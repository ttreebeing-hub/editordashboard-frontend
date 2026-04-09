import { useTaskStore } from '../../shared/stores/taskStore';
import { getStats } from '../../shared/utils/task-utils';
import { CHANNELS } from '../../constants/app-config';
import type { TaskChannel } from '../../shared/types/editor.types';

export function KpiPage() {
  const { tasks } = useTaskStore();
  const stats = getStats(tasks);

  const channelKeys = Object.keys(CHANNELS) as TaskChannel[];
  const channelStats = channelKeys.map(ch => {
    const chTasks = tasks.filter(t => t.ch === ch);
    const done = chTasks.filter(t => t.step === 'Done').length;
    const rej = chTasks.filter(t => t.step === 'Reject').length;
    return { ch, done, rej, total: chTasks.length };
  });

  const cards = [
    { label: 'Completion Rate', value: `${stats.cr}%`, target: '≥ 70%', ok: stats.cr >= 70, color: 'var(--teal)' },
    { label: 'Approval Rate', value: `${stats.ar}%`, target: '≥ 80%', ok: stats.ar >= 80, color: 'var(--blue)' },
    { label: 'Reject Rate', value: `${stats.rr}%`, target: '≤ 20%', ok: stats.rr <= 20, color: 'var(--red)' },
    { label: 'Video Done', value: stats.done, target: `/ ${stats.total} total`, ok: true, color: 'var(--green)' },
  ];

  const weeklyIndicators = [
    { label: 'Tổng video xử lý', value: stats.total, norm: '≥ 8 video/tuần', ok: stats.total >= 8 },
    { label: 'Tỷ lệ hoàn thành', value: `${stats.cr}%`, norm: '≥ 70%', ok: stats.cr >= 70 },
    { label: 'Approval Rate', value: `${stats.ar}%`, norm: '≥ 80%', ok: stats.ar >= 80 },
  ];

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {cards.map(card => (
          <div key={card.label} style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', borderTop: `3px solid ${card.color}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--t3)', marginBottom: 8 }}>{card.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'var(--t1)' }}>{card.value}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>Target: {card.target}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Channel breakdown */}
        <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '16px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>Kênh breakdown</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Kênh', 'Done', 'Reject', 'Total'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Kênh' ? 'left' : 'center', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', padding: '0 6px 8px', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channelStats.map(cs => {
                const ch = CHANNELS[cs.ch];
                return (
                  <tr key={cs.ch} style={{ borderTop: '1px solid var(--b1)' }}>
                    <td style={{ padding: '8px 6px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: ch.c }}>{ch.n}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px 6px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>{cs.done}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px 6px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: cs.rej > 0 ? 'var(--red)' : 'var(--t3)' }}>{cs.rej}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '8px 6px' }}>
                      <span style={{ fontSize: 12, color: 'var(--t2)' }}>{cs.total}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Weekly snapshot */}
        <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '16px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>Weekly Snapshot</div>
          {weeklyIndicators.map(ind => (
            <div key={ind.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 7, marginBottom: 8,
              background: ind.ok ? 'rgba(46,125,50,.1)' : 'rgba(245,127,23,.08)',
              border: `1px solid ${ind.ok ? 'rgba(46,125,50,.25)' : 'rgba(245,127,23,.25)'}`,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{ind.label}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>Target: {ind.norm}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: ind.ok ? 'var(--green)' : 'var(--amber)', fontFamily: 'Syne, sans-serif' }}>{ind.value}</span>
                <span style={{ fontSize: 16 }}>{ind.ok ? '✅' : '⚠️'}</span>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 7, background: 'rgba(46,134,171,.08)', border: '1px solid rgba(46,134,171,.2)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>💡 Prompt B-01 Tip</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>
              Sử dụng Prompt B-01 để tối ưu hook 5 giây đầu. Mục tiêu: retention &gt; 60% ở giây thứ 30.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
