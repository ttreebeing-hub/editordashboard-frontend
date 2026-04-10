import { useState } from 'react';

const cardStyle: React.CSSProperties = {
  background: 'var(--bg2)',
  border: '1px solid var(--b1)',
  borderRadius: 12,
  padding: 16,
};

const PILLARS = [
  {
    emoji: '🟣',
    title: 'Hiến Pháp Editor',
    desc: 'Tài liệu sống chứa WHY, tiêu chuẩn & case study. Cập nhật mỗi năm, sở hữu bởi hệ thống — không phải cá nhân.',
    bg: 'rgba(83,74,183,0.12)',
    border: 'rgba(175,169,236,0.3)',
    color: '#afa9ec',
  },
  {
    emoji: '🟢',
    title: 'Vòng Lặp Nghi Thức',
    desc: 'Daily / Weekly / Monthly rituals tự động reinforcing mindset — không cần leader giải thích mỗi lần.',
    bg: 'rgba(15,110,86,0.12)',
    border: 'rgba(93,202,165,0.3)',
    color: '#5dcaa5',
  },
  {
    emoji: '🟠',
    title: 'Hệ Thống Cổng',
    desc: 'Tiêu chí thăng cấp BẮT BUỘC đo mindset — không chỉ kỹ năng. Ai lên thì hệ thống tự kiểm tra.',
    bg: 'rgba(133,79,11,0.12)',
    border: 'rgba(239,159,39,0.3)',
    color: '#ef9f27',
  },
];

const PHASES = ['Onboard', 'Develop', 'Promote', 'Offboard'] as const;
type Phase = typeof PHASES[number];

function PhaseOnboard() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 32 }}>📖</span>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)' }}>Giai đoạn 1: Onboard</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Ngày 1 – Tháng 3 (T3)</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {[
          { week: 'Tuần 1', title: 'Đọc Hiến Pháp + Buddy System', desc: 'Nắm nền tảng WHY và được ghép cặp với buddy có mindset phù hợp.' },
          { week: 'Tuần 2–4', title: 'Why Journal cho mỗi task', desc: 'Trước mỗi task, viết tại sao video này quan trọng với viewer.' },
          { week: 'Tháng 2', title: 'Reject như data, không phải lỗi', desc: 'Mỗi lần bị reject = 1 dữ liệu học tập, ghi lại vào Learning Log.' },
          { week: 'Ngày 90', title: 'Graduation Check', desc: 'Bài kiểm tra tư duy big-picture — pass mới được đọc SOP đầy đủ.' },
        ].map((m) => (
          <div key={m.week} style={{ ...cardStyle, background: 'var(--bg3)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.week}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{m.title}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, background: 'rgba(83,74,183,0.08)', borderColor: 'rgba(175,169,236,0.2)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#afa9ec', marginBottom: 8 }}>📋 Quy tắc Onboard</div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'Buddy chọn theo mindset score — không phải seniority.',
            'SOP chỉ đọc sau khi pass Graduation Check ngày 90.',
            'Fail Graduation Check 2 lần → bắt buộc 1-1 với Co-Leader.',
          ].map((r, i) => (
            <li key={i} style={{ fontSize: 11, color: 'var(--t2)', display: 'flex', gap: 8 }}>
              <span style={{ color: '#afa9ec' }}>→</span> {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PhaseDevelop() {
  const mindsets = [
    { old: 'Tôi edit video', new: 'Tôi đang giúp NhiLe reach đúng người', label: 'Mindset 1: Mục đích công việc' },
    { old: 'Chờ feedback từ leader', new: 'Tự đặt câu hỏi cải thiện trước khi submit', label: 'Mindset 2: Chủ động học' },
    { old: '"Xong task là xong"', new: '"Mỗi video là dữ liệu để hệ thống học"', label: 'Mindset 3: Video = Data' },
    { old: 'Leader quyết định chất lượng', new: 'Tự đánh giá được chất lượng theo tiêu chuẩn', label: 'Mindset 4: Self-evaluation' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 32 }}>📈</span>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)' }}>Giai đoạn 2: Develop</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>T3+ — Chuyển hóa mindset sâu</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mindsets.map((m, i) => (
          <div key={i} style={{ ...cardStyle, background: 'var(--bg3)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{m.label}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(198,40,40,0.1)', border: '1px solid rgba(198,40,40,0.25)' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--red)', marginBottom: 3 }}>❌ Cũ</div>
                <div style={{ fontSize: 11, color: 'var(--t2)' }}>{m.old}</div>
              </div>
              <div style={{ fontSize: 18, color: 'var(--t3)' }}>→</div>
              <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(0,131,143,0.1)', border: '1px solid rgba(0,131,143,0.25)' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--teal)', marginBottom: 3 }}>✓ Mới</div>
                <div style={{ fontSize: 11, color: 'var(--t1)' }}>{m.new}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhasePromote() {
  const gates = [
    {
      gate: 'Cổng 1',
      from: 'Member',
      to: 'Senior',
      criteria: 'Learning log không tái diễn cùng lý do reject >2 lần trong 3 tháng liên tiếp.',
      bg: 'rgba(83,74,183,0.08)',
      border: 'rgba(175,169,236,0.3)',
      color: '#afa9ec',
    },
    {
      gate: 'Cổng 2',
      from: 'Senior',
      to: 'Co-Leader',
      criteria: 'Đã buddy thành công ít nhất 1 member mới qua Graduation Check ngày 90.',
      bg: 'rgba(15,110,86,0.08)',
      border: 'rgba(93,202,165,0.3)',
      color: '#5dcaa5',
    },
    {
      gate: 'Cổng 3',
      from: 'Co-Leader',
      to: 'Leader',
      criteria: 'Đã phát triển 1 Senior sẵn sàng thay thế mình + thực hiện Vision Talk 10 phút trước team.',
      bg: 'rgba(133,79,11,0.08)',
      border: 'rgba(239,159,39,0.3)',
      color: '#ef9f27',
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 32 }}>🚪</span>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)' }}>Giai đoạn 3: Promote</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Hệ thống cổng — đo mindset bắt buộc</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {gates.map((g) => (
          <div key={g.gate} style={{
            ...cardStyle,
            background: g.bg,
            borderColor: g.border,
            borderLeft: `4px solid ${g.color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: g.color, background: `${g.color}20`, padding: '2px 8px', borderRadius: 4 }}>{g.gate}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{g.from} → {g.to}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>{g.criteria}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseOffboard() {
  const mechanisms = [
    { icon: '✉️', title: 'Letter to My Successor', desc: 'Viết thư để lại cho người kế nhiệm — mindset, bài học, và những gì mình ước mình biết sớm hơn.' },
    { icon: '🎬', title: 'Video "What I Wish I Knew"', desc: 'Quay video ngắn chia sẻ insight quan trọng nhất sau quá trình làm việc.' },
    { icon: '💬', title: 'Exit Interview (Mindset Debrief)', desc: '1-1 với Leader để review hành trình tư duy — không phải performance review.' },
    { icon: '📅', title: 'Annual Review — Cập nhật Hiến Pháp', desc: 'Kinh nghiệm của bạn sẽ được cập nhật vào Hiến Pháp Editor cho thế hệ sau.' },
  ];

  const dnaChain = ['Founder', 'Hiến Pháp', 'Nghi thức', 'Cổng thăng cấp', 'Leader mới'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 32 }}>📜</span>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)' }}>Giai đoạn 4: Offboard</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>Truyền đi — Hệ thống sống tiếp</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {mechanisms.map((m) => (
          <div key={m.title} style={{ ...cardStyle, background: 'var(--bg3)' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{m.title}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, background: 'rgba(0,131,143,0.08)', borderColor: 'rgba(0,131,143,0.25)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', marginBottom: 12 }}>🧬 DNA Chain — Hệ thống truyền thừa</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {dnaChain.map((node, i) => (
            <div key={node} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--t1)',
                background: 'var(--bg3)', border: '1px solid var(--b1)',
                padding: '4px 10px', borderRadius: 20,
              }}>{node}</span>
              {i < dnaChain.length - 1 && (
                <span style={{ fontSize: 14, color: 'var(--teal)', fontWeight: 700 }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SystemOverview() {
  const [activePhase, setActivePhase] = useState<Phase>('Onboard');

  const phaseLabels: Record<Phase, string> = {
    Onboard: 'Giai đoạn 1: Onboard',
    Develop: 'Giai đoạn 2: Develop',
    Promote: 'Giai đoạn 3: Promote',
    Offboard: 'Giai đoạn 4: Offboard',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--t1)', marginBottom: 4 }}>
          Hệ thống 30 năm
        </div>
        <div style={{ fontSize: 12, color: 'var(--t3)' }}>
          Framework vận hành nhân sự không phụ thuộc vào cá nhân
        </div>
      </div>

      {/* 3 Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {PILLARS.map((p) => (
          <div key={p.title} style={{
            ...cardStyle,
            background: p.bg,
            borderColor: p.border,
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{p.emoji}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: p.color, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {PHASES.map((phase) => {
          const active = activePhase === phase;
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                border: active ? '1px solid var(--rc)' : '1px solid var(--b1)',
                background: active ? 'var(--rc2)' : 'transparent',
                color: active ? 'var(--rc)' : 'var(--t2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {phaseLabels[phase]}
            </button>
          );
        })}
      </div>

      {/* Phase content */}
      <div style={cardStyle}>
        {activePhase === 'Onboard' && <PhaseOnboard />}
        {activePhase === 'Develop' && <PhaseDevelop />}
        {activePhase === 'Promote' && <PhasePromote />}
        {activePhase === 'Offboard' && <PhaseOffboard />}
      </div>
    </div>
  );
}
