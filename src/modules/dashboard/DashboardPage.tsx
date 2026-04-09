import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../shared/stores/taskStore';
import { getStats, fmtDeadline, isUrgent } from '../../shared/utils/task-utils';
import { CHANNELS, STEPS, STEP_COLORS } from '../../constants/app-config';
import type { TaskChannel } from '../../shared/types/editor.types';

const cardBorders = ['var(--blue)', 'var(--teal)', 'var(--green)', 'var(--gold)'];

function StatCard({ label, value, footer, border }: { label: string; value: string | number; footer: string; border: string }) {
  return (
    <div style={{
      background: 'var(--bg2)', borderRadius: 10,
      border: '1px solid var(--b1)', borderTop: `3px solid ${border}`,
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--t1)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 6 }}>{footer}</div>
    </div>
  );
}

export function DashboardPage() {
  const { tasks } = useTaskStore();
  const navigate = useNavigate();
  const stats = getStats(tasks);

  // Step counts (exclude Done/Reject for pipeline)
  const stepCounts = STEPS.slice(0, 5).map(s => ({
    step: s, count: tasks.filter(t => t.step === s).length,
  }));

  // Pending approval
  const pendingTasks = tasks.filter(t => t.pend && t.step !== 'Done').slice(0, 4);

  // Channel output
  const channelKeys = Object.keys(CHANNELS) as TaskChannel[];
  const channelDone = channelKeys.map(ch => ({
    ch,
    done: tasks.filter(t => t.ch === ch && t.step === 'Done').length,
    total: tasks.filter(t => t.ch === ch).length,
  }));
  const maxDone = Math.max(...channelDone.map(c => c.done), 1);

  // KPI weekly
  const kpiItems = [
    { label: 'Completion Rate', value: stats.cr, target: 70, unit: '%' },
    { label: 'Approval Rate', value: stats.ar, target: 80, unit: '%' },
    { label: 'Reject Rate', value: stats.rr, target: 20, unit: '%', invert: true },
    { label: 'Active Tasks', value: stats.active, target: 8, unit: '' },
  ];

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Task đang chạy" value={stats.active} footer={`${stats.total} tổng`} border={cardBorders[0]} />
        <StatCard label="Completion Rate" value={`${stats.cr}%`} footer={`${stats.done} done / ${stats.total} total`} border={cardBorders[1]} />
        <StatCard label="Approval Rate" value={`${stats.ar}%`} footer={`${stats.done} approved`} border={cardBorders[2]} />
        <StatCard label="Chờ duyệt" value={stats.pend} footer="cần xem xét ngay" border={cardBorders[3]} />
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Pipeline quick */}
          <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>Pipeline nhanh</span>
              <button onClick={() => navigate('/pipeline')} style={{ fontSize: 10, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Xem tất cả →</button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {stepCounts.map((sc, i) => (
                <button
                  key={sc.step}
                  onClick={() => navigate('/pipeline')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 6,
                    background: `${STEP_COLORS[i]}22`,
                    border: `1px solid ${STEP_COLORS[i]}44`,
                    cursor: 'pointer',
                    color: STEP_COLORS[i],
                    fontSize: 11, fontWeight: 500,
                  }}
                >
                  <span style={{
                    background: STEP_COLORS[i], color: '#fff',
                    borderRadius: 99, width: 18, height: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 700,
                  }}>{sc.count}</span>
                  {sc.step}
                </button>
              ))}
            </div>
          </div>

          {/* Pending approval */}
          <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>Video chờ duyệt</span>
              <button onClick={() => navigate('/approve')} style={{ fontSize: 10, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Duyệt ngay →</button>
            </div>
            {pendingTasks.length === 0 ? (
              <div style={{ color: 'var(--t3)', fontSize: 12, padding: '12px 0' }}>Không có video nào chờ duyệt</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pendingTasks.map(task => {
                  const ch = CHANNELS[task.ch];
                  const urgent = isUrgent(task.dl);
                  return (
                    <div key={task.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 6,
                      background: 'var(--s1)', border: '1px solid var(--b1)',
                      borderLeft: urgent ? '3px solid var(--red)' : '3px solid var(--b1)',
                    }}>
                      <span style={{ fontSize: 14 }}>{task.type === 'short' ? '✂️' : '🎬'}</span>
                      <span style={{ flex: 1, fontSize: 12, color: 'var(--t1)', fontWeight: 500 }}>{task.name}</span>
                      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${ch.c}22`, color: ch.c }}>{ch.n}</span>
                      <span style={{ fontSize: 10, color: urgent ? 'var(--red)' : 'var(--t3)' }}>{fmtDeadline(task.dl)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* KPI weekly */}
          <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)', marginBottom: 12 }}>KPI tuần</div>
            {kpiItems.map(kpi => {
              const ok = kpi.invert ? kpi.value <= kpi.target : kpi.value >= kpi.target;
              return (
                <div key={kpi.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--t2)' }}>{kpi.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: ok ? 'var(--green)' : 'var(--amber)' }}>{kpi.value}{kpi.unit}</span>
                    <span style={{ fontSize: 12 }}>{ok ? '✅' : '⚠️'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Channel output */}
          <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '14px 16px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)', marginBottom: 12 }}>Output theo kênh</div>
            {channelDone.map(c => {
              const ch = CHANNELS[c.ch];
              const pct = maxDone > 0 ? (c.done / maxDone) * 100 : 0;
              return (
                <div key={c.ch} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: 'var(--t2)' }}>{ch.n}</span>
                    <span style={{ fontSize: 10, color: ch.c, fontWeight: 600 }}>{c.done}/{c.total}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'var(--s2)' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: ch.c, width: `${pct}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
