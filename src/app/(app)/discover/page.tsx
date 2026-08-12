'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/services/store';
import { BookOpen, Users, FolderGit2 } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function DiscoverPage() {
  const { papers, projects, researchers } = useApp();

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#FFFFFF] uppercase tracking-widest block font-bold mb-1">
          RESEARCH EXPLORATION
        </span>
        <h1 className="text-3xl sm:text-4xl serif-title text-[#F4F0E8] mb-2">
          Discover the Living Republic
        </h1>
        <p className="text-sm font-serif text-[#A8A198] max-w-xl">
          Explore research across 12 disciplines, trending manuscripts, projects seeking co-authors, and peer reviews.
        </p>
      </div>

      {/* Grid of Discovery Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Papers Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="text-lg serif-title text-[#F4F0E8] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#FFFFFF]" />
              Trending Manuscripts
            </h2>
            <Link href="/papers" className="text-xs font-mono text-[#FFFFFF] hover:underline">View All →</Link>
          </div>

          <div className="space-y-3">
            {papers.map(p => (
              <div key={p.id} className="ipr-card p-4">
                <DisciplineTag domain={p.primaryDomain} size="sm" className="mb-1" />
                <h3 className="text-sm font-semibold text-[#F4F0E8] mb-1">
                  <Link href={`/papers/${p.slug}`} className="hover:text-[#FFFFFF]">
                    {p.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#746F69] font-mono">{p.citationCount} Citations • {p.readingTimeMinutes} min read</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects & Researchers Column */}
        <div className="space-y-8">
          {/* Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h2 className="text-lg serif-title text-[#F4F0E8] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#FFFFFF]" />
                Projects Seeking Team
              </h2>
              <Link href="/projects" className="text-xs font-mono text-[#FFFFFF] hover:underline">View All →</Link>
            </div>

            <div className="space-y-3">
              {projects.map(pr => (
                <div key={pr.id} className="ipr-card p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#FFFFFF]">{pr.status}</span>
                    <DisciplineTag domain={pr.domain} size="sm" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#F4F0E8]">{pr.title}</h3>
                  <p className="text-xs text-[#A8A198] line-clamp-1 mt-1">Needs: {pr.openRoles.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Researchers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h2 className="text-lg serif-title text-[#F4F0E8] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#5A6B43]" />
                Featured Researchers
              </h2>
              <Link href="/people" className="text-xs font-mono text-[#5A6B43] hover:underline">View All →</Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {researchers.slice(0, 4).map(r => (
                <Link key={r.id} href={`/people/${r.id}`} className="ipr-card p-3 flex items-center gap-2.5">
                  <Image src={r.avatarUrl} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-[#F4F0E8] truncate">{r.name}</h4>
                    <p className="text-[10px] font-mono text-[#746F69] truncate">{r.primaryDomains[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

