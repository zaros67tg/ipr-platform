'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { Award, Coins, ArrowUpRight, ShieldCheck, CheckCircle2, AlertCircle, FileText, PlusCircle } from 'lucide-react';
import { VerificationBadge } from '@/components/common/VerificationBadge';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { formatDate } from '@/lib/utils/format';

export default function ReviewsDashboardPage() {
  const { currentUser, transactions, reviews, papers, availableCredits } = useApp();
  const [showDoiModal, setShowDoiModal] = useState(false);

  const isEligibleForSubmission = availableCredits >= 3;
  const isEligibleForDOI = availableCredits >= 5;
  const isEligibleForFeatured = availableCredits >= 10;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#6D4C7D] uppercase tracking-widest block font-bold mb-1">
            PILLAR II • RECIPROCAL REVIEW ECONOMY
          </span>
          <h1 className="text-3xl sm:text-4xl serif-title text-[#F4F0E8] mb-2">
            Review Credit Economy & Ledger
          </h1>
          <p className="text-sm font-serif text-[#A8A198] max-w-xl">
            "Give to Get." Earn Review Credits by completing 300+ word verified peer reviews before submitting manuscripts for community review.
          </p>
        </div>

        <Link
          href="/submit"
          className="px-5 py-2.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] rounded-lg text-xs font-mono font-bold transition-colors inline-flex items-center gap-2 shadow-lg shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Manuscript (3 Credits)</span>
        </Link>
      </div>

      {/* CREDIT BALANCE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="ipr-card p-6 bg-[#151311] border-l-4 border-l-[#C85A32]">
          <div className="text-[10px] font-mono text-[#746F69] uppercase">AVAILABLE CREDITS</div>
          <div className="text-4xl font-mono font-bold text-[#F4F0E8] my-1">{availableCredits.toString().padStart(2, '0')}</div>
          <div className="text-[11px] font-mono text-[#C85A32]">
            {isEligibleForSubmission ? '✓ Eligible for Manuscript Submission' : '✗ Need 3 Credits to Submit'}
          </div>
        </div>

        <div className="ipr-card p-6">
          <div className="text-[10px] font-mono text-[#746F69] uppercase">TOTAL CREDITS EARNED</div>
          <div className="text-3xl font-mono font-bold text-[#F4F0E8] my-1">14</div>
          <div className="text-[11px] font-mono text-[#5A6B43]">From 14 Completed Reviews</div>
        </div>

        <div className="ipr-card p-6">
          <div className="text-[10px] font-mono text-[#746F69] uppercase">CREDITS SPENT</div>
          <div className="text-3xl font-mono font-bold text-[#F4F0E8] my-1">07</div>
          <div className="text-[11px] font-mono text-[#A8A198]">On 2 Manuscript Submissions</div>
        </div>

        <div className="ipr-card p-6">
          <div className="text-[10px] font-mono text-[#746F69] uppercase">AVERAGE REVIEW QUALITY</div>
          <div className="text-3xl font-mono font-bold text-emerald-400 my-1">94%</div>
          <div className="text-[11px] font-mono text-[#746F69]">Technical Depth & Specificity</div>
        </div>
      </div>

      {/* UNLOCK THRESHOLDS */}
      <div className="p-6 rounded-xl bg-[#151311] border border-white/10 space-y-4">
        <h3 className="text-xs font-mono font-bold text-[#C85A32] uppercase tracking-wider">
          Contribution Unlock Thresholds
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className={`p-4 rounded-lg border ${isEligibleForSubmission ? 'bg-[#5A6B43]/10 border-[#5A6B43]/40' : 'bg-[#0D0C0B] border-white/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#F4F0E8]">3 CREDITS</span>
              {isEligibleForSubmission ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-[#746F69]" />}
            </div>
            <div className="text-xs font-semibold text-[#E8E0D2] mb-1">FREE COMMUNITY MANUSCRIPT REVIEW</div>
            <p className="text-[11px] text-[#A8A198] font-sans">Unlocks submission of 1 paper manuscript for peer review.</p>
          </div>

          <div className={`p-4 rounded-lg border ${isEligibleForDOI ? 'bg-[#6D4C7D]/10 border-[#6D4C7D]/40' : 'bg-[#0D0C0B] border-white/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#F4F0E8]">5 CREDITS</span>
              {isEligibleForDOI ? <CheckCircle2 className="w-4 h-4 text-purple-400" /> : <AlertCircle className="w-4 h-4 text-[#746F69]" />}
            </div>
            <div className="text-xs font-semibold text-[#E8E0D2] mb-1">DOI PUBLICATION EXPORT WORKFLOW</div>
            <p className="text-[11px] text-[#A8A198] font-sans">Prepares publication metadata for DOI provider registration.</p>
            {isEligibleForDOI && (
              <button
                onClick={() => setShowDoiModal(true)}
                className="mt-2 text-[10px] text-[#D8B4E2] underline hover:text-[#F4F0E8]"
              >
                Trigger DOI Metadata Workflow →
              </button>
            )}
          </div>

          <div className={`p-4 rounded-lg border ${isEligibleForFeatured ? 'bg-[#D97706]/10 border-[#D97706]/40' : 'bg-[#0D0C0B] border-white/10'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[#F4F0E8]">10 CREDITS</span>
              {isEligibleForFeatured ? <CheckCircle2 className="w-4 h-4 text-amber-400" /> : <AlertCircle className="w-4 h-4 text-[#746F69]" />}
            </div>
            <div className="text-xs font-semibold text-[#E8E0D2] mb-1">HIGH-VISIBILITY FEATURED PLACEMENT</div>
            <p className="text-[11px] text-[#A8A198] font-sans">Features your research paper on the homepage editorial hero section.</p>
          </div>
        </div>
      </div>

      {/* OPEN MANUSCRIPTS SEEKING REVIEWS */}
      <div className="space-y-4">
        <h2 className="text-xl serif-title text-[#F4F0E8]">Manuscripts Open for Peer Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.slice(0, 2).map(pap => (
            <div key={pap.id} className="ipr-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <DisciplineTag domain={pap.primaryDomain} size="sm" />
                <span className="text-[10px] font-mono text-emerald-400 font-bold">+1 CREDIT UPON QUALIFYING REVIEW</span>
              </div>
              <h3 className="text-base font-semibold text-[#F4F0E8]">{pap.title}</h3>
              <p className="text-xs text-[#A8A198] line-clamp-2 font-serif italic">"{pap.abstract}"</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#746F69]">Min 300 words required</span>
                <Link
                  href={`/reviews/workspace?paperId=${pap.id}`}
                  className="px-3 py-1.5 bg-[#6D4C7D] text-[#F4F0E8] rounded font-bold hover:bg-[#5B3E6A] transition-colors"
                >
                  Open Reviewer Workspace →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMMUTABLE TRANSACTION LEDGER */}
      <div className="space-y-4">
        <h2 className="text-xl serif-title text-[#F4F0E8]">Review Credit Ledger</h2>
        <div className="bg-[#151311] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0D0C0B] border-b border-white/10 text-[#746F69] uppercase">
                <tr>
                  <th className="p-3">TRANSACTION ID</th>
                  <th className="p-3">TYPE</th>
                  <th className="p-3">AMOUNT</th>
                  <th className="p-3">REASON</th>
                  <th className="p-3">DATE</th>
                  <th className="p-3">BALANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#E8E0D2]">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#1C1917]/50">
                    <td className="p-3 text-[#746F69]">{tx.id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#C85A32]/20 text-[#E89574]'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-3 font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-[#C85A32]'}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="p-3 text-xs max-w-xs truncate">{tx.reason}</td>
                    <td className="p-3 text-[#746F69]">{formatDate(tx.timestamp)}</td>
                    <td className="p-3 font-bold text-[#F4F0E8]">{tx.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DOI Workflow Modal */}
      {showDoiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#151311] border border-white/15 rounded-xl p-6 relative">
            <h3 className="text-lg font-serif text-[#F4F0E8] mb-2">DOI Registration Workflow</h3>
            <p className="text-xs text-[#A8A198] font-mono mb-4">
              Metadata package prepared for registration with Crossref/Datacite.
            </p>
            <div className="p-3 bg-[#0D0C0B] border border-white/10 rounded font-mono text-xs text-[#E8E0D2] mb-4">
              DOI registration unavailable in this environment.
            </div>
            <button
              onClick={() => setShowDoiModal(false)}
              className="w-full py-2 bg-[#1C1917] text-[#F4F0E8] rounded font-mono text-xs hover:bg-[#24201D]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
