'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { PlusCircle, Users } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function ProjectsDirectoryPage() {
  const { projects } = useApp();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 lg:px-12 pt-10 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/25 mb-3">
          Collaborative Research Hubs
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', fontWeight: 600, letterSpacing: '-0.05em' }}
          >
            Projects
          </h1>
          <Link
            href="/create-project"
            className="font-ui text-[12px] border border-white/30 px-5 py-2.5 hover:bg-white hover:text-black transition-colors flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            New Project
          </Link>
        </div>
        <p className="font-ui text-[13px] text-white/35 max-w-2xl mt-3">
          Active research entities with open collaborator roles, linked datasets, and code repositories.
        </p>
      </div>

      {/* Projects grid */}
      <div className="px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8">
          {projects.map(proj => (
            <div key={proj.id} className="bg-black p-8 group flex flex-col justify-between gap-6 min-h-[320px]">
              <div className="space-y-4">
                {/* Domain + status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <DisciplineTag domain={proj.domain} size="sm" />
                  <span className="font-ui text-[9px] uppercase tracking-[0.2em] border border-white/20 text-white/40 px-2 py-0.5">
                    {proj.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="font-display text-white leading-tight group-hover:opacity-75 transition-opacity"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 600, letterSpacing: '-0.03em' }}
                >
                  <Link href={`/projects/${proj.slug}`}>
                    <em>{proj.title}</em>
                  </Link>
                </h2>

                {/* Research question */}
                <p
                  className="font-display italic text-white/45 leading-snug"
                  style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}
                >
                  "{proj.researchQuestion}"
                </p>

                <p className="font-ui text-[12px] text-white/35 leading-relaxed line-clamp-2">
                  {proj.description}
                </p>

                {/* Open roles */}
                <div className="space-y-1.5">
                  <p className="font-ui text-[9px] uppercase tracking-[0.25em] text-white/25">Open Roles</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.openRoles.map(r => (
                      <span key={r} className="font-ui text-[9px] uppercase tracking-widest border border-white/15 px-2 py-0.5 text-white/40">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 font-ui text-[11px] text-white/30">
                  <Users className="w-3.5 h-3.5" />
                  {proj.team.length} members
                </div>
                <Link
                  href={`/projects/${proj.slug}`}
                  className="font-ui text-[11px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                >
                  Project Hub →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
