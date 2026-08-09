'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { Users, Search, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { VerificationBadge } from '@/components/common/VerificationBadge';

export default function PeopleDirectoryPage() {
  const { researchers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = researchers.filter(r => 
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase()) || r.primaryDomains.some(d => d.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs font-mono text-[#5A6B43] uppercase tracking-widest block font-bold mb-1">
          RESEARCH REPUBLIC REGISTRY
        </span>
        <h1 className="text-3xl sm:text-4xl serif-title text-[#F4F0E8] mb-2">
          Researcher Dossiers & Directory
        </h1>
        <p className="text-sm font-serif text-[#A8A198] max-w-xl">
          Discover independent researchers, theoretical physicists, systems programmers, and mathematicians across the Republic.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#746F69] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search researchers by name, domain, institution..."
          className="w-full bg-[#151311] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-[#F4F0E8] placeholder-[#746F69] focus:outline-none focus:border-[#5A6B43]"
        />
      </div>

      {/* Researcher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(r => (
          <Link
            key={r.id}
            href={`/people/${r.id}`}
            className="ipr-card p-6 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img src={r.avatarUrl} alt={r.name} className="w-14 h-14 rounded-full object-cover border border-white/10 group-hover:scale-105 transition-transform" />
                <div>
                  <h2 className="text-base font-semibold text-[#F4F0E8] group-hover:text-[#C85A32] transition-colors">{r.name}</h2>
                  <p className="text-xs font-mono text-[#746F69] line-clamp-1">{r.title}</p>
                  <VerificationBadge status={r.verificationStatus} showText={false} className="mt-1" />
                </div>
              </div>

              <p className="text-xs text-[#A8A198] font-serif italic line-clamp-2 mb-4 leading-relaxed">
                "{r.researchStatement}"
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {r.primaryDomains.map(d => (
                  <DisciplineTag key={d} domain={d} size="sm" />
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#746F69]">
              <span>{r.stats.papersCount} Papers • {r.stats.citationsCount} Citations</span>
              <ArrowRight className="w-4 h-4 text-[#746F69] group-hover:text-[#C85A32] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
