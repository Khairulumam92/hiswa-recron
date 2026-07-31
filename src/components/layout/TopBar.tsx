import React from 'react';
import { useGameStore } from '../../game/store/gameStore';

/**
 * TopBar — sticky header sesuai brand Jong RECRON
 * - Background: Navy #003E6F (dark, bukan white)
 * - Logo tengah: "Jong RECRON" bold putih
 * - Progress: "X/28 banen ontdekt" + bar hijau daun
 * - Icons Material Symbols Outlined
 */
export const TopBar: React.FC = () => {
  const { resetGame, discoveredRolesCount, phase } = useGameStore();
  const pct = Math.max(4, Math.round((discoveredRolesCount / 28) * 100));

  return (
    <header className="topbar">
      {/* Left: Reset/History icon */}
      <button
        onClick={resetGame}
        aria-label="Terug naar begin"
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors shrink-0"
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: "'wght' 400" }}
        >
          {phase === 'intro' ? 'home' : 'arrow_back'}
        </span>
      </button>

      {/* Center: Brand + progress */}
      <div className="flex flex-col items-center gap-1 select-none min-w-0">
        {/* Logo text */}
        <div className="flex items-center gap-1.5">
          {/* HISWA (blue wave visual) */}
          <span
            className="material-symbols-outlined text-[#7db8ff] text-[18px] leading-none"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
          >
            waves
          </span>
          <span className="font-heading font-extrabold text-white text-[15px] tracking-tight leading-none">
            Jong RECRON
          </span>
          {/* RECRON (green leaf visual) */}
          <span
            className="material-symbols-outlined text-[#aaf455] text-[18px] leading-none"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
          >
            eco
          </span>
        </div>

        {/* Progress bar + count */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white/70 tabular-nums leading-none whitespace-nowrap">
            {discoveredRolesCount}/28 banen ontdekt
          </span>
          <div className="w-20 sm:w-28 progress-track" style={{ height: '5px' }}>
            <div
              className="progress-fill"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Share icon */}
      <button
        aria-label="Deel deze ervaring"
        onClick={() => navigator.clipboard?.writeText(window.location.href)}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors shrink-0"
      >
        <span
          className="material-symbols-outlined text-[22px]"
          style={{ fontVariationSettings: "'wght' 400" }}
        >
          share
        </span>
      </button>
    </header>
  );
};
