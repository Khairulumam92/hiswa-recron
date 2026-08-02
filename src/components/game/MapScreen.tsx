import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { MAP_ZONES, MapZone } from '../../content/mapZones';

/**
 * MapScreen — Isometric pixel art map with interactive zone markers
 *
 * Inspired by the reference image: a full-screen isometric park map where
 * players tap on locations to discover scenarios. Each zone marker is a
 * floating pin with an icon, pulsing to indicate available scenarios.
 *
 * Features:
 * - Full-viewport isometric map background (pannable on mobile)
 * - Floating zone markers at % positions over the map
 * - Zone detail card (bottom-left) on hover/tap
 * - "Kies je avontuur" prompt card
 * - Badge counters showing completed zones
 */

interface ZoneMarkerProps {
  zone: MapZone;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const ZoneMarker: React.FC<ZoneMarkerProps> = ({ zone, isActive, isCompleted, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute group"
      style={{
        left: `${zone.position.x}%`,
        top: `${zone.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 20 : 10,
      }}
      aria-label={`${zone.name} — ${zone.subtitle}`}
    >
      {/* Pulse ring behind marker */}
      {!isCompleted && (
        <span
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            animation: 'mapPulse 2.5s ease-in-out infinite',
            background: zone.markerColor,
            transform: 'scale(1)',
          }}
        />
      )}

      {/* Marker body */}
      <div
        className="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150"
        style={{
          background: isCompleted ? '#2d6a04' : zone.markerColor,
          border: '3px solid #fff',
          boxShadow: isActive
            ? `0 0 0 3px ${zone.markerColor}40, 0 4px 16px rgba(0,0,0,0.25)`
            : '0 4px 12px rgba(0,0,0,0.2)',
          transform: isActive ? 'scale(1.15)' : 'scale(1)',
        }}
      >
        <span
          className="material-symbols-outlined text-white text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isCompleted ? 'check' : zone.icon}
        </span>
      </div>

      {/* Tooltip label (desktop hover) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    whitespace-nowrap"
      >
        <div
          className="px-3 py-1.5 rounded-lg text-[12px] font-heading font-bold text-white shadow-lg"
          style={{ background: zone.markerColor }}
        >
          {zone.name}
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
            style={{
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `5px solid ${zone.markerColor}`,
            }}
          />
        </div>
      </div>
    </button>
  );
};

export const MapScreen: React.FC = () => {
  const { startGame, navigateToHome, setMode, mode, discoveredRolesCount, playHistory } = useGameStore();
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [mapScale, setMapScale] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  // Track which scenario IDs have been played
  const playedScenarioIds = new Set(playHistory.map(p => p.scenarioId));

  const getZoneProgress = (zone: MapZone) => {
    const completed = zone.scenarioIds.filter(id => playedScenarioIds.has(id)).length;
    return { completed, total: zone.scenarioIds.length };
  };

  // Select first zone by default
  useEffect(() => {
    if (!selectedZone) {
      setSelectedZone(MAP_ZONES[0]);
    }
  }, [selectedZone]);

  const handleZoneClick = (zone: MapZone) => {
    setSelectedZone(zone);
  };

  const handleStartFromZone = () => {
    startGame();
  };

  const totalScenarios = MAP_ZONES.reduce((sum, z) => sum + z.scenarioIds.length, 0);
  const completedScenarios = MAP_ZONES.reduce(
    (sum, z) => sum + z.scenarioIds.filter(id => playedScenarioIds.has(id)).length,
    0
  );

  return (
    <div className="flex flex-col h-[calc(100vh-95px)] overflow-hidden bg-[#1a3a5c]">

      {/* ── MAP VIEWPORT ──────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden" ref={mapRef}>
        {/* Map image — covers full viewport, pannable */}
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${mapScale})` }}
        >
          <img
            src="/assets/images/map_isometric.jpg"
            alt="Recreatiepark kaart — isometrisch overzicht"
            className="w-full h-full object-cover"
            draggable={false}
          />

          {/* Subtle dark gradient overlay for readability at edges */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(to bottom, rgba(0,38,73,0.3) 0%, transparent 20%),
                linear-gradient(to top, rgba(0,38,73,0.5) 0%, transparent 25%),
                linear-gradient(to right, rgba(0,38,73,0.3) 0%, transparent 15%)
              `,
            }}
          />

          {/* Zone markers */}
          {MAP_ZONES.map((zone) => {
            const progress = getZoneProgress(zone);
            const isCompleted = progress.completed === progress.total && progress.total > 0;
            return (
              <ZoneMarker
                key={zone.id}
                zone={zone}
                isActive={selectedZone?.id === zone.id}
                isCompleted={isCompleted}
                onClick={() => handleZoneClick(zone)}
              />
            );
          })}
        </div>

        {/* ── TOP-RIGHT: Map controls ─────────────────────────── */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          <button
            onClick={() => setMapScale(s => Math.min(s + 0.15, 1.8))}
            className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center
                       text-[#003e6f] hover:bg-white transition-colors"
            aria-label="Inzoomen"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <button
            onClick={() => setMapScale(s => Math.max(s - 0.15, 0.7))}
            className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center
                       text-[#003e6f] hover:bg-white transition-colors"
            aria-label="Uitzoomen"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
          <button
            onClick={() => setMapScale(1)}
            className="w-9 h-9 rounded-lg bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center
                       text-[#003e6f] hover:bg-white transition-colors"
            aria-label="Reset zoom"
          >
            <span className="material-symbols-outlined text-[18px]">fit_screen</span>
          </button>
        </div>

        {/* ── BOTTOM-LEFT: Info card ──────────────────────────── */}
        <div className="absolute bottom-4 left-4 z-30 w-[320px] max-w-[calc(100%-2rem)]">
          {selectedZone ? (
            /* Zone detail card */
            <div
              className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden animate-in"
              key={selectedZone.id}
            >
              {/* Scene thumbnail */}
              <div className="relative h-32 overflow-hidden">
                <img
                  src={selectedZone.scenePath}
                  alt={selectedZone.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Category chip */}
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-bold"
                  style={{ background: selectedZone.markerBg, color: selectedZone.markerColor }}
                >
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {selectedZone.icon}
                  </span>
                  {selectedZone.category}
                </div>
                {/* Zone name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-heading font-black text-white text-xl leading-tight drop-shadow-lg">
                    {selectedZone.name}
                  </h3>
                  <p className="text-white/80 text-[13px] mt-0.5">{selectedZone.subtitle}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Progress */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-[#5e6e85]">
                      assignment
                    </span>
                    <span className="text-[13px] text-[#384454] font-bold">
                      {getZoneProgress(selectedZone).completed}/{getZoneProgress(selectedZone).total} situaties
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#003e6f]"
                      style={{ fontVariationSettings: "'FILL' 1" }}>work</span>
                    <span className="text-[13px] text-[#003e6f] font-bold">
                      {selectedZone.roleCount} beroepen
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="timer-track mb-4" style={{ height: '5px' }}>
                  <div
                    className="timer-fill"
                    style={{
                      width: `${(getZoneProgress(selectedZone).completed / getZoneProgress(selectedZone).total) * 100}%`,
                      background: selectedZone.markerColor,
                    }}
                  />
                </div>

                {/* Mode select + Start */}
                <div className="flex items-center gap-2">
                  <div className="flex border border-[#dde1e9] rounded-lg bg-[#f0f2f5] overflow-hidden">
                    <button
                      onClick={() => setMode('stan')}
                      className={`px-3 py-1.5 text-[11px] font-heading font-bold transition-all ${
                        mode === 'stan' ? 'bg-[#003e6f] text-white' : 'text-[#5e6e85]'
                      }`}
                    >
                      2 min
                    </button>
                    <button
                      onClick={() => setMode('school')}
                      className={`px-3 py-1.5 text-[11px] font-heading font-bold transition-all ${
                        mode === 'school' ? 'bg-[#2d6a04] text-white' : 'text-[#5e6e85]'
                      }`}
                    >
                      3 min
                    </button>
                  </div>
                  <button
                    onClick={handleStartFromZone}
                    className="btn-primary flex-1 justify-center py-2.5"
                    style={{ fontSize: '13px', padding: '10px 16px' }}
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    Speel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Default prompt card */
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5">
              <h3 className="font-heading font-black text-[#003e6f] text-lg mb-1">
                Kies je avontuur
              </h3>
              <p className="text-[#384454] text-[14px] leading-relaxed mb-3">
                Ontdek de wereld van recreatie. Tik op een locatie om te starten.
              </p>
              <div className="flex items-center gap-2 text-[13px] text-[#5e6e85]">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span className="font-bold">{MAP_ZONES.length} gebieden wachten op je</span>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM-RIGHT: Overall progress ──────────────────── */}
        <div className="absolute bottom-4 right-4 z-30">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--c-navy-light)', color: 'var(--c-navy)' }}
            >
              <span className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                {discoveredRolesCount >= 28 ? 'emoji_events' : 'explore'}
              </span>
            </div>
            <div>
              <div className="font-heading font-black text-[#003e6f] text-[15px] tabular-nums leading-none">
                {discoveredRolesCount}/28
              </div>
              <div className="text-[11px] text-[#5e6e85] font-bold">banen ontdekt</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── ZONE QUICK-NAV STRIP (mobile-friendly) ──────────── */}
      <div className="bg-white border-t border-[#dde1e9] px-3 py-2.5 overflow-x-auto flex-shrink-0">
        <div className="flex gap-2 min-w-max">
          {MAP_ZONES.map((zone) => {
            const progress = getZoneProgress(zone);
            const isActive = selectedZone?.id === zone.id;
            const isCompleted = progress.completed === progress.total && progress.total > 0;

            return (
              <button
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className={[
                  'flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-left shrink-0',
                  isActive
                    ? 'bg-[#ddeeff] border border-[#003e6f]/30'
                    : 'bg-[#f0f2f5] border border-transparent hover:border-[#dde1e9]',
                ].join(' ')}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: isCompleted ? '#e4f5eb' : zone.markerBg,
                    color: isCompleted ? '#2d6a04' : zone.markerColor,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isCompleted ? 'check' : zone.icon}
                  </span>
                </div>
                <div>
                  <div className="font-heading font-bold text-[12px] text-[#0f1923] leading-none">
                    {zone.name}
                  </div>
                  <div className="text-[10px] text-[#5e6e85] mt-0.5 leading-none tabular-nums">
                    {progress.completed}/{progress.total}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
