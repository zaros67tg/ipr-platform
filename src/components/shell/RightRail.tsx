'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/services/store';
import { Sparkles, ArrowUpRight, Users } from 'lucide-react';
import { DisciplineTag } from '../common/DisciplineTag';

export const RightRail: React.FC = () => {
  const { matches, researchers, projects } = useApp();

  const topMatch = matches[0];
  const featuredResearchers = researchers.slice(1, 4);

  return (
    <div className="space-y-6 font-sans text-sm antialiased">
      {/* ACTIVE MATCHES */}
      {topMatch && (
        <div className="pb-5 border-b border-[#E8E0D2]/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-semibold text-[#C5A880] text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#C5A880]" /> Active Match
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8C6B4A]/20 text-[#C5A880] font-semibold border border-[#8C6B4A]/40">
              {topMatch.compatibilityScore}% Match
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img src={topMatch.candidate.avatarUrl} alt={topMatch.candidate.name} className="w-9 h-9 rounded-full object-cover border border-[#8C6B4A]/50" />
            <div>
              <h4 className="text-sm font-semibold text-[#E8E0D2]">{topMatch.candidate.name}</h4>
              <p className="text-xs text-[#B8AF9F]">{topMatch.candidate.primaryDomains[0]}</p>
            </div>
          </div>

          <p className="text-sm text-[#B8AF9F] line-clamp-2 leading-relaxed font-serif italic">
            "{topMatch.reason}"
          </p>

          <Link
            href="/match"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A880] hover:underline"
          >
            <span>View Pitch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* LOOKING FOR COLLABORATORS */}
      <div className="pb-5 border-b border-[#E8E0D2]/10 space-y-3">
        <h3 className="text-xs font-sans text-[#8C8275] uppercase tracking-wider font-semibold">
          Collaborators Needed
        </h3>
        <div className="space-y-3">
          {projects.slice(0, 2).map(proj => (
            <div key={proj.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <DisciplineTag domain={proj.domain} size="sm" />
                <span className="text-xs text-[#C5A880] font-medium">Open</span>
              </div>
              <h4 className="text-sm font-semibold text-[#E8E0D2]">{proj.title}</h4>
              <p className="text-xs text-[#B8AF9F] line-clamp-1">Needs: {proj.openRoles.join(', ')}</p>
              <Link
                href={`/projects/${proj.slug}`}
                className="text-xs font-semibold text-[#C5A880] hover:underline inline-flex items-center gap-1 pt-0.5"
              >
                <span>Offer Collaboration</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* PEOPLE TO KNOW */}
      <div className="space-y-3">
        <h3 className="text-xs font-sans text-[#8C8275] uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#C5A880]" /> People to Know
        </h3>
        <div className="space-y-2.5">
          {featuredResearchers.map(r => (
            <Link
              key={r.id}
              href={`/people/${r.id}`}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <img src={r.avatarUrl} alt={r.name} className="w-8 h-8 rounded-full object-cover border border-[#E8E0D2]/10" />
                <div>
                  <h4 className="text-sm font-semibold text-[#E8E0D2] group-hover:text-[#C5A880] transition-colors">{r.name}</h4>
                  <p className="text-xs text-[#8C8275] truncate max-w-[130px]">{r.primaryDomains[0]}</p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#8C8275] group-hover:text-[#C5A880] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
