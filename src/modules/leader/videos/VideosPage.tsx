import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderApi } from '../leader.api';
import { VideoTrackingTable } from './VideoTrackingTable';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

const FILTERS = [
  { key: '', label: 'Tất cả' },
  { key: 'in_progress', label: 'Đúng hạn' },
  { key: 'submitted', label: 'Chờ duyệt' },
  { key: 'overdue', label: 'Trễ hạn' },
];

export function VideosPage() {
  const [filter, setFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leader-videos', filter],
    queryFn: () => leaderApi.getVideos(filter ? { status: filter } : undefined),
    staleTime: 30_000,
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#f4f4f5]">Video Tracking</h1>
        <span className="text-sm text-[#a1a1aa]">{data?.total ?? 0} video</span>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#2a2a2a] text-[#a1a1aa] hover:text-[#f4f4f5]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner label="Đang tải videos..." />
      ) : (
        <VideoTrackingTable items={data?.videos ?? []} />
      )}
    </div>
  );
}
