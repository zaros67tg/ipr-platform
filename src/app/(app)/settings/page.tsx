'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/services/store';
import { Settings, User, Bell, Lock, ShieldCheck, Check } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useApp();
  const [saved, setSaved] = useState(false);
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [researchStatement, setResearchStatement] = useState(currentUser.researchStatement);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto font-mono text-xs">
      <div className="border-b border-white/10 pb-6">
        <span className="text-xs text-[#FFFFFF] uppercase font-bold tracking-wider">PREFERENCES & CREDS</span>
        <h1 className="text-3xl serif-title text-[#F4F0E8] mt-1 font-sans">Researcher Settings</h1>
      </div>

      {saved && (
        <div className="p-4 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-center animate-in fade-in">
          Researcher dossier preferences saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="ipr-card p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">RESEARCHER NAME</label>
          <input
            type="text"
            disabled
            value={currentUser.name}
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#746F69] cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">INSTITUTIONAL AFFILIATION</label>
          <input
            type="text"
            value={institution}
            onChange={e => setInstitution(e.target.value)}
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#FFFFFF]"
          />
        </div>

        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">RESEARCH STATEMENT</label>
          <textarea
            rows={3}
            value={researchStatement}
            onChange={e => setResearchStatement(e.target.value)}
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#FFFFFF] font-serif italic resize-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#F4F0E8] rounded font-bold transition-colors inline-flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}

