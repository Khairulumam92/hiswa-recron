import React, { useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';

/** 
 * IntroScreen — Landing screen
 *
 * Design inspired by: Landal.nl hero + NS.nl utility + Booking.com card patterns
 * Layout: Full-height, two-column on desktop (text left, visual right)
 *
 * Key differences from previous "AI slop" version:
 * - No generic gradient blobs
 * - Real stat counters (like Booking.com social proof)
 * - Mode toggle redesigned as functional segmented control, not just pills
 * - Hero visual shows real context: category tiles, not just one image
 * - Tight editorial typography (no loose spacing)
 */

const SECTORS = [
  { icon: 'sailing',      label: 'Watersport',   color: '#003e6f', bg: '#ddeeff' },
  { icon: 'cottage',      label: 'Recreatie',    color: '#2d6a04', bg: '#edf7e3' },
  { icon: 'restaurant',   label: 'Horeca',       color: '#7a4500', bg: '#fff4e6' },
  { icon: 'park',         label: 'Groen Beheer', color: '#2d6a04', bg: '#edf7e3' },
  { icon: 'anchor',       label: 'Marina',       color: '#003e6f', bg: '#ddeeff' },
  { icon: 'celebration',  label: 'Animatie',     color: '#7a4500', bg: '#fff4e6' },
];

const STATS = [
  { value: '28', label: 'beroepen in de sector' },
  { value: '3.000+', label: 'recreatiebedrijven' },
  { value: '60.000', label: 'mensen werkzaam' },
];

export const IntroScreen: React.FC = () => {
  const { startGame, setMode, mode } = useGameStore();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="stripe-bg min-h-[calc(100vh-95px)] flex flex-col">

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* ── LEFT: Content ───────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-10 md:py-16 animate-in">

          {/* Eyebrow: sector tag */}
          <div className="chip chip-navy mb-5 w-fit">
            <span className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            Recreatie & Watersport
          </div>

          {/* Main headline — tight, editorial, Montserrat 900 */}
          <h1 className="font-heading font-black text-[#003e6f] leading-[0.95] mb-4"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}>
            Wat voor<br />
            <span className="relative inline-block">
              baan
              {/* Underline accent */}
              <span
                aria-hidden
                className="absolute left-0 bottom-0 h-[4px] w-full rounded-full"
                style={{ background: 'var(--c-orange)', bottom: '-2px' }}
              />
            </span>{' '}
            past<br />bij jou?
          </h1>

          {/* Sub */}
          <p className="text-[#384454] text-lg leading-relaxed mb-8 max-w-[380px]">
            Help de medewerkers op het vakantiepark en ontdek welke van de{' '}
            <strong className="text-[#003e6f]">28 beroepen</strong>{' '}
            in de recreatiebranche bij jou past.
          </p>

          {/* Mode selector — functional segmented control */}
          <div className="mb-7">
            <p className="font-heading font-bold text-[11px] text-[#5e6e85] uppercase tracking-[0.1em] mb-2">
              Kies jouw situatie
            </p>
            <div className="inline-flex border border-[#dde1e9] rounded-[10px] bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setMode('stan')}
                className={[
                  'flex items-center gap-2 px-4 py-2.5 transition-all',
                  'font-heading font-bold text-sm',
                  mode === 'stan'
                    ? 'bg-[#003e6f] text-white'
                    : 'text-[#5e6e85] hover:bg-[#f0f2f5] hover:text-[#003e6f]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                Stan &middot; 2 min
              </button>
              <div className="w-px bg-[#dde1e9]" />
              <button
                onClick={() => setMode('school')}
                className={[
                  'flex items-center gap-2 px-4 py-2.5 transition-all',
                  'font-heading font-bold text-sm',
                  mode === 'school'
                    ? 'bg-[#2d6a04] text-white'
                    : 'text-[#5e6e85] hover:bg-[#f0f2f5] hover:text-[#003e6f]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                Klaslokaal &middot; 3 min
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
            <button
              onClick={startGame}
              id="start-game-btn"
              className="btn-primary animate-pulse-glow"
            >
              Start het spel
              <span className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'wght' 600" }}>
                play_arrow
              </span>
            </button>
            <p className="text-[#5e6e85] text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#2d6a04]"
                style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Geen account nodig
            </p>
          </div>

          {/* Stats bar — like Booking.com social proof */}
          <div className="flex items-center gap-0 border border-[#dde1e9] rounded-xl bg-white overflow-hidden shadow-sm w-fit">
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <div className="w-px h-10 bg-[#dde1e9] shrink-0" />}
                <div className="px-5 py-3 text-center">
                  <div className="font-heading font-black text-[#003e6f] text-lg leading-none tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-[#5e6e85] text-[11px] mt-0.5 leading-tight">
                    {stat.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Sector grid visual ────────────────────────── */}
        <div className="md:w-[48%] lg:w-[45%] flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">

          {/* Section label */}
          <p className="font-heading font-bold text-[11px] text-[#5e6e85] uppercase tracking-[0.1em] mb-4 animate-in"
            style={{ animationDelay: '0.1s' }}>
            Ontdek 28 beroepen in 6 sectoren
          </p>

          {/* 2×3 sector tile grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in mb-6"
            style={{ animationDelay: '0.15s' }}>
            {SECTORS.map((sector, i) => (
              <button
                key={sector.label}
                className="flex flex-col items-center gap-2 p-4 rounded-[14px] border border-[#dde1e9] bg-white hover:border-[#003e6f] hover:shadow-md transition-all text-center group"
                style={{
                  animationDelay: `${0.1 + i * 0.04}s`,
                  transform: hovered === i ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: hovered === i ? '0 6px 20px rgba(0,62,111,0.12)' : undefined,
                  transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: sector.bg, color: sector.color }}
                >
                  <span className="material-symbols-outlined text-[22px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    {sector.icon}
                  </span>
                </div>
                <span className="font-heading font-bold text-[12px] text-[#0f1923] leading-tight">
                  {sector.label}
                </span>
              </button>
            ))}
          </div>

          {/* Info card — QR / scan & play */}
          <div className="card flex items-center gap-4 p-4 animate-in"
            style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#003e6f] shrink-0">
              <span className="material-symbols-outlined text-white text-[26px]">qr_code_2</span>
            </div>
            <div>
              <p className="font-heading font-extrabold text-[#003e6f] text-sm leading-tight mb-0.5">
                Op een beurs? Scan & speel!
              </p>
              <p className="text-[#5e6e85] text-[13px] leading-snug">
                Scan de QR-code bij de Jong RECRON stand voor direct toegang
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
