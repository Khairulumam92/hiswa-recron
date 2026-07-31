// Custom hook: auto-reset after N seconds of inactivity
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { GAME_CONSTANTS } from '../../lib/constants';

export function useIdleReset() {
  const { phase, mode, showIdleOverlay } = useGameStore();

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'result') return;
    if (mode !== 'stan') return;

    let idleTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(showIdleOverlay, GAME_CONSTANTS.IDLE_TIMEOUT_SECONDS * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [phase, mode, showIdleOverlay]);
}
