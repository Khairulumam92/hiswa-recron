import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'navy' | 'highlight';
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', className = '', ...props }) => {
  const base = 'rounded-[1.25rem] border';
  const variants = {
    default: 'bg-white border-[#E4E7EC] shadow-[0_8px_24px_rgba(0,62,111,0.07)]',
    navy: 'bg-gradient-to-br from-[#002d5c] to-[#00489a] border-transparent text-white',
    highlight: 'bg-[#ddeeff] border-[#003E6F]/20',
  };
  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
