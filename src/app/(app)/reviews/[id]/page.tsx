'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { MathRenderer } from '@/components/common/MathRenderer';
import { Recommendation } from '@/types';
import { Award, CheckCircle2, AlertCircle, ArrowLeft, FileText, Check, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ReviewerWorkspacePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { papers, submitReview, availableCredits } = useApp();

  const paperIdFromQuery = searchParams?.get('paperId');
  const paper = papers.find(p => p.id === params?.id || p.id === paperIdFromQuery || p.slug === params?.id) || papers[0];

  const [summary, setSummary] = useState('');
  const [methodology, setMethodology] = useState('');
  const [mathematicalConcerns, setMathematicalConcerns] = useState('');
  const [technicalConcerns, setTechnicalConcerns] = useState('');
  const [codeConcerns, setCodeConcerns] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation>('ACCEPT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fullText = `${summary} ${methodology} ${mathematicalConcerns} ${technicalConcerns} ${codeConcerns} ${strengths} ${weaknesses} ${suggestions}`;
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
  const isWordCountValid = wordCount >= 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = submitReview({
      paperId: paper.id,
      paperTitle: paper.title,
      paperSlug: paper.slug,
      summary,
      methodology,
      mathematicalConcerns,
      technicalConcerns,
      codeConcerns,
      strengths,
      weaknesses,
      suggestions,
      recommendation
    });

    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        router.push('/reviews');
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/reviews" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A8A198] hover:text-[#C85A32]">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Review Workspace</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#746F69]">MANUSCRIPT: <strong>{paper.title}</strong></span>
          <span className={`px-2.5 py-1 rounded font-bold ${
            isWordCountValid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-[#C85A32]/20 text-[#E89574]'
          }`}>
            {wordCount} / 300 WORDS {isWordCountValid ? '✓' : '(MIN REQUIRED)'}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-mono text-sm text-center animate-in fade-in">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-lg bg-[#C85A32]/20 border border-[#C85A32]/50 text-[#E89574] font-mono text-xs text-center">
          {errorMsg}
        </div>
      )}

      {/* 3-PANE REVIEWER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANE 1: OUTLINE (2 Cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-[#151311] border border-white/10 space-y-3 sticky top-20 text-xs font-mono">
          <div className="text-[11px] text-[#746F69] uppercase font-bold tracking-wider">PAPER OUTLINE</div>
          <div className="space-y-1.5 text-[#A8A198]">
            <a href="#abstract" className="block p-1.5 rounded hover:bg-[#1C1917] hover:text-[#F4F0E8]">1. Abstract</a>
            <a href="#sec-1" className="block p-1.5 rounded hover:bg-[#1C1917] hover:text-[#F4F0E8]">2. LIF Equations</a>
            <a href="#sec-2" className="block p-1.5 rounded hover:bg-[#1C1917] hover:text-[#F4F0E8]">3. Lyapunov Proof</a>
            <a href="#sec-3" className="block p-1.5 rounded hover:bg-[#1C1917] hover:text-[#F4F0E8]">4. C++ LIF Kernel</a>
          </div>
        </div>

        {/* PANE 2: MANUSCRIPT CONTENT (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#151311] border border-white/10 space-y-6 max-h-[80vh] overflow-y-auto font-serif">
          <div>
            <span className="text-xs font-mono text-[#C85A32] font-bold block mb-1">READING PANE</span>
            <h2 className="text-2xl serif-title text-[#F4F0E8] mb-2">{paper.title}</h2>
            <p className="text-xs font-mono text-[#746F69]">By {paper.authors.map(a => a.name).join(', ')}</p>
          </div>

          <div id="abstract" className="p-4 rounded bg-[#0D0C0B] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-[#C85A32] uppercase">Abstract</span>
            <p className="text-xs text-[#E8E0D2] italic">{paper.abstract}</p>
          </div>

          {paper.versions[0]?.blocks.map(block => (
            <div key={block.id} className="space-y-2">
              {block.type === 'heading' && (
                <h3 className="text-base font-bold text-[#F4F0E8] pt-2 border-b border-white/10 font-mono">
                  {block.content}
                </h3>
              )}
              {block.type === 'paragraph' && (
                <p className="text-sm text-[#E8E0D2] leading-relaxed">{block.content}</p>
              )}
              {block.type === 'equation' && (
                <div className="py-2 text-center bg-[#0D0C0B] rounded border border-white/5">
                  <MathRenderer latex={block.metadata?.latex || block.content} />
                </div>
              )}
              {block.type === 'code' && (
                <pre className="p-3 bg-[#0D0C0B] rounded text-xs font-mono text-[#E8E0D2] overflow-x-auto">
                  <code>{block.content}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* PANE 3: ANNOTATION & EVALUATION WORKSPACE (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#151311] border border-[#6D4C7D]/40 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-serif font-bold text-[#F4F0E8] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#6D4C7D]" />
              Peer Review Annotation Form
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">+1 CREDIT</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#A8A198] mb-1 font-bold">1. Manuscript Summary *</label>
              <textarea
                required
                rows={2}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Provide a concise summary of the core thesis, math derivations, or experimental findings..."
                className="w-full bg-[#0D0C0B] border border-white/10 rounded p-2.5 text-[#F4F0E8] focus:outline-none focus:border-[#6D4C7D]"
              />
            </div>

            <div>
              <label className="block text-[#A8A198] mb-1 font-bold">2. Methodology & Scientific Rigor *</label>
              <textarea
                required
                rows={2}
                value={methodology}
                onChange={e => setMethodology(e.target.value)}
                placeholder="Assess experimental controls, sampling size, assumptions, or mathematical validity..."
                className="w-full bg-[#0D0C0B] border border-white/10 rounded p-2.5 text-[#F4F0E8] focus:outline-none focus:border-[#6D4C7D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A8A198] mb-1 font-bold">Mathematical Concerns</label>
                <textarea
                  rows={2}
                  value={mathematicalConcerns}
                  onChange={e => setMathematicalConcerns(e.target.value)}
                  placeholder="Identify missing variable definitions or invalid steps in derivations..."
                  className="w-full bg-[#0D0C0B] border border-white/10 rounded p-2.5 text-[#F4F0E8] focus:outline-none focus:border-[#6D4C7D]"
                />
              </div>
              <div>
                <label className="block text-[#A8A198] mb-1 font-bold">Code & Reproducibility</label>
                <textarea
                  rows={2}
                  value={codeConcerns}
                  onChange={e => setCodeConcerns(e.target.value)}
                  placeholder="Assess C++/Rust code cleanliness, memory safety, thread barriers..."
                  className="w-full bg-[#0D0C0B] border border-white/10 rounded p-2.5 text-[#F4F0E8] focus:outline-none focus:border-[#6D4C7D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A8A198] mb-1 font-bold">Key Strengths & Actionable Weaknesses *</label>
              <textarea
                required
                rows={2}
                value={strengths}
                onChange={e => setStrengths(e.target.value)}
                placeholder="Highlight unique theoretical contributions and outline required revisions..."
                className="w-full bg-[#0D0C0B] border border-white/10 rounded p-2.5 text-[#F4F0E8] focus:outline-none focus:border-[#6D4C7D]"
              />
            </div>

            {/* Recommendation Radio */}
            <div>
              <label className="block text-[#A8A198] mb-2 font-bold uppercase">Final Recommendation *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT'] as const).map(rec => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setRecommendation(rec)}
                    className={`py-2 px-2 rounded text-[11px] font-bold border transition-colors ${
                      recommendation === rec 
                        ? 'bg-[#6D4C7D] text-[#F4F0E8] border-purple-400' 
                        : 'bg-[#0D0C0B] text-[#A8A198] border-white/10 hover:text-[#F4F0E8]'
                    }`}
                  >
                    {rec.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isWordCountValid}
              className="w-full py-3 bg-[#6D4C7D] hover:bg-[#5B3E6A] text-[#F4F0E8] font-bold rounded-lg text-xs font-mono shadow-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Peer Review (+1 Credit)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
