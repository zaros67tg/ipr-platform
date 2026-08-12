'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { formatDate } from '@/lib/utils/format';

export default function ReviewsDashboardPage() {
  const { transactions, papers, availableCredits } = useApp();
  const [showDoiModal, setShowDoiModal] = useState(false);

  const isEligibleForSubmission = availableCredits >= 3;
  const isEligibleForDOI = availableCredits >= 5;
  const isEligibleForFeatured = availableCredits >= 10;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">
            Pillar II · Reciprocal Review Economy
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
          >
            Review Credit Ledger
          </h1>
          <p className="font-ui text-[13px] text-white/40 max-w-2xl mt-4">
            &ldquo;Give to Get.&rdquo; Earn Review Credits by completing 300+ word verified peer reviews before submitting manuscripts for community review.
          </p>
        </div>

        <Link
          href="/submit"
          className="bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-3 font-bold uppercase tracking-widest text-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Manuscript (3 Credits)</span>
        </Link>
      </div>

      {/* CREDIT BALANCE DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
        <div className="bg-black p-6 space-y-2 border-l-2 border-l-white">
          <div className="font-ui text-[10px] text-white/30 uppercase tracking-widest">AVAILABLE CREDITS</div>
          <div className="font-display text-4xl font-bold text-white">{availableCredits.toString().padStart(2, '0')}</div>
          <div className="font-ui text-[11px] text-white/70">
            {isEligibleForSubmission ? '✓ Eligible for Submission' : 'Need 3 Credits to Submit'}
          </div>
        </div>

        <div className="bg-black p-6 space-y-2">
          <div className="font-ui text-[10px] text-white/30 uppercase tracking-widest">TOTAL CREDITS EARNED</div>
          <div className="font-display text-3xl font-bold text-white">14</div>
          <div className="font-ui text-[11px] text-white/50">From 14 Completed Reviews</div>
        </div>

        <div className="bg-black p-6 space-y-2">
          <div className="font-ui text-[10px] text-white/30 uppercase tracking-widest">CREDITS SPENT</div>
          <div className="font-display text-3xl font-bold text-white">07</div>
          <div className="font-ui text-[11px] text-white/50">On 2 Manuscript Submissions</div>
        </div>

        <div className="bg-black p-6 space-y-2">
          <div className="font-ui text-[10px] text-white/30 uppercase tracking-widest">AVERAGE REVIEW QUALITY</div>
          <div className="font-display text-3xl font-bold text-white">94%</div>
          <div className="font-ui text-[11px] text-white/50">Technical Depth &amp; Specificity</div>
        </div>
      </div>

      {/* UNLOCK THRESHOLDS */}
      <div className="border border-white/10 p-8 space-y-6">
        <h3 className="font-ui text-[11px] font-bold text-white uppercase tracking-[0.25em]">
          Contribution Unlock Thresholds
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-ui text-xs">
          <div className={`p-5 border ${isEligibleForSubmission ? 'border-white bg-white/5' : 'border-white/10 bg-black'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white uppercase tracking-widest">3 CREDITS</span>
              {isEligibleForSubmission ? <CheckCircle2 className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white/30" />}
            </div>
            <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">FREE COMMUNITY MANUSCRIPT REVIEW</div>
            <p className="text-[12px] text-white/50 leading-relaxed">Unlocks submission of 1 paper manuscript for peer review.</p>
          </div>

          <div className={`p-5 border ${isEligibleForDOI ? 'border-white bg-white/5' : 'border-white/10 bg-black'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white uppercase tracking-widest">5 CREDITS</span>
              {isEligibleForDOI ? <CheckCircle2 className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white/30" />}
            </div>
            <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">DOI PUBLICATION EXPORT WORKFLOW</div>
            <p className="text-[12px] text-white/50 leading-relaxed">Prepares publication metadata for DOI provider registration.</p>
            {isEligibleForDOI && (
              <button
                onClick={() => setShowDoiModal(true)}
                className="mt-3 text-[11px] text-white underline hover:opacity-80"
              >
                Trigger DOI Metadata Workflow →
              </button>
            )}
          </div>

          <div className={`p-5 border ${isEligibleForFeatured ? 'border-white bg-white/5' : 'border-white/10 bg-black'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-white uppercase tracking-widest">10 CREDITS</span>
              {isEligibleForFeatured ? <CheckCircle2 className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white/30" />}
            </div>
            <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wide">HIGH-VISIBILITY FEATURED PLACEMENT</div>
            <p className="text-[12px] text-white/50 leading-relaxed">Features your research paper on the homepage editorial hero section.</p>
          </div>
        </div>
      </div>

      {/* OPEN MANUSCRIPTS SEEKING REVIEWS */}
      <div className="space-y-6">
        <h2 className="font-display text-white text-3xl font-bold tracking-tight">Manuscripts Open for Peer Review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.slice(0, 2).map(pap => (
            <div key={pap.id} className="border border-white/10 p-6 space-y-4 bg-black">
              <div className="flex items-center justify-between">
                <DisciplineTag domain={pap.primaryDomain} size="sm" />
                <span className="font-ui text-[10px] text-white/70 font-bold uppercase tracking-widest">+1 CREDIT UPON QUALIFYING REVIEW</span>
              </div>
              <h3 className="font-display text-white text-xl font-bold leading-snug">{pap.title}</h3>
              <p className="font-display italic text-xs text-white/50 line-clamp-2">&ldquo;{pap.abstract}&rdquo;</p>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between font-ui text-xs">
                <span className="text-white/40">Min 300 words required</span>
                <Link
                  href={`/reviews/${pap.id}`}
                  className="px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors font-ui text-[11px] uppercase tracking-widest"
                >
                  Open Workspace →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* IMMUTABLE TRANSACTION LEDGER */}
      <div className="space-y-6">
        <h2 className="font-display text-white text-3xl font-bold tracking-tight">Review Credit Ledger</h2>
        <div className="border border-white/10 bg-black overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-ui text-xs">
              <thead className="border-b border-white/10 text-white/40 uppercase tracking-widest bg-white/5">
                <tr>
                  <th className="p-4">TRANSACTION ID</th>
                  <th className="p-4">TYPE</th>
                  <th className="p-4">AMOUNT</th>
                  <th className="p-4">REASON</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4">BALANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/40 font-mono">{tx.id}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest border ${
                        tx.amount > 0 ? 'border-white text-white bg-white/10' : 'border-white/20 text-white/50'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${tx.amount > 0 ? 'text-white' : 'text-white/50'}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="p-4 text-xs max-w-xs truncate">{tx.reason}</td>
                    <td className="p-4 text-white/40">{formatDate(tx.timestamp)}</td>
                    <td className="p-4 font-bold text-white">{tx.balanceAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DOI Workflow Modal */}
      {showDoiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="w-full max-w-lg bg-black border border-white p-8 space-y-6">
            <h3 className="font-display text-white text-2xl font-bold">DOI Registration Workflow</h3>
            <p className="font-ui text-xs text-white/60">
              Metadata package prepared for registration with Crossref/Datacite.
            </p>
            <div className="p-4 border border-white/20 font-ui text-xs text-white/70">
              DOI registration unavailable in this environment.
            </div>
            <button
              onClick={() => setShowDoiModal(false)}
              className="w-full py-3 border border-white text-white hover:bg-white hover:text-black font-ui text-xs uppercase tracking-widest transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
