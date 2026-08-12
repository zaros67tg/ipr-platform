'use client';

import React from 'react';
import { useApp } from '@/lib/services/store';
import { CitationModal } from '@/components/common/CitationModal';
import type { Paper } from '@/types';

export default function CitationsPage() {
  const { papers } = useApp();
  const [selectedPaper, setSelectedPaper] = React.useState<Paper | null>(null);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#FFFFFF] uppercase font-bold tracking-wider">INTELLECTUAL LINEAGE</span>
        <h1 className="text-3xl serif-title text-[#F4F0E8] mt-1">Citations & Provenance</h1>
        <p className="text-sm font-serif text-[#A8A198] max-w-xl">
          Track research citations, derivative paper forks, and export citations in APA, MLA, Chicago, and BibTeX.
        </p>
      </div>

      <div className="space-y-4">
        {papers.map(p => (
          <div key={p.id} className="ipr-card p-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-[#746F69] mb-1">
                PLATFORM ID: IPR-{p.id.toUpperCase()} • {p.citationCount} CITATIONS
              </div>
              <h3 className="text-base font-semibold text-[#F4F0E8]">{p.title}</h3>
              <p className="text-xs text-[#A8A198] font-serif">By {p.authors.map(a => a.name).join(', ')} ({p.currentVersion})</p>
            </div>
            <button
              onClick={() => setSelectedPaper(p)}
              className="px-4 py-2 bg-[#FFFFFF] text-black rounded font-mono text-xs font-bold hover:bg-[#FFFFFF] shrink-0"
            >
              Export Citation
            </button>
          </div>
        ))}
      </div>

      <CitationModal paper={selectedPaper} isOpen={!!selectedPaper} onClose={() => setSelectedPaper(null)} />
    </div>
  );
}

