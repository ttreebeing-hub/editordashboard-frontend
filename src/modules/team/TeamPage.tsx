import { useTaskStore } from '../../shared/stores/taskStore';
import { MOCK_TEAM } from '../../mocks/data';

const STATUS_COLOR: Record<string, string> = {
  online: '#2E7D32',
  busy: '#F57F17',
  offline: '#555',
};

const STATUS_LABEL: Record<string, string> = {
  online: 'Online',
  busy: 'Busy',
  offline: 'Offline',
};

const ORG_TREE = [
  { id: 'm1', children: [
    { id: 'm2', children: [
      { id: 'm3', children: [] },
      { id: 'm4', children: [] },
      { id: 'm5', children: [] },
    ] }
  ] }
];

function OrgNode({ id, members, tasks }: { id: string; members: typeof MOCK_TEAM; tasks: ReturnType<typeof useTaskStore>['tasks'] }) {
  const m = members.find(x => x.id === id);
  if (!m) return null;
  const activeTasks = tasks.filter(t => t.ed === m.n && t.step !== 'Done' && t.step !== 'Reject').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Syne, sans-serif',
        border: `2px solid ${STATUS_COLOR[m.st]}`,
        position: 'relative',
      }}>
        {m.av}
        <span style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 12, height: 12, borderRadius: '50%',
          background: STATUS_COLOR[m.st], border: '2px solid var(--bg3)',
        }} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--t1)', marginTop: 4, textAlign: 'center' }}>{m.n.split(' ').slice(-1)[0]}</div>
      <div style={{ fontSize: 9, color: 'var(--t3)', textAlign: 'center' }}>{m.role}</div>
      {activeTasks > 0 && <div style={{ fontSize: 9, color: 'var(--gold)', marginTop: 2 }}>{activeTasks} tasks</div>}
    </div>
  );
}

export function TeamPage() {
  const { tasks } = useTaskStore();
  const members = MOCK_TEAM;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
      {/* Left: Org chart + workload */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Org chart */}
        <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '16px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>Sơ đồ tổ chức</div>
          {/* Simple visual tree */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Leader */}
            <OrgNode id="m1" members={members} tasks={tasks} />
            <div style={{ width: 1, height: 12, background: 'var(--b2)' }} />
            {/* Co-leader */}
            <OrgNode id="m2" members={members} tasks={tasks} />
            <div style={{ width: 1, height: 12, background: 'var(--b2)' }} />
            {/* Horizontal line */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 1, background: 'var(--b2)' }} />
              {['m3','m4','m5'].map((mid) => (
                <div key={mid} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 1, height: 12, background: 'var(--b2)' }} />
                  <OrgNode id={mid} members={members} tasks={tasks} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workload bars */}
        <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '16px' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>Workload</div>
          {members.filter(m => m.tr === 'short' || m.tr === 'long').map(m => {
            const active = tasks.filter(t => t.ed === m.n && t.step !== 'Done' && t.step !== 'Reject').length;
            const maxTasks = 5;
            const pct = Math.min((active / maxTasks) * 100, 100);
            return (
              <div key={m.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: 'var(--t1)' }}>{m.n.split(' ').slice(-1)[0]}</span>
                  <span style={{ fontSize: 10, color: pct > 80 ? 'var(--red)' : 'var(--t3)' }}>{active}/{maxTasks}</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: 'var(--s2)' }}>
                  <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--amber)' : m.c, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Editor roster */}
      <div style={{ background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--b1)', padding: '16px' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 14 }}>Editor Roster</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Editor', 'Role', 'Tasks đang chạy', 'Progress', 'Hours tự do', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t3)', padding: '0 8px 10px', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => {
              const activeTasks = tasks.filter(t => t.ed === m.n && t.step !== 'Done' && t.step !== 'Reject').length;
              const doneTasks = tasks.filter(t => t.ed === m.n && t.step === 'Done').length;
              const totalTasks = tasks.filter(t => t.ed === m.n).length;
              const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
              const usedHours = activeTasks * 8;
              const freeHours = Math.max(0, m.mh - usedHours);
              const roleColors: Record<string, string> = { leader: 'var(--blue)', coleader: 'var(--teal)', short: 'var(--gold)', long: '#7B2D8B' };
              return (
                <tr key={m.id} style={{ borderTop: '1px solid var(--b1)' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: m.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.av}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)' }}>{m.n}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${roleColors[m.tr] || 'var(--t3)'}22`, color: roleColors[m.tr] || 'var(--t3)', fontWeight: 600 }}>{m.role}</span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: activeTasks > 3 ? 'var(--red)' : 'var(--t1)' }}>{activeTasks}</span>
                  </td>
                  <td style={{ padding: '10px 8px', minWidth: 80 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--s2)' }}>
                        <div style={{ height: '100%', borderRadius: 2, width: `${progressPct}%`, background: m.c }} />
                      </div>
                      <span style={{ fontSize: 9, color: 'var(--t3)', minWidth: 28 }}>{progressPct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ fontSize: 12, color: freeHours < 16 ? 'var(--amber)' : 'var(--green)', fontWeight: 600 }}>{freeHours}h</span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[m.st] }} />
                      <span style={{ fontSize: 10, color: 'var(--t3)' }}>{STATUS_LABEL[m.st]}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
