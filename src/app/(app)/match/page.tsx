'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { Sparkles, ArrowRight, CheckCircle2, Bookmark, XCircle, Send, ShieldCheck, Users, FolderGit2 } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import Link from 'next/link';

export default function MatchmakingPage() {
  const { matches, updateMatchStatus } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const activeMatches = matches.filter(m => m.status === 'NEW' || m.status === 'SAVED');
  const currentMatch = activeMatches[currentIndex] || activeMatches[0];

  const handleAction = (status: 'PASSED' | 'SAVED' | 'CONNECTED') => {
    if (!currentMatch) return;
    updateMatchStatus(currentMatch.id, status);

    const msgs = {
      PASSED: 'Recommendation passed.',
      SAVED: 'Candidate profile saved to your Match archive.',
      CONNECTED: 'Collaboration Connection request dispatched to candidate.'
    };

    setFeedbackMsg(msgs[status]);
    setTimeout(() => setFeedbackMsg(null), 2500);

    if (currentIndex < activeMatches.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#C85A32] uppercase tracking-widest block font-bold mb-1">
            PILLAR I • COLLABORATION ENGINE
          </span>
          <h1 className="text-3xl sm:text-4xl serif-title text-[#F4F0E8] mb-2">
            Intellectual Co-Author Matchmaker
          </h1>
          <p className="text-sm font-serif text-[#A8A198] max-w-xl">
            Algorithmic matchmaking evaluating complementary domain expertise, technical skills, project needs, and availability.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#151311] border border-white/10 text-right text-xs font-mono">
          <div className="text-[#C85A32] font-bold">COMPLEMENTARY SCORING</div>
          <div className="text-[#746F69]">Rewards skill synergy over duplicate expertise</div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-mono text-xs text-center animate-in fade-in">
          {feedbackMsg}
        </div>
      )}

      {currentMatch ? (
        <div className="ipr-card p-6 sm:p-10 relative overflow-hidden space-y-8">
          {/* Top Compatibility Score Ribbon */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <img
                src={currentMatch.candidate.avatarUrl}
                alt={currentMatch.candidate.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#C85A32]/50 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl serif-title text-[#F4F0E8]">{currentMatch.candidate.name}</h2>
                  <VerificationBadge status={currentMatch.candidate.verificationStatus} showText={false} />
                </div>
                <p className="text-xs font-mono text-[#A8A198]">{currentMatch.candidate.title}</p>
                <p className="text-[11px] font-mono text-[#746F69]">{currentMatch.candidate.institution}</p>
              </div>
            </div>

            {/* Score Ring / Badge */}
            <div className="p-4 rounded-xl bg-[#0D0C0B] border border-[#C85A32]/40 text-center shrink-0">
              <div className="text-3xl font-mono font-bold text-[#C85A32]">{currentMatch.compatibilityScore}%</div>
              <div className="text-[10px] font-mono text-[#A8A198] uppercase tracking-wider">COMPATIBILITY SCORE</div>
            </div>
          </div>

          {/* Research Statement & Pitch */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#C85A32] uppercase tracking-wider font-bold block">RESEARCH DIRECTION</span>
            <p className="text-base font-serif text-[#E8E0D2] italic leading-relaxed">
              "{currentMatch.candidate.researchStatement}"
            </p>
            <p className="text-xs text-[#A8A198] bg-[#0D0C0B] p-3 rounded border border-white/5 leading-relaxed font-mono">
              <strong>Match Rationale:</strong> {currentMatch.reason}
            </p>
          </div>

          {/* Score Breakdown (5 Factors) */}
          <div>
            <span className="text-xs font-mono text-[#746F69] uppercase tracking-widest block font-semibold mb-3">
              Compatibility Breakdown (Platform Estimate)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs text-center">
              <div className="p-2.5 rounded bg-[#0D0C0B] border border-white/5">
                <div className="text-[#746F69] text-[10px]">DOMAIN OVERLAP</div>
                <div className="text-[#F4F0E8] font-bold">{currentMatch.scoreBreakdown.domainComplementarity}/30</div>
              </div>
              <div className="p-2.5 rounded bg-[#0D0C0B] border border-white/5">
                <div className="text-[#746F69] text-[10px]">SKILL SYNERGY</div>
                <div className="text-[#F4F0E8] font-bold">{currentMatch.scoreBreakdown.skillComplementarity}/25</div>
              </div>
              <div className="p-2.5 rounded bg-[#0D0C0B] border border-white/5">
                <div className="text-[#746F69] text-[10px]">NEED ALIGNMENT</div>
                <div className="text-[#F4F0E8] font-bold">{currentMatch.scoreBreakdown.projectNeedAlignment}/20</div>
              </div>
              <div className="p-2.5 rounded bg-[#0D0C0B] border border-white/5">
                <div className="text-[#746F69] text-[10px]">INTEREST MATCH</div>
                <div className="text-[#F4F0E8] font-bold">{currentMatch.scoreBreakdown.researchInterest}/15</div>
              </div>
              <div className="p-2.5 rounded bg-[#0D0C0B] border border-white/5">
                <div className="text-[#746F69] text-[10px]">AVAILABILITY</div>
                <div className="text-[#F4F0E8] font-bold">{currentMatch.scoreBreakdown.availability}/10</div>
              </div>
            </div>
          </div>

          {/* Candidate Domains & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            <div>
              <span className="text-xs font-mono text-[#746F69] uppercase block mb-2 font-semibold">PRIMARY DOMAINS & SKILLS</span>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {currentMatch.candidate.primaryDomains.map(d => (
                  <DisciplineTag key={d} domain={d} size="sm" />
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {currentMatch.candidate.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#0D0C0B] text-[#A8A198] border border-white/5">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-[#746F69] uppercase block mb-2 font-semibold">WHAT THEY OFFER & NEED</span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="text-emerald-400">
                  <strong>OFFERS:</strong> {currentMatch.candidate.projectOffers.join(', ')}
                </div>
                <div className="text-[#D97706]">
                  <strong>NEEDS:</strong> {currentMatch.candidate.projectNeeds.join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 gap-3">
            <button
              onClick={() => handleAction('PASSED')}
              className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#24201D] text-[#746F69] hover:text-[#F4F0E8] border border-white/10 rounded-lg text-xs font-mono transition-colors inline-flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>PASS</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAction('SAVED')}
                className="px-5 py-2.5 bg-[#1C1917] hover:bg-[#24201D] text-[#D97706] border border-[#D97706]/40 rounded-lg text-xs font-mono transition-colors inline-flex items-center gap-1.5"
              >
                <Bookmark className="w-4 h-4" />
                <span>SAVE</span>
              </button>

              <button
                onClick={() => handleAction('CONNECTED')}
                className="px-6 py-2.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] font-bold rounded-lg text-xs font-mono shadow-lg transition-colors inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>CONNECT / OFFER COLLABORATION</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 ipr-card p-8">
          <p className="text-lg font-serif italic text-[#A8A198] mb-2">"Nothing compatible has surfaced yet."</p>
          <p className="text-xs font-mono text-[#746F69] max-w-md mx-auto mb-6">
            All candidate match profiles for your current active project parameters have been evaluated. Check back soon as new researchers join the Republic.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-4 py-2 bg-[#1C1917] text-[#F4F0E8] border border-white/10 rounded text-xs font-mono hover:bg-[#24201D]"
          >
            Reset Match Queue
          </button>
        </div>
      )}
    </div>
  );
}
