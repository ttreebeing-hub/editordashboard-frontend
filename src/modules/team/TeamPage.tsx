// Editor Team — org chart + member status

interface Member { initials: string; name: string; role: string; status: 'online' | 'busy' | 'offline'; statusLabel: string; avatarBg: string; days?: number; isMe?: boolean; }

const MEMBERS: Member[] = [
  { initials: 'NL', name: 'Nguyễn Thị Nhi',  role: 'Leader',           status: 'online',  statusLabel: 'Online',        avatarBg: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)' },
  { initials: 'TM', name: 'Trần Văn Minh',   role: 'Co-Leader · QC',   status: 'busy',    statusLabel: 'Đang review',   avatarBg: 'linear-gradient(135deg,#4c1d95,#a855f7)' },
  { initials: 'LA', name: 'Lê Thị An',        role: 'Ops',              status: 'online',  statusLabel: 'Online',        avatarBg: 'linear-gradient(135deg,#065f46,#14b8a6)' },
  { initials: 'PD', name: 'Phạm Thị D',      role: 'Editor',           status: 'online',  statusLabel: 'Online',        avatarBg: 'linear-gradient(135deg,#7c2d12,#f59e0b)', days: 23, isMe: true },
  { initials: 'NK', name: 'Nguyễn Khoa',     role: 'Editor',           status: 'busy',    statusLabel: 'Đang edit',     avatarBg: 'linear-gradient(135deg,#1e40af,#3b82f6)', days: 45 },
  { initials: 'TH', name: 'Trần Hoà',         role: 'Editor',           status: 'offline', statusLabel: 'Offline',       avatarBg: 'linear-gradient(135deg,#831843,#ec4899)', days: 67 },
];

const STATUS_COLOR = { online: 'var(--green)', busy: 'var(--amber)', offline: 'var(--t3)' };

interface OrgCardProps { m: Member; size?: 'lg' | 'sm'; accent?: string; }
function OrgCard({ m, size = 'sm', accent }: OrgCardProps) {
  const dim = size === 'lg' ? 40 : 36;
  return (
    <div style={{
      background: accent ? `${accent}22` : 'var(--bg2)',
      border: `1px solid ${accent ?? 'var(--b1)'}`,
      borderRadius: 'var(--r2)', padding: '12px 14px', minWidth: size === 'lg' ? 140 : 110, textAlign: 'center',
    }}>
      <div style={{ width: dim, height: dim, borderRadius: '50%', background: m.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size === 'lg' ? 15 : 13, color: '#fff', margin: '0 auto 7px' }}>
        {m.initials}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)' }}>{m.name}</div>
      <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 2 }}>{m.role}</div>
    </div>
  );
}

export function TeamPage() {
  const editors = MEMBERS.filter(m => m.role === 'Editor');
  const leader = MEMBERS.find(m => m.role === 'Leader')!;
  const coleader = MEMBERS.find(m => m.role === 'Co-Leader · QC')!;
  const ops = MEMBERS.find(m => m.role === 'Ops')!;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Org chart */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Sơ đồ tổ chức</span>
        </div>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--b1)', borderRadius: 'var(--r2)', padding: 20 }}>
          {/* Leader */}
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <OrgCard m={leader} size="lg" accent="#0ea5e9" />
          </div>
          {/* Connector */}
          <div style={{ width: 2, height: 16, background: 'var(--b2)', margin: '0 auto' }} />
          {/* Co-leaders */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
            <OrgCard m={coleader} accent="#a855f7" />
            <OrgCard m={ops} accent="#14b8a6" />
          </div>
          {/* Connector */}
          <div style={{ width: 2, height: 16, background: 'var(--b2)', margin: '0 auto' }} />
          {/* Editors */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {editors.map(m => <OrgCard key={m.initials} m={m} />)}
          </div>
        </div>
      </div>

      {/* Member status */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)' }}>Trạng thái thành viên</span>
        </div>
        <div>
          {MEMBERS.map(m => (
            <div key={m.initials} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 'var(--r)',
              background: 'var(--bg2)',
              border: m.isMe ? '1px solid var(--accent)' : '1px solid var(--b1)',
              marginBottom: 6,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff', flexShrink: 0 }}>
                {m.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>
                  {m.name}{m.isMe && <span style={{ fontSize: 9, color: 'var(--accent)', marginLeft: 5 }}>(Bạn)</span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--t3)' }}>
                  {m.role}{m.days != null ? ` · Ngày ${m.days}` : ''}
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: STATUS_COLOR[m.status] }}>
                ● {m.statusLabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
