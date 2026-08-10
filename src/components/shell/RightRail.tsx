'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { Sparkles, ArrowUpRight, Users } from 'lucide-react';
import { DisciplineTag } from '../common/DisciplineTag';

export const RightRail: React.FC = () => {
  const { matches, researchers, projects } = useApp();

  const topMatch = matches[0];
  const featuredResearchers = researchers.slice(1, 4);

  return (
    <div className="space-y-6 font-serif text-sm">
      {/* ACTIVE MATCHES */}
      {topMatch && (
        <div className="pb-5 border-b border-white space-y-3">
          <div className="flex items-center justify-between border-b border-white/30 pb-1">
            <span className="flex items-center gap-1.5 font-bold text-white uppercase text-xs">
              <Sparkles className="w-3.5 h-3.5" /> ACTIVE MATCH
            </span>
            <span className="text-xs px-2 py-0.5 border border-white bg-white text-black font-bold">
              {topMatch.compatibilityScore}% MATCH
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img src={topMatch.candidate.avatarUrl} alt={topMatch.candidate.name} className="w-8 h-8 object-cover border border-white" />
            <div>
              <h4 className="text-sm font-bold text-white">{topMatch.candidate.name}</h4>
              <p className="text-xs text-white/70">{topMatch.candidate.primaryDomains[0]}</p>
            </div>
          </div>

          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed italic border-l border-white/50 pl-2">
            "{topMatch.reason}"
          </p>

          <Link
            href="/match"
            className="inline-flex items-center gap-1 text-xs font-bold text-white hover:underline uppercase"
          >
            <span>View Pitch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* LOOKING FOR COLLABORATORS */}
      <div className="pb-5 border-b border-white space-y-3">
        <h3 className="text-xs font-serif uppercase tracking-widest font-bold text-white border-b border-white/30 pb-1">
          COLLABORATORS NEEDED
        </h3>
        <div className="space-y-3">
          {projects.slice(0, 2).map(proj => (
            <div key={proj.id} className="space-y-1.5 p-2 border border-white/40">
              <div className="flex items-center justify-between">
                <DisciplineTag domain={proj.domain} size="sm" />
                <span className="text-xs text-white font-bold uppercase">Open</span>
              </div>
              <h4 className="text-sm font-bold text-white">{proj.title}</h4>
              <p className="text-xs text-white/70 line-clamp-1">Needs: {proj.openRoles.join(', ')}</p>
              <Link
                href={`/projects/${proj.slug}`}
                className="text-xs font-bold text-white hover:underline inline-flex items-center gap-1 uppercase"
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
        <h3 className="text-xs font-serif uppercase tracking-widest font-bold text-white border-b border-white/30 pb-1 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> PEOPLE TO KNOW
        </h3>
        <div className="space-y-2.5">
          {featuredResearchers.map(r => (
            <Link
              key={r.id}
              href={`/people/${r.id}`}
              className="flex items-center justify-between group p-1.5 border border-transparent hover:border-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <img src={r.avatarUrl} alt={r.name} className="w-7 h-7 object-cover border border-white" />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:underline">{r.name}</h4>
                  <p className="text-xs text-white/60 truncate max-w-[120px]">{r.primaryDomains[0]}</p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
