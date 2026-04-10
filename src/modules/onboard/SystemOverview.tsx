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

export function SystemOverview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--t1)', marginBottom: 4 }}>
          Hệ thống 30 năm
        </div>
        <div style={{ fontSize: 12, color: 'var(--t3)' }}>
          Framework phát triển tư duy — không phụ thuộc vào cá nhân
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {PILLARS.map((p) => (
          <div key={p.title} style={{ ...cardStyle, background: p.bg, borderColor: p.border }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{p.emoji}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: p.color, marginBottom: 6 }}>{p.title}</div>
            <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <PhaseOnboard />
      </div>
    </div>
  );
}
