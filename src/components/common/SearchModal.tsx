'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { X, Search, FileText, Users, FolderGit2 } from 'lucide-react';
import Link from 'next/link';
import { DisciplineTag } from './DisciplineTag';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { papers, researchers, projects, posts } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAPERS' | 'PEOPLE' | 'PROJECTS'>('ALL');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredPapers = papers.filter(p => 
    !q || p.title.toLowerCase().includes(q) || p.abstract.toLowerCase().includes(q) || p.primaryDomain.toLowerCase().includes(q)
  );

  const filteredResearchers = researchers.filter(r => 
    !q || r.name.toLowerCase().includes(q) || r.bio.toLowerCase().includes(q) || r.primaryDomains.some(d => d.toLowerCase().includes(q))
  );

  const filteredProjects = projects.filter(pr => 
    !q || pr.title.toLowerCase().includes(q) || pr.description.toLowerCase().includes(q) || pr.domain.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-black border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-black">
          <Search className="w-5 h-5 text-white/50" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search papers, mathematical terms, researchers, projects, code..."
            className="w-full bg-transparent text-base font-ui text-white placeholder-white/30 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black text-xs font-ui">
          {(['ALL', 'PAPERS', 'PEOPLE', 'PROJECTS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 uppercase tracking-widest transition-colors border ${
                activeFilter === tab 
                  ? 'bg-white text-black border-white font-bold' 
                  : 'text-white/50 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 bg-black font-ui">
          {/* Papers */}
          {(activeFilter === 'ALL' || activeFilter === 'PAPERS') && filteredPapers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-white/40 mb-3 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-white" /> Papers ({filteredPapers.length})</span>
              </div>
              <div className="space-y-2">
                {filteredPapers.map(paper => (
                  <Link
                    key={paper.id}
                    href={`/papers/${paper.slug}`}
                    onClick={onClose}
                    className="block p-3.5 bg-black hover:bg-white/5 border border-white/10 hover:border-white/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <DisciplineTag domain={paper.primaryDomain} size="sm" />
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">{paper.readingTimeMinutes} min read · {paper.citationCount} citations</span>
                    </div>
                    <h4 className="text-sm font-display font-bold text-white group-hover:text-white/80 transition-colors">{paper.title}</h4>
                    <p className="text-xs text-white/50 line-clamp-1 mt-1 font-display italic font-normal">By {paper.authors.map(a => a.name).join(', ')}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {(activeFilter === 'ALL' || activeFilter === 'PEOPLE') && filteredResearchers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-white/40 mb-3 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-white" /> Researchers ({filteredResearchers.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredResearchers.map(researcher => (
                  <Link
                    key={researcher.id}
                    href={`/people/${researcher.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 bg-black hover:bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <img src={researcher.avatarUrl} alt={researcher.name} className="w-10 h-10 object-cover grayscale" />
                    <div>
                      <h4 className="text-sm font-display font-bold text-white">{researcher.name}</h4>
                      <p className="text-xs text-white/40 line-clamp-1 font-ui">{researcher.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {(activeFilter === 'ALL' || activeFilter === 'PROJECTS') && filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-white/40 mb-3 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FolderGit2 className="w-3.5 h-3.5 text-white" /> Projects ({filteredProjects.length})</span>
              </div>
              <div className="space-y-2">
                {filteredProjects.map(proj => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    onClick={onClose}
                    className="block p-3.5 bg-black hover:bg-white/5 border border-white/10 hover:border-white/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-white/50">{proj.status.replace(/_/g, ' ')}</span>
                      <DisciplineTag domain={proj.domain} size="sm" />
                    </div>
                    <h4 className="text-sm font-display font-bold text-white">{proj.title}</h4>
                    <p className="text-xs text-white/50 line-clamp-1 mt-0.5 font-display italic">{proj.researchQuestion}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredPapers.length === 0 && filteredResearchers.length === 0 && filteredProjects.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <p className="text-sm font-display italic text-white/60 mb-1">"Nothing compatible has surfaced yet."</p>
              <p className="text-xs font-ui uppercase tracking-widest text-white/30">Try searching by discipline like Theoretical Physics, Spiking Neural Networks, or Systems Programming.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
