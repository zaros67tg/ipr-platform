'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/lib/services/store';
import { ArrowRight, Send, Bookmark, XCircle } from 'lucide-react';
import Link from 'next/link';

const DISCIPLINES = [
  'NEUROSCIENCE',
  'QUANTUM PHYSICS',
  'SYSTEMS PROGRAMMING',
  'ROBOTICS',
  'CRYPTOGRAPHY',
  'MATHEMATICS',
  'MACHINE LEARNING',
  'PHILOSOPHY',
  'BIOLOGY',
  'CLIMATE SCIENCE',
];

const GOALS = [
  'PUBLISH A PAPER',
  'FIND A CO-AUTHOR',
  'BUILD A PROJECT',
  'GET PEER REVIEWS',
  'EXPLORE RESEARCH',
];

type Phase = 'discipline' | 'goal' | 'matches';

export default function VitaMatchmakerPage() {
  const { matches, updateMatchStatus } = useApp();
  const [phase, setPhase] = useState<Phase>('discipline');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [matchIndex, setMatchIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const toggleDiscipline = (d: string) => {
    setSelectedDisciplines(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const activeMatches = matches.filter(m => m.status === 'NEW' || m.status === 'SAVED');
  const currentMatch = activeMatches[matchIndex];

  const handleMatchAction = (status: 'PASSED' | 'SAVED' | 'CONNECTED') => {
    if (!currentMatch) return;
    updateMatchStatus(currentMatch.id, status);
    const msgs = {
      PASSED: 'Passed.',
      SAVED: 'Saved to archive.',
      CONNECTED: 'Connection request sent.',
    };
    setFeedbackMsg(msgs[status]);
    setTimeout(() => setFeedbackMsg(null), 2000);
    setMatchIndex(p => Math.min(p + 1, activeMatches.length - 1));
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-black text-white flex flex-col">
      {/* ── Phase: Discipline Selection ── */}
      <AnimatePresence mode="wait">
        {phase === 'discipline' && (
          <motion.div
            key="discipline"
            className="flex flex-col items-start justify-center flex-1 px-6 lg:px-20 py-16 gap-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div>
              <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-4">
                Step 1 of 2 · The Matchmaker
              </p>
              <h1
                className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(2.8rem, 8vw, 8rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
              >
                WHAT ARE YOU
                <br />
                <span className="text-white/30">BUILDING?</span>
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 max-w-5xl">
              {DISCIPLINES.map(d => {
                const active = selectedDisciplines.includes(d);
                return (
                  <motion.button
                    key={d}
                    onClick={() => toggleDiscipline(d)}
                    className={`font-ui text-sm uppercase tracking-[0.15em] px-6 py-4 border border-white transition-colors btn-invert ${active ? 'active' : ''}`}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 35 }}
                  >
                    {d}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={() => selectedDisciplines.length > 0 && setPhase('goal')}
              className={`flex items-center gap-3 font-ui text-sm uppercase tracking-[0.2em] border border-white px-8 py-4 transition-all ${selectedDisciplines.length === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
              whileTap={{ scale: 0.97 }}
            >
              Continue <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {phase === 'goal' && (
          <motion.div
            key="goal"
            className="flex flex-col items-start justify-center flex-1 px-6 lg:px-20 py-16 gap-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div>
              <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-4">
                Step 2 of 2 · Your Goal
              </p>
              <h1
                className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(2.8rem, 8vw, 8rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
              >
                WHAT DO YOU
                <br />
                <span className="text-white/30">NEED?</span>
              </h1>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xl">
              {GOALS.map(g => {
                const active = selectedGoal === g;
                return (
                  <motion.button
                    key={g}
                    onClick={() => setSelectedGoal(g)}
                    className={`w-full text-left font-display text-2xl sm:text-4xl px-0 py-4 border-b border-white/10 transition-all ${active ? 'text-white' : 'text-white/30 hover:text-white/70'}`}
                    style={{ letterSpacing: '-0.03em', fontWeight: 700 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {g}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setPhase('discipline')}
                className="font-ui text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <motion.button
                onClick={() => selectedGoal && setPhase('matches')}
                className={`flex items-center gap-3 font-ui text-sm uppercase tracking-[0.2em] border border-white px-8 py-4 transition-all ${!selectedGoal ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white hover:text-black'}`}
                whileTap={{ scale: 0.97 }}
              >
                Find My Match <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === 'matches' && (
          <motion.div
            key="matches"
            className="flex flex-col flex-1 px-6 lg:px-20 py-12 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="border-b border-white/10 pb-6">
              <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-2">
                Your Results · {activeMatches.length} Candidates
              </p>
              <h2
                className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
              >
                YOUR MATCHES
              </h2>
            </div>

            {feedbackMsg && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-ui text-xs uppercase tracking-widest text-white/50"
              >
                {feedbackMsg}
              </motion.p>
            )}

            {currentMatch ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-white">
                {/* Left: Candidate portrait */}
                <div className="relative min-h-[360px] lg:min-h-[500px] overflow-hidden border-b lg:border-b-0 lg:border-r border-white">
                  <img
                    src={currentMatch.candidate.avatarUrl}
                    alt={currentMatch.candidate.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/50 mb-1">
                      {currentMatch.scoreBreakdown.domainComplementarity + currentMatch.scoreBreakdown.skillComplementarity}% Match
                    </div>
                    <h3
                      className="font-display text-white leading-none"
                      style={{ fontSize: 'clamp(1.5rem, 3vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.03em' }}
                    >
                      {currentMatch.candidate.name}
                    </h3>
                    <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
                      {currentMatch.candidate.title} · {currentMatch.candidate.institution}
                    </p>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="flex flex-col justify-between p-8 gap-6">
                  <div className="space-y-6">
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/30 mb-2">Research Direction</p>
                      <p className="font-display text-lg sm:text-xl text-white/80 italic leading-snug" style={{ letterSpacing: '-0.02em' }}>
                        "{currentMatch.candidate.researchStatement}"
                      </p>
                    </div>
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/30 mb-2">Why This Match</p>
                      <p className="font-ui text-xs text-white/60 leading-relaxed">
                        {currentMatch.reason}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentMatch.candidate.primaryDomains.map(d => (
                        <span key={d} className="font-ui text-[9px] uppercase tracking-[0.2em] border border-white/20 px-2 py-1 text-white/50">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                    <button
                      onClick={() => handleMatchAction('PASSED')}
                      className="font-ui text-[10px] uppercase tracking-[0.2em] border border-white/20 px-4 py-3 text-white/40 hover:text-white hover:border-white transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-3 h-3" /> Pass
                    </button>
                    <button
                      onClick={() => handleMatchAction('SAVED')}
                      className="font-ui text-[10px] uppercase tracking-[0.2em] border border-white/20 px-4 py-3 text-white/40 hover:text-white hover:border-white transition-colors flex items-center gap-2"
                    >
                      <Bookmark className="w-3 h-3" /> Save
                    </button>
                    <button
                      onClick={() => handleMatchAction('CONNECTED')}
                      className="flex-1 font-ui text-[10px] uppercase tracking-[0.2em] border border-white px-4 py-3 bg-white text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-3 h-3" /> Connect
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-white/10 p-16 text-center">
                <p className="font-display text-2xl text-white/30 italic" style={{ letterSpacing: '-0.02em' }}>
                  "No more candidates in queue."
                </p>
                <button
                  onClick={() => { setMatchIndex(0); setPhase('discipline'); setSelectedDisciplines([]); setSelectedGoal(null); }}
                  className="mt-8 font-ui text-[11px] uppercase tracking-[0.2em] border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors"
                >
                  Start Over
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
