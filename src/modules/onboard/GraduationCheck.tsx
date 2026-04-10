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
const DAY_1 = new Date(Date.now() - 87 * 24 * 60 * 60 * 1000); // 87 days ago = day 87/90

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
  return {
    attempted: false,
    answers: ['', '', '', '', ''],
    selfScore: 50,
    techMindsetBalance: 50,
    submittedAt: null,
    coLeaderScore: null,
  };
}

function saveData(data: GraduationData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function GraduationCheck() {
  const [data, setData] = useState<GraduationData>(() => loadData());
  const [answers, setAnswers] = useState<string[]>(data.answers.length === 5 ? data.answers : ['', '', '', '', '']);
  const [selfScore, setSelfScore] = useState(data.selfScore);
  const [techMindsetBalance, setTechMindsetBalance] = useState(data.techMindsetBalance);
  const [submitted, setSubmitted] = useState(data.attempted);

  const daysSinceJoin = Math.floor((Date.now() - DAY_1.getTime()) / (1000 * 60 * 60 * 24));
  const daysToGrad = Math.max(0, 90 - daysSinceJoin);
  const isNearGrad = daysToGrad <= 7;

  useEffect(() => {
    saveData({ ...data, answers, selfScore, techMindsetBalance, attempted: submitted });
  }, [answers, selfScore, techMindsetBalance, submitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allAnswered = answers.every(a => a.trim().length > 10);
    if (!allAnswered) return;
    const newData: GraduationData = {
      attempted: true,
      answers,
      selfScore,
      techMindsetBalance,
      submittedAt: new Date().toISOString(),
      coLeaderScore: null,
    };
    setData(newData);
    saveData(newData);
    setSubmitted(true);
  };

  const handleReset = () => {
    const fresh: GraduationData = {
      attempted: false,
      answers: ['', '', '', '', ''],
      selfScore: 50,
      techMindsetBalance: 50,
      submittedAt: null,
      coLeaderScore: null,
    };
    setData(fresh);
    setAnswers(['', '', '', '', '']);
    setSelfScore(50);
    setTechMindsetBalance(50);
    setSubmitted(false);
    saveData(fresh);
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 12, padding: 16,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    background: 'var(--s1)', border: '1px solid var(--b1)',
    color: 'var(--t1)', fontSize: 12, outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Status card */}
      <div style={{
        ...cardStyle,
        background: isNearGrad ? 'rgba(133,79,11,0.12)' : 'rgba(46,134,171,0.08)',
        borderColor: isNearGrad ? 'rgba(239,159,39,0.3)' : 'rgba(46,134,171,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 36 }}>{isNearGrad ? '⏳' : '🎓'}</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)', marginBottom: 4 }}>
              Ngày {daysSinceJoin} / 90 — Graduation Check {isNearGrad ? 'sắp đến' : 'đang tiến hành'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--t2)' }}>
              {daysToGrad === 0
                ? 'Đã đến ngày Graduation Check! Hãy hoàn thành bài kiểm tra.'
                : `Còn ${daysToGrad} ngày nữa đến Graduation Check ngày 90.`
              }
            </div>
            {submitted && data.submittedAt && (
              <div style={{ fontSize: 11, color: 'var(--teal)', marginTop: 4 }}>
                ✓ Đã nộp lúc {new Date(data.submittedAt).toLocaleString('vi-VN')}
              </div>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 6, borderRadius: 99, background: 'var(--b1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (daysSinceJoin / 90) * 100)}%`,
              background: isNearGrad ? 'var(--amber)' : 'var(--rc)',
              borderRadius: 99,
              transition: 'width 0.3s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 9, color: 'var(--t3)' }}>Ngày 1</span>
            <span style={{ fontSize: 9, color: 'var(--t3)' }}>Ngày 90</span>
          </div>
        </div>
      </div>

      {!submitted ? (
        /* Question form */
        <div style={cardStyle}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 4 }}>
            📋 Bài kiểm tra Graduation Check
          </div>
          <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 16 }}>
            Trả lời bằng ngôn ngữ của bạn — không cần hoàn hảo, cần thể hiện tư duy.
          </div>

          <form onSubmit={handleSubmit}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--rc)', marginBottom: 4 }}>
                  Câu {i + 1} / {QUESTIONS.length}
                </div>
                <div style={{ fontSize: 13, color: 'var(--t1)', marginBottom: 8, lineHeight: 1.5 }}>{q}</div>
                <textarea
                  style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
                  value={answers[i]}
                  onChange={e => {
                    const next = [...answers];
                    next[i] = e.target.value;
                    setAnswers(next);
                  }}
                  placeholder="Viết câu trả lời của bạn ở đây..."
                  required
                />
              </div>
            ))}

            {/* Self scoring */}
            <div style={{ padding: 14, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--b1)', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', marginBottom: 12 }}>
                🎯 Tự đánh giá
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, color: 'var(--t2)' }}>Big-picture ratio</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)' }}>{selfScore}%</span>
                </div>
                <input
                  type="range"
                  min={0} max={100}
                  value={selfScore}
                  onChange={e => setSelfScore(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--teal)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--t3)' }}>
                  <span>Chủ yếu technical</span>
                  <span>Hoàn toàn big-picture</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, color: 'var(--t2)' }}>Technical vs Mindset balance</label>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold2)' }}>{techMindsetBalance}% mindset</span>
                </div>
                <input
                  type="range"
                  min={0} max={100}
                  value={techMindsetBalance}
                  onChange={e => setTechMindsetBalance(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold2)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--t3)' }}>
                  <span>100% Technical</span>
                  <span>100% Mindset</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%', padding: '10px', borderRadius: 8,
                background: 'var(--teal)', border: 'none',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Nộp Graduation Check
            </button>
          </form>
        </div>
      ) : (
        /* Result card */
        <div style={cardStyle}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 4 }}>
            ✅ Đã nộp Graduation Check
          </div>
          <div style={{ fontSize: 11, color: 'var(--teal)', marginBottom: 16 }}>
            Co-Leader sẽ review và chấm độc lập trong 48h.
          </div>

          {/* Self scores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(0,131,143,0.1)', border: '1px solid rgba(0,131,143,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>Big-picture ratio (tự chấm)</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--teal)' }}>{data.selfScore}%</div>
            </div>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(240,140,80,0.1)', border: '1px solid rgba(240,140,80,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 4 }}>Mindset balance</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: 'var(--gold2)' }}>{data.techMindsetBalance}%</div>
            </div>
          </div>

          {/* Answers summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {QUESTIONS.map((q, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--b1)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', marginBottom: 4 }}>Câu {i + 1}: {q}</div>
                <div style={{ fontSize: 11, color: 'var(--t1)', lineHeight: 1.6 }}>{data.answers[i] || '—'}</div>
              </div>
            ))}
          </div>

          {data.coLeaderScore !== null && (
            <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(46,125,50,0.12)', border: '1px solid rgba(46,125,50,0.3)', marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
                Co-Leader Score: {data.coLeaderScore}%
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            style={{
              padding: '7px 14px', borderRadius: 6, background: 'transparent',
              border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 11, cursor: 'pointer',
            }}
          >
            Reset (thử lại)
          </button>
        </div>
      )}
    </div>
  );
}
