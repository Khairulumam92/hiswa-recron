import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, filled = false, className = '' }) => (
  <span
    className={`material-symbols-outlined select-none leading-none ${className}`}
    style={{
      fontSize: `${size}px`,
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400`,
    }}
  >
    {name}
  </span>
);
