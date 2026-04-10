import { useState } from 'react';
import { SystemOverview } from './SystemOverview';
import { WhyJournal } from './WhyJournal';
import { LearningLog } from './LearningLog';
import { GraduationCheck } from './GraduationCheck';

type Tab = 'system' | 'why' | 'learning' | 'graduation';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'system', label: 'Hệ thống', icon: '🏛️' },
  { key: 'why', label: 'Why Journal', icon: '✍️' },
  { key: 'learning', label: 'Learning Log', icon: '📝' },
  { key: 'graduation', label: 'Graduation Check', icon: '🎓' },
];

export function OnboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('system');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 22,
          color: 'var(--t1)',
          marginBottom: 4,
        }}>
          🌱 Onboard & Phát triển
        </h1>
        <p style={{ fontSize: 12, color: 'var(--t3)' }}>
          Hệ thống phát triển tư duy 30 năm — không phụ thuộc vào cá nhân
        </p>
      </div>

      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                border: active ? '1px solid var(--rc)' : '1px solid var(--b1)',
                background: active ? 'var(--rc2)' : 'transparent',
                color: active ? 'var(--rc)' : 'var(--t2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'system' && <SystemOverview />}
        {activeTab === 'why' && <WhyJournal />}
        {activeTab === 'learning' && <LearningLog />}
        {activeTab === 'graduation' && <GraduationCheck />}
      </div>
    </div>
  );
}
