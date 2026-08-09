'use client';

import React from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';

interface CreditBadgeProps {
  credits: number;
  className?: string;
  showUnlockHint?: boolean;
}

export const CreditBadge: React.FC<CreditBadgeProps> = ({ 
  credits, 
  className = '',
  showUnlockHint = false
}) => {
  const isEligibleForSubmission = credits >= 3;

  return (
    <Link 
      href="/reviews"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-sans border transition-all ${
        isEligibleForSubmission 
          ? 'bg-[#8C6B4A]/20 text-[#E8E0D2] border-[#8C6B4A]/40 hover:border-[#C5A880]' 
          : 'bg-[#141210] text-[#B8AF9F] border-[#E8E0D2]/10 hover:border-white/20'
      } ${className}`}
      title={`Review Credits: ${credits} available`}
    >
      <Coins className="w-3.5 h-3.5 text-[#C5A880]" />
      <span className="font-semibold">{credits.toString().padStart(2, '0')} CREDITS</span>

      {showUnlockHint && (
        <span className="hidden sm:inline-block ml-1 px-2 py-0.5 rounded text-[10px] bg-white/10 text-[#C5A880] font-semibold">
          Unlocked Featured
        </span>
      )}
    </Link>
  );
};
