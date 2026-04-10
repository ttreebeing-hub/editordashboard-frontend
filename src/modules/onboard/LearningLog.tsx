import { useState, useEffect } from 'react';

interface LearningEntry {
  id: string;
  videoName: string;
  criteria: string;
  occurrence: number;
  processChange: string;
  learned: string;
  createdAt: string;
  coLeaderReviewed: boolean;
}

const STORAGE_KEY = 'nl2_learninglog';

const CRITERIA_OPTIONS = [
  'Hook/Retention',
  'Audio quality',
  'Visual quality',
  'Kỹ thuật export',
  'Big picture thinking',
  'Khác',
];

function loadEntries(): LearningEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveEntries(entries: LearningEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function getMonthStats(entries: LearningEntry[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEntries = entries.filter(e => new Date(e.createdAt) >= monthStart);

  const totalRejects = monthEntries.length;

  // LVI: new_reasons / total_reasons
  const criteriaCount: Record<string, number> = {};
  monthEntries.forEach(e => {
    criteriaCount[e.criteria] = (criteriaCount[e.criteria] || 0) + 1;
  });
  const totalReasons = Object.values(criteriaCount).reduce((a, b) => a + b, 0);
  const newReasons = Object.values(criteriaCount).filter(c => c === 1).length;
  const lvi = totalReasons === 0 ? 0 : newReasons / totalReasons;

  // Most repeated
  let maxCount = 0;
  let topCriteria = '—';
  Object.entries(criteriaCount).forEach(([c, count]) => {
    if (count > maxCount) { maxCount = count; topCriteria = c; }
  });
  const topStr = maxCount > 1 ? `${topCriteria} (${maxCount} lần)` : '—';

  return { totalRejects, lvi: lvi.toFixed(2), topCriteria: topStr };
}

function timeSince(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Vừa xong';
  if (hours < 24) return `${hours}h trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function LearningLog() {
  const [entries, setEntries] = useState<LearningEntry[]>(() => loadEntries());
  const [videoName, setVideoName] = useState('');
  const [criteria, setCriteria] = useState(CRITERIA_OPTIONS[0]);
  const [occurrence, setOccurrence] = useState(1);
  const [processChange, setProcessChange] = useState('');
  const [learned, setLearned] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  useEffect(() => {
    setShowAlert(occurrence >= 3);
  }, [occurrence]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoName.trim() || !processChange.trim()) return;
    const entry: LearningEntry = {
      id: 'l' + Date.now(),
      videoName: videoName.trim(),
      criteria,
      occurrence,
      processChange: processChange.trim(),
      learned: learned.trim(),
      createdAt: new Date().toISOString(),
      coLeaderReviewed: false,
    };
    setEntries(prev => [entry, ...prev]);
    setVideoName('');
    setCriteria(CRITERIA_OPTIONS[0]);
    setOccurrence(1);
    setProcessChange('');
    setLearned('');
  };

  const stats = getMonthStats(entries);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    background: 'var(--s1)', border: '1px solid var(--b1)',
    color: 'var(--t1)', fontSize: 12, outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, color: 'var(--t3)', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: 4, display: 'block',
  };
  const cardStyle: React.CSSProperties = {
    background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 12, padding: 16,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <div style={{ ...cardStyle, background: 'var(--bg3)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Tổng reject tháng này</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--t1)' }}>{stats.totalRejects}</div>
        </div>
        <div style={{ ...cardStyle, background: 'var(--bg3)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
            LVI
            <span
              title="Learning Velocity Index: Tỉ lệ lý do reject MỚI / tổng lý do tháng này. >0.5 = đang học tốt"
              style={{ marginLeft: 4, cursor: 'help', color: 'var(--rc)' }}
            >ⓘ</span>
          </div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: parseFloat(stats.lvi) >= 0.5 ? 'var(--green)' : 'var(--amber)' }}>
            {stats.lvi}
          </div>
        </div>
        <div style={{ ...cardStyle, background: 'var(--bg3)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Lý do lặp nhiều nhất</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', marginTop: 4 }}>{stats.topCriteria}</div>
        </div>
      </div>

      {/* Alert banner */}
      {showAlert && (
        <div style={{
          padding: '10px 14px', borderRadius: 8,
          background: 'rgba(198,40,40,0.12)', border: '1px solid rgba(198,40,40,0.35)',
          fontSize: 12, color: '#ef9a9a',
          display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <span>⚠️</span>
          <span>Đây là lần thứ 3+ cùng lý do — hệ thống đã ghi nhận. Co-Leader sẽ được thông báo để hỗ trợ.</span>
        </div>
      )}

      {/* Form */}
      <div style={cardStyle}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>
          📝 Ghi nhận Learning Log mới
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Tên video bị reject</label>
            <input
              style={inputStyle}
              value={videoName}
              onChange={e => setVideoName(e.target.value)}
              placeholder="Tên video..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Tiêu chí bị fail?</label>
              <select
                style={inputStyle}
                value={criteria}
                onChange={e => setCriteria(e.target.value)}
              >
                {CRITERIA_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Lần thứ mấy cùng lý do này?</label>
              <input
                type="number"
                style={inputStyle}
                value={occurrence}
                onChange={e => setOccurrence(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Bước nào trong quy trình mình sẽ thay đổi? *</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }}
              value={processChange}
              onChange={e => setProcessChange(e.target.value)}
              placeholder="Ví dụ: Trước khi submit, mình sẽ xem lại 5 giây đầu và tự hỏi: hook này có capture nỗi đau của viewer không?"
              required
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Học được gì từ reject này? (tùy chọn)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 60, resize: 'vertical', lineHeight: 1.6 }}
              value={learned}
              onChange={e => setLearned(e.target.value)}
              placeholder="Insight quan trọng nhất..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)' }}>
              Thời gian: {new Date().toLocaleString('vi-VN')}
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 18px', borderRadius: 6, background: 'var(--rc)',
                border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Lưu Learning Log
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)', marginBottom: 10 }}>
          Lịch sử ({entries.length})
        </div>
        {entries.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--t3)', fontSize: 12 }}>
            Chưa có learning log. Mỗi reject là một bước tiến!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.map(entry => (
              <div key={entry.id} style={{ ...cardStyle, background: 'var(--bg3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>{entry.videoName}</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 4,
                        background: 'rgba(46,134,171,0.1)', color: 'var(--rc)',
                        border: '1px solid rgba(46,134,171,0.2)',
                        fontWeight: 600,
                      }}>{entry.criteria}</span>
                      <span style={{
                        fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                        background: entry.occurrence >= 3 ? 'rgba(198,40,40,0.15)' : 'rgba(245,127,23,0.1)',
                        color: entry.occurrence >= 3 ? 'var(--red)' : 'var(--amber)',
                        border: `1px solid ${entry.occurrence >= 3 ? 'rgba(198,40,40,0.3)' : 'rgba(245,127,23,0.2)'}`,
                      }}>Lần {entry.occurrence}</span>
                      {entry.coLeaderReviewed && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--green)', background: 'rgba(46,125,50,0.15)', padding: '2px 6px', borderRadius: 10, border: '1px solid rgba(46,125,50,0.3)' }}>Đã xem</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--t3)', flexShrink: 0 }}>{timeSince(entry.createdAt)}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: 'var(--t3)' }}>Thay đổi: </span>
                  {entry.processChange.slice(0, 100)}{entry.processChange.length > 100 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
