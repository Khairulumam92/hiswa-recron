import React, { useEffect } from 'react';
import { useGameStore } from '../game/store/gameStore';
import { getAppModeFromUrl } from '../lib/urlParams';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { IdleOverlay } from '../components/layout/IdleOverlay';
import { IntroScreen } from '../components/game/IntroScreen';
import { MapScreen } from '../components/game/MapScreen';
import { ScenarioCard } from '../components/game/ScenarioCard';
import { ResultScreen } from '../components/results/ResultScreen';
import { MijnPadModal } from '../components/navigation/MijnPadModal';
import { BadgesModal } from '../components/navigation/BadgesModal';
import { useGameLoop } from '../game/hooks/useGameLoop';
import { useIdleReset } from '../game/hooks/useIdleReset';
import { useCounterSync } from '../game/hooks/useCounterSync';

export const AppShell: React.FC = () => {
  const { phase, activeTab, setMode } = useGameStore();

  useGameLoop();
  useIdleReset();
  useCounterSync();

  // Detect mode from URL on initial load
  useEffect(() => {
    const modeFromUrl = getAppModeFromUrl();
    setMode(modeFromUrl);
  }, [setMode]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Two-tier sticky header */}
      <SiteHeader />

      {/* Main screen content — flex-1 so footer stays at bottom */}
      <main className="flex-1" id="main-content">
        {phase === 'intro'   && <IntroScreen />}
        {phase === 'map'     && <MapScreen />}
        {phase === 'playing' && <ScenarioCard />}
        {phase === 'result'  && <ResultScreen />}
      </main>

      {/* Tab Modals for Mijn Pad & Badges */}
      {activeTab === 'pad' && <MijnPadModal />}
      {activeTab === 'badges' && <BadgesModal />}

      {/* Footer — hidden during gameplay and map */}
      <SiteFooter />

      {/* Booth idle overlay */}
      <IdleOverlay />
    </div>
  );
};
