'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/services/store';
import { GitFork, Search } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function PapersListPage() {
  const { papers } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papers.filter(p =>
    !searchQuery ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-6 pb-20">
      {/* Header */}
      <div className="border-b border-white/10 pt-4 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/25 mb-3">
          Publications Archive
        </p>
        <div className="flex items-end justify-between gap-6">
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)', fontWeight: 600, letterSpacing: '-0.05em' }}
          >
            Manuscripts
          </h1>
          {/* Editorial search */}
          <div className="relative pb-1 border-b border-white/20 flex items-center gap-3 min-w-[260px]">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title or topic…"
              className="bg-transparent font-ui text-[13px] text-white placeholder-white/25 focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Papers — editorial list with aligned left edge */}
      <div className="py-8">
        <div className="space-y-0">
          {filteredPapers.map((paper, i) => (
            <div
              key={paper.id}
              className="group border-b border-white/8 py-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:bg-white/2 transition-colors -mx-6 lg:-mx-12 px-6 lg:px-12"
            >
              {/* Index number */}
              <span className="font-ui text-[11px] text-white/20 shrink-0 pt-1 w-8">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Main content */}
              <div className="flex-1 min-w-0 space-y-3">
                {/* Domain + meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <DisciplineTag domain={paper.primaryDomain} size="sm" />
                  <span className="font-ui text-[10px] text-white/25 uppercase tracking-widest">
                    {paper.readingTimeMinutes} min · {paper.citationCount} citations
                  </span>
                  <span className="font-ui text-[9px] uppercase tracking-widest border border-white/20 px-2 py-0.5 text-white/40">
                    {paper.status}
                  </span>
                </div>

                {/* Title — serif, large, italic */}
                <h2 className="font-display text-white leading-tight group-hover:opacity-80 transition-opacity" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.5rem)', fontWeight: 600, letterSpacing: '-0.03em' }}>
                  <Link href={`/papers/${paper.slug}`} className="hover:underline decoration-white/20 underline-offset-4">
                    <em>{paper.title}</em>
                  </Link>
                </h2>

                {/* Abstract */}
                <p className="font-display italic text-white/45 leading-snug line-clamp-2" style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', letterSpacing: '0.01em' }}>
                  &ldquo;{paper.abstract}&rdquo;
                </p>

                {/* Fork lineage */}
                {paper.parentPaperTitle && (
                  <div className="flex items-center gap-2 font-ui text-[10px] text-white/30">
                    <GitFork className="w-3 h-3" />
                    <span>Forked from: {paper.parentPaperTitle}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    {paper.authors[0]?.avatarUrl && (
                      <Image
                        src={paper.authors[0].avatarUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover"
                      />
                    )}
                    <span className="font-ui text-[11px] text-white/40">
                      {paper.authors.map(a => a.name).join(', ')}
                    </span>
                  </div>
                  <Link
                    href={`/papers/${paper.slug}`}
                    className="font-ui text-[11px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
