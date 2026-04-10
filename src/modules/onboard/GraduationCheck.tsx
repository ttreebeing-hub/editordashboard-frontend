import { useState, useEffect } from 'react';

interface GraduationData {
  attempted: boolean;
  answers: string[];
  selfScore: number;
  techMindsetBalance: number;
  submittedAt: string | null;
  coLeaderScore: number | null;
}

const STORAGE_KEY = 'nl2_graduation';

// Demo: member joined 23 days ago
const DAY_1 = new Date(Date.now() - 23 * 24 * 60 * 60 * 1000);

const QUESTIONS = [
  'Tại sao công việc Editor quan trọng với NhiLe?',
  'Nếu video bị reject 3 lần cùng lý do, điều đó nói lên điều gì?',
  'Viewer của kênh NhiLe cần gì từ mỗi video?',
  'Vai trò của Editor trong việc đạt được mục tiêu kênh là gì?',
  'Mô tả 1 quyết định edit bạn đã thay đổi nhờ hiểu được WHY — không chỉ HOW.',
];

function loadData(): GraduationData {
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    if (d) return JSON.parse(d);
  } catch { /* ignore */ }
  return { attempted: false, answers: ['', '', '', '', ''], selfScore: 50, techMindsetBalance: 50, submittedAt: null, coLeaderScore: null };
}

function saveData(data: GraduationData) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export function GraduationCheck() {
  const [data, setData]       = useState<GraduationData>(() => loadData());
  const [answers, setAnswers] = useState<string[]>(data.answers.length === 5 ? data.answers : ['', '', '', '', '']);
  const [selfScore, setSelfScore]               = useState(data.selfScore);
  const [techMindsetBalance, setBalance]        = useState(data.techMindsetBalance);
  const [submitted, setSubmitted]               = useState(data.attempted);

  const daysSinceJoin = Math.floor((Date.now() - DAY_1.getTime()) / (1000 * 60 * 60 * 24));
  const daysLeft      = Math.max(0, 90 - daysSinceJoin);
  const isUnlocked    = daysSinceJoin >= 90;
  const pct           = Math.min(100, Math.round(daysSinceJoin / 90 * 100));

  useEffect(() => { saveData({ ...data, answers, selfScore, techMindsetBalance, attempted: submitted }); }, [answers, selfScore, techMindsetBalance, submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.every(a => a.trim().length > 10)) return;
    const next: GraduationData = { attempted: true, answers, selfScore, techMindsetBalance, submittedAt: new Date().toISOString(), coLeaderScore: null };
    setData(next); saveData(next); setSubmitted(true);
  };

  const handleReset = () => {
    const fresh: GraduationData = { attempted: false, answers: ['', '', '', '', ''], selfScore: 50, techMindsetBalance: 50, submittedAt: null, coLeaderScore: null };
    setData(fresh); setAnswers(['', '', '', '', '']); setSelfScore(50); setBalance(50); setSubmitted(false); saveData(fresh);
  };

  const card: React.CSSProperties = { background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: 16 };
  const inp:  React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: 12, outline: 'none' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Progress banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg3), rgba(14,165,233,0.08))',
        border: `1px solid ${isUnlocked ? 'var(--green)' : 'var(--accent)'}`,
        borderRadius: 'var(--r2)', padding: 24, textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 48, color: 'var(--accent)', lineHeight: 1 }}>
          {daysSinceJoin}
        </div>
        <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>ngày làm việc</div>
        <div style={{ marginTop: 12 }}>
          <div style={{ background: 'rgba(14,165,233,0.15)', borderRadius: 99, height: 8, maxWidth: 300, margin: '0 auto', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, background: isUnlocked ? 'var(--green)' : 'linear-gradient(90deg,var(--accent),var(--teal))', width: `${pct}%`, transition: 'width 0.5s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 6 }}>
            {daysSinceJoin} / 90 ngày để Graduation Check
          </div>
        </div>
      </div>

      {/* Locked state */}
      {!isUnlocked && (
        <div style={{ ...card, background: 'var(--bg3)', border: '1px solid var(--b1)', textAlign: 'center', opacity: 0.7, padding: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)', marginBottom: 8 }}>
            Graduation Check chưa mở
          </div>
          <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
            Hệ thống sẽ tự động gửi thông báo cho bạn vào ngày thứ 90.<br />
            Đến ngày đó, bạn sẽ hoàn thành bài đánh giá để tốt nghiệp onboard.<br /><br />
            <strong style={{ color: 'var(--t2)' }}>Còn {daysLeft} ngày nữa — tiếp tục cố gắng nhé! 💪</strong>
          </div>
        </div>
      )}

      {/* Unlocked: form or result */}
      {isUnlocked && !submitted && (
        <div style={card}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 4 }}>
            📋 Bài kiểm tra Graduation Check
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 16 }}>
            Trả lời bằng ngôn ngữ của bạn — không cần hoàn hảo, cần thể hiện tư duy.
          </div>
          <form onSubmit={handleSubmit}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>Câu {i + 1} / {QUESTIONS.length}</div>
                <div style={{ fontSize: 13, color: 'var(--t1)', marginBottom: 8, lineHeight: 1.5 }}>{q}</div>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
                  value={answers[i]}
                  onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }}
                  placeholder="Viết câu trả lời của bạn ở đây..." required />
              </div>
            ))}

            <div style={{ padding: 14, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--b1)', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>🎯 Tự đánh giá</div>
              {[
                { label: 'Big-picture ratio', val: selfScore, setter: setSelfScore, color: 'var(--teal)', lo: 'Chủ yếu technical', hi: 'Hoàn toàn big-picture' },
                { label: 'Technical vs Mindset', val: techMindsetBalance, setter: setBalance, color: 'var(--amber)', lo: '100% Technical', hi: '100% Mindset' },
              ].map(r => (
                <div key={r.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 11, color: 'var(--t2)' }}>{r.label}</label>
                    <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{r.val}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={r.val} onChange={e => r.setter(Number(e.target.value))} style={{ width: '100%', accentColor: r.color }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--t3)' }}>
                    <span>{r.lo}</span><span>{r.hi}</span>
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--teal)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Nộp Graduation Check
            </button>
          </form>
        </div>
      )}

      {isUnlocked && submitted && (
        <div style={card}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 4 }}>✅ Đã nộp Graduation Check</div>
          <div style={{ fontSize: 11, color: 'var(--teal)', marginBottom: 16 }}>Co-Leader sẽ review và chấm độc lập trong 48h.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Big-picture (tự chấm)', val: data.selfScore, color: 'var(--teal)' },
              { label: 'Mindset balance', val: data.techMindsetBalance, color: 'var(--amber)' },
            ].map(s => (
              <div key={s.label} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--b1)', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, color: s.color }}>{s.val}%</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', marginBottom: 4 }}>Câu {i + 1}: {q}</div>
                <div style={{ fontSize: 11, color: 'var(--t1)', lineHeight: 1.6 }}>{data.answers[i] || '—'}</div>
              </div>
            ))}
          </div>
          <button onClick={handleReset} style={{ padding: '7px 14px', borderRadius: 6, background: 'transparent', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 11, cursor: 'pointer' }}>
            Reset (thử lại)
          </button>
        </div>
      )}
    </div>
  );
}
