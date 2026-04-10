const MINDSETS = [
  { icon: '⚡', title: 'Craft over Speed',      desc: 'Làm đúng trước, làm nhanh sau. Một video cẩu thả tốn gấp đôi thời gian sửa.' },
  { icon: '🔍', title: 'Đọc Brief kỹ',           desc: 'Brief là bản hợp đồng. Thiếu thông tin = hỏi ngay, không tự đoán rồi làm sai.' },
  { icon: '🪞', title: 'Reflect sau reject',      desc: 'Mỗi reject là một bài học. Điền learning log trong 24h để không lặp lại lỗi.' },
  { icon: '🤝', title: 'Giao tiếp proactive',    desc: 'Báo trước khi trễ deadline. Đừng để QC đi hỏi mới trả lời.' },
  { icon: '📈', title: 'Kaizen — cải thiện 1%',  desc: 'Mỗi video tốt hơn 1% so với video trước. Nhỏ thôi nhưng bền.' },
  { icon: '🧘', title: 'Tập trung — 1 task',     desc: 'Multi-tasking là ảo giác. Một video tại một thời điểm, làm xong rồi chuyển.' },
  { icon: '🎯', title: 'Hiểu Why của video',      desc: 'Mỗi video có mục đích. Khi hiểu Why, bạn biết giữ cái gì và cắt cái gì.' },
  { icon: '💬', title: 'Feedback = quà tặng',    desc: 'QC không phải kẻ thù. Họ muốn video tốt nhất — giống bạn.' },
  { icon: '🌱', title: 'Không ngừng học',         desc: 'Tool mới, trend mới, kỹ thuật mới. Editor giỏi luôn tò mò và update.' },
];

export function MindsetEditor() {
  return (
    <div>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg3), rgba(14,165,233,0.06))',
        border: '1px solid var(--b1)', borderRadius: 'var(--r2)',
        padding: 14, marginBottom: 16,
      }}>
        <div style={{ fontSize: 18, marginBottom: 6 }}>🎯</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 5 }}>
          Mindset của một Editor tại NhiLe
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.6 }}>
          Đây là những giá trị cốt lõi định hình cách bạn làm việc, giao tiếp và phát triển trong team.
        </div>
      </div>

      {/* 3-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {MINDSETS.map(m => (
          <div
            key={m.title}
            style={{
              background: 'var(--bg2)', border: '1px solid var(--b1)',
              borderRadius: 'var(--r2)', padding: 14, textAlign: 'center',
              transition: 'all 0.2s', cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--b2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--b1)'; e.currentTarget.style.transform = ''; }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)', marginBottom: 5 }}>{m.title}</div>
            <div style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.5 }}>{m.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
