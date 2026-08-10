'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { X, Search, FileText, Users, FolderGit2, MessageSquare, ArrowRight, Code } from 'lucide-react';
import Link from 'next/link';
import { DisciplineTag } from './DisciplineTag';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { papers, researchers, projects, posts } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAPERS' | 'PEOPLE' | 'PROJECTS' | 'DISCUSSIONS'>('ALL');

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

  const filteredPosts = posts.filter(po => 
    !q || po.content.toLowerCase().includes(q) || po.tags.some(t => t.toLowerCase().includes(q))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-[#151311] border border-white/15 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-[#0D0C0B]">
          <Search className="w-5 h-5 text-[#FFFFFF]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search papers, mathematical terms, researchers, projects, code..."
            className="w-full bg-transparent text-lg text-[#F4F0E8] placeholder-[#746F69] focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1.5 text-[#746F69] hover:text-[#F4F0E8] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#1C1917]/50 text-xs font-mono">
          {(['ALL', 'PAPERS', 'PEOPLE', 'PROJECTS', 'DISCUSSIONS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1 rounded transition-colors ${
                activeFilter === tab 
                  ? 'bg-[#FFFFFF] text-[#F4F0E8] font-semibold' 
                  : 'text-[#A8A198] hover:text-[#F4F0E8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          {/* Papers */}
          {(activeFilter === 'ALL' || activeFilter === 'PAPERS') && filteredPapers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#746F69] mb-3 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-[#FFFFFF]" /> Papers ({filteredPapers.length})</span>
              </div>
              <div className="space-y-2">
                {filteredPapers.map(paper => (
                  <Link
                    key={paper.id}
                    href={`/papers/${paper.slug}`}
                    onClick={onClose}
                    className="block p-3 rounded-lg bg-[#0D0C0B] hover:bg-[#1C1917] border border-white/5 hover:border-[#FFFFFF]/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <DisciplineTag domain={paper.primaryDomain} size="sm" />
                      <span className="text-[11px] font-mono text-[#746F69]">{paper.readingTimeMinutes} min read • {paper.citationCount} citations</span>
                    </div>
                    <h4 className="text-sm font-semibold text-[#F4F0E8] group-hover:text-[#FFFFFF] transition-colors">{paper.title}</h4>
                    <p className="text-xs text-[#A8A198] line-clamp-1 mt-1">By {paper.authors.map(a => a.name).join(', ')}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {(activeFilter === 'ALL' || activeFilter === 'PEOPLE') && filteredResearchers.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#746F69] mb-3 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#6D4C7D]" /> Researchers ({filteredResearchers.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredResearchers.map(researcher => (
                  <Link
                    key={researcher.id}
                    href={`/people/${researcher.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0C0B] hover:bg-[#1C1917] border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <img src={researcher.avatarUrl} alt={researcher.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#F4F0E8]">{researcher.name}</h4>
                      <p className="text-xs text-[#A8A198] line-clamp-1">{researcher.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {(activeFilter === 'ALL' || activeFilter === 'PROJECTS') && filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#746F69] mb-3 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><FolderGit2 className="w-3.5 h-3.5 text-[#FFFFFF]" /> Projects ({filteredProjects.length})</span>
              </div>
              <div className="space-y-2">
                {filteredProjects.map(proj => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.slug}`}
                    onClick={onClose}
                    className="block p-3 rounded-lg bg-[#0D0C0B] hover:bg-[#1C1917] border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-[#FFFFFF]">{proj.status.replace(/_/g, ' ')}</span>
                      <DisciplineTag domain={proj.domain} size="sm" />
                    </div>
                    <h4 className="text-sm font-semibold text-[#F4F0E8]">{proj.title}</h4>
                    <p className="text-xs text-[#A8A198] line-clamp-1 mt-0.5">{proj.researchQuestion}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredPapers.length === 0 && filteredResearchers.length === 0 && filteredProjects.length === 0 && (
            <div className="text-center py-12 text-[#746F69]">
              <p className="text-sm font-serif italic text-[#A8A198] mb-1">"Nothing compatible has surfaced yet."</p>
              <p className="text-xs font-mono">Try searching by discipline like Theoretical Physics, Spiking Neural Networks, or Rust.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

