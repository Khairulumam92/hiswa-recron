import React from 'react';
import { useGameStore } from '../../game/store/gameStore';

/**
 * SiteHeader — Two-tier header inspired by NS.nl / Landal.nl
 *
 * Structure:
 * 1. Utility bar (dark navy strip, 32px) — HISWA-RECRON branding + context
 * 2. Main bar (60px) — logo, progress pill, action icons
 * 3. Progress strip (3px) — thin green bar showing discovered roles
 *
 * This replaces the previous flat white single-bar header.
 */
export const SiteHeader: React.FC = () => {
  const { resetGame, discoveredRolesCount, phase } = useGameStore();
  const pct = Math.max(4, Math.round((discoveredRolesCount / 28) * 100));

  return (
    <header className="site-header">
      {/* ── Tier 1: Utility bar ─────────────────────────────── */}
      <div className="header-utility">
        <div className="flex items-center gap-3">
          {/* HISWA + RECRON wordmark */}
          <a href="https://www.hiswarecron.nl" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 opacity-70 hover:opacity-100">
            <span className="material-symbols-outlined text-[13px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>anchor</span>
            hiswarecron.nl
          </a>
          <span className="text-white/20">|</span>
          <span>Beroependiscovery voor scholieren en studenten</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-white" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            <span className="material-symbols-outlined text-[12px]">share</span>
            Deel
          </button>
          <a href="https://www.jongerecron.nl" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white">
            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            Jong RECRON
          </a>
        </div>
      </div>

      {/* ── Tier 2: Main nav bar ─────────────────────────────── */}
      <div className="header-main">
        {/* Left: Back / Home button */}
        <button
          onClick={resetGame}
          aria-label={phase === 'intro' ? 'Home' : 'Terug'}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: "'wght' 300" }}
          >
            {phase === 'intro' ? 'home' : 'arrow_back'}
          </span>
          {phase !== 'intro' && (
            <span className="hidden sm:block font-heading font-bold text-[13px] tracking-wide">
              Terug
            </span>
          )}
        </button>

        {/* Center: Brand Identity */}
        <div className="flex flex-col items-center gap-0.5 select-none">
          <div className="flex items-center gap-2">
            {/* Wave icon (water/marina side) */}
            <span
              className="material-symbols-outlined text-[#7ecfff] text-[16px] leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              waves
            </span>
            {/* Brand name */}
            <span className="font-heading font-extrabold text-white text-[17px] tracking-tight leading-none">
              Jong RECRON
            </span>
            {/* Eco icon (recreation/green side) */}
            <span
              className="material-symbols-outlined text-[#a8e86c] text-[16px] leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              eco
            </span>
          </div>
          <span className="font-heading text-white/50 text-[10px] font-semibold tracking-[0.12em] uppercase leading-none">
            Beroependiscovery
          </span>
        </div>

        {/* Right: Progress counter */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="font-heading font-bold text-white text-[12px] leading-none tabular-nums">
              {discoveredRolesCount}<span className="text-white/40">/28</span>
            </span>
            <span className="text-white/40 text-[10px] leading-none">ontdekt</span>
          </div>
          {/* Mini progress ring indicator */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <span
              className="material-symbols-outlined text-[#a8e86c] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {discoveredRolesCount === 0 ? 'explore' :
               discoveredRolesCount >= 28 ? 'emoji_events' : 'trending_up'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tier 3: Progress strip ───────────────────────────── */}
      <div className="header-progress-strip">
        <div
          className="header-progress-fill"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </header>
  );
};
