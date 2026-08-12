'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useApp } from '@/lib/services/store';
import { authClient } from '@/lib/auth-client';
import { CheckCircle2 } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import Link from 'next/link';

export default function UserProfileDossierPage() {
  const { currentUser, papers } = useApp();
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'PROJECTS' | 'REVIEWS' | 'ACTIVITY'>('PAPERS');

  const activeName = session?.user?.name || currentUser.name;
  const activeAvatar = session?.user?.image || currentUser.avatarUrl;
  const activeEmail = session?.user?.email || 'researcher@republic-academic.org';

  const userPapers = papers.filter(p => p.authors.some(a => a.id === currentUser.id));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="space-y-10"
    >
      {/* EDITORIAL HEADER (NO BOUNDING BOX, MASSIVE AVATAR) */}
      <div className="pb-10 border-b border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Image
              src={activeAvatar}
              alt={activeName}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover ring-2 ring-white/20 shadow-2xl"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-5xl serif-title font-bold text-white/90">{activeName}</h1>
                <span className="px-2.5 py-1 rounded border border-white/20 text-white/80 text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-white" /> Verified
                </span>
              </div>
              <p className="text-sm font-mono text-white/50">{activeEmail}</p>
              <p className="text-xs font-mono text-white/40">Republic Academic & Open Research Network</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center shrink-0 min-w-[160px]">
            <div className="text-xs font-mono text-white/40 uppercase font-bold">REVIEW CREDITS</div>
            <div className="text-4xl font-mono font-bold text-white my-1">
              500
            </div>
            <Link href="/reviews" className="text-[10px] font-mono text-white/60 hover:text-white underline">
              View Credit Ledger →
            </Link>
          </div>
        </div>

        {/* Bio Text Flowing Naturally Below */}
        <div className="pt-4 space-y-2">
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest font-bold block">RESEARCH STATEMENT</span>
          <p className="text-lg font-serif text-white/80 italic leading-relaxed">
            &ldquo;Pioneering open access research, reciprocal peer evaluation, and high-performance formal derivations.&rdquo;
          </p>
        </div>

        {/* Primary Domains & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs font-mono">
          <div>
            <span className="text-white/40 uppercase block mb-2 font-bold">PRIMARY DOMAINS</span>
            <div className="flex flex-wrap gap-2">
              {['Systems Programming', 'Neuroscience', 'Spiking Neural Networks', 'Quantum Gravity'].map(d => (
                <DisciplineTag key={d} domain={d} size="sm" />
              ))}
            </div>
          </div>
          <div>
            <span className="text-white/40 uppercase block mb-2 font-bold">TECHNICAL SKILLS</span>
            <div className="flex flex-wrap gap-1.5">
              {['Rust', 'C++', 'LaTeX', 'Category Theory', 'CUDA'].map(s => (
                <span key={s} className="px-2.5 py-1 rounded bg-white/5 text-white/70 border border-white/10 text-[11px]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLLECTIONS */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4 font-mono text-xs overflow-x-auto">
          {(['PAPERS', 'PROJECTS', 'REVIEWS', 'ACTIVITY'] as const).map(tab => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl transition-colors font-bold ${
                activeTab === tab 
                  ? 'bg-white/15 text-white border border-white/20 shadow-md' 
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* PAPERS TAB */}
        {activeTab === 'PAPERS' && (
          <div className="space-y-6">
            {userPapers.length === 0 ? (
              <div className="text-center py-12 border-b border-white/10 font-mono text-xs text-white/40">
                No published papers yet. Click <Link href="/submit" className="text-white underline font-bold">Publish Document</Link> to post your first work.
              </div>
            ) : (
              userPapers.map(paper => (
                <div key={paper.id} className="pb-6 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <DisciplineTag domain={paper.primaryDomain} size="sm" />
                      <span className="text-[11px] font-mono text-white/40">{paper.readingTimeMinutes} min read</span>
                    </div>
                    <h3 className="text-xl serif-title font-bold text-white/90">{paper.title}</h3>
                    <p className="text-sm text-white/60 line-clamp-1 mt-1 font-serif">{paper.abstract}</p>
                  </div>
                  <Link
                    href={`/papers/${paper.slug}`}
                    className="px-4 py-2 bg-white/10 text-white rounded-xl font-mono text-xs font-bold hover:bg-white/20 border border-white/15 shrink-0"
                  >
                    View Paper →
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
