'use client';

import React from 'react'; // useState, useEffect 제거

// 이벤트 데이터 타입 정의
interface EventDetail {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  benefit?: string;
  url?: string;
  event_type?: string;
  site_name: string;
  // site_id: number; // DetailedList에서는 직접 사용하지 않을 수 있음
}

interface DetailedListProps {
  year: number;
  month: number; // 1월부터 12월까지의 값
  events: EventDetail[]; // 필터링된 이벤트 목록을 props로 받음
  onEventClick: (event: EventDetail) => void;
}

const calculateDday = (startDate: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(startDate);
  eventDate.setHours(0, 0, 0, 0);

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return '종료';
  if (diffDays === 0) return 'D-Day';
  return `D-${diffDays}`;
};

const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  const end = new Date(endDate).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  return `${start} ~ ${end}`;
};

const DetailedList: React.FC<DetailedListProps> = ({ year, month, events: propEvents, onEventClick }) => {
  // props로 받은 events를 year, month 기준으로 필터링
  const monthlyEvents = propEvents.filter(event => {
    const eventStartDate = new Date(event.start_date);
    // 이벤트가 해당 월/년에 시작하거나, 해당 월/년에 걸쳐있는 경우 모두 포함 가능
    // 여기서는 간단히 시작일 기준으로 해당 월의 이벤트만 필터링
    return eventStartDate.getFullYear() === year && eventStartDate.getMonth() === month - 1;
  }).sort((a,b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{year}년 {month}월 이벤트 리스트</h2>
      {monthlyEvents.length === 0 ? (
        <p className="text-gray-500 py-4">해당 월에 표시할 이벤트가 없습니다.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">D-Day</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">행사명</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">기간</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">사이트</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">혜택/할인율</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">상세</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyEvents.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{calculateDday(event.start_date)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{event.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDateRange(event.start_date, event.end_date)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{event.site_name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{event.benefit || '-'}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onEventClick(event)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                  >
                    [보기]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DetailedList;
