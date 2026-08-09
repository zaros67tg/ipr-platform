'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { FileText, GitFork, BookOpen, Search } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function PapersListPage() {
  const { papers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papers.filter(p => {
    return !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.abstract.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl serif-title font-bold text-white/90 mb-2">
          Publications Archive
        </h1>
        <p className="text-base font-serif text-white/50 max-w-2xl">
          Open access interactive publications with native block-level marginalia and repository code links.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-neutral-900/40 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search publications by title or topic..."
            className="w-full bg-neutral-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white/90 placeholder-white/40 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      {/* Papers List */}
      <div className="space-y-6">
        {filteredPapers.map(paper => (
          <div key={paper.id} className="bg-neutral-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 flex flex-col justify-between group transition-all hover:border-white/25">
            <div>
              <div className="flex items-center justify-between mb-3">
                <DisciplineTag domain={paper.primaryDomain} size="sm" />
                <span className="text-xs font-mono text-white/40">
                  {paper.readingTimeMinutes} MIN READ • {paper.citationCount} CITATIONS
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl serif-title font-bold text-white/90 group-hover:text-white transition-colors mb-3 leading-snug">
                <Link href={`/papers/${paper.slug}`}>
                  {paper.title}
                </Link>
              </h2>

              <p className="text-base text-white/60 line-clamp-2 mb-4 leading-relaxed font-serif italic">
                "{paper.abstract}"
              </p>

              {paper.parentPaperTitle && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/70 mb-4 flex items-center gap-2">
                  <GitFork className="w-4 h-4" />
                  <span>FORKED FROM: {paper.parentPaperTitle}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <img src={paper.authors[0].avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-7 h-7 rounded-full object-cover border border-white/20" />
                <span className="text-white/80 font-semibold">{paper.authors.map(a => a.name).join(', ')}</span>
              </div>
              <Link
                href={`/papers/${paper.slug}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/15 shadow-lg"
              >
                Read Interactive →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
