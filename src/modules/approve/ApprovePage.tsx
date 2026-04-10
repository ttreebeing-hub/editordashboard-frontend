import { useState } from 'react';

// Member's own review results page

interface RejectedVideo { id: string; title: string; date: string; qc: string; reasons: string; }
interface ApprovedVideo { id: string; title: string; date: string; qc: string; comment: string; }

const REJECTED: RejectedVideo[] = [
  { id: 'r1', title: 'Podcast NhiLe Talk Ep.21', date: '08/04/2026', qc: 'Anh Minh', reasons: '1. Màu sắc không nhất quán ở đoạn 2:34 – 3:10, cần chỉnh balance.\n2. Nhạc nền quá lớn tại intro, lấn át giọng host.\n3. Thiếu lower-third tên khách mời xuất hiện lần đầu.' },
];
const APPROVED: ApprovedVideo[] = [
  { id: 'a1', title: 'Review Samsung Galaxy S25', date: '07/04/2026', qc: 'Anh Minh', comment: '"Edit rất mượt, chuyển cảnh tự nhiên. Màu sắc nhất quán và nhạc nền cân bằng tốt. Phần B-roll sản phẩm rất chuyên nghiệp — đây là chuẩn để tham khảo cho các video tới!"' },
];

function CelebrateModal({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 16, padding: 30, textAlign: 'center', maxWidth: 380, animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎊</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--green)', marginBottom: 8 }}>Video được duyệt!</div>
        <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 12 }}>
          Chúc mừng — video <strong style={{ color: 'var(--t1)' }}>"{title}"</strong> của bạn đã pass QC!
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', fontStyle: 'italic', marginBottom: 20 }}>
          💬 QC nhận xét: "Edit rất mượt, chuyển cảnh tự nhiên — đây là chuẩn tham khảo!"
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '10px', borderRadius: 8, background: 'var(--teal)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Tuyệt vời, tiếp tục! 🚀
        </button>
      </div>
    </div>
  );
}

export function ApprovePage() {
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [celebrate, setCelebrate] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Rejected */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Bị từ chối</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'var(--red)', color: '#fff' }}>{REJECTED.filter(r => !confirmed[r.id]).length}</span>
      </div>

      {REJECTED.map(r => {
        if (confirmed[r.id]) return null;
        return (
          <div key={r.id} style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderLeft: '3px solid var(--red)', borderRadius: 'var(--r2)', padding: 16, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>🎬</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{r.title}</div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>Gửi: {r.date} · QC: {r.qc}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: 'var(--red2)', color: 'var(--red)' }}>Từ chối</span>
            </div>
            <div style={{ background: 'var(--red2)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r)', padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--red)', marginBottom: 5 }}>🔴 Lý do từ chối</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{r.reasons}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <input
                type="checkbox"
                id={`chk-${r.id}`}
                checked={!!checked[r.id]}
                onChange={e => setChecked(p => ({ ...p, [r.id]: e.target.checked }))}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor={`chk-${r.id}`} style={{ fontSize: 11, color: 'var(--t3)', cursor: 'pointer', flex: 1 }}>
                Tôi đã đọc kỹ lý do và hiểu rõ cần sửa gì
              </label>
              <button
                disabled={!checked[r.id]}
                onClick={() => setConfirmed(p => ({ ...p, [r.id]: true }))}
                style={{
                  padding: '6px 14px', borderRadius: 6, border: 'none',
                  background: checked[r.id] ? 'var(--blue)' : 'var(--bg4)',
                  color: '#fff', fontSize: 11, fontWeight: 600,
                  cursor: checked[r.id] ? 'pointer' : 'not-allowed', opacity: checked[r.id] ? 1 : 0.4,
                }}
              >
                Xác nhận & Làm lại →
              </button>
            </div>
          </div>
        );
      })}

      {REJECTED.every(r => confirmed[r.id]) && REJECTED.length > 0 && (
        <div style={{ background: 'var(--green2)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--r)', padding: '10px 14px', marginBottom: 10, fontSize: 12, color: 'var(--green)' }}>
          ✓ Đã xác nhận tất cả lý do từ chối. Hãy tiếp tục sửa và nộp lại!
        </div>
      )}

      <div style={{ height: 1, background: 'var(--b1)', margin: '8px 0 16px' }} />

      {/* Approved */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Được duyệt</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'var(--green)', color: '#fff' }}>{APPROVED.length}</span>
      </div>

      {APPROVED.map(a => (
        <div key={a.id} style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderLeft: '3px solid var(--green)', borderRadius: 'var(--r2)', padding: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>🎬</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{a.title}</div>
              <div style={{ fontSize: 10, color: 'var(--t3)' }}>Gửi: {a.date} · QC: {a.qc}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: 'var(--green2)', color: 'var(--green)' }}>✓ Đã duyệt</span>
          </div>
          <div style={{ background: 'var(--green2)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--r)', padding: '10px 12px', marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)', marginBottom: 4 }}>🎉 Nhận xét từ QC</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5 }}>{a.comment}</div>
          </div>
          <button
            onClick={() => setCelebrate(a.title)}
            style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'var(--teal)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            🎊 Xem lời chúc mừng
          </button>
        </div>
      ))}

      {celebrate && <CelebrateModal title={celebrate} onClose={() => setCelebrate(null)} />}
    </div>
  );
}
