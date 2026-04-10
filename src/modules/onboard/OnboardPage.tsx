import { useState } from 'react';
import { MindsetEditor } from './MindsetEditor';
import { WhyJournal } from './WhyJournal';
import { LearningLog } from './LearningLog';
import { GraduationCheck } from './GraduationCheck';

type Tab = 'mindset' | 'why' | 'learning' | 'graduation';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'mindset',    label: 'Mindset Editor',   icon: '🧠' },
  { key: 'why',        label: 'Why Journal',       icon: '📓' },
  { key: 'learning',   label: 'Learning Log',      icon: '📚' },
  { key: 'graduation', label: 'Graduation Check',  icon: '🎓' },
];

export function OnboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('mindset');

  // Learning badge — pending log
  const learningBadge = (() => {
    try {
      const logs: { submitted?: boolean }[] = JSON.parse(localStorage.getItem('nl2_learninglog') || '[]');
      return logs.filter(l => !l.submitted).length;
    } catch { return 1; }
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--t1)', marginBottom: 4 }}>
          🌱 Onboard & Phát triển
        </h1>
        <p style={{ fontSize: 12, color: 'var(--t3)' }}>
          Hệ thống phát triển tư duy 30 năm — không phụ thuộc vào cá nhân
        </p>
      </div>

      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                border: active ? '1px solid var(--accent)' : '1px solid var(--b1)',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--t3)',
                cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === 'learning' && learningBadge > 0 && (
                <span style={{ background: 'var(--amber)', color: '#fff', fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 99, marginLeft: 2 }}>
                  {learningBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'mindset'    && <MindsetEditor />}
        {activeTab === 'why'        && <WhyJournal />}
        {activeTab === 'learning'   && <LearningLog />}
        {activeTab === 'graduation' && <GraduationCheck />}
      </div>
    </div>
  );
}
