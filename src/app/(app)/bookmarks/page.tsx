'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { FileText } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';

export default function BookmarksPage() {
  const { papers, bookmarks } = useApp();

  const savedPapers = papers.filter(p => bookmarks.includes(p.id));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#FFFFFF] uppercase font-bold tracking-wider">SAVED ARCHIVE</span>
        <h1 className="text-3xl serif-title text-[#F4F0E8] mt-1">My Bookmarks</h1>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg serif-title text-[#F4F0E8] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#FFFFFF]" />
          Saved Manuscripts ({savedPapers.length})
        </h2>

        {savedPapers.length === 0 ? (
          <div className="p-8 text-center ipr-card font-mono text-xs text-[#746F69]">
            No bookmarked manuscripts yet. Click &quot;Save&quot; while reading any paper to bookmark it here.
          </div>
        ) : (
          <div className="space-y-3">
            {savedPapers.map(p => (
              <div key={p.id} className="ipr-card p-5 flex items-center justify-between">
                <div>
                  <DisciplineTag domain={p.primaryDomain} size="sm" className="mb-1" />
                  <h3 className="text-base font-semibold text-[#F4F0E8]">{p.title}</h3>
                  <p className="text-xs text-[#746F69] font-mono">By {p.authors.map(a => a.name).join(', ')}</p>
                </div>
                <Link href={`/papers/${p.slug}`} className="px-4 py-2 bg-[#FFFFFF] text-black rounded font-mono text-xs font-bold hover:bg-[#FFFFFF]">
                  Read →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

