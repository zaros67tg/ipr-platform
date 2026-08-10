'use client';

import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">
          Legal Framework · Covenant
        </p>
        <h1
          className="font-display text-white leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="font-ui text-[13px] text-white/40 max-w-2xl mt-4">
          Effective Date: January 1, 2026 · Governing the open research ecosystem and peer review commons of IPR.
        </p>
      </div>

      {/* Clauses */}
      <div className="space-y-10 max-w-4xl font-ui text-sm text-white/70 leading-relaxed">
        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Independent Press of Republic (IPR) platform, including manuscript submission, peer review workspaces, researcher matchmaking, or citation networks, you agree to be bound by these Terms &amp; Conditions. If you do not agree to all terms, you may not access or participate in the network.
          </p>
        </section>

        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">2. Open Access &amp; Copyright Licensing</h2>
          <p>
            All research papers, preprints, datasets, and mathematical derivations submitted to IPR are published under open access licenses (by default Creative Commons Attribution 4.0 International — CC-BY-4.0). Authors retain ownership of their intellectual property while granting IPR a perpetual, non-exclusive, worldwide license to index, display, and archive their contributions.
          </p>
        </section>

        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">3. Reciprocal Peer Review Commons</h2>
          <p>
            IPR operates on a "Give to Get" reciprocal review credit economy. Peer reviews must meet the minimum standard of technical depth (300+ words of constructive criticism, mathematical evaluation, or code verification). Attempting to game, automate, or spam the peer review ledger will result in credit forfeiture and account suspension.
          </p>
        </section>

        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">4. Academic Integrity &amp; Plagiarism</h2>
          <p>
            Submissions must represent original scientific work. Plagiarism, data fabrication, or failure to disclose co-authorship constitutes grounds for immediate retraction and permanent exclusion from the IPR research registry.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">5. Limitation of Liability</h2>
          <p>
            IPR provides the publishing platform "as is" without warranties of any kind. Authors and researchers are solely responsible for the technical accuracy and safety of their published algorithms, code repositories, and physical experiment claims.
          </p>
        </section>
      </div>
    </div>
  );
}
