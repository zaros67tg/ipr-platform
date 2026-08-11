'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { authClient } from '@/lib/auth-client';
import { updateProfile } from '@/lib/actions/profile';
import { Check, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser, updateCurrentUserProfile } = useApp();
  const { data: session } = authClient.useSession();
  
  const [name, setName] = useState(session?.user?.name || currentUser.name || '');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [researchStatement, setResearchStatement] = useState(currentUser.researchStatement || '');
  const [isPending, setIsPending] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const userEmail = session?.user?.email || 'zaros@republic-research.org';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMsg(null);

    const formData = new FormData();
    // SECURITY: userId is NOT sent to the server — the authenticated session
    // on the server side determines the target user.
    formData.append('name', name);
    formData.append('institution', institution);
    formData.append('researchStatement', researchStatement);

    const res = await updateProfile(formData);
    setIsPending(false);

    if (res.success) {
      updateCurrentUserProfile({
        name: name.trim(),
        institution: institution.trim(),
        researchStatement: researchStatement.trim(),
      });
      setMsg({ type: 'success', text: '✓ Settings & preferences updated in database globally.' });
      setTimeout(() => setMsg(null), 4000);
    } else {
      setMsg({ type: 'error', text: `Failed to save: ${res.message}` });
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-28 pb-20 space-y-10">
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
          Manage your verified researcher profile, institutional affiliations, and database preferences.
        </p>
      </div>

      {msg && (
        <div className={`p-4 border font-ui text-xs uppercase tracking-widest text-center ${
          msg.type === 'success' ? 'border-white bg-white/10 text-white' : 'border-white/40 bg-white/5 text-white/70'
        }`}>
          {msg.text}
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-10 max-w-3xl">
        {/* Researcher Name */}
        <div className="space-y-3">
          <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
            Researcher Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Dr. Zaros H. Vance"
            className="editorial-input font-ui text-sm text-white py-3"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-3">
          <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
            Email Address (OAuth Verified)
          </label>
          <input
            type="email"
            disabled
            value={userEmail}
            className="w-full bg-black border border-white/20 p-3.5 font-ui text-sm text-white/60 cursor-not-allowed"
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
            disabled={isPending}
            className="bg-white text-black hover:bg-neutral-200 transition-colors px-6 py-3 font-bold uppercase tracking-widest text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{isPending ? 'Updating Database…' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
