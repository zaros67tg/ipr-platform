'use client';

import React, { useState } from 'react';
import { Paper } from '@/types';
import { X, Copy, Check, BookOpen } from 'lucide-react';

interface CitationModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ paper, isOpen, onClose }) => {
  const [activeFormat, setActiveFormat] = useState<'APA' | 'MLA' | 'Chicago' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !paper) return null;

  const authorsString = paper.authors.map(a => a.name).join(', ');
  const year = new Date(paper.publishedAt || paper.createdAt).getFullYear();
  const url = `https://ipr.republic/papers/${paper.slug}`;

  const citations = {
    APA: `${authorsString}. (${year}). ${paper.title}. Independent Press of Republic (${paper.currentVersion}). ${url}`,
    MLA: `${authorsString}. "${paper.title}." Independent Press of Republic, ${paper.currentVersion}, ${year}, ${url}.`,
    Chicago: `${authorsString}. "${paper.title}." Independent Press of Republic (${year}). ${url}.`,
    BibTeX: `@article{ipr_${paper.slug.replace(/-/g, '_')}_${year},
  author    = {${paper.authors.map(a => a.name).join(' and ')}},
  title     = {${paper.title}},
  journal   = {Independent Press of Republic},
  year      = {${year}},
  volume    = {${paper.currentVersion}},
  url       = {${url}},
  publisher = {Republic Research Ecosystem}
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[activeFormat]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#151311] border border-white/15 rounded-xl shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#746F69] hover:text-[#F4F0E8] p-1 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-[#C85A32]" />
          <h2 className="text-xl serif-title text-[#F4F0E8]">Export Native Citation</h2>
        </div>
        <p className="text-sm text-[#A8A198] mb-6">
          Cite this published research manuscript with permanent platform identifier lineage.
        </p>

        {/* Format Selector */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
          {(['APA', 'MLA', 'Chicago', 'BibTeX'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                activeFormat === fmt 
                  ? 'bg-[#C85A32] text-[#F4F0E8] font-bold' 
                  : 'bg-[#1C1917] text-[#A8A198] hover:text-[#F4F0E8] border border-white/5'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="bg-[#0D0C0B] border border-white/10 rounded-lg p-4 mb-6 font-mono text-xs text-[#E8E0D2] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto selection:bg-[#C85A32]/40">
          {citations[activeFormat]}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-[#746F69] font-mono">
            Platform Identifier: IPR-{paper.id.toUpperCase()} • {paper.currentVersion}
          </span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] rounded-md text-xs font-mono font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : `Copy ${activeFormat}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
