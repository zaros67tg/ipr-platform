'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { FolderGit2, PlusCircle, Users, Code, ArrowRight } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function ProjectsDirectoryPage() {
  const { projects } = useApp();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#D97706] uppercase tracking-widest block font-bold mb-1">
            COLLABORATIVE RESEARCH HUBS
          </span>
          <h1 className="text-3xl sm:text-4xl serif-title text-[#F4F0E8] mb-2">
            Active Projects in Motion
          </h1>
          <p className="text-sm font-serif text-[#A8A198] max-w-xl">
            First-class research entities containing active teams, open collaborator roles, required skills, linked datasets, and code repositories.
          </p>
        </div>

        <Link
          href="/create-project"
          className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] rounded-lg text-xs font-mono font-bold transition-colors inline-flex items-center gap-2 shadow-lg shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Project Hub</span>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(proj => (
          <div key={proj.id} className="ipr-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <DisciplineTag domain={proj.domain} size="sm" />
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D97706]/20 text-[#D97706] font-bold">
                  {proj.status.replace(/_/g, ' ')}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-[#F4F0E8] group-hover:text-[#C85A32] transition-colors mb-2">
                <Link href={`/projects/${proj.slug}`}>
                  {proj.title}
                </Link>
              </h2>

              <p className="text-xs font-serif text-[#E8E0D2] italic mb-3">
                "Question: {proj.researchQuestion}"
              </p>

              <p className="text-xs text-[#A8A198] line-clamp-3 mb-4 leading-relaxed">
                {proj.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="text-[10px] font-mono text-[#746F69] uppercase">OPEN ROLES & NEEDED SKILLS</div>
                <div className="flex flex-wrap gap-1">
                  {proj.openRoles.map(r => (
                    <span key={r} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#C85A32]/20 text-[#E89574] border border-[#C85A32]/30">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#746F69]" />
                <span className="text-[#A8A198]">{proj.team.length} Team Members</span>
              </div>
              <Link
                href={`/projects/${proj.slug}`}
                className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#24201D] text-[#F4F0E8] border border-white/10 rounded"
              >
                Project Hub →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
