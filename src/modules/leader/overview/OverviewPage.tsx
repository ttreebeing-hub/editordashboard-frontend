import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leaderApi } from '../leader.api';
import { TeamKpiCards } from './TeamKpiCards';
import { TeamKpiChart } from './TeamKpiChart';
import { MemberQuickTable } from './MemberQuickTable';
import { AlertPanel } from './AlertPanel';
import { MemberDrawer } from '../team/MemberDrawer';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import type { MemberCard } from '../../../shared/types/editor.types';

export function OverviewPage() {
  const [selectedMember, setSelectedMember] = useState<MemberCard | null>(null);

  const { data: kpi, isLoading: kpiLoading } = useQuery({
    queryKey: ['leader-dashboard'],
    queryFn: leaderApi.getDashboard,
    staleTime: 60_000,
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['leader-members'],
    queryFn: leaderApi.getMembers,
    staleTime: 60_000,
  });

  const { data: signals = [] } = useQuery({
    queryKey: ['leader-signals'],
    queryFn: leaderApi.getSignals,
    staleTime: 60_000,
  });

  if (kpiLoading) return <LoadingSpinner label="Đang tải dữ liệu..." />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#f4f4f5]">Team Overview</h1>
        {kpi?.computed_at && (
          <span className="text-xs text-[#a1a1aa]">
            Cập nhật lúc {new Date(kpi.computed_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {kpi && <TeamKpiCards data={kpi} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TeamKpiChart />
        </div>
        <AlertPanel signals={signals} />
      </div>

      {membersLoading ? (
        <LoadingSpinner label="Đang tải danh sách..." />
      ) : (
        <MemberQuickTable members={members} onSelect={setSelectedMember} />
      )}

      {selectedMember && (
        <MemberDrawer
          memberId={selectedMember.user_id}
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
