import React from 'react';

interface TimerProps {
  seconds: number;
  totalSeconds?: number;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ seconds, totalSeconds = 120, className = '' }) => {
  const isUrgent = seconds <= 20;
  const isWarning = seconds <= 45;
  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return (
    <span
      className={`font-heading font-extrabold tabular-nums text-lg ${
        isUrgent ? 'text-red-600 animate-pulse' : isWarning ? 'text-[#F47D00]' : 'text-[#003E6F]'
      } ${className}`}
    >
      {formatted}
    </span>
  );
};
