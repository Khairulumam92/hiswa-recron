import React, { useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { QRCodeModal } from '../navigation/QRCodeModal';

type NavTab = {
  id: 'home' | 'ontdekken' | 'pad' | 'badges';
  label: string;
  icon: string;
};

const NAV_TABS: NavTab[] = [
  { id: 'home',      label: 'Home',     icon: 'home' },
  { id: 'ontdekken', label: 'Ontdekken', icon: 'explore' },
  { id: 'pad',       label: 'Mijn Pad',  icon: 'route' },
  { id: 'badges',    label: 'Badges',    icon: 'military_tech' },
];

export const SiteHeader: React.FC = () => {
  const { navigateToHome, navigateToMap, activeTab, setActiveTab, discoveredRolesCount, phase } = useGameStore();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const pct = Math.max(4, Math.round((discoveredRolesCount / 16) * 100));

  const showNavTabs = phase === 'intro' || phase === 'map' || phase === 'result';

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab.id);
    if (tab.id === 'home') {
      navigateToHome();
    } else if (tab.id === 'ontdekken' && phase !== 'map') {
      navigateToMap();
    }
  };

  return (
    <header className="site-header">
      <div
        className="h-[56px] flex items-center justify-between px-4 sm:px-6 gap-4"
        style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}
      >
        {/* ── LEFT: Brand ───────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('ontdekken');
              navigateToHome();
            }}
            className="flex items-center gap-1 shrink-0 group"
            title="Naar Home Dashboard"
          >
            <span className="font-heading font-black text-white text-[18px] sm:text-[20px] tracking-tight leading-none group-hover:text-amber-300 transition-colors">
              Jong RECRON
            </span>
          </button>
        </div>

        {/* ── CENTER: Nav tabs ─────────────────────────────── */}
        {showNavTabs && (
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab)}
                  className={[
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all',
                    'font-heading font-bold text-[13px]',
                    isActive
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10',
                  ].join(' ')}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* ── RIGHT: Progress + user ───────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-20 h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: '#a8e86c' }}
              />
            </div>
            <span className="font-heading font-bold text-white text-[13px] tabular-nums whitespace-nowrap">
              {discoveredRolesCount}/16 banen ontdekt
            </span>
          </div>

          {/* Mobile: compact counter */}
          <span className="sm:hidden font-heading font-bold text-white text-[13px] tabular-nums">
            {discoveredRolesCount}/16
          </span>

          {/* QR Code Quick Button */}
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-[#F47D00] transition-colors"
            title="Scan & Speel QR-Code"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </button>

          {/* User avatar icon */}
          <button
            onClick={() => setIsQRModalOpen(true)}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Profiel & QR"
            title="Stand QR & Profiel"
          >
            <span
              className="material-symbols-outlined text-white text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              account_circle
            </span>
          </button>
        </div>
      </div>

      {/* Thin progress strip at bottom */}
      <div className="h-[3px]" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: '#a8e86c' }}
        />
      </div>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </header>
  );
};
