import React, { useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { QRCodeModal } from '../navigation/QRCodeModal';

/**
 * IntroScreen — Vibrant Landing Dashboard
 * 
 * Features:
 * - Rich Hero Interactive Map Preview Card featuring isometric voxel art
 * - Sector tiles with real isometric scene image thumbnails
 * - Live animated hot-spot badges
 * - Clean editorial typography & social proof counters
 */

const SECTORS = [
  { icon: 'sailing',      label: 'Watersport',   image: '/assets/images/scene_marina.jpg', color: '#003e6f', bg: '#ddeeff', count: '4 beroepen' },
  { icon: 'holiday_village', label: 'Camping',   image: '/assets/images/scene_camping.jpg', color: '#2d6a04', bg: '#edf7e3', count: '3 beroepen' },
  { icon: 'restaurant',   label: 'Horeca',       image: '/assets/images/scene_restaurant.jpg', color: '#7a4500', bg: '#fff4e6', count: '3 beroepen' },
  { icon: 'yard',         label: 'Groen Beheer', image: '/assets/images/scene_garden.jpg', color: '#1a5e1a', bg: '#e4f5eb', count: '3 beroepen' },
  { icon: 'pool',         label: 'Zwembad',      image: '/assets/images/scene_pool.jpg', color: '#0077b6', bg: '#d0eeff', count: '3 beroepen' },
  { icon: 'emoji_nature', label: 'Animatie',     image: '/assets/images/scene_playground.jpg', color: '#f47d00', bg: '#fff4e6', count: '3 beroepen' },
];

const STATS = [
  { value: '16', label: 'beroepen in de sector' },
  { value: '3.000+', label: 'recreatiebedrijven' },
  { value: '60.000', label: 'mensen werkzaam' },
];

export const IntroScreen: React.FC = () => {
  const { startGame, navigateToMap, setMode, mode, contentError } = useGameStore();
  const [hovered, setHovered] = useState<number | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  return (
    <div className="stripe-bg min-h-[calc(100vh-95px)] flex flex-col relative overflow-hidden">

      {/* Subtle ambient light glow for warmth */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, #003e6f 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none blur-3xl"
        style={{ background: 'radial-gradient(circle, #f47d00 0%, transparent 70%)' }}
      />

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row items-center max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 lg:py-12 gap-8 lg:gap-12 z-10">

        {/* ── LEFT: Content ───────────────────────────────────── */}
        <div className="w-full lg:w-[48%] flex flex-col justify-center animate-in">

          {/* Sector Tag Chip */}
          <div className="chip chip-navy mb-4 w-fit shadow-sm">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              explore
            </span>
            Jong RECRON Career Discovery
          </div>

          {/* Main Headline */}
          <h1 className="font-heading font-black text-[#003e6f] leading-[1.02] mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 5.2vw, 4.2rem)' }}>
            Wat voor<br />
            <span className="relative inline-block text-[#003e6f]">
              baan
              <span
                aria-hidden
                className="absolute left-0 bottom-1 h-[6px] w-full rounded-full"
                style={{ background: 'var(--c-orange)' }}
              />
            </span>{' '}
            past bij jou?
          </h1>

          {/* Subtitle */}
          <p className="text-[#384454] text-base sm:text-lg leading-relaxed mb-6 max-w-[480px]">
            Verken de isometrische wereld van het vakantiepark, help medewerkers bij echte situaties en ontdek welke van de{' '}
            <strong className="text-[#003e6f] font-black">16 recreatieberoepen</strong> bij jouw talenten past.
          </p>

          {/* Mode Selector */}
          <div className="mb-6">
            <p className="font-heading font-bold text-[11px] text-[#5e6e85] uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              Kies jouw spelmodus
            </p>
            <div className="inline-flex p-1 border border-[#dde1e9] rounded-[14px] bg-white shadow-sm">
              <button
                onClick={() => setMode('stan')}
                className={[
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all',
                  'font-heading font-bold text-xs sm:text-sm',
                  mode === 'stan'
                    ? 'bg-[#003e6f] text-white shadow-sm'
                    : 'text-[#5e6e85] hover:bg-[#f0f2f5] hover:text-[#003e6f]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  store
                </span>
                Stand &middot; 2 min
              </button>
              <button
                onClick={() => setMode('school')}
                className={[
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all',
                  'font-heading font-bold text-xs sm:text-sm',
                  mode === 'school'
                    ? 'bg-[#2d6a04] text-white shadow-sm'
                    : 'text-[#5e6e85] hover:bg-[#f0f2f5] hover:text-[#003e6f]',
                ].join(' ')}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
                Klaslokaal &middot; 3 min
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <button
              onClick={navigateToMap}
              id="start-game-btn"
              className="btn-primary animate-pulse-glow justify-center py-3.5 px-7 shadow-lg text-base"
            >
              <span className="material-symbols-outlined text-[24px]">map</span>
              Ontdek de interactieve kaart
            </button>
            <button
              onClick={() => startGame()}
              className="btn-secondary justify-center py-3.5 px-6 text-base"
            >
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              Direct spelen
            </button>
          </div>

          {contentError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {contentError}
            </div>
          )}

          {/* Social Proof Stats */}
          <div className="flex items-center gap-0 border border-[#dde1e9] rounded-2xl bg-white/90 backdrop-blur-sm overflow-hidden shadow-sm w-fit">
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <div className="w-px h-10 bg-[#dde1e9] shrink-0" />}
                <div className="px-4 sm:px-6 py-3 text-center">
                  <div className="font-heading font-black text-[#003e6f] text-lg sm:text-xl leading-none tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-[#5e6e85] text-[11px] mt-1 leading-tight font-medium">
                    {stat.label}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Interactive Hero Park Preview & Sector Visuals ── */}
        <div className="w-full lg:w-[52%] flex flex-col gap-5">

          {/* 1. HERO MAP PREVIEW CARD */}
          <div 
            onClick={navigateToMap}
            className="group relative rounded-3xl overflow-hidden border-2 border-[#003e6f]/20 bg-[#003e6f] shadow-2xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* Map Preview Image */}
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img 
                src="/assets/images/map_isometric.jpg" 
                alt="Recreatiepark Isometrische Kaart"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003e6f] via-[#003e6f]/30 to-transparent" />
              
              {/* Floating Hotspot Badges on Image */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-heading font-extrabold text-xs text-[#003e6f]">
                  Interactive Park Map
                </span>
              </div>

              {/* Pin Badges floating over map */}
              <div className="absolute top-12 left-1/4 bg-[#003e6f] text-white px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold shadow-lg flex items-center gap-1.5 border border-white/30 animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="material-symbols-outlined text-[14px]">sailing</span>
                Jachthaven
              </div>
              <div className="absolute bottom-16 right-1/4 bg-[#2d6a04] text-white px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold shadow-lg flex items-center gap-1.5 border border-white/30 animate-bounce" style={{ animationDuration: '3.5s' }}>
                <span className="material-symbols-outlined text-[14px]">holiday_village</span>
                Camping
              </div>
              <div className="absolute top-20 right-10 bg-[#7a4500] text-white px-2.5 py-1 rounded-lg text-[11px] font-heading font-bold shadow-lg flex items-center gap-1.5 border border-white/30 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="material-symbols-outlined text-[14px]">restaurant</span>
                Restaurant
              </div>
            </div>

            {/* Bottom Bar of Map Card */}
            <div className="p-5 flex items-center justify-between text-white bg-[#003e6f]">
              <div>
                <h3 className="font-heading font-black text-lg sm:text-xl text-white leading-tight flex items-center gap-2">
                  Verken het Park Interactief
                  <span className="material-symbols-outlined text-amber-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stars
                  </span>
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                  Klik op locaties op de isometrische kaart om situaties op te lossen
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-white/10 group-hover:bg-[#f47d00] text-white flex items-center justify-center transition-colors shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>

          {/* 2. RICH SECTOR IMAGE GRID */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="font-heading font-bold text-xs text-[#5e6e85] uppercase tracking-wider">
                Ontdek 6 Hoofdsectoren
              </p>
              <span className="text-xs font-bold text-[#003e6f] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">work</span>                 16 Beroepen
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SECTORS.map((sector, i) => (
                <div
                  key={sector.label}
                  onClick={navigateToMap}
                  className="group relative h-28 rounded-2xl overflow-hidden border border-[#dde1e9] bg-white shadow-sm hover:shadow-xl hover:border-[#003e6f]/40 transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Background Image Thumbnail */}
                  <img
                    src={sector.image}
                    alt={sector.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badge Icon */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shadow-md backdrop-blur-md"
                      style={{ background: sector.bg, color: sector.color }}
                    >
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {sector.icon}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <div className="font-heading font-black text-sm text-white leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                      {sector.label}
                    </div>
                    <div className="text-[10px] text-white/80 font-medium leading-none mt-0.5">
                      {sector.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. EVENT / SCAN & PLAY CARD */}
          <div 
            onClick={() => setIsQRModalOpen(true)}
            className="card flex items-center gap-4 p-4 bg-white/90 backdrop-blur-md border border-[#003e6f]/15 shadow-md hover:shadow-lg rounded-2xl cursor-pointer transition-all group"
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#003e6f] text-white shrink-0 shadow-md group-hover:bg-[#F47D00] transition-colors">
              <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
            </div>
            <div className="flex-1">
              <p className="font-heading font-extrabold text-[#003e6f] text-sm leading-tight">
                Op een beurs of evenement?
              </p>
              <p className="text-[#5e6e85] text-xs mt-0.5">
                Scan de QR-code bij de Jong RECRON stand voor snelle toegang
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsQRModalOpen(true);
              }}
              className="btn-ghost text-xs font-bold text-[#003e6f] hover:bg-[#003e6f]/10 rounded-lg px-2.5 py-1.5 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              Scan QR &rarr;
            </button>
          </div>

        </div>

      </div>

      {/* QR Code Scan Modal */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </div>
  );
};
