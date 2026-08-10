'use client';

import React from 'react';
import { VerificationStatus } from '@/types';
import { ShieldCheck, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  showText?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  status, 
  showText = true, 
  className = '' 
}) => {
  switch (status) {
    case 'RESEARCH_VERIFIED':
      return (
        <span 
          title="Verified Researcher - Publications & Peer Review Record Validated" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-ui uppercase tracking-wider border-white/30 text-white bg-white/5 ${className}`}
        >
          <Award className="w-3 h-3 text-white" />
          {showText && <span>Research Verified</span>}
        </span>
      );
    case 'INSTITUTION_VERIFIED':
      return (
        <span 
          title="Institution Verified - Official Academic Credentials" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-ui uppercase tracking-wider border-white/30 text-white/80 bg-white/5 ${className}`}
        >
          <ShieldCheck className="w-3 h-3 text-white" />
          {showText && <span>Institution Verified</span>}
        </span>
      );
    case 'COMMUNITY_VERIFIED':
      return (
        <span 
          title="Community Verified - Active Contributor" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-ui uppercase tracking-wider border-white/20 text-white/60 bg-white/5 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-white/60" />
          {showText && <span>Community Verified</span>}
        </span>
      );
    case 'UNVERIFIED':
    default:
      return (
        <span 
          title="Unverified Researcher" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 border text-xs font-ui uppercase tracking-wider border-white/10 text-white/35 bg-black ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-white/35" />
          {showText && <span>Unverified</span>}
        </span>
      );
  }
};
