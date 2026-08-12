'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/services/store';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Portrait aspect ratios — alternating for masonry variety
const HEIGHTS = ['pb-[120%]', 'pb-[100%]', 'pb-[140%]', 'pb-[110%]', 'pb-[130%]', 'pb-[95%]'];

export default function PeopleDirectoryPage() {
  const { researchers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = researchers.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.primaryDomains.some(d => d.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black text-white w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-6 pb-20">
      {/* Header */}
      <div className="border-b border-white/10 pt-4 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/25 mb-4">
          Research Republic Registry
        </p>
        <div className="flex items-end justify-between gap-6">
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 600, letterSpacing: '-0.05em' }}
          >
            The People
          </h1>
          {/* Search — elegant editorial style */}
          <div className="relative pb-1 border-b border-white/20 flex items-center gap-3 min-w-[240px]">
            <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, domain…"
              className="bg-transparent font-ui text-[13px] text-white placeholder-white/25 focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Masonry grid — cinematic portrait cards */}
      <div className="people-masonry px-0 pt-px gap-px bg-white/8">
        {filtered.map((r, i) => {
          const padHeight = HEIGHTS[i % HEIGHTS.length];
          return (
            <div key={r.id} className="break-inside-avoid bg-black mb-px">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
              >
                <Link href={`/people/${r.id}`} className="block group relative overflow-hidden">
                  {/* Portrait image */}
                  <div className={`relative w-full ${padHeight} overflow-hidden`}>
                    <Image
                      src={r.avatarUrl}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top transition-all duration-700 group-hover:scale-[1.04] group-hover:brightness-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                  </div>

                  {/* Card footer — bottom of portrait */}
                  <div className="p-6 space-y-3 border-b border-white/8">
                    {/* Availability badge */}
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${r.availability === 'AVAILABLE' ? 'bg-white' : r.availability === 'SELECTIVE' ? 'bg-white/50' : 'bg-white/20'}`} />
                      <span className="font-ui text-[9px] uppercase tracking-[0.25em] text-white/35">
                        {r.availability === 'AVAILABLE' ? 'Open to Collaborate' : r.availability === 'SELECTIVE' ? 'Selective' : 'Not Available'}
                      </span>
                    </div>

                    {/* Name */}
                    <h2
                      className="font-display text-white leading-tight group-hover:opacity-80 transition-opacity"
                      style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 600, letterSpacing: '-0.03em' }}
                    >
                      {r.name}
                    </h2>

                    {/* Title + institution */}
                    <p className="font-ui text-[11px] text-white/40 leading-snug">
                      {r.title} · {r.institution}
                    </p>

                    {/* Research statement quote */}
                    {r.researchStatement && (
                      <p
                        className="font-display italic text-white/55 leading-snug line-clamp-2"
                        style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)', letterSpacing: '0.01em' }}
                      >
                        &ldquo;{r.researchStatement}&rdquo;
                      </p>
                    )}

                    {/* Domain pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {r.primaryDomains.slice(0, 2).map(d => (
                        <span key={d} className="font-ui text-[9px] uppercase tracking-widest border border-white/15 px-2 py-0.5 text-white/35">
                          {d}
                        </span>
                      ))}
                    </div>

                    {/* Stats footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/8">
                      <span className="font-ui text-[10px] text-white/25">
                        {r.stats.papersCount} papers · {r.stats.citationsCount} citations
                      </span>
                      <span className="font-ui text-[10px] text-white/25 group-hover:text-white transition-colors">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
