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
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#5A6B43]/20 text-[#A8C980] border border-[#5A6B43]/40 ${className}`}
        >
          <Award className="w-3 h-3 text-[#A8C980]" />
          {showText && <span>Research Verified</span>}
        </span>
      );
    case 'INSTITUTION_VERIFIED':
      return (
        <span 
          title="Institution Verified - Official Academic Credentials" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#6D4C7D]/20 text-[#D8B4E2] border border-[#6D4C7D]/40 ${className}`}
        >
          <ShieldCheck className="w-3 h-3 text-[#D8B4E2]" />
          {showText && <span>Institution Verified</span>}
        </span>
      );
    case 'COMMUNITY_VERIFIED':
      return (
        <span 
          title="Community Verified - Active Contributor" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#C85A32]/20 text-[#E89574] border border-[#C85A32]/40 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#E89574]" />
          {showText && <span>Community Verified</span>}
        </span>
      );
    case 'UNVERIFIED':
    default:
      return (
        <span 
          title="Unverified Researcher" 
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#24201D] text-[#746F69] border border-white/5 ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-[#746F69]" />
          {showText && <span>Unverified</span>}
        </span>
      );
  }
};
