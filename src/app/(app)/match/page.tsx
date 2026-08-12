'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/services/store';
import { ArrowRight, Send, Bookmark, XCircle } from 'lucide-react';

const SUGGESTION_CHIPS = [
  'Neuroscience', 'Quantum Physics', 'Systems Programming', 'Robotics',
  'Cryptography', 'Mathematics', 'Machine Learning', 'Philosophy',
  'Computational Biology', 'Climate Science', 'Topology', 'Computer Vision',
  'Formal Verification', 'Distributed Systems', 'Neuromorphic Computing',
];

type Phase = 'input' | 'matches';

export default function VitaMatchmakerPage() {
  const { matches, updateMatchStatus } = useApp();
  const [phase, setPhase] = useState<Phase>('input');
  const [query, setQuery] = useState('');
  const [matchIndex, setMatchIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Double the chips for infinite marquee
  const marqueeChips = [...SUGGESTION_CHIPS, ...SUGGESTION_CHIPS];

  const activeMatches = matches.filter(m => m.status === 'NEW' || m.status === 'SAVED');
  const currentMatch = activeMatches[matchIndex];

  const handleMatchAction = (status: 'PASSED' | 'SAVED' | 'CONNECTED') => {
    if (!currentMatch) return;
    updateMatchStatus(currentMatch.id, status);
    const msgs = { PASSED: 'Passed.', SAVED: 'Saved to archive.', CONNECTED: 'Connection request sent.' };
    setFeedbackMsg(msgs[status]);
    setTimeout(() => setFeedbackMsg(null), 2000);
    setMatchIndex(p => Math.min(p + 1, activeMatches.length - 1));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white flex flex-col">
      <AnimatePresence mode="wait">

        {phase === 'input' && (
          <motion.div
            key="input"
            className="flex flex-col items-center justify-center flex-1 px-6 py-24 gap-16 max-w-4xl mx-auto w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Question */}
            <div className="text-center">
              <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-white/25 mb-6">
                Intellectual Co-Author Matchmaker
              </p>
              <h1
                className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', fontWeight: 600, letterSpacing: '-0.05em' }}
              >
                WHAT ARE YOU
                <br />
                <span className="text-white/25">BUILDING?</span>
              </h1>
            </div>

            {/* Elegant text input — single border-bottom line */}
            <div className="w-full" onClick={() => inputRef.current?.focus()}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && query.trim() && setPhase('matches')}
                placeholder="Type your field or idea…"
                className="w-full bg-transparent border-b border-white/25 py-5 font-display text-white focus:outline-none focus:border-white transition-colors text-center placeholder-white/20"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.03em' }}
                autoFocus
              />
              <p className="font-ui text-[10px] text-white/20 text-center mt-3 tracking-widest uppercase">
                Press Enter or click below to find matches
              </p>
            </div>

            {/* Suggestion Circuit — scrolling marquee */}
            <div className="w-full overflow-hidden">
              <div className="marquee-track gap-3 flex">
                {marqueeChips.map((chip, i) => {
                  const isMatch = query && chip.toLowerCase().includes(query.toLowerCase());
                  return (
                    <button
                      key={`${chip}-${i}`}
                      onClick={() => { setQuery(chip); inputRef.current?.focus(); }}
                      className={`font-ui text-[11px] uppercase tracking-[0.15em] px-5 py-2.5 border whitespace-nowrap flex-shrink-0 transition-all ${isMatch ? 'border-white bg-white text-black' : 'border-white/20 text-white/40 hover:border-white/50 hover:text-white/70'}`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue */}
            <motion.button
              onClick={() => query.trim() && setPhase('matches')}
              className={`flex items-center gap-3 font-ui text-[13px] border border-white px-10 py-4 transition-all ${!query.trim() ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
              whileTap={{ scale: 0.97 }}
            >
              Find My Match <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {phase === 'matches' && (
          <motion.div
            key="matches"
            className="flex flex-col flex-1 max-w-6xl mx-auto w-full px-6 py-12 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="border-b border-white/10 pb-6 flex items-end justify-between">
              <div>
                <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/25 mb-2">
                  Results for &ldquo;{query}&rdquo; · {activeMatches.length} candidates
                </p>
                <h2
                  className="font-display text-white leading-none"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
                >
                  YOUR MATCHES
                </h2>
              </div>
              <button
                onClick={() => setPhase('input')}
                className="font-ui text-[11px] text-white/30 hover:text-white transition-colors"
              >
                ← Refine Search
              </button>
            </div>

            {feedbackMsg && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="font-ui text-[12px] text-white/40 uppercase tracking-widest">
                {feedbackMsg}
              </motion.p>
            )}

            {currentMatch ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 border border-white/10 overflow-hidden">
                {/* Portrait */}
                <div className="relative min-h-[400px] lg:min-h-[560px] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                  <Image
                    src={currentMatch.candidate.avatarUrl}
                    alt={currentMatch.candidate.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover brightness-75"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/50 mb-2">
                      {currentMatch.compatibilityScore}% Compatibility
                    </div>
                    <h3
                      className="font-display text-white leading-none mb-1"
                      style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
                    >
                      {currentMatch.candidate.name}
                    </h3>
                    <p className="font-ui text-[11px] text-white/50 uppercase tracking-widest">
                      {currentMatch.candidate.title}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between p-8 lg:p-10 gap-8">
                  <div className="space-y-8">
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/25 mb-3">Research Direction</p>
                      <p
                        className="font-display italic text-white/80 leading-snug"
                        style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', letterSpacing: '-0.02em' }}
                      >
                        &ldquo;{currentMatch.candidate.researchStatement}&rdquo;
                      </p>
                    </div>
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/25 mb-2">Why This Match</p>
                      <p className="font-ui text-[12px] text-white/50 leading-relaxed">{currentMatch.reason}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.candidate.primaryDomains.map(d => (
                        <span key={d} className="font-ui text-[9px] uppercase tracking-widest border border-white/15 px-2.5 py-1 text-white/40">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 border-t border-white/10 pt-8">
                    <button onClick={() => handleMatchAction('PASSED')}
                      className="font-ui text-[10px] uppercase tracking-widest border border-white/20 px-4 py-3 text-white/30 hover:text-white hover:border-white transition-colors flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5" /> Pass
                    </button>
                    <button onClick={() => handleMatchAction('SAVED')}
                      className="font-ui text-[10px] uppercase tracking-widest border border-white/20 px-4 py-3 text-white/30 hover:text-white hover:border-white transition-colors flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5" /> Save
                    </button>
                    <button onClick={() => handleMatchAction('CONNECTED')}
                      className="flex-1 font-ui text-[10px] uppercase tracking-widest border border-white px-4 py-3 bg-white text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 font-bold">
                      <Send className="w-3.5 h-3.5" /> Connect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <p className="font-display text-3xl text-white/20 italic" style={{ letterSpacing: '-0.03em' }}>
                    &ldquo;No more candidates in queue.&rdquo;
                  </p>
                  <button
                    onClick={() => { setMatchIndex(0); setPhase('input'); setQuery(''); }}
                    className="font-ui text-[11px] uppercase tracking-widest border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
