'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AnnualTimeline from '@/components/AnnualTimeline';
import DetailedCalendar from '@/components/DetailedCalendar';
import DetailedList from '@/components/DetailedList';
import FilterControls from '@/components/FilterControls';
import EventModal from '@/components/EventModal';
// import { Cross2Icon } from '@radix-ui/react-icons'; // 아이콘 사용 예시 (설치 필요)

interface Site {
  id: number;
  name: string;
}

interface EventData {
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

interface Filters {
  siteId?: number;
  eventType?: string;
}

export default function Home() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1);

  const [sites, setSites] = useState<Site[]>([]);
  const [allEvents, setAllEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);

  const [filters, setFilters] = useState<Filters>({});

  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // basePath를 고려한 데이터 경로 생성 (빌드 환경에 따라 동적으로 설정 가능)
  // const dataBasePath = process.env.NEXT_PUBLIC_BASE_PATH || ''; // next.config.js의 basePath와 일치시켜야 함

  useEffect(() => {
    // fetch(`${dataBasePath}/data/sites.json`)
    fetch(`/data/sites.json`) // public 폴더의 파일은 basePath와 관계없이 루트에서 접근 가능
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for sites.json`);
        return res.json();
      })
      .then(setSites)
      .catch(error => console.error("Failed to fetch sites:", error));
  }, []);

  useEffect(() => {
    // fetch(`${dataBasePath}/data/events.json`)
    fetch(`/data/events.json`) // public 폴더의 파일은 basePath와 관계없이 루트에서 접근 가능
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status} for events.json`);
        return res.json();
      })
      .then((data: EventData[]) => {
        setAllEvents(data);
      })
      .catch(error => console.error("Failed to fetch events:", error));
  }, []);

  // 필터 또는 원본 데이터 변경 시 이벤트 필터링
  useEffect(() => {
    let eventsToFilter = allEvents;
    if (filters.siteId) {
      eventsToFilter = eventsToFilter.filter(event => event.site_id === filters.siteId);
    }
    if (filters.eventType && filters.eventType !== '전체') {
      eventsToFilter = eventsToFilter.filter(event => event.event_type === filters.eventType);
    }
    setFilteredEvents(eventsToFilter);
  }, [allEvents, filters]);

  const handleMonthClickFromAnnual = useCallback((month: number) => {
    setCurrentMonth(month);
  }, []);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleEventClick = useCallback((event: EventData) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8 bg-gray-50 min-h-screen">
      <header className="text-center py-6 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">레고 이벤트 트래커</h1>
      </header>

      <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <AnnualTimeline
          year={currentYear}
          sites={sites}
          events={allEvents}
          onMonthClick={handleMonthClickFromAnnual}
        />
      </section>

      <section className="sticky top-0 z-20 bg-gray-50 py-4 -mx-4 sm:-mx-6 px-4 sm:px-6 shadow">
        <FilterControls sites={sites} onFilterChange={handleFilterChange} />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <DetailedCalendar
            year={currentYear}
            month={currentMonth}
            events={filteredEvents}
            sites={sites}
            onEventClick={handleEventClick}
          />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <DetailedList
            year={currentYear}
            month={currentMonth}
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        </div>
      </section>

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <footer className="text-center mt-12 py-6 border-t border-gray-200 text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Lego Event Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
