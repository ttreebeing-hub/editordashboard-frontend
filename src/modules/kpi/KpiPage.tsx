import { useState } from 'react';
import { useTaskStore } from '../../shared/stores/taskStore';
import { getStats } from '../../shared/utils/task-utils';
import { CHANNELS } from '../../constants/app-config';
import type { TaskChannel } from '../../shared/types/editor.types';

// ── Mindset & Learning mock data ──────────────────────────────────────────────

const MEMBER_MINDSET = [
  { name: 'Phạm Thị D', rejects: 3, lvi: 0.67, topReason: 'Hook (1x)', status: 'green' as const },
  { name: 'Lê Văn C', rejects: 5, lvi: 0.40, topReason: 'Hook/Retention (3x)', status: 'red' as const },
  { name: 'Hoàng Văn E', rejects: 2, lvi: 1.0, topReason: '—', status: 'green' as const },
];

const ALERTS = [
  { type: 'error' as const, msg: 'Lê Văn C — Hook/Retention lặp 3 lần tháng này → cần 1-1 với Co-Leader' },
  { type: 'warning' as const, msg: 'Hoàng Văn E — Why Journal completion 60% tuần này (target: 100%)' },
];

const GATE_MEMBER = {
  name: 'Phạm Thị D',
  gate: 'Cổng 1 (Member → Senior)',
  checks: [
    { label: 'LVI ≥ 0.5 trong 3 tháng gần nhất: 0.67 / 0.62 / 0.71', done: true },
    { label: 'Không có reject reason nào lặp ≥ 3 lần', done: true },
    { label: 'Why explanation quality: Chưa đánh giá', done: false },
  ],
  eligible: true,
};

// ── Original KPI content ──────────────────────────────────────────────────────

function KpiOriginalContent() {
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
                    <td style={{ padding: '8px 6px' }}><span style={{ fontSize: 11, fontWeight: 600, color: ch.c }}>{ch.n}</span></td>
                    <td style={{ textAlign: 'center', padding: '8px 6px' }}><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>{cs.done}</span></td>
                    <td style={{ textAlign: 'center', padding: '8px 6px' }}><span style={{ fontSize: 12, fontWeight: 700, color: cs.rej > 0 ? 'var(--red)' : 'var(--t3)' }}>{cs.rej}</span></td>
                    <td style={{ textAlign: 'center', padding: '8px 6px' }}><span style={{ fontSize: 12, color: 'var(--t2)' }}>{cs.total}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '16px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>Weekly Snapshot</div>
          {weeklyIndicators.map(ind => (
            <div key={ind.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 7, marginBottom: 8, background: ind.ok ? 'rgba(46,125,50,.1)' : 'rgba(245,127,23,.08)', border: `1px solid ${ind.ok ? 'rgba(46,125,50,.25)' : 'rgba(245,127,23,.25)'}` }}>
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
            <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>Sử dụng Prompt B-01 để tối ưu hook 5 giây đầu. Mục tiêu: retention &gt; 60% ở giây thứ 30.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mindset & Learning tab ────────────────────────────────────────────────────

function MindsetContent() {
  const cardStyle: React.CSSProperties = {
    background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 12, padding: 16,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Section A: Journal Overview */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 12 }}>
          A — Journal Overview
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            { label: 'Journal completion tuần này', value: '80%', sub: '4/5 tasks có journal', ok: true },
            { label: 'Avg depth tuần này', value: '2.1 / 3.0', sub: 'Medium-Deep', ok: true },
            { label: 'Depth trend', value: '↑', sub: 'Tăng so với tuần trước', ok: true },
            { label: 'Streak dài nhất', value: 'Lê Văn C', sub: '5 ngày liên tiếp', ok: true },
          ].map(item => (
            <div key={item.label} style={{ ...cardStyle, background: 'var(--bg3)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: item.ok ? 'var(--teal)' : 'var(--amber)' }}>{item.value}</div>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Learning Log & LVI */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 12 }}>
          B — Learning Log & LVI
        </div>
        <div style={cardStyle}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Tên', 'Reject/tháng', 'LVI', 'Lý do lặp nhiều nhất', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', padding: '0 8px 10px', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEMBER_MINDSET.map(m => (
                <tr key={m.name} style={{ borderTop: '1px solid var(--b1)' }}>
                  <td style={{ padding: '10px 8px', fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{m.name}</td>
                  <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--t2)', textAlign: 'center' }}>{m.rejects}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: m.lvi >= 0.5 ? 'var(--green)' : 'var(--red)',
                    }}>{m.lvi.toFixed(2)}</span>
                  </td>
                  <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--t2)' }}>{m.topReason}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: 14 }}>
                    {m.status === 'green' ? '🟢' : '🔴'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, padding: '8px 10px', borderRadius: 6, background: 'rgba(46,134,171,0.08)', border: '1px solid rgba(46,134,171,0.15)', fontSize: 10, color: 'var(--t3)' }}>
            <span style={{ fontWeight: 700, color: 'var(--rc)' }}>LVI Formula: </span>
            new_reasons_month / total_reasons_month → target &gt; 0.5
          </div>
        </div>

        {/* Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
          {ALERTS.map((alert, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8,
              background: alert.type === 'error' ? 'rgba(198,40,40,0.1)' : 'rgba(245,127,23,0.08)',
              border: `1px solid ${alert.type === 'error' ? 'rgba(198,40,40,0.3)' : 'rgba(245,127,23,0.25)'}`,
              fontSize: 12,
              color: alert.type === 'error' ? '#ef9a9a' : '#ffcc80',
              display: 'flex', gap: 8,
            }}>
              <span>⚠️</span>
              <span>{alert.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section C: Onboard Health Score */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 12 }}>
          C — Onboard Health Score
        </div>
        <div style={{ ...cardStyle, background: 'rgba(83,74,183,0.08)', borderColor: 'rgba(175,169,236,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>Nguyễn Thị F</div>
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>Ngày 67 / 90 — Đang onboard</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(0,131,143,0.15)', color: 'var(--teal)', border: '1px solid rgba(0,131,143,0.3)' }}>
              On Track
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Onboard Mindset Index', value: '0.74', desc: 'depth×0.4 + big_pic×0.4 + reread×0.2', color: 'var(--teal)' },
              { label: 'Buddy Effectiveness', value: '82%', desc: 'Buddy score từ journal review', color: 'var(--green)' },
              { label: 'Days to Graduation', value: '23', desc: 'Ngày còn lại đến Day 90', color: 'var(--amber)' },
              { label: 'LVI (1 tháng)', value: '0.75', desc: 'Học tốt — đa dạng lỗi', color: 'var(--green)' },
            ].map(m => (
              <div key={m.label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--b1)', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--t3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 4, lineHeight: 1.4 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section D: Gate Readiness */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 12 }}>
          D — Gate Readiness
        </div>
        <div style={{ ...cardStyle, borderLeft: '4px solid #afa9ec', background: 'rgba(83,74,183,0.06)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{GATE_MEMBER.name}</div>
            <div style={{ fontSize: 11, color: '#afa9ec', marginTop: 2 }}>Ứng viên {GATE_MEMBER.gate}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {GATE_MEMBER.checks.map((check, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{check.done ? '✅' : '⏳'}</span>
                <span style={{ fontSize: 12, color: check.done ? 'var(--t1)' : 'var(--t3)', lineHeight: 1.5 }}>{check.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(46,125,50,0.1)', border: '1px solid rgba(46,125,50,0.25)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>
              → Kết luận: {GATE_MEMBER.eligible ? 'Đủ điều kiện xét thăng cấp' : 'Chưa đủ điều kiện'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Main KpiPage ──────────────────────────────────────────────────────────────

type KpiTab = 'kpi' | 'mindset';

export function KpiPage() {
  const [activeTab, setActiveTab] = useState<KpiTab>('kpi');

  const tabs: { key: KpiTab; label: string }[] = [
    { key: 'kpi', label: 'KPI & Hiệu suất' },
    { key: 'mindset', label: 'Mindset & Learning' },
  ];

  return (
    <div>
      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(tab => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '7px 18px', borderRadius: 20, fontSize: 12,
                fontWeight: active ? 600 : 500,
                border: active ? '1px solid var(--rc)' : '1px solid var(--b1)',
                background: active ? 'var(--rc2)' : 'transparent',
                color: active ? 'var(--rc)' : 'var(--t2)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'kpi' && <KpiOriginalContent />}
      {activeTab === 'mindset' && <MindsetContent />}
    </div>
  );
}
