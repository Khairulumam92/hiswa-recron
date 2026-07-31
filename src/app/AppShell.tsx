import React, { useEffect } from 'react';
import { useGameStore } from '../game/store/gameStore';
import { getAppModeFromUrl } from '../lib/urlParams';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { IdleOverlay } from '../components/layout/IdleOverlay';
import { IntroScreen } from '../components/game/IntroScreen';
import { ScenarioCard } from '../components/game/ScenarioCard';
import { ResultScreen } from '../components/results/ResultScreen';
import { useGameLoop } from '../game/hooks/useGameLoop';
import { useIdleReset } from '../game/hooks/useIdleReset';
import { useCounterSync } from '../game/hooks/useCounterSync';

export const AppShell: React.FC = () => {
  const { phase, setMode } = useGameStore();

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
        {phase === 'playing' && <ScenarioCard />}
        {phase === 'result'  && <ResultScreen />}
      </main>

      {/* Footer — hidden during gameplay */}
      <SiteFooter />

      {/* Booth idle overlay */}
      <IdleOverlay />
    </div>
  );
};
