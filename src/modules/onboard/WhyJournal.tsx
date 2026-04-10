import { useState, useEffect } from 'react';

interface JournalEntry {
  id: string;
  taskName: string;
  whyText: string;
  depthLevel: 'L1' | 'L2' | 'L3';
  createdAt: string;
  buddyReviewed: boolean;
}

const STORAGE_KEY = 'nl2_whyjournal';

function loadEntries(): JournalEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function autoDetectDepth(text: string): 'L1' | 'L2' | 'L3' {
  const lower = text.toLowerCase();
  const hasViewerSpecific = /viewer|người xem|khán giả|đối tượng|target|nỗi đau|pain point|cảm xúc/.test(lower);
  const hasMission = /nhile|sứ mệnh|mission|mục tiêu kênh|reach|impact|thay đổi|cộng đồng/.test(lower);

  if (hasMission && hasViewerSpecific) return 'L3';
  if (hasViewerSpecific || hasMission) return 'L2';
  return 'L1';
}

function DepthBadge({ level }: { level: 'L1' | 'L2' | 'L3' }) {
  const styles: Record<string, React.CSSProperties> = {
    L1: { background: 'rgba(62,80,106,0.4)', color: 'var(--t3)', border: '1px solid var(--b1)' },
    L2: { background: 'rgba(46,134,171,0.15)', color: '#2E86AB', border: '1px solid rgba(46,134,171,0.3)' },
    L3: { background: 'rgba(0,131,143,0.15)', color: '#00838F', border: '1px solid rgba(0,131,143,0.3)' },
  };
  const labels = { L1: 'L1 Surface', L2: 'L2 Medium', L3: 'L3 Deep' };

  return (
    <span style={{
      ...styles[level],
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
    }}>
      {labels[level]}
    </span>
  );
}

function getWeekStats(entries: JournalEntry[]) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekEntries = entries.filter(e => new Date(e.createdAt) >= weekStart);
  const totalTasks = 5; // target per week (mock)
  const avgDepth = weekEntries.length === 0 ? 0 :
    weekEntries.reduce((sum, e) => sum + (e.depthLevel === 'L1' ? 1 : e.depthLevel === 'L2' ? 2 : 3), 0) / weekEntries.length;

  // streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 30; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);
    const hasEntry = entries.some(e => {
      const d = new Date(e.createdAt);
      return d >= day && d <= dayEnd;
    });
    if (hasEntry) streak++;
    else if (i > 0) break;
  }

  return { weekCount: weekEntries.length, totalTasks, avgDepth: avgDepth.toFixed(1), streak };
}

export function WhyJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadEntries());
  const [taskName, setTaskName] = useState('');
  const [whyText, setWhyText] = useState('');
  const [manualDepth, setManualDepth] = useState<'auto' | 'L1' | 'L2' | 'L3'>('auto');

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const detectedDepth = autoDetectDepth(whyText);
  const finalDepth = manualDepth === 'auto' ? detectedDepth : manualDepth;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !whyText.trim()) return;
    const entry: JournalEntry = {
      id: 'j' + Date.now(),
      taskName: taskName.trim(),
      whyText: whyText.trim(),
      depthLevel: finalDepth,
      createdAt: new Date().toISOString(),
      buddyReviewed: false,
    };
    setEntries(prev => [entry, ...prev]);
    setTaskName('');
    setWhyText('');
    setManualDepth('auto');
  };

  const stats = getWeekStats(entries);

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
        {[
          { label: 'Journal tuần này', value: `${stats.weekCount}/${stats.totalTasks} tasks` },
          { label: 'Avg depth', value: `${stats.avgDepth} / 3.0` },
          { label: 'Streak', value: `${stats.streak} ngày liên tiếp` },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, background: 'var(--bg3)', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div style={cardStyle}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>
          ✍️ Why Journal mới
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Tên video / task</label>
            <input
              style={inputStyle}
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              placeholder="Ví dụ: Video thói quen sáng EP.3..."
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Video này phục vụ viewer nào và tại sao nó quan trọng?</label>
            <textarea
              style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
              value={whyText}
              onChange={e => setWhyText(e.target.value)}
              placeholder="Ví dụ: Video này dành cho người muốn thay đổi thói quen sáng — nếu hook 5 giây đầu không capture được nỗi đau của họ, chúng ta mất họ ngay lập tức..."
              required
            />
          </div>

          {/* Depth indicator */}
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Depth Level</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Auto detected */}
              <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                Tự động: <DepthBadge level={detectedDepth} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--t3)' }}>|</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['auto', 'L1', 'L2', 'L3'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setManualDepth(d)}
                    style={{
                      fontSize: 10, padding: '3px 8px', borderRadius: 4, cursor: 'pointer',
                      border: manualDepth === d ? '1px solid var(--rc)' : '1px solid var(--b1)',
                      background: manualDepth === d ? 'var(--rc2)' : 'transparent',
                      color: manualDepth === d ? 'var(--rc)' : 'var(--t2)',
                    }}
                  >
                    {d === 'auto' ? 'Tự động' : d}
                  </button>
                ))}
              </div>
            </div>
            {whyText && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--t2)' }}>
                Kết quả: <DepthBadge level={finalDepth} />
                {finalDepth === 'L1' && <span style={{ marginLeft: 6, color: 'var(--t3)' }}>— Thử đề cập cụ thể hơn về viewer hoặc impact</span>}
                {finalDepth === 'L2' && <span style={{ marginLeft: 6, color: 'var(--t3)' }}>— Tốt! Thử kết nối với mission NhiLe để đạt L3</span>}
                {finalDepth === 'L3' && <span style={{ marginLeft: 6, color: 'var(--teal)' }}>— Tuyệt vời! Tư duy deep đã được ghi nhận.</span>}
              </div>
            )}
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 18px', borderRadius: 6, background: 'var(--rc)',
              border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Lưu Journal
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)', marginBottom: 10 }}>
          Lịch sử ({entries.length})
        </div>
        {entries.length === 0 ? (
          <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--t3)', fontSize: 12 }}>
            Chưa có journal nào. Hãy bắt đầu với task đầu tiên!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {entries.map(entry => (
              <div key={entry.id} style={{ ...cardStyle, background: 'var(--bg3)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{entry.taskName}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                    <DepthBadge level={entry.depthLevel} />
                    {entry.buddyReviewed && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--green)', background: 'rgba(46,125,50,0.15)', padding: '2px 6px', borderRadius: 10, border: '1px solid rgba(46,125,50,0.3)' }}>
                        Buddy ✓
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 6, lineHeight: 1.5 }}>
                  {entry.whyText.slice(0, 80)}{entry.whyText.length > 80 ? '...' : ''}
                </div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>
                  {new Date(entry.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
