'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { Search, FileText, Users, FolderGit2 } from 'lucide-react';
import Link from 'next/link';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function GlobalSearchPage() {
  const { papers, researchers, projects } = useApp();
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();

  const filteredPapers = papers.filter(p => !q || p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q));
  const filteredResearchers = researchers.filter(r => !q || r.name.toLowerCase().includes(q) || r.bio.toLowerCase().includes(q));
  const filteredProjects = projects.filter(pr => !q || pr.title.toLowerCase().includes(q) || pr.description.toLowerCase().includes(q));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#C85A32] uppercase font-bold tracking-wider">SCHOLARLY ARCHIVE SEARCH</span>
        <h1 className="text-3xl serif-title text-[#F4F0E8] mt-1">Search the Republic</h1>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 text-[#C85A32] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search papers, mathematical equations, researchers, projects, code..."
          className="w-full bg-[#151311] border border-white/15 rounded-xl pl-12 pr-4 py-4 text-base text-[#F4F0E8] placeholder-[#746F69] focus:outline-none focus:border-[#C85A32] shadow-xl"
        />
      </div>

      <div className="space-y-8">
        {/* Papers */}
        <div>
          <h2 className="text-sm font-mono text-[#746F69] uppercase mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#C85A32]" /> Papers ({filteredPapers.length})
          </h2>
          <div className="space-y-2">
            {filteredPapers.map(p => (
              <Link key={p.id} href={`/papers/${p.slug}`} className="block p-4 ipr-card">
                <div className="flex items-center justify-between mb-1">
                  <DisciplineTag domain={p.primaryDomain} size="sm" />
                  <span className="text-xs font-mono text-[#746F69]">{p.readingTimeMinutes} min read</span>
                </div>
                <h3 className="text-base font-semibold text-[#F4F0E8]">{p.title}</h3>
                <p className="text-xs text-[#A8A198] line-clamp-1 mt-1 font-serif">{p.abstract}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* People */}
        <div>
          <h2 className="text-sm font-mono text-[#746F69] uppercase mb-3 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#5A6B43]" /> Researchers ({filteredResearchers.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredResearchers.map(r => (
              <Link key={r.id} href={`/people/${r.id}`} className="p-3 ipr-card flex items-center gap-3">
                <img src={r.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-sm font-semibold text-[#F4F0E8]">{r.name}</h4>
                  <p className="text-xs font-mono text-[#746F69]">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
