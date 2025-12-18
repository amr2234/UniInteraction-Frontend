import { Card } from '@/components/ui/card';
import { Filter } from 'lucide-react';
import { FilterType } from './NotificationsPage.logic';

interface NotificationFiltersProps {
  activeFilter: FilterType;
  totalCount: number;
  unreadCount: number;
  requestsCount: number;
  onFilterChange: (filter: FilterType) => void;
  t: (key: string) => string;
}

export function NotificationFilters({
  activeFilter,
  totalCount,
  unreadCount,
  requestsCount,
  onFilterChange,
  t,
}: NotificationFiltersProps) {
  const filterButtons: Array<{ key: FilterType; labelKey: string; count: number }> = [
    { key: 'all', labelKey: 'notifications.filters.all', count: totalCount },
    { key: 'unread', labelKey: 'notifications.filters.unread', count: unreadCount },
    { key: 'requests', labelKey: 'notifications.filters.requests', count: requestsCount },
  ];

  return (
    <Card className="p-4 rounded-xl border-0 shadow-soft bg-white">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-5 h-5 text-[#6F6F6F]" />
        {filterButtons.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-xl transition ${
              activeFilter === filter.key
                ? 'bg-[#6CAEBD] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t(filter.labelKey)} ({filter.count})
          </button>
        ))}
      </div>
    </Card>
  );
}
