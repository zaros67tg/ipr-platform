'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { formatDate } from '@/lib/utils/format';
import { ArrowLeft, Send, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';

export default function ResearcherDossierPage() {
  const params = useParams();
  const researcherId = params?.id as string;
  const { researchers, papers, projects, reviews } = useApp();

  const researcher = researchers.find(r => r.id === researcherId) || researchers[1];
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'PROJECTS' | 'REVIEWS'>('PAPERS');

  const userPapers = papers.filter(p => p.authors.some(a => a.id === researcher.id));
  const userProjects = projects.filter(pr => pr.team.some(t => t.id === researcher.id));
  const userReviews = reviews.filter(r => r.reviewerId === researcher.id);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <Link href="/people" className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Researcher Registry</span>
      </Link>

      {/* DOSSIER HEADER */}
      <div className="ipr-card p-8 sm:p-10 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img
              src={researcher.avatarUrl}
              alt={researcher.name}
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover border-2 border-[#5A6B43]/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-4xl serif-title text-white">{researcher.name}</h1>
                <VerificationBadge status={researcher.verificationStatus} />
              </div>
              <p className="text-sm font-mono text-white/50">{researcher.title} • {researcher.handle}</p>
              <p className="text-xs font-mono text-white/35 mt-0.5">{researcher.institution}</p>
              {researcher.orcid && (
                <p className="text-[11px] font-mono text-[#5A6B43] mt-1">ORCID: {researcher.orcid}</p>
              )}
            </div>
          </div>

          <Link
            href="/match"
            className="px-5 py-2.5 bg-white hover:bg-white/90 text-black font-bold text-xs font-mono inline-flex items-center gap-2 shadow-lg shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Connect / Offer Collaboration</span>
          </Link>
        </div>

        {/* Research Statement */}
        <div className="p-5 bg-black border border-white/5 space-y-2">
          <span className="text-xs font-mono text-[#5A6B43] uppercase tracking-wider font-bold block">RESEARCH STATEMENT</span>
          <p className="text-base font-serif text-[#E8E0D2] italic leading-relaxed">
            "{researcher.researchStatement}"
          </p>
        </div>

        {/* Domains & Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-white/35 uppercase block mb-2">PRIMARY DOMAINS</span>
            <div className="flex flex-wrap gap-1.5">
              {researcher.primaryDomains.map(d => (
                <DisciplineTag key={d} domain={d} size="sm" />
              ))}
            </div>
          </div>
          <div>
            <span className="text-white/35 uppercase block mb-2">SKILLS &amp; TECH STACK</span>
            <div className="flex flex-wrap gap-1">
              {researcher.skills.map(s => (
                <span key={s} className="px-2 py-0.5 text-[10px] bg-black text-white/50 border border-white/5">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TABBED COLLECTIONS */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs">
          {(['PAPERS', 'PROJECTS', 'REVIEWS'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 transition-colors ${
                activeTab === tab 
                  ? 'bg-[#5A6B43] text-white font-bold' 
                  : 'bg-black text-white/50 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'PAPERS' && (
          <div className="space-y-4">
            {userPapers.map(paper => (
              <div key={paper.id} className="ipr-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <DisciplineTag domain={paper.primaryDomain} size="sm" className="mb-2" />
                  <h3 className="text-lg serif-title text-white">{paper.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-1 mt-1 font-serif">{paper.abstract}</p>
                </div>
                <Link
                  href={`/papers/${paper.slug}`}
                  className="px-4 py-2 bg-white text-black font-mono text-xs font-bold hover:bg-white/90 shrink-0"
                >
                  Read Paper →
                </Link>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'PROJECTS' && (
          <div className="space-y-4">
            {userProjects.map(proj => (
              <div key={proj.id} className="ipr-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <DisciplineTag domain={proj.domain} size="sm" className="mb-2" />
                  <h3 className="text-lg font-semibold text-white">{proj.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-1 mt-1">{proj.researchQuestion}</p>
                </div>
                <Link
                  href={`/projects/${proj.slug}`}
                  className="px-4 py-2 bg-black border border-white/10 text-white font-mono text-xs hover:bg-[#24201D] shrink-0"
                >
                  View Project →
                </Link>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'REVIEWS' && (
          <div className="space-y-4">
            {userReviews.map(rev => (
              <div key={rev.id} className="ipr-card p-6 space-y-2">
                <div className="text-xs font-mono text-white/35">{formatDate(rev.createdAt)}</div>
                <h3 className="text-base font-semibold text-white">{rev.paperTitle}</h3>
                <p className="text-xs text-white/50 font-serif italic">"{rev.content.summary}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
