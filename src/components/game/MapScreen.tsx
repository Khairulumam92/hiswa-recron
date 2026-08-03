import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../game/store/gameStore';
import { MAP_ZONES, MapZone } from '../../content/mapZones';

interface ZoneMarkerProps {
  zone: MapZone;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const ZoneMarker: React.FC<ZoneMarkerProps> = ({ zone, isActive, isCompleted, onClick }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="absolute group"
    style={{
      left: `${zone.position.x}%`,
      top: `${zone.position.y}%`,
      transform: 'translate(-50%, -50%)',
      zIndex: isActive ? 20 : 10,
    }}
    aria-label={`${zone.name} — ${zone.subtitle}`}
  >
    {!isCompleted && (
      <span
        className="absolute inset-0 rounded-full opacity-60"
        style={{ animation: 'mapPulse 2.5s ease-in-out infinite', background: zone.markerColor, transform: 'scale(1)' }}
      />
    )}
    <div
      className="relative w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150"
      style={{
        background: isCompleted ? '#2d6a04' : zone.markerColor,
        border: '3px solid #fff',
        boxShadow: isActive ? `0 0 0 3px ${zone.markerColor}40, 0 4px 16px rgba(0,0,0,0.25)` : '0 4px 12px rgba(0,0,0,0.2)',
        transform: isActive ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      <span className="material-symbols-outlined text-white text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
        {isCompleted ? 'check' : zone.icon}
      </span>
    </div>
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden md:block">
      <div className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-white shadow-lg" style={{ background: zone.markerColor }}>
        {zone.name}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${zone.markerColor}` }} />
      </div>
    </div>
  </button>
);

export const MapScreen: React.FC = () => {
  const { startGame, setMode, mode, discoveredRolesCount, playHistory } = useGameStore();
  const [selectedZone, setSelectedZone] = useState<MapZone | null>(null);
  const [mapScale, setMapScale] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const playedScenarioIds = new Set(playHistory.map(p => p.scenarioId));

  const getZoneProgress = (zone: MapZone) => {
    const completed = zone.scenarioIds.filter(id => playedScenarioIds.has(id)).length;
    return { completed, total: zone.scenarioIds.length };
  };

  useEffect(() => {
    if (!selectedZone) setSelectedZone(MAP_ZONES[0]);
  }, [selectedZone]);

  const handleZoneClick = (zone: MapZone) => {
    setSelectedZone(zone);
    setShowDetail(true);
  };

  const handleCloseDetail = () => setShowDetail(false);

  return (
    <div className="flex flex-col h-[calc(100vh-95px)] overflow-hidden bg-[#1a3a5c]">
      {/* MAP AREA — popups are INSIDE this div so they don't overlap the footer */}
      <div className="flex-1 relative overflow-hidden" ref={mapRef} onClick={handleCloseDetail}>
        <div className="absolute inset-0 transition-transform duration-300" style={{ transform: `scale(${mapScale})` }}>
          <img src="/assets/images/map_isometric.jpg" alt="Park kaart" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,38,73,0.3) 0%, transparent 20%), linear-gradient(to top, rgba(0,38,73,0.5) 0%, transparent 25%), linear-gradient(to right, rgba(0,38,73,0.3) 0%, transparent 15%)' }} />
          {MAP_ZONES.map((zone) => {
            const progress = getZoneProgress(zone);
            const isCompleted = progress.completed === progress.total && progress.total > 0;
            return (
              <ZoneMarker key={zone.id} zone={zone} isActive={selectedZone?.id === zone.id} isCompleted={isCompleted} onClick={() => handleZoneClick(zone)} />
            );
          })}
        </div>

        {/* Zoom controls */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-col gap-1.5 md:gap-2 z-30" onClick={(e) => e.stopPropagation()}>
          {[
            { icon: 'add', action: () => setMapScale(s => Math.min(s + 0.15, 1.8)) },
            { icon: 'remove', action: () => setMapScale(s => Math.max(s - 0.15, 0.7)) },
            { icon: 'fit_screen', action: () => setMapScale(1) },
          ].map(btn => (
            <button key={btn.icon} onClick={btn.action} className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/90 shadow-md flex items-center justify-center text-[#003e6f] hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">{btn.icon}</span>
            </button>
          ))}
        </div>

        {/* Progress badge (top-left) */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-30" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white/90 rounded-lg md:rounded-xl shadow-lg px-2.5 py-1.5 md:px-4 md:py-2.5 flex items-center gap-2 md:gap-3">
            <span className="material-symbols-outlined text-[#003e6f] text-[18px] md:text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
            <div>
              <div className="font-black text-[#003e6f] text-[13px] md:text-[15px] tabular-nums leading-none">{discoveredRolesCount}/16</div>
              <div className="text-[10px] md:text-[11px] text-[#5e6e85] font-bold">banen ontdekt</div>
            </div>
          </div>
        </div>

        {/* ZONE DETAIL — mobile: slide-up drawer, desktop: left-bottom card. INSIDE map area so it doesn't cover footer */}
        {selectedZone && showDetail && (
          <>
            {/* Mobile backdrop */}
            <div className="md:hidden fixed inset-0 z-25 bg-black/40" onClick={handleCloseDetail} />
            {/* Detail card */}
            <div
              className="z-30 bg-white/95 backdrop-blur-md rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden animate-in flex flex-col fixed bottom-0 left-0 right-0 max-h-[55vh] md:max-h-none md:absolute md:bottom-4 md:left-4 md:right-auto md:w-[320px] md:max-w-[calc(100%-2rem)]"
              onClick={(e) => e.stopPropagation()}
              key={selectedZone.id}
            >
              {/* Scene thumbnail */}
              <div className="relative h-24 md:h-32 overflow-hidden shrink-0">
                <img src={selectedZone.scenePath} alt={selectedZone.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <button onClick={handleCloseDetail} className="md:hidden absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: selectedZone.markerBg, color: selectedZone.markerColor }}>
                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>{selectedZone.icon}</span>
                  {selectedZone.category}
                </div>
                <div className="absolute bottom-2 md:bottom-3 left-3 right-3">
                  <h3 className="font-black text-white text-base md:text-xl leading-tight drop-shadow-lg">{selectedZone.name}</h3>
                  <p className="text-white/80 text-[11px] md:text-[13px]">{selectedZone.subtitle}</p>
                </div>
              </div>
              {/* Content */}
              <div className="p-3 md:p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] md:text-[13px] text-[#384454] font-bold">{getZoneProgress(selectedZone).completed}/{getZoneProgress(selectedZone).total} situaties</span>
                  <span className="text-[11px] md:text-[13px] text-[#003e6f] font-bold">{selectedZone.roleCount} beroepen</span>
                </div>
                <div className="timer-track mb-3" style={{ height: '4px' }}>
                  <div className="timer-fill" style={{ width: `${(getZoneProgress(selectedZone).completed / Math.max(1, getZoneProgress(selectedZone).total)) * 100}%`, background: selectedZone.markerColor }} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex border border-[#dde1e9] rounded-lg bg-[#f0f2f5] overflow-hidden">
                    <button onClick={() => setMode('stan')} className={`px-2.5 py-1.5 text-[11px] font-bold ${mode === 'stan' ? 'bg-[#003e6f] text-white' : 'text-[#5e6e85]'}`}>2 min</button>
                    <button onClick={() => setMode('school')} className={`px-2.5 py-1.5 text-[11px] font-bold ${mode === 'school' ? 'bg-[#2d6a04] text-white' : 'text-[#5e6e85]'}`}>3 min</button>
                  </div>
                  <button onClick={startGame} className="btn-primary flex-1 justify-center py-2 text-[13px]">
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>Speel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Default prompt — only desktop, only when no detail shown */}
        {!showDetail && (
          <div className="hidden md:block absolute bottom-4 left-4 z-30 w-[320px] max-w-[calc(100%-2rem)]" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5">
              <h3 className="font-black text-[#003e6f] text-lg mb-1">Kies je avontuur</h3>
              <p className="text-[#384454] text-[14px] leading-relaxed mb-3">Ontdek de wereld van recreatie. Tik op een locatie om te starten.</p>
              <div className="flex items-center gap-2 text-[13px] text-[#5e6e85]">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span className="font-bold">{MAP_ZONES.length} gebieden wachten op je</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom quick-nav strip — OUTSIDE map area, never covered by popups */}
      <div className="bg-white border-t border-[#dde1e9] px-2 md:px-3 py-2 overflow-x-auto flex-shrink-0">
        <div className="flex gap-1.5 md:gap-2 min-w-max">
          {MAP_ZONES.map((zone) => {
            const progress = getZoneProgress(zone);
            const isActive = selectedZone?.id === zone.id;
            const isCompleted = progress.completed === progress.total && progress.total > 0;
            return (
              <button key={zone.id} onClick={() => handleZoneClick(zone)} className={['flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2 rounded-xl transition-all text-left shrink-0', isActive ? 'bg-[#ddeeff] border border-[#003e6f]/30' : 'bg-[#f0f2f5] border border-transparent hover:border-[#dde1e9]'].join(' ')}>
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: isCompleted ? '#e4f5eb' : zone.markerBg, color: isCompleted ? '#2d6a04' : zone.markerColor }}>
                  <span className="material-symbols-outlined text-[14px] md:text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{isCompleted ? 'check' : zone.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-[11px] md:text-[12px] text-[#0f1923] leading-none">{zone.name}</div>
                  <div className="text-[10px] text-[#5e6e85] tabular-nums">{progress.completed}/{progress.total}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
