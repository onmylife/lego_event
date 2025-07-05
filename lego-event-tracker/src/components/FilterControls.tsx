'use client';

import React, { useState, useEffect } from 'react';

// 사이트 및 이벤트 유형 데이터 타입 (실제로는 API 또는 props로 받아옴)
interface Site {
  id: number;
  name: string;
}

const EVENT_TYPES = ["할인", "신제품", "사은품", "체험", "한정판", "전체"] as const;
type EventTypeTuple = typeof EVENT_TYPES;
type EventType = EventTypeTuple[number];


interface FilterControlsProps {
  sites: Site[]; // 전체 사이트 목록
  onFilterChange: (filters: { siteId?: number; eventType?: EventType }) => void;
}

// 임시 사이트 데이터
const dummySites: Site[] = [
  { id: 1, name: '레고 공식몰' },
  { id: 2, name: '롯데ON' },
  { id: 3, name: '이마트' },
  { id: 4, name: '토이저러스' },
];


const FilterControls: React.FC<FilterControlsProps> = ({ sites: propSites, onFilterChange }) => {
  const [sites, setSites] = useState<Site[]>(propSites.length > 0 ? propSites : dummySites);
  const [selectedSiteId, setSelectedSiteId] = useState<number | undefined>(undefined);
  const [selectedEventType, setSelectedEventType] = useState<EventType>('전체');

  // props로 받은 sites가 변경되면 업데이트
  useEffect(() => {
    if (propSites.length > 0) {
        setSites([{id: 0, name: "전체 사이트"}, ...propSites]); // "전체 사이트" 옵션 추가
    } else if (dummySites.length > 0 && sites.length === 0) { // propSites가 비어있고 dummySites가 있다면 초기화
        setSites([{id: 0, name: "전체 사이트"}, ...dummySites]);
    }
  }, [propSites]);

  useEffect(() => {
    // "전체"는 undefined로 처리하여 필터링하지 않도록 함
    const siteFilter = selectedSiteId === 0 ? undefined : selectedSiteId;
    const typeFilter = selectedEventType === '전체' ? undefined : selectedEventType;
    onFilterChange({ siteId: siteFilter, eventType: typeFilter });
  }, [selectedSiteId, selectedEventType, onFilterChange]);


  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col sm:flex-row gap-4 items-center">
      <div className="w-full sm:w-auto">
        <label htmlFor="site-filter" className="block text-sm font-medium text-gray-700 mb-1">
          사이트 선택
        </label>
        <select
          id="site-filter"
          name="site-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          value={selectedSiteId === undefined ? 0 : selectedSiteId} // "전체 사이트"의 value는 0으로 가정
          onChange={(e) => setSelectedSiteId(parseInt(e.target.value, 10))}
        >
          {/* "전체 사이트" 옵션은 useEffect에서 동적으로 추가되도록 수정 */}
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-auto">
        <label htmlFor="event-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
          행사 유형 선택
        </label>
        <select
          id="event-type-filter"
          name="event-type-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value as EventType)}
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === "전체" ? "전체 유형" : type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
