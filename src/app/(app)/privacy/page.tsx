'use client';

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">
          Data Governance · Transparency
        </p>
        <h1
          className="font-display text-white leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
        >
          Privacy Policy
        </h1>
        <p className="font-ui text-[13px] text-white/40 max-w-2xl mt-4">
          Last Updated: January 1, 2026 · Respecting researcher sovereignty and data minimization.
        </p>
      </div>

      {/* Clauses */}
      <div className="space-y-10 max-w-4xl font-ui text-sm text-white/70 leading-relaxed">
        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">1. Information We Collect</h2>
          <p>
            We collect minimal necessary information to operate the research network:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li><strong>Account Data:</strong> Name, email, handle, and avatar provided via GitHub authentication.</li>
            <li><strong>Researcher Dossier Data:</strong> Institutional affiliation, research statements, ORCID identifiers, and declared primary domains.</li>
            <li><strong>Content Data:</strong> Manuscript text, LaTeX equations, code repository links, and peer review logs.</li>
          </ul>
        </section>

        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">2. How We Use Information</h2>
          <p>
            Your information is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-white/60">
            <li>Attribute scientific publications and peer reviews accurately.</li>
            <li>Power the Vitra Matchmaker algorithm for co-author recommendations.</li>
            <li>Maintain the immutable review credit ledger and reputation metrics.</li>
          </ul>
        </section>

        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">3. Data Sharing &amp; Open Access</h2>
          <p>
            Public contributions (published papers, public reviews, and co-author match profiles) are visible to the network. We never sell, rent, or monetize researcher data to third-party ad networks or data brokers.
          </p>
        </section>

        <section className="space-y-3 border-b border-white/8 pb-8">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">4. Cookies &amp; Local Storage</h2>
          <p>
            IPR uses essential session storage and local state for authentication and state synchronization. We do not employ cross-site tracking cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-white text-2xl font-bold tracking-tight">5. Your Rights &amp; Data Control</h2>
          <p>
            You retain the right to update your profile data, export your submitted manuscripts, or request complete deletion of your account credentials at any time by contacting governance@ipr.org.
          </p>
        </section>
      </div>
    </div>
  );
}
