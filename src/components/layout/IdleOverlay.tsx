import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../game/store/gameStore';

export const IdleOverlay: React.FC = () => {
  const { isIdleOverlayVisible, resetGame, dismissIdleOverlay } = useGameStore();
  const [sec, setSec] = useState(10);

  useEffect(() => {
    if (!isIdleOverlayVisible) { setSec(10); return; }
    const t = setInterval(() => {
      setSec(p => {
        if (p <= 1) { clearInterval(t); resetGame(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isIdleOverlayVisible, resetGame]);

  if (!isIdleOverlayVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-[#001f3f]/70 backdrop-blur-sm">
      <div className="card card-lg w-full max-w-sm p-8 flex flex-col items-center gap-5 text-center animate-pop">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-amber-500 text-[36px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            schedule
          </span>
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-xl text-[#003e6f] mb-1">Ben je er nog?</h2>
          <p className="text-sm text-[#5a6272]">Het spel wordt automatisch opnieuw gestart.</p>
        </div>
        <span className="font-heading font-extrabold text-5xl text-amber-500 tabular-nums">
          0:{String(sec).padStart(2, '0')}
        </span>
        <div className="flex flex-col sm:flex-row w-full gap-3">
          <button onClick={dismissIdleOverlay} className="btn-primary flex-1 justify-center">
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            Doorgaan
          </button>
          <button onClick={resetGame} className="btn-secondary flex-1 justify-center">
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Opnieuw
          </button>
        </div>
      </div>
    </div>
  );
};
