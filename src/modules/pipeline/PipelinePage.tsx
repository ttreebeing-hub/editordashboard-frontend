import { useState, useEffect, useCallback } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

interface Video {
  title: string; urgency: 'urgent' | 'warning' | 'normal'; urgencyText: string;
  channel: string; duration: string; style: string; assets: string; deadline: string; assignedBy: string;
}
const VIDEOS: Record<string, Video> = {
  vid4: { title: 'Tutorial Premiere Pro 2025',  urgency: 'normal',  urgencyText: '🟢 5 ngày còn', channel: 'NhiLe Learn',    duration: '20 phút', style: 'Tutorial kỹ thuật',    assets: 'Screen recording + voiceover script',         deadline: '15/04/2026 18:00', assignedBy: 'Chị Nhi'  },
  vid3: { title: 'Vlog Trip Đà Nẵng 2025',    urgency: 'normal',  urgencyText: '🟢 2 ngày còn', channel: 'NhiLe Lifestyle', duration: '12 phút', style: 'Vlog du lịch',          assets: 'Footage từ Đà Nẵng + drone shot',            deadline: '12/04/2026 18:00', assignedBy: 'Chị Nhi'  },
  vid2: { title: 'Review iPhone 16 Pro Max',   urgency: 'warning', urgencyText: '⏰ 8h còn lại', channel: 'NhiLe',          duration: '18 phút', style: 'Review sản phẩm',       assets: 'Footage sản phẩm + B-roll + nhạc nền',       deadline: '11/04/2026 12:00', assignedBy: 'Chị Nhi'  },
  vid1: { title: 'Podcast NhiLe Talk Ep.22',  urgency: 'urgent',  urgencyText: '⚡ 3h còn lại', channel: 'NhiLe',          duration: '45 phút', style: 'Podcast conversation',  assets: 'Footage + âm thanh + thumbnail draft',        deadline: '10/04/2026 23:59', assignedBy: 'Anh Minh' },
};

const COLS = [
  { step: 1, label: 'B1 · Nhận task',      icon: '📋', color: 'var(--blue)'   },
  { step: 2, label: 'B2 · Tải tài nguyên', icon: '📦', color: 'var(--purple)' },
  { step: 3, label: 'B3 · Cut thô',        icon: '✂️', color: 'var(--amber)'  },
  { step: 4, label: 'B4 · Hậu kỳ',         icon: '🎨', color: 'var(--teal)'   },
  { step: 5, label: 'B5 · Xuất video',     icon: '📤', color: 'var(--accent)' },
  { step: 6, label: 'B6 · Upload',         icon: '☁️', color: 'var(--green)'  },
];

const STEP_NAMES: Record<number, string> = { 1:'Nhận task', 2:'Tải tài nguyên', 3:'Cut thô', 4:'Hậu kỳ', 5:'Xuất video', 6:'Upload' };
const STEP_ICONS: Record<number, string>  = { 1:'📋', 2:'📦', 3:'✂️', 4:'🎨', 5:'📤', 6:'☁️' };
const CHECKLIST: Record<number, string[]> = {
  2: ['Tải toàn bộ footage từ folder được chỉ định','Tải file nhạc nền (nếu có trong brief)','Tải template/preset màu (nếu có)','Tải B-roll và asset bổ sung','Kiểm tra đủ tất cả asset trước khi bắt đầu'],
  3: ['Xem toàn bộ footage một lần trước khi cắt','Tạo timeline theo cấu trúc trong brief','Sync âm thanh với hình ảnh','Cắt thô theo flow content — chưa quan tâm màu/nhạc'],
  4: ['Color grading theo tone nhất quán với channel','Mix âm thanh — cân bằng giọng nói và nhạc nền','Thêm motion graphics, lower-third, text','Kiểm tra transitions giữa các cảnh','Review toàn bộ một lần trước khi xuất'],
  5: ['Export đúng resolution (1080p hoặc 4K theo brief)','Kiểm tra codec và bitrate theo yêu cầu','Đặt tên file đúng convention: [Date]_[Title]_v1','Xem lại file xuất: không có glitch, audio OK'],
  6: ['Upload lên đúng folder Google Drive','Paste link vào ô bên dưới','Đảm bảo link có quyền "Anyone with the link can view"','Thông báo QC/Leader đã upload'],
};

// ─── State ───────────────────────────────────────────────────────────────────

interface JournalAns { q1: string; q2: string; q3: string; }
interface PState {
  steps:       Record<string, number>;
  journal:     Record<string, JournalAns>;
  journalDone: Record<string, boolean>;
  checks:      Record<string, Record<string, number[]>>;
  drive:       Record<string, string>;
}
const INIT: PState = {
  steps:       { vid4: 1, vid3: 3, vid2: 4, vid1: 5 },
  journal: {
    vid4: { q1:'', q2:'', q3:'' },
    vid3: { q1:'Kể lại trải nghiệm chuyến đi Đà Nẵng thực tế và cảm xúc của chị Nhi — không phải quảng cáo du lịch', q2:'Khán giả 20–35 tuổi thích du lịch tự túc, muốn tìm cảm hứng và tips thực tế từ người đã đi', q3:'Cảm giác được "sống chậm" tại Đà Nẵng — khoảnh khắc thật, không cần hoàn hảo' },
    vid2: { q1:'Showcase iPhone 16 Pro Max features cho người dùng đang cân nhắc upgrade', q2:'Tech user 25-40, đang dùng iPhone 13 hoặc 14', q3:'Camera ProRes và Action Button — hai tính năng killer nhất' },
    vid1: { q1:'', q2:'', q3:'' },
  },
  journalDone: { vid4: false, vid3: true, vid2: true, vid1: false },
  checks: {
    vid4: {},
    vid3: { b2:[0,1,2,3,4], b3:[] },
    vid2: { b2:[0,1,2], b3:[0,1,2,3], b4:[0,1] },
    vid1: { b5: [] },
  },
  drive: { vid4:'', vid3:'', vid2:'', vid1:'' },
};
const LS_KEY    = 'nl2_pipeline_v2';
const STATE_VER = 3; // bump this to force-reseed demo data on next load

function loadState(): PState {
  try {
    const s = localStorage.getItem(LS_KEY);
    if (!s) return INIT;
    const parsed = JSON.parse(s) as PState & { _ver?: number };
    // Version mismatch → wipe and return fresh INIT
    if ((parsed._ver ?? 0) < STATE_VER) {
      localStorage.removeItem(LS_KEY);
      return INIT;
    }
    return parsed;
  } catch { return INIT; }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const U_COLOR  = { urgent: 'var(--red)', warning: 'var(--amber)', normal: 'var(--teal)' };
const U_BG     = { urgent: 'var(--red2)', warning: 'var(--amber2)', normal: 'var(--teal2)' };

function getChecks(state: PState, vid: string, step: number): number[] { return state.checks[vid]?.['b'+step] ?? []; }
function getCheckPct(state: PState, vid: string, step: number) {
  const items = CHECKLIST[step] ?? []; const ch = getChecks(state, vid, step);
  return items.length ? Math.round(ch.length / items.length * 100) : 0;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

interface Toast { id: number; msg: string; type: 'success' | 'info' | 'warn'; }
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((msg: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, add };
}

// ─── Step Navigator ──────────────────────────────────────────────────────────

function StepNav({ currentStep, viewStep, onSelect }: { currentStep: number; viewStep: number; onSelect: (s: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 2, marginBottom: 16 }}>
      {COLS.map((col, idx) => {
        const isPast    = col.step < currentStep;
        const isCurrent = col.step === currentStep;
        const isFuture  = col.step > currentStep;
        const isViewing = col.step === viewStep;
        const canClick  = !isFuture;

        return (
          <div key={col.step} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => canClick && onSelect(col.step)}
              disabled={isFuture}
              title={`${col.icon} B${col.step}: ${STEP_NAMES[col.step]}`}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'transparent', border: 'none', cursor: canClick ? 'pointer' : 'default',
                padding: '4px 6px', borderRadius: 8,
                opacity: isFuture ? 0.35 : 1,
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, transition: 'all 0.2s',
                border: isViewing
                  ? `2px solid ${isCurrent ? 'var(--accent)' : 'var(--green)'}`
                  : isPast ? '2px solid var(--green)' : isCurrent ? '2px solid var(--accent)' : '2px solid var(--b2)',
                background: isViewing
                  ? (isCurrent ? 'var(--accent)' : 'var(--green2)')
                  : isPast ? 'var(--green2)' : isCurrent ? 'var(--accent2)' : 'var(--bg3)',
                color: isViewing
                  ? (isCurrent ? '#fff' : 'var(--green)')
                  : isPast ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'var(--t3)',
                boxShadow: isViewing ? '0 0 0 3px rgba(14,165,233,0.2)' : 'none',
              }}>
                {isPast && !isViewing ? '✓' : `B${col.step}`}
              </div>
              <div style={{ fontSize: 8, color: isViewing ? 'var(--t1)' : isPast ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'var(--t3)', whiteSpace: 'nowrap', maxWidth: 52, textAlign: 'center', lineHeight: 1.2 }}>
                {STEP_NAMES[col.step]}
              </div>
            </button>
            {idx < COLS.length - 1 && (
              <div style={{ width: 20, height: 2, background: col.step < currentStep ? 'var(--green)' : 'var(--b2)', flexShrink: 0, marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Modal content ───────────────────────────────────────────────────────────

interface ModalProps { vid: string; state: PState; setState: (s: PState) => void; onClose: () => void; showToast: (msg: string, type?: Toast['type']) => void; }

// Read-only journal view (for reviewing past B1)
function JournalReadOnly({ vid, state }: { vid: string; state: PState }) {
  const j = state.journal[vid] ?? { q1:'', q2:'', q3:'' };
  const done = state.journalDone[vid];
  return (
    <div>
      {done ? (
        <>
          <div style={{ background: 'var(--green2)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--r)', padding: '7px 12px', marginBottom: 14, fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
            ✓ Why Journal đã hoàn thành
          </div>
          {[['1. Video này phục vụ mục đích gì?', j.q1], ['2. Khán giả mục tiêu là ai?', j.q2], ['3. Điều quan trọng nhất cần truyền đạt?', j.q3]].map(([q, a]) => (
            <div key={q} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t3)', marginBottom: 4 }}>{q}</div>
              <div style={{ fontSize: 12, color: 'var(--t2)', background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 'var(--r)', padding: '9px 12px', lineHeight: 1.5 }}>{a || '—'}</div>
            </div>
          ))}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 20, color: 'var(--t3)', fontSize: 12 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📝</div>
          Why Journal chưa được điền.
        </div>
      )}
    </div>
  );
}

// Read-only checklist (for reviewing past steps)
function ChecklistReadOnly({ vid, step, state }: { vid: string; step: number; state: PState }) {
  const items = CHECKLIST[step] ?? [];
  const checked = getChecks(state, vid, step);
  const pct = items.length ? Math.round(checked.length / items.length * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 99, background: checked.length >= items.length ? 'var(--green)' : 'var(--accent)', width: `${pct}%` }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--t3)' }}>{checked.length}/{items.length} mục</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 12px', borderRadius: 'var(--r)', background: 'var(--bg3)', border: '1px solid var(--b1)', opacity: 0.8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, border: checked.includes(i) ? '2px solid var(--green)' : '2px solid var(--b2)', background: checked.includes(i) ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              {checked.includes(i) && <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ fontSize: 12, color: checked.includes(i) ? 'var(--t3)' : 'var(--t2)', textDecoration: checked.includes(i) ? 'line-through' : 'none', lineHeight: 1.4 }}>{item}</div>
          </div>
        ))}
      </div>
      {checked.length >= items.length && (
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--green)', textAlign: 'center' }}>✓ Bước này đã hoàn thành</div>
      )}
    </div>
  );
}

// Active B1 — Why Journal form
function ModalStep1({ vid, state, setState, onClose, showToast }: ModalProps) {
  const v = VIDEOS[vid];
  const j = state.journal[vid] ?? { q1:'', q2:'', q3:'' };
  const done = state.journalDone[vid];
  const [q1, setQ1] = useState(j.q1);
  const [q2, setQ2] = useState(j.q2);
  const [q3, setQ3] = useState(j.q3);
  const [showExample, setShowExample] = useState(false);
  const filled = [q1, q2, q3].filter(x => x.trim().length > 10).length;
  const allFilled = filled === 3;

  // Use vid3 (Vlog Đà Nẵng) as reference example — it has a completed journal
  const exampleVid = 'vid3';
  const exVidTitle = VIDEOS[exampleVid]?.title ?? '';
  const exJ = state.journal[exampleVid] ?? { q1:'', q2:'', q3:'' };
  const exDone = state.journalDone[exampleVid];

  const handleSubmit = () => {
    if (!allFilled && !done) return;
    const next: PState = { ...state, journal: { ...state.journal, [vid]: { q1, q2, q3 } }, journalDone: { ...state.journalDone, [vid]: true }, steps: { ...state.steps, [vid]: Math.max(state.steps[vid], 2) } };
    setState(next);
    showToast('✓ Why Journal đã lưu! Sang B2 →', 'success');
    onClose();
  };

  const ta: React.CSSProperties = { width:'100%', minHeight:68, background:'var(--bg3)', border:'1px solid var(--b1)', borderRadius:'var(--r)', color:'var(--t1)', fontSize:12, fontFamily:'DM Sans,sans-serif', padding:'10px', resize:'vertical' as const, outline:'none', lineHeight:1.5 };

  return (
    <>
      <div style={{ background:'var(--bg3)', border:'1px solid var(--b1)', borderRadius:'var(--r)', padding:12, marginBottom:12 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--t3)', textTransform:'uppercase', marginBottom:8 }}>📄 Brief từ người order</div>
        {[['Channel',v.channel],['Thời lượng',`~${v.duration}`],['Phong cách',v.style],['Tài nguyên',v.assets],['Deadline',v.deadline],['Order bởi',v.assignedBy]].map(([k,val]) => (
          <div key={k} style={{ display:'flex', gap:8, marginBottom:5, fontSize:12 }}>
            <span style={{ fontWeight:600, color:'var(--t1)', minWidth:80 }}>{k}:</span>
            <span style={{ color: k==='Deadline' ? 'var(--red)':'var(--t2)', fontWeight: k==='Deadline' ? 700:400 }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--amber2)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'var(--r)', padding:'9px 12px', marginBottom:12 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'var(--amber)', marginBottom:2 }}>📝 Why Journal — bắt buộc trước khi sang B2</div>
        <div style={{ fontSize:10, color:'var(--t3)' }}>Điền đủ 3 câu để unlock bước tiếp theo</div>
      </div>

      {/* Example answer hint */}
      {exDone && vid !== exampleVid && (
        <div style={{ marginBottom:14 }}>
          <button
            onClick={() => setShowExample(prev => !prev)}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:'var(--r)', background:'var(--green2)', border:'1px solid rgba(34,197,94,0.2)', cursor:'pointer', textAlign:'left' }}
          >
            <span style={{ fontSize:12 }}>💡</span>
            <span style={{ fontSize:10, fontWeight:700, color:'var(--green)', flex:1 }}>Xem ví dụ mẫu — {exVidTitle}</span>
            <span style={{ fontSize:10, color:'var(--green)' }}>{showExample ? '▲ Ẩn' : '▼ Xem'}</span>
          </button>
          {showExample && (
            <div style={{ background:'var(--bg3)', border:'1px solid rgba(34,197,94,0.15)', borderRadius:'0 0 var(--r) var(--r)', padding:'10px 12px', borderTop:'none' }}>
              {([['1. Mục đích?', exJ.q1], ['2. Khán giả?', exJ.q2], ['3. Key message?', exJ.q3]] as [string, string][]).map(([q, a]) => (
                <div key={q} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:9, fontWeight:700, color:'var(--t3)', marginBottom:2 }}>{q}</div>
                  <div style={{ fontSize:11, color:'var(--t2)', lineHeight:1.5, fontStyle:'italic' }}>"{a}"</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {([['1. Video này phục vụ mục đích gì?', q1, setQ1, 'VD: Giúp người xem học được kỹ năng X / Kể chuyện trải nghiệm Y của chị Nhi / Showcase sản phẩm Z...'],
         ['2. Khán giả mục tiêu là ai?',         q2, setQ2, 'VD: Bạn trẻ 18–25 đang học edit / Người dùng iPhone muốn upgrade / Khán giả thích du lịch tự túc...'],
         ['3. Điều quan trọng nhất cần truyền đạt?', q3, setQ3, 'VD: Key message / cảm xúc muốn để lại / tính năng cần nhấn mạnh / điểm khác biệt...']] as const).map(([label, val, setter, ph]) => (
        <div key={label}>
          <div style={{ fontSize:12, fontWeight:600, color:'var(--t1)', margin:'14px 0 6px' }}>{label}</div>
          <textarea style={ta} placeholder={ph} value={val} onChange={e => setter(e.target.value)} />
        </div>
      ))}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}>
        <div style={{ fontSize:10, color:'var(--t3)', flex:1 }}>{done ? '✓ Đã hoàn thành' : `${filled}/3 câu đã điền`}</div>
        <button onClick={handleSubmit} disabled={!allFilled && !done}
          style={{ padding:'7px 14px', borderRadius:6, background: allFilled||done ? 'var(--teal)':'var(--bg4)', border:'none', color:'#fff', fontSize:12, fontWeight:600, cursor: allFilled||done ? 'pointer':'not-allowed', opacity: allFilled||done ? 1:0.4 }}>
          {done ? '✓ Sang B2 →' : 'Điền đủ để tiếp tục'}
        </button>
      </div>
    </>
  );
}

// Active checklist (B2–B5)
function ModalChecklist({ vid, step, state, setState, onClose, showToast }: ModalProps & { step: number }) {
  const items = CHECKLIST[step] ?? [];
  const checked = getChecks(state, vid, step);
  const allDone = checked.length >= items.length;
  const pct = items.length ? Math.round(checked.length / items.length * 100) : 0;

  const toggle = (i: number) => {
    const cur = getChecks(state, vid, step);
    const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i];
    setState({ ...state, checks: { ...state.checks, [vid]: { ...state.checks[vid], ['b'+step]: next } } });
  };
  const handleNext = () => {
    setState({ ...state, steps: { ...state.steps, [vid]: Math.max(state.steps[vid], step+1) } });
    showToast(`✓ B${step} hoàn thành! Sang B${step+1}`, 'success');
    onClose();
  };

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <div style={{ flex:1, background:'var(--bg3)', borderRadius:99, height:5, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,var(--accent),var(--teal))', width:`${pct}%`, transition:'width 0.4s' }} />
        </div>
        <span style={{ fontSize:10, color:'var(--t3)' }}>{checked.length}/{items.length} mục</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:'var(--r)', background:'var(--bg3)', border:'1px solid var(--b1)', cursor:'pointer', opacity: checked.includes(i) ? 0.6:1 }}>
            <div style={{ width:18, height:18, borderRadius:5, border: checked.includes(i) ? '2px solid var(--green)':'2px solid var(--b2)', background: checked.includes(i) ? 'var(--green)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
              {checked.includes(i) && <span style={{ fontSize:10, color:'#fff', fontWeight:700 }}>✓</span>}
            </div>
            <div style={{ fontSize:12, color: checked.includes(i) ? 'var(--t3)':'var(--t2)', textDecoration: checked.includes(i) ? 'line-through':'none', lineHeight:1.4 }}>{item}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
        <button onClick={handleNext} disabled={!allDone}
          style={{ padding:'7px 14px', borderRadius:6, background: allDone ? 'var(--teal)':'var(--bg4)', border:'none', color:'#fff', fontSize:12, fontWeight:600, cursor: allDone ? 'pointer':'not-allowed', opacity: allDone ? 1:0.4 }}>
          ✓ Hoàn thành B{step} → Sang B{step+1}
        </button>
      </div>
    </>
  );
}

// Active B6 — Upload
function ModalStep6({ vid, state, setState, onClose, showToast }: ModalProps) {
  const items = CHECKLIST[6];
  const checked = getChecks(state, vid, 6);
  const [link, setLink] = useState(state.drive[vid] ?? '');
  const allDone = checked.length >= items.length && link.includes('drive');
  const pct = items.length ? Math.round(checked.length / items.length * 100) : 0;

  const toggle = (i: number) => {
    const cur = getChecks(state, vid, 6);
    const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i];
    setState({ ...state, checks: { ...state.checks, [vid]: { ...state.checks[vid], b6: next } } });
  };
  const handleLink = (v: string) => { setLink(v); setState({ ...state, drive: { ...state.drive, [vid]: v } }); };
  const handleSubmit = () => { showToast('🚀 Đã submit cho QC!', 'success'); onClose(); };

  const inp: React.CSSProperties = { width:'100%', background:'var(--bg3)', border:'1px solid var(--b1)', borderRadius:'var(--r)', color:'var(--t1)', fontSize:12, padding:'9px 12px', outline:'none', marginBottom:10 };

  return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <div style={{ flex:1, background:'var(--bg3)', borderRadius:99, height:5, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,var(--accent),var(--teal))', width:`${pct}%`, transition:'width 0.4s' }} />
        </div>
        <span style={{ fontSize:10, color:'var(--t3)' }}>{checked.length}/{items.length}</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', borderRadius:'var(--r)', background:'var(--bg3)', border:'1px solid var(--b1)', cursor:'pointer', opacity: checked.includes(i) ? 0.6:1 }}>
            <div style={{ width:18, height:18, borderRadius:5, border: checked.includes(i) ? '2px solid var(--green)':'2px solid var(--b2)', background: checked.includes(i) ? 'var(--green)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
              {checked.includes(i) && <span style={{ fontSize:10, color:'#fff', fontWeight:700 }}>✓</span>}
            </div>
            <div style={{ fontSize:12, color: checked.includes(i) ? 'var(--t3)':'var(--t2)', textDecoration: checked.includes(i) ? 'line-through':'none', lineHeight:1.4 }}>{item}</div>
          </div>
        ))}
      </div>
      <div style={{ height:1, background:'var(--b1)', margin:'12px 0' }} />
      <div style={{ fontSize:10, fontWeight:700, color:'var(--t3)', marginBottom:6 }}>🔗 Link Google Drive</div>
      <input style={inp} type="url" placeholder="https://drive.google.com/file/d/..." value={link} onChange={e => handleLink(e.target.value)} />
      <div style={{ background:'var(--bg3)', borderRadius:'var(--r)', padding:'8px 10px', marginBottom:10, fontSize:10, color:'var(--t3)', lineHeight:1.5 }}>
        Tên file: <span style={{ color:'var(--accent)', fontFamily:'monospace' }}>YYYYMMDD_TenVideo_v1.mp4</span><br/>
        Share: "Anyone with link can view"
      </div>
      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button onClick={handleSubmit} disabled={!allDone}
          style={{ padding:'7px 14px', borderRadius:6, background: allDone ? 'var(--blue)':'var(--bg4)', border:'none', color:'#fff', fontSize:12, fontWeight:600, cursor: allDone ? 'pointer':'not-allowed', opacity: allDone ? 1:0.4 }}>
          🚀 Submit cho QC
        </button>
      </div>
    </>
  );
}

// ─── Card Modal ──────────────────────────────────────────────────────────────

function CardModal({ vid, state, setState, onClose, showToast }: {
  vid: string; state: PState; setState: (s: PState) => void;
  onClose: () => void; showToast: (msg: string, type?: Toast['type']) => void;
}) {
  const v = VIDEOS[vid];
  const currentStep = state.steps[vid];
  const [viewStep, setViewStep] = useState(currentStep);
  const urgColor = U_COLOR[v.urgency];
  const isReviewing = viewStep < currentStep;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'var(--bg2)', border:'1px solid var(--b2)', borderRadius:14, padding:24, width:540, maxWidth:'90vw', maxHeight:'88vh', overflowY:'auto', animation:'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:2 }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:16, color:'var(--t1)' }}>{v.title}</div>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:5 }}>
              <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:99, color:urgColor, background:U_BG[v.urgency] }}>{v.urgencyText}</span>
              <span style={{ fontSize:9, color:'var(--t3)' }}>📅 {v.deadline.split(' ')[0]}</span>
              <span style={{ fontSize:8, padding:'2px 6px', borderRadius:3, background:'var(--accent2)', color:'var(--accent)', fontWeight:700 }}>{v.channel}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'var(--bg3)', border:'1px solid var(--b1)', borderRadius:6, padding:'5px 9px', color:'var(--t3)', cursor:'pointer', fontSize:13 }}>✕</button>
        </div>

        <div style={{ height:1, background:'var(--b1)', margin:'12px 0' }} />

        {/* Step navigator */}
        <StepNav currentStep={currentStep} viewStep={viewStep} onSelect={setViewStep} />

        {/* Viewing label */}
        {isReviewing && (
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:'var(--r)', padding:'7px 12px', marginBottom:14, fontSize:11 }}>
            <span style={{ fontSize:14 }}>👁</span>
            <span style={{ color:'var(--green)', fontWeight:600 }}>Đang xem lại B{viewStep}: {STEP_NAMES[viewStep]}</span>
            <button onClick={() => setViewStep(currentStep)} style={{ marginLeft:'auto', background:'transparent', border:'none', color:'var(--accent)', fontSize:11, cursor:'pointer', fontWeight:600 }}>
              → Về B{currentStep} hiện tại
            </button>
          </div>
        )}

        {/* Active step label */}
        {!isReviewing && (
          <div style={{ fontSize:10, fontWeight:700, color:'var(--accent)', background:'var(--accent2)', padding:'3px 10px', borderRadius:4, display:'inline-block', marginBottom:14 }}>
            {STEP_ICONS[currentStep]} B{currentStep}: {STEP_NAMES[currentStep]}
          </div>
        )}

        {/* Body — read-only for past steps */}
        {isReviewing && viewStep === 1 && (
          <JournalReadOnly vid={vid} state={state} />
        )}
        {isReviewing && viewStep >= 2 && (
          <ChecklistReadOnly vid={vid} step={viewStep} state={state} />
        )}

        {/* Body — interactive for current step */}
        {!isReviewing && viewStep === 1 && (
          <ModalStep1 vid={vid} state={state} setState={setState} onClose={onClose} showToast={showToast} />
        )}
        {!isReviewing && viewStep >= 2 && viewStep <= 5 && (
          <ModalChecklist vid={vid} step={viewStep} state={state} setState={setState} onClose={onClose} showToast={showToast} />
        )}
        {!isReviewing && viewStep === 6 && (
          <ModalStep6 vid={vid} state={state} setState={setState} onClose={onClose} showToast={showToast} />
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function PipelinePage() {
  const [pState, setPState] = useState<PState>(loadState);
  const [openVid, setOpenVid] = useState<string | null>(null);
  const { toasts, add: addToast } = useToasts();

  const setState = (s: PState) => { setPState(s); localStorage.setItem(LS_KEY, JSON.stringify({ ...s, _ver: STATE_VER })); };
  const vidList = Object.keys(VIDEOS);

  useEffect(() => { localStorage.setItem(LS_KEY, JSON.stringify({ ...pState, _ver: STATE_VER })); }, [pState]);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', margin:-18 }}>
      {/* Board header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 18px 8px', flexShrink:0, borderBottom:'1px solid var(--b1)' }}>
        <span style={{ fontSize:11, color:'var(--t3)' }}>Video của bạn:</span>
        <span style={{ fontSize:11, fontWeight:700, color:'var(--t1)' }}>{vidList.length} đang làm</span>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:10, color:'var(--t3)' }}>Chỉ hiện video của bạn</span>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)', display:'inline-block' }} />
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ display:'flex', gap:10, padding:'12px 16px', flex:1, overflowX:'auto', overflowY:'hidden', alignItems:'flex-start' }}>
        {COLS.map(col => {
          const vids = vidList.filter(vid => pState.steps[vid] === col.step);
          return (
            <div key={col.step} style={{ width:195, minWidth:195, flexShrink:0, display:'flex', flexDirection:'column', maxHeight:'100%' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 10px', background:'var(--bg3)', borderRadius:'8px 8px 0 0', border:'1px solid var(--b1)', borderBottom:'none' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:col.color, flexShrink:0, display:'block' }} />
                <span style={{ fontSize:10, fontWeight:700, color:'var(--t1)', flex:1, whiteSpace:'nowrap' }}>{col.icon} {col.label}</span>
                <span style={{ fontSize:9, fontWeight:700, color:col.color, background:'rgba(255,255,255,0.06)', borderRadius:99, padding:'1px 6px' }}>{vids.length}</span>
              </div>
              <div style={{ flex:1, overflowY:'auto', background:'var(--bg3)', border:'1px solid var(--b1)', borderTop:`2px solid ${col.color}`, borderRadius:'0 0 8px 8px', padding:8, display:'flex', flexDirection:'column', gap:6, minHeight:100 }}>
                {vids.length === 0
                  ? <div style={{ textAlign:'center', padding:'16px 6px', fontSize:10, color:'var(--t3)' }}>—</div>
                  : vids.map(vid => {
                    const v = VIDEOS[vid];
                    const step = pState.steps[vid];
                    const urgColor = U_COLOR[v.urgency];
                    const pct = getCheckPct(pState, vid, step);
                    const jDone = pState.journalDone[vid];
                    return (
                      <div key={vid} onClick={() => setOpenVid(vid)}
                        style={{ background:'var(--bg2)', border:'1px solid var(--b1)', borderLeft:`3px solid ${urgColor}`, borderRadius:8, padding:10, cursor:'pointer', transition:'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}
                      >
                        <div style={{ fontSize:11, fontWeight:600, color:'var(--t1)', marginBottom:5, lineHeight:1.35 }}>{v.title}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:5, flexWrap:'wrap' as const }}>
                          <span style={{ fontSize:8, padding:'1px 5px', borderRadius:3, background:'var(--accent2)', color:'var(--accent)', fontWeight:700 }}>{v.channel}</span>
                          <span style={{ fontSize:8, fontWeight:700, color:urgColor }}>{v.urgencyText}</span>
                        </div>
                        {step === 1 && (
                          <div style={{ fontSize:9, color: jDone ? 'var(--green)':'var(--amber)', marginBottom:4 }}>
                            {jDone ? '✓ Journal OK' : '⚠ Why Journal chưa điền'}
                          </div>
                        )}
                        {step >= 2 && pct > 0 && (
                          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
                            <div style={{ flex:1, height:3, background:'var(--bg4)', borderRadius:99, overflow:'hidden' }}>
                              <div style={{ width:`${pct}%`, height:'100%', background:urgColor, borderRadius:99 }} />
                            </div>
                            <span style={{ fontSize:8, color:'var(--t3)' }}>{pct}%</span>
                          </div>
                        )}
                        <div style={{ fontSize:9, color:'var(--t3)' }}>👤 {v.assignedBy} · 📅 {v.deadline.split(' ')[0]}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {openVid && (
        <CardModal vid={openVid} state={pState} setState={setState} onClose={() => setOpenVid(null)} showToast={addToast} />
      )}

      <div style={{ position:'fixed', bottom:20, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
        {toasts.map(t => (
          <div key={t.id} style={{ background:'var(--bg2)', border:'1px solid var(--b1)', borderLeft:`3px solid ${t.type==='success'?'var(--green)':t.type==='warn'?'var(--amber)':'var(--accent)'}`, borderRadius:'var(--r)', padding:'10px 14px', fontSize:12, color:'var(--t1)', boxShadow:'0 4px 20px rgba(0,0,0,0.4)', animation:'slideInFromRight4 0.3s ease' }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
