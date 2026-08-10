'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { ArrowLeft, Users, FolderGit2, Code, BookOpen, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ProjectHubDetailPage() {
  const params = useParams();
  const slugOrId = params?.id as string;
  const { projects, papers } = useApp();

  const project = projects.find(p => p.slug === slugOrId || p.id === slugOrId) || projects[0];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects Directory</span>
      </Link>

      <div className="ipr-card p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <DisciplineTag domain={project.domain} size="md" />
          <span className="px-3 py-1 text-xs font-mono bg-white/8 text-white/60 font-bold">
            {project.status.replace(/_/g, ' ')}
          </span>
        </div>

        <h1 className="text-3xl font-serif font-bold text-white">{project.title}</h1>

        <div className="p-4 bg-black border border-white/5 font-serif italic text-base text-[#E8E0D2]">
          "Research Question: {project.researchQuestion}"
        </div>

        <p className="text-sm text-white/50 leading-relaxed font-sans">{project.description}</p>

        {/* Required Skills & Open Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div>
            <span className="text-white/35 uppercase block mb-2 font-bold">REQUIRED TECHNICAL SKILLS</span>
            <div className="flex flex-wrap gap-1">
              {project.requiredSkills.map(s => (
                <span key={s} className="px-2.5 py-1 bg-black text-white border border-white/5">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-white/35 uppercase block mb-2 font-bold">OPEN COLLABORATOR ROLES</span>
            <div className="flex flex-wrap gap-1">
              {project.openRoles.map(r => (
                <span key={r} className="px-2.5 py-1 bg-white/5 text-white/60 border border-white/40">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <span className="text-xs font-mono text-white/35 uppercase font-bold block">RESEARCH TEAM</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.team.map(member => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-black border border-white/5">
                <img src={member.avatarUrl} alt="" className="w-10 h-10 object-cover" />
                <div>
                  <h4 className="text-xs font-semibold text-white">{member.name}</h4>
                  <p className="text-[11px] font-mono text-white/35">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 flex items-center justify-end">
          <Link
            href="/match"
            className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-bold text-xs font-mono inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Apply / Offer Collaboration</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
