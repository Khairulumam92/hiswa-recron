import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'green' | 'navy' | 'orange' | 'red';
  height?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'green',
  height = '6px',
  className = '',
}) => {
  const colors = {
    green: 'bg-[#2D4B08]',
    navy: 'bg-[#003E6F]',
    orange: 'bg-[#F47D00]',
    red: 'bg-red-600',
  };
  return (
    <div
      className={`w-full bg-[#E4E7EC] rounded-full overflow-hidden ${className}`}
      style={{ height }}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
};
