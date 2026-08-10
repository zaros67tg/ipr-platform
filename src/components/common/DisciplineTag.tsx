'use client';

import React from 'react';
import { ResearchDomain } from '@/types';

interface DisciplineTagProps {
  domain: ResearchDomain | string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const DisciplineTag: React.FC<DisciplineTagProps> = ({
  domain,
  size = 'md',
  interactive = false,
  onClick,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] font-ui',
    md: 'px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] font-ui',
    lg: 'px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] font-ui'
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center border border-white/25 text-white/55 ${sizeClasses[size]} ${
        interactive ? 'cursor-pointer hover:border-white hover:text-white transition-colors' : ''
      } ${className}`}
    >
      {domain}
    </span>
  );
};
