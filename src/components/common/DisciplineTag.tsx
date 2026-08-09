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
  // Domain accent mappings
  const getDomainColor = (d: string) => {
    switch (d) {
      case 'Theoretical Physics': return 'border-[#6B1D2F]/50 text-[#E08A9D] bg-[#6B1D2F]/15';
      case 'Neuroscience': return 'border-[#C85A32]/50 text-[#E8A085] bg-[#C85A32]/15';
      case 'Systems Programming': return 'border-[#5A6B43]/50 text-[#B4C69E] bg-[#5A6B43]/15';
      case 'Robotics': return 'border-[#D97706]/50 text-[#F5C27B] bg-[#D97706]/15';
      case 'Mathematics': return 'border-[#6D4C7D]/50 text-[#D0B4DB] bg-[#6D4C7D]/15';
      case 'Artificial Intelligence': return 'border-[#C85A32]/50 text-[#F4F0E8] bg-[#C85A32]/10';
      case 'Quantum Computing': return 'border-[#6D4C7D]/50 text-[#E0B0FF] bg-[#6D4C7D]/20';
      case 'Cybersecurity': return 'border-[#6B1D2F]/50 text-[#F099AA] bg-[#6B1D2F]/20';
      default: return 'border-white/10 text-[#A8A198] bg-[#1C1917]';
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] uppercase tracking-wider font-mono',
    md: 'px-2.5 py-1 text-xs font-mono tracking-wide',
    lg: 'px-3 py-1.5 text-sm font-mono tracking-wide'
  };

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center rounded border font-mono ${sizeClasses[size]} ${getDomainColor(domain)} ${
        interactive ? 'cursor-pointer hover:border-white/40 transition-colors' : ''
      } ${className}`}
    >
      {domain}
    </span>
  );
};
