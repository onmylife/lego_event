'use client';

import React from 'react'; // useState, useEffect 제거
import * as Tooltip from '@radix-ui/react-tooltip';

// 데이터 타입 정의
interface Site {
  id: number;
  name: string;
}

interface EventSummary {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  site_name: string; // 툴팁 등에 사용될 수 있음
  site_id: number;   // 사이트 매칭에 사용
}

interface AnnualTimelineProps {
  year: number;
  sites: Site[];
  events: EventSummary[];
  onMonthClick?: (month: number) => void;
  onEventHover?: (event: EventSummary | null) => void;
}

// 특정 사이트, 특정 월에 이벤트가 있는지 확인하고, 있다면 첫 번째 이벤트를 반환
const getFirstEventInMonthForSite = (
  siteId: number,
  year: number,
  monthIndex: number, // 0 (Jan) to 11 (Dec)
  allEvents: EventSummary[]
): EventSummary | null => {
  const startDateOfMonth = new Date(year, monthIndex, 1);
  const endDateOfMonth = new Date(year, monthIndex + 1, 0);

  const eventInMonth = allEvents.find(event => {
    if (event.site_id !== siteId) return false;

    const eventStartDate = new Date(event.start_date);
    const eventEndDate = new Date(event.end_date);

    // 이벤트 기간이 해당 월과 겹치는지 확인
    return eventStartDate <= endDateOfMonth && eventEndDate >= startDateOfMonth;
  });
  return eventInMonth || null;
};


const AnnualTimeline: React.FC<AnnualTimelineProps> = ({ year, sites, events, onMonthClick, onEventHover }) => {
  const months = Array.from({ length: 12 }, (_, i) => i); // 0 (Jan) to 11 (Dec)

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{year}년 레고 프로모션 연간 현황</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky left-0 bg-gray-100 z-10 px-3 py-2 text-left text-sm font-semibold text-gray-600 border border-gray-300">사이트</th>
              {months.map(monthIndex => (
                <th
                  key={monthIndex}
                  className="px-3 py-2 text-center text-sm font-semibold text-gray-600 border border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => onMonthClick && onMonthClick(monthIndex + 1)} // 1월부터 시작하도록 +1
                >
                  {monthIndex + 1}월
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sites.map(site => (
              <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                <td className="sticky left-0 bg-white group-hover:bg-gray-50 z-10 px-3 py-2 text-sm text-gray-800 font-medium border border-gray-300">{site.name}</td>
                {months.map(monthIndex => {
                  const eventInCell = getFirstEventInMonthForSite(site.id, year, monthIndex, events);
                  return (
                    <td key={monthIndex} className="px-3 py-2 text-center border border-gray-300 h-10"> {/* 높이 고정 */}
                      {eventInCell ? (
                        <Tooltip.Provider delayDuration={100}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <span
                                className="inline-block w-3 h-3 bg-teal-500 rounded-full cursor-pointer"
                                onMouseEnter={() => onEventHover && onEventHover(eventInCell)}
                                onMouseLeave={() => onEventHover && onEventHover(null)}
                              />
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-slate-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50"
                                sideOffset={5}
                              >
                                {eventInCell.name}
                                <Tooltip.Arrow className="fill-slate-800" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnualTimeline;
