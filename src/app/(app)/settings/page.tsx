'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { authClient } from '@/lib/auth-client';
import { Check } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useApp();
  const { data: session } = authClient.useSession();
  
  const [saved, setSaved] = useState(false);
  const [institution, setInstitution] = useState(currentUser.institution || 'Republic Institute for Neuromorphic Computing');
  const [researchStatement, setResearchStatement] = useState(currentUser.researchStatement || '');

  const userName = session?.user?.name || currentUser.name;
  const userEmail = session?.user?.email || 'zaros@republic-research.org';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">
          Account &amp; Dossier Preferences
        </p>
        <h1
          className="font-display text-white leading-none"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
        >
          Researcher Settings
        </h1>
        <p className="font-ui text-[13px] text-white/40 max-w-2xl mt-4">
          Manage your verified researcher profile, institutional affiliations, and publication preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 border border-white bg-white/10 text-white font-ui text-xs uppercase tracking-widest text-center">
          ✓ Researcher dossier preferences saved successfully.
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
        {/* Researcher Name */}
        <div className="space-y-3">
          <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
            Researcher Name (GitHub Authenticated)
          </label>
          <input
            type="text"
            disabled
            value={userName}
            className="w-full bg-black border border-white/20 p-3.5 font-ui text-sm text-white/80 cursor-not-allowed"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-3">
          <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
            Email Address (Verified)
          </label>
          <input
            type="email"
            disabled
            value={userEmail}
            className="w-full bg-black border border-white/20 p-3.5 font-ui text-sm text-white/80 cursor-not-allowed"
          />
        </div>

        {/* Institutional Affiliation */}
        <div className="space-y-3">
          <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
            Institutional Affiliation
          </label>
          <input
            type="text"
            value={institution}
            onChange={e => setInstitution(e.target.value)}
            placeholder="e.g. Zurich Theoretical Physics Laboratory"
            className="editorial-input font-ui text-sm text-white py-3"
          />
        </div>

        {/* Research Statement */}
        <div className="space-y-3">
          <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
            Research Statement / Thesis
          </label>
          <textarea
            rows={4}
            value={researchStatement}
            onChange={e => setResearchStatement(e.target.value)}
            placeholder="Describe your primary research focus..."
            className="w-full bg-black border border-white/20 p-4 font-display text-white/90 text-lg italic leading-relaxed focus:outline-none focus:border-white resize-none"
          />
        </div>

        {/* Save Preferences Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
