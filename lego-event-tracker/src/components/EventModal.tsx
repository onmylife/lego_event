'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons'; // 예시 아이콘, 실제 설치 필요

// 이벤트 데이터 타입 정의 (API 응답에 맞춰서)
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
}

interface EventModalProps {
  event: EventDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose }) => {
  if (!event) {
    return null;
  }

  // 날짜 포맷팅 함수 (필요시)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[85vh] p-6 bg-white rounded-lg shadow-lg data-[state=open]:animate-contentShow overflow-y-auto focus:outline-none">
          <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800">
            {event.name}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-1">
            {event.site_name}
          </Dialog.Description>

          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>
              <strong>기간:</strong> {formatDate(event.start_date)} ~ {formatDate(event.end_date)}
            </p>
            {event.event_type && (
              <p>
                <strong>유형:</strong> {event.event_type}
              </p>
            )}
            {event.benefit && (
              <p>
                <strong>혜택:</strong> {event.benefit}
              </p>
            )}
            {event.description && (
              <div className="mt-2">
                <h4 className="font-medium text-gray-800">상세 설명:</h4>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </div>

          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              이벤트 바로가기
            </a>
          )}

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
              aria-label="Close"
              onClick={onClose}
            >
              <Cross2Icon className="w-5 h-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EventModal;
