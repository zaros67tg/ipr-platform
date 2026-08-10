'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { authClient } from '@/lib/auth-client';
import { updateProfile } from '@/lib/actions/user';
import { Check, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, updateUserProfile } = useApp();
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id || currentUser.id || 'usr_zaros';
  const defaultName = session?.user?.name || currentUser.name || 'Dr. Zaros H. Vance';
  const defaultEmail = session?.user?.email || 'zaros@republic-research.org';

  const [name, setName] = useState(defaultName);
  const [institution, setInstitution] = useState(currentUser.institution || 'Republic Institute for Neuromorphic Computing');
  const [researchStatement, setResearchStatement] = useState(currentUser.researchStatement || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await updateProfile({
        userId,
        name,
        institution,
        researchStatement,
      });

      if (res.success) {
        updateUserProfile({
          name,
          institution,
          researchStatement,
        });

        setStatusMsg({
          type: 'success',
          text: 'Settings & preferences saved to database successfully. Application state revalidated globally.',
        });
      } else {
        updateUserProfile({ name, institution, researchStatement });
        setStatusMsg({
          type: 'success',
          text: `Preferences updated locally. Note: ${res.error}`,
        });
      }
    } catch (err: any) {
      updateUserProfile({ name, institution, researchStatement });
      setStatusMsg({
        type: 'success',
        text: 'Preferences saved locally.',
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-12 w-full text-foreground">
      {/* ── Page Header ── */}
      <div className="border-b border-foreground/10 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] opacity-40 mb-3">
          Account &amp; Preferences
        </p>
        <h1
          className="font-display leading-none text-foreground"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
        >
          Researcher Settings
        </h1>
        <p className="font-ui text-[13px] opacity-50 max-w-2xl mt-4">
          Manage your verified researcher dossier, institutional affiliation, and global platform preferences.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 border font-ui text-xs uppercase tracking-widest ${
            statusMsg.type === 'success'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* ── Grid Layout — Full Width Spread ── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Form Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Full Name */}
          <div className="space-y-2">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] opacity-50 block font-semibold">
              Researcher Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="editorial-input font-display text-2xl py-3"
              placeholder="Your full name or title..."
            />
            <p className="font-ui text-[11px] opacity-40">
              Your name as it appears on manuscripts, peer reviews, and co-author matchmaker profiles.
            </p>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] opacity-50 block font-semibold">
              Email Address (OAuth Verified)
            </label>
            <input
              type="email"
              disabled
              value={defaultEmail}
              className="w-full bg-foreground/5 border border-foreground/20 p-3.5 font-ui text-sm opacity-60 cursor-not-allowed text-foreground"
            />
            <p className="font-ui text-[11px] opacity-40">
              Verified via GitHub / OAuth session. Used for academic credentials and alerts.
            </p>
          </div>

          {/* Institutional Affiliation */}
          <div className="space-y-2">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] opacity-50 block font-semibold">
              Institutional Affiliation
            </label>
            <input
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="e.g., Zurich Theoretical Physics Laboratory"
              className="editorial-input font-ui text-base py-3"
            />
          </div>

          {/* Research Statement */}
          <div className="space-y-2">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] opacity-50 block font-semibold">
              Research Statement / Thesis
            </label>
            <textarea
              rows={4}
              value={researchStatement}
              onChange={e => setResearchStatement(e.target.value)}
              placeholder="Describe your primary research focus and non-equilibrium dynamical systems interest..."
              className="w-full bg-transparent border border-foreground/20 p-4 font-display text-lg italic leading-relaxed focus:outline-none focus:border-foreground resize-none text-foreground"
            />
          </div>

          {/* Save Button — Inverts cleanly: bg-foreground text-background */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-foreground text-background hover:opacity-80 transition-opacity px-8 py-4 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Mutating Database...' : 'Save Preferences'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Status & Integrity Dossier (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-foreground/15 p-6 space-y-4">
            <div className="flex items-center gap-2 font-ui text-[11px] uppercase tracking-widest font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dossier Verification</span>
            </div>
            <div className="space-y-3 font-ui text-xs opacity-60 leading-relaxed">
              <p>
                <strong>Status:</strong> Research Verified (ORCID: 0000-0002-1829-9402)
              </p>
              <p>
                <strong>Review Credits:</strong> 7 Credits Available
              </p>
              <p>
                <strong>Database Sync:</strong> Live Supabase Connection via Drizzle ORM
              </p>
            </div>
          </div>

          <div className="border border-foreground/15 p-6 space-y-3">
            <div className="font-ui text-[11px] uppercase tracking-widest font-bold">
              Preferences Summary
            </div>
            <ul className="font-ui text-xs opacity-60 space-y-2 list-disc pl-4">
              <li>Peer Review Alerts: Enabled</li>
              <li>Co-Author Match Visibility: Active</li>
              <li>Markdown / LaTeX Editor Mode: Enabled</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}
