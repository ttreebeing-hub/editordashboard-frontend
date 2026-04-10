// Why Journal — history only view.
// Journals are written at Step B1 (Nhận task) inside Pipeline SOP.

interface PipelineJournal { id: string; title: string; q1: string; q2: string; q3: string; }
interface LegacyEntry { id: string; taskName: string; whyText: string; depthLevel: 'L1' | 'L2' | 'L3'; createdAt: string; }

const VIDEO_TITLES: Record<string, string> = {
  vid1: 'Podcast NhiLe Talk Ep.22',
  vid2: 'Review iPhone 16 Pro Max',
  vid3: 'Vlog Trip Đà Nẵng 2025',
};

function getPipelineJournals(): PipelineJournal[] {
  try {
    const s = JSON.parse(localStorage.getItem('nl2_pipeline_v2') || '{}');
    const { journal, journalDone } = s;
    if (!journal || !journalDone) return [];
    return (Object.keys(journalDone) as string[])
      .filter(vid => journalDone[vid])
      .map(vid => ({
        id: vid,
        title: VIDEO_TITLES[vid] ?? vid,
        q1: journal[vid]?.q1 ?? '',
        q2: journal[vid]?.q2 ?? '',
        q3: journal[vid]?.q3 ?? '',
      }));
  } catch { return []; }
}

function getLegacyEntries(): LegacyEntry[] {
  try { return JSON.parse(localStorage.getItem('nl2_whyjournal') || '[]'); } catch { return []; }
}

function DepthBadge({ level }: { level: 'L1' | 'L2' | 'L3' }) {
  const map = { L1: ['rgba(90,90,112,0.3)', 'var(--t3)'], L2: ['var(--blue2)', 'var(--blue)'], L3: ['var(--teal2)', 'var(--teal)'] };
  const labels = { L1: 'L1 Surface', L2: 'L2 Medium', L3: 'L3 Deep' };
  return (
    <span style={{ background: map[level][0], color: map[level][1], fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>
      {labels[level]}
    </span>
  );
}

function autoDepth(text: string): 'L1' | 'L2' | 'L3' {
  const l = text.toLowerCase();
  const hasViewer = /viewer|người xem|khán giả|đối tượng|target|nỗi đau|pain|cảm xúc/.test(l);
  const hasMission = /nhile|sứ mệnh|mission|mục tiêu kênh|reach|impact|thay đổi|cộng đồng/.test(l);
  if (hasMission && hasViewer) return 'L3';
  if (hasViewer || hasMission) return 'L2';
  return 'L1';
}

export function WhyJournal() {
  const pJournals = getPipelineJournals();
  const legacy = getLegacyEntries();
  const total = pJournals.length + legacy.length;

  const cardStyle: React.CSSProperties = { background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: 14 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'Tổng journals', value: `${total} entries` },
          { label: 'Pipeline done', value: `${pJournals.length} video` },
          { label: 'Legacy entries', value: `${legacy.length} bài` },
        ].map(s => (
          <div key={s.label} style={{ ...cardStyle, background: 'var(--bg3)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Info banner */}
      <div style={{ background: 'var(--accent2)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--r)', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
        <span style={{ fontSize: 14 }}>💡</span>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
          Why Journal được điền tại <strong>Bước B1 — Nhận task</strong> trong Pipeline SOP. Trang này chỉ hiển thị lịch sử.
        </span>
      </div>

      {/* Pipeline journals */}
      {pJournals.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Từ Pipeline SOP
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pJournals.map(j => (
              <div key={j.id} style={{ ...cardStyle, background: 'var(--bg3)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>🎬 {j.title}</div>
                {[['1. Video này phục vụ mục đích gì?', j.q1], ['2. Khán giả mục tiêu là ai?', j.q2], ['3. Điều quan trọng nhất cần truyền đạt?', j.q3]].map(([q, a]) => (
                  <div key={q}>
                    <div style={{ fontSize: 10, color: 'var(--t3)', marginBottom: 2 }}>{q}</div>
                    <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 6, lineHeight: 1.5 }}>{a || '—'}</div>
                  </div>
                ))}
                <div style={{ marginTop: 4 }}>
                  <DepthBadge level={autoDepth([j.q1, j.q2, j.q3].join(' '))} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy entries */}
      {legacy.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
            Lịch sử cũ
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {legacy.map(e => (
              <div key={e.id} style={{ ...cardStyle, background: 'var(--bg3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{e.taskName}</div>
                  <DepthBadge level={e.depthLevel} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 4 }}>
                  {e.whyText.slice(0, 120)}{e.whyText.length > 120 ? '...' : ''}
                </div>
                <div style={{ fontSize: 9, color: 'var(--t3)' }}>{new Date(e.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div style={{ ...cardStyle, textAlign: 'center', padding: 30 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📓</div>
          <div style={{ fontSize: 13, color: 'var(--t2)', marginBottom: 4 }}>Chưa có journal nào</div>
          <div style={{ fontSize: 11, color: 'var(--t3)' }}>Hãy vào Pipeline SOP → click vào một video ở Bước B1 để bắt đầu điền Why Journal.</div>
        </div>
      )}
    </div>
  );
}
