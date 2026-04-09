import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderApi } from '../leader.api';
import { MemberCard } from './MemberCard';
import { MemberDrawer } from './MemberDrawer';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { EmptyState } from '../../../shared/components/EmptyState';
import { Users } from 'lucide-react';
import type { MemberCard as MemberCardType } from '../../../shared/types/editor.types';

export function TeamPage() {
  const [selected, setSelected] = useState<MemberCardType | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['leader-members'],
    queryFn: leaderApi.getMembers,
    staleTime: 60_000,
  });

  if (isLoading) return <LoadingSpinner label="Đang tải danh sách team..." />;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-[#f4f4f5] mb-6">Team Members</h1>

      {members.length === 0 ? (
        <EmptyState icon={Users} title="Chưa có thành viên" description="Chưa có editor nào trong team" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map(m => (
            <MemberCard key={m.user_id} member={m} onClick={() => setSelected(m)} />
          ))}
        </div>
      )}

      {selected && (
        <MemberDrawer
          memberId={selected.user_id}
          member={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
