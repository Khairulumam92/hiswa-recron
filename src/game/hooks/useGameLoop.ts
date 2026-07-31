// Custom hook: manages the timer interval
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameLoop() {
  const { phase, tickTimer } = useGameStore();

  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(tickTimer, 1000);
    return () => clearInterval(interval);
  }, [phase, tickTimer]);
}
