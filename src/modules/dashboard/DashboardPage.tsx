import { useNavigate } from 'react-router-dom';

// KPI ring using SVG. r=22 → circumference ≈ 138.2
function KpiRing({ value, max, unit, color }: { value: number; max: number; unit: string; color: string }) {
  const C = 138.2;
  const pct = Math.min(value / max, 1);
  const dash = C * pct;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx="26" cy="26" r="22" fill="none" stroke="var(--bg3)" strokeWidth="5" />
      <circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round" strokeDasharray={`${dash} ${C}`} strokeDashoffset="0" />
    </svg>
  );
}

interface KpiCardProps { label: string; value: number; max: number; unit: string; sub: string; trend: string; trendUp: boolean; color: string; }
function KpiCard({ label, value, max, unit, sub, trend, trendUp, color }: KpiCardProps) {
  return (
    <div style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: 14 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--t3)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <KpiRing value={value} max={max} unit={unit} color={color} />
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: 'var(--t1)', lineHeight: 1 }}>
            {value}<span style={{ fontSize: 13, color: 'var(--t3)' }}>{unit === '%' ? '%' : unit === '/100' ? '/100' : `/${max}`}</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 3 }}>{sub}</div>
        </div>
      </div>
      <div style={{ fontSize: 10, marginTop: 8, color: trendUp ? 'var(--green)' : 'var(--red)' }}>{trend}</div>
    </div>
  );
}

const MY_VIDEOS = [
  { id: 'v1', title: 'Podcast NhiLe Talk Ep.22', urgency: 'urgent' as const, badge: '⚡ 3h còn lại', step: 'B5: Xuất video', channel: 'NhiLe' },
  { id: 'v2', title: 'Review iPhone 16 Pro Max', urgency: 'warning' as const, badge: '⏰ 8h còn lại', step: 'B4: Hậu kỳ', channel: 'NhiLe' },
  { id: 'v3', title: 'Vlog Trip Đà Nẵng 2025', urgency: 'normal' as const, badge: '🟢 2 ngày còn', step: 'B2: Tải tài nguyên', channel: 'NhiLe Lifestyle' },
];

const URGENCY_COLOR = { urgent: 'var(--red)', warning: 'var(--amber)', normal: 'var(--teal)' };
const URGENCY_BG = { urgent: 'var(--red2)', warning: 'var(--amber2)', normal: 'var(--teal2)' };

const PROGRESS_ITEMS = [
  { label: 'Video hoàn thành', done: 8, total: 12, color: 'linear-gradient(90deg,var(--accent),var(--teal))' },
  { label: 'Why Journal ghi', done: 8, total: 8, color: 'linear-gradient(90deg,var(--purple),var(--accent))' },
  { label: 'Learning Log', done: 1, total: 2, warn: '1 chờ điền', color: 'linear-gradient(90deg,var(--amber),var(--red))' },
];

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Alert banner */}
      <div style={{
        background: 'var(--amber2)', border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 'var(--r)', padding: '8px 12px',
        display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
      }}>
        <span style={{ fontSize: 14 }}>⚡</span>
        <span style={{ color: 'var(--amber)', fontWeight: 600, flex: 1 }}>
          Learning Log "Podcast Ep.22" cần hoàn thành trong 18 giờ!
        </span>
        <button
          onClick={() => navigate('/onboard')}
          style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--bg3)', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 10, cursor: 'pointer' }}
        >
          Điền ngay
        </button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KpiCard label="Video hoàn thành" value={8} max={12} unit="/12" sub="Tháng này" trend="↑ 2 so với tháng trước" trendUp color="var(--teal)" />
        <KpiCard label="Tỉ lệ duyệt" value={85} max={100} unit="%" sub="Pass lần đầu" trend="↑ 5% tháng trước" trendUp color="var(--green)" />
        <KpiCard label="On-time delivery" value={70} max={100} unit="%" sub="Đúng deadline" trend="↓ Cần cải thiện" trendUp={false} color="var(--amber)" />
        <KpiCard label="Điểm mindset" value={90} max={100} unit="/100" sub="Journal + reflex" trend="↑ Giữ vững nhé!" trendUp color="var(--purple)" />
      </div>

      {/* 2-column row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* My videos */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Video của bạn</span>
            <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'var(--red)', color: '#fff' }}>3</span>
          </div>
          {MY_VIDEOS.map(v => (
            <div
              key={v.id}
              onClick={() => navigate('/pipeline')}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--b1)',
                borderLeft: `3px solid ${URGENCY_COLOR[v.urgency]}`,
                borderRadius: 'var(--r)', padding: '11px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 7, cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
            >
              <span style={{ fontSize: 18 }}>🎬</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{v.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                    color: URGENCY_COLOR[v.urgency], background: URGENCY_BG[v.urgency],
                  }}>{v.badge}</span>
                  <span style={{ fontSize: 9, color: 'var(--t3)' }}>{v.step}</span>
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'var(--accent2)', color: 'var(--accent)', fontWeight: 600 }}>{v.channel}</span>
                </div>
              </div>
              <span style={{ color: 'var(--t3)', fontSize: 11 }}>→</span>
            </div>
          ))}
        </div>

        {/* Right column */}
        <div>
          {/* Mindset card */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Mindset hôm nay</span>
            </div>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: 14 }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>💡</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 5 }}>"Craft before speed."</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.6 }}>
                Một video xuất đúng hạn nhưng ẩu sẽ bị reject — tốn gấp đôi thời gian. Làm đúng ngay từ đầu.
              </div>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Tiến độ tháng</span>
          </div>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: 14 }}>
            {PROGRESS_ITEMS.map(p => (
              <div key={p.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--t3)' }}>{p.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: p.warn ? 'var(--amber)' : 'var(--t1)' }}>
                    {p.warn || `${p.done}/${p.total}`}
                  </span>
                </div>
                <div style={{ background: 'var(--bg3)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: p.color, width: `${Math.round(p.done / p.total * 100)}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
