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
  return (
    <Link 
      href="/reviews"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-serif border border-white bg-black text-white hover:bg-white hover:text-black transition-colors ${className}`}
      title={`Review Credits: ${credits} available`}
    >
      <Coins className="w-3.5 h-3.5" />
      <span className="font-bold">{credits.toString().padStart(2, '0')} CREDITS</span>

      {showUnlockHint && (
        <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] bg-white text-black font-semibold">
          Unlocked Featured
        </span>
      )}
    </Link>
  );
};
