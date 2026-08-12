'use client';

import React, { useState } from 'react';
import { Paper } from '@/types';
import { useApp } from '@/lib/services/store';
import { X, GitFork, ArrowDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForkModalProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ForkModal: React.FC<ForkModalProps> = ({ paper, isOpen, onClose }) => {
  const { forkPaper, currentUser } = useApp();
  const router = useRouter();
  const [changesSummary, setChangesSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdFork, setCreatedFork] = useState<Paper | null>(null);

  if (!isOpen || !paper) return null;

  const handleFork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changesSummary.trim()) return;

    setIsSubmitting(true);
    const newFork = forkPaper(paper.id, changesSummary);
    setIsSubmitting(false);

    if (newFork) {
      setCreatedFork(newFork);
    }
  };

  const handleGoToFork = () => {
    if (createdFork) {
      onClose();
      router.push(`/papers/${createdFork.slug}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#151311] border border-white/15 rounded-xl shadow-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#746F69] hover:text-[#F4F0E8] p-1 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <GitFork className="w-5 h-5 text-[#FFFFFF]" />
          <h2 className="text-xl serif-title text-[#F4F0E8]">Fork Research Manuscript</h2>
        </div>
        <p className="text-sm text-[#A8A198] mb-6">
          Forking creates an immutable derivative research branch that preserves original author provenance while allowing you to extend mathematical derivations, code, or experimental models.
        </p>

        {/* Lineage Diagram */}
        <div className="bg-[#0D0C0B] border border-white/10 rounded-lg p-4 mb-6">
          <div className="text-xs font-mono text-[#746F69] mb-1">ORIGINAL ANCESTOR</div>
          <div className="text-sm font-semibold text-[#F4F0E8]">{paper.title}</div>
          <div className="text-xs text-[#A8A198] mb-3">By {paper.authors.map(a => a.name).join(', ')} ({paper.currentVersion})</div>

          <div className="flex justify-center my-1 text-[#FFFFFF]">
            <ArrowDown className="w-4 h-4" />
          </div>

          <div className="text-xs font-mono text-[#FFFFFF] mb-1">YOUR DERIVATIVE FORK</div>
          <div className="text-sm font-semibold text-[#E8E0D2]">By {currentUser.name}</div>
          <div className="text-xs text-[#746F69]">Branch status: Active Draft</div>
        </div>

        {createdFork ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mb-3 border border-emerald-500/40">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif text-[#F4F0E8] mb-2">Fork Successfully Created!</h3>
            <p className="text-xs text-[#A8A198] mb-6">
              Derivative manuscript registered with original lineage attributes.
            </p>
            <button
              onClick={handleGoToFork}
              className="w-full py-2.5 bg-[#FFFFFF] hover:bg-[#FFFFFF] text-black rounded-md text-sm font-mono font-medium transition-colors"
            >
              Open Derivative Manuscript
            </button>
          </div>
        ) : (
          <form onSubmit={handleFork}>
            <div className="mb-6">
              <label className="block text-xs font-mono text-[#A8A198] mb-2 uppercase tracking-wide">
                Summary of Research Modifications / Extension Objectives *
              </label>
              <textarea
                required
                rows={3}
                value={changesSummary}
                onChange={e => setChangesSummary(e.target.value)}
                placeholder="Describe what mathematical derivations, code fixes, or experimental variations you are introducing in this derivative fork..."
                className="w-full bg-[#0D0C0B] border border-white/10 rounded-lg p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#FFFFFF] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#1C1917] hover:bg-[#24201D] text-[#A8A198] rounded-md text-xs font-mono transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !changesSummary.trim()}
                className="px-5 py-2 bg-[#FFFFFF] hover:bg-[#FFFFFF] text-black rounded-md text-xs font-mono font-medium transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                <GitFork className="w-4 h-4" />
                <span>Create Fork Branch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

