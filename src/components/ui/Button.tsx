import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'pressable';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold font-heading rounded-xl transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    pressable: 'btn-pressable-orange text-white',
    accent: 'btn-pressable-orange text-white',
    primary: 'bg-[#003e6f] hover:bg-[#005596] text-white shadow-sm',
    secondary: 'bg-[#2D4B08] hover:bg-[#3e6a00] text-white shadow-sm',
    outline: 'border-2 border-[#003e6f] text-[#003e6f] hover:bg-[#E6F0F9] bg-white',
    ghost: 'hover:bg-slate-100 text-[#003e6f]'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg font-black uppercase tracking-wider'
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
