import React from 'react';
import { useGameStore } from '../../game/store/gameStore';

/**
 * MijnPadModal — "Mijn Pad" tab view
 * Displays player's career discovery journey, played scenarios log, 
 * top match recommendation, and stats breakdown.
 */

export const MijnPadModal: React.FC = () => {
  const { 
    playHistory, 
    score, 
    maxStreak, 
    discoveredRolesCount, 
    scenarios, 
    roles,
    matchedRole,
    setActiveTab,
    startGame,
    navigateToMap
  } = useGameStore();

  const totalPlayed = playHistory.length;
  const correctPlayed = playHistory.filter(h => h.isCorrect).length;
  const accuracy = totalPlayed > 0 ? Math.round((correctPlayed / totalPlayed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-[#dde1e9]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#003e6f] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <span className="material-symbols-outlined text-[24px]">route</span>
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white leading-tight">
                Mijn Ontdekkingspad
              </h2>
              <p className="text-white/80 text-xs mt-0.5">
                Overzicht van jouw gespeelde situaties en beroepenkeuze
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ontdekken')}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Sluiten"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#ddeeff] border border-[#003e6f]/15 text-center">
              <div className="font-heading font-black text-2xl text-[#003e6f] tabular-nums">
                {score}
              </div>
              <div className="text-[11px] font-bold text-[#003e6f]/80 uppercase tracking-wider mt-0.5">
                Totaal Score
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#edf7e3] border border-[#2d6a04]/15 text-center">
              <div className="font-heading font-black text-2xl text-[#2d6a04] tabular-nums">
                {discoveredRolesCount}/16
              </div>
              <div className="text-[11px] font-bold text-[#2d6a04]/80 uppercase tracking-wider mt-0.5">
                Banen Ontdekt
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#fff4e6] border border-[#f47d00]/15 text-center">
              <div className="font-heading font-black text-2xl text-[#f47d00] tabular-nums">
                {maxStreak}×
              </div>
              <div className="text-[11px] font-bold text-[#f47d00]/80 uppercase tracking-wider mt-0.5">
                Max Streak
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f0f4fb] border border-[#003e6f]/15 text-center">
              <div className="font-heading font-black text-2xl text-[#003e6f] tabular-nums">
                {accuracy}%
              </div>
              <div className="text-[11px] font-bold text-[#003e6f]/80 uppercase tracking-wider mt-0.5">
                Nauwkeurigheid
              </div>
            </div>
          </div>

          {/* Top Matched Role Preview (if any) */}
          {matchedRole && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#003e6f] to-[#00284d] text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-amber-300 font-heading font-extrabold text-xs tracking-wider uppercase">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
                Jouw Beste Match Tot Nu Toe
              </div>
              <h3 className="font-heading font-black text-2xl text-white leading-tight mb-1">
                {matchedRole.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                {matchedRole.shortDescription}
              </p>
              <div className="flex items-center gap-3 text-xs text-white/90">
                <span className="px-2.5 py-1 rounded-full bg-white/15 font-bold">
                  💼 {matchedRole.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 font-bold">
                  💶 {matchedRole.salaryRange}
                </span>
              </div>
            </div>
          )}

          {/* Scenario Play Log Timeline */}
          <div>
            <h3 className="font-heading font-bold text-sm text-[#003e6f] uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">history</span>
              Gespeelde Situaties ({totalPlayed})
            </h3>

            {totalPlayed === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-[#dde1e9] bg-[#f8fafc] text-center">
                <span className="material-symbols-outlined text-4xl text-[#5e6e85] mb-2">explore</span>
                <p className="font-heading font-bold text-[#003e6f] text-base mb-1">
                  Nog geen situaties gespeeld
                </p>
                <p className="text-xs text-[#5e6e85] max-w-sm mx-auto mb-4">
                  Open de isometrische kaart of start direct het spel om jouw eerste beroep te ontdekken!
                </p>
                <button
                  onClick={() => {
                    setActiveTab('ontdekken');
                    navigateToMap();
                  }}
                  className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  Start op de kaart
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
                {playHistory.map((item, idx) => {
                  const sc = scenarios.find(s => s.id === item.scenarioId);
                  const selectedRole = roles.find(r => r.id === item.selectedRoleId);
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                        item.isCorrect
                          ? 'bg-[#edf7e3]/60 border-[#2d6a04]/20 text-[#2d6a04]'
                          : 'bg-[#fde8e6]/60 border-[#BA1A1A]/20 text-[#BA1A1A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 font-bold text-xs ${
                          item.isCorrect ? 'bg-[#2d6a04]' : 'bg-[#BA1A1A]'
                        }`}>
                          <span className="material-symbols-outlined text-[18px]">
                            {item.isCorrect ? 'check' : 'close'}
                          </span>
                        </div>
                        <div>
                          <div className="font-heading font-bold text-sm text-[#0f1923]">
                            {sc?.title ?? `Scenario ${item.scenarioId}`}
                          </div>
                          <div className="text-xs text-[#5e6e85] flex items-center gap-2 mt-0.5">
                            <span>Gekozen: <strong>{selectedRole?.title ?? item.selectedRoleId}</strong></span>
                            <span>&bull;</span>
                            <span>{sc?.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-heading font-black text-xs shrink-0">
                        {item.isCorrect ? '+100 PTS' : '+0 PTS'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#dde1e9] flex items-center justify-between">
          <button
            onClick={() => setActiveTab('badges')}
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">military_tech</span>
            Bekijk Badges Gallery &rarr;
          </button>
          <button
            onClick={() => setActiveTab('ontdekken')}
            className="btn-primary py-2 px-5 text-xs flex items-center gap-1.5"
          >
            Verder spelen
          </button>
        </div>

      </div>
    </div>
  );
};
