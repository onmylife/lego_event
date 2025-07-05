'use client';

import React from 'react'; // useEffect, useState는 props로 데이터를 받으므로 제거 가능성 있음

// 이벤트 및 사이트 데이터 타입 정의
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
  site_id: number;
}

interface Site {
  id: number;
  name: string;
}

interface DetailedCalendarProps {
  year: number;
  month: number; // 1월부터 12월까지의 값
  events: EventDetail[]; // 필터링된 이벤트 목록을 props로 받음
  sites: Site[]; // 전체 사이트 목록을 props로 받음 (캘린더 행 구성용)
  onEventClick: (event: EventDetail) => void;
}

const DetailedCalendar: React.FC<DetailedCalendarProps> = ({ year, month, events, sites, onEventClick }) => {

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  const renderCalendarGrid = () => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    return Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
      const isCurrentDay = day === currentDay && month === currentMonth && year === currentYear;
      const currentDateObj = new Date(year, month - 1, day);

      return (
        <div
          key={day}
          className={`border border-gray-200 p-1 min-h-[120px] ${isCurrentDay ? 'bg-sky-50' : 'bg-white'}`}
        >
          <div className={`text-sm font-medium text-right pr-1 ${isCurrentDay ? 'text-sky-600 font-bold' : 'text-gray-600'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {sites.map(site => {
              // 해당 날짜, 해당 사이트의 이벤트를 찾음
              const eventsForSiteOnDate = events.filter(event => {
                const eventStartDate = new Date(event.start_date);
                const eventEndDate = new Date(event.end_date);
                return event.site_id === site.id &&
                       eventStartDate <= currentDateObj &&
                       eventEndDate >= currentDateObj;
              });

              if (eventsForSiteOnDate.length > 0) {
                return (
                  <div key={site.id} className="group">
                    {/* <div className="text-xs text-gray-500 truncate mb-0.5">{site.name}</div> */}
                    {eventsForSiteOnDate.map(event => (
                      <div
                        key={event.id}
                        className="mb-0.5 p-1 text-xs bg-blue-500 text-white rounded-sm truncate cursor-pointer hover:bg-blue-600 hover:overflow-visible hover:whitespace-normal hover:min-h-[2em]"
                        onClick={() => onEventClick(event)}
                        title={`${site.name} - ${event.name}`}
                      >
                        {event.name}
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    });
  };

  const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{year}년 {month}월 상세 현황</h2>
      <div className="grid grid-cols-7 gap-px border-t border-l border-gray-300 bg-gray-300">
        {dayHeaders.map((header, index) => (
          <div
            key={header}
            className={`p-2 text-center text-sm font-medium
                        ${index === 0 ? 'text-red-600' : (index === 6 ? 'text-blue-600' : 'text-gray-600')}
                        bg-gray-100`}
          >
            {header}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px border-l border-b border-r border-gray-300 bg-gray-300">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-gray-50 min-h-[120px] border-r border-gray-300"></div>
        ))}
        {renderCalendarGrid()}
      </div>
    </div>
  );
};

export default DetailedCalendar;
