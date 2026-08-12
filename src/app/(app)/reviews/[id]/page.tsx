'use client';

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { MathRenderer } from '@/components/common/MathRenderer';
import { Recommendation } from '@/types';
import { Award, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ReviewerWorkspacePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { papers, submitReview } = useApp();

  const paperIdFromQuery = searchParams?.get('paperId');
  const paper = papers.find(p => p.id === params?.id || p.id === paperIdFromQuery || p.slug === params?.id);

  const [summary, setSummary] = useState('');
  const [methodology, setMethodology] = useState('');
  const [mathematicalConcerns] = useState('');
  const [technicalConcerns] = useState('');
  const [codeConcerns] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [suggestions] = useState('');
  const [recommendation, setRecommendation] = useState<Recommendation>('ACCEPT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!paper) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="font-display text-3xl text-white">Manuscript not found</h1>
          <Link href="/reviews" className="inline-block font-ui text-xs uppercase tracking-widest border border-white px-5 py-2.5 text-white hover:bg-white hover:text-black transition-colors">
            Back to Reviews
          </Link>
        </div>
      </div>
    );
  }

  const fullText = `${summary} ${methodology} ${mathematicalConcerns} ${technicalConcerns} ${codeConcerns} ${strengths} ${weaknesses} ${suggestions}`;
  const wordCount = fullText.trim().match(/\b[a-zA-Z0-9]+\b/g)?.length || 0;
  const isWordCountValid = wordCount >= 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await submitReview({
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
      setIsSubmitting(false);
    } else {
      setSuccessMsg(res.message);
      setTimeout(() => {
        router.push('/reviews');
      }, 2000);
    }
  } catch {
    setIsSubmitting(false);
    setErrorMsg('Failed to submit review. Please try again.');
  }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/reviews" className="inline-flex items-center gap-2 text-xs font-ui uppercase tracking-widest text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Review Workspace</span>
        </Link>

        <div className="flex items-center gap-4 text-xs font-ui">
          <span className="text-white/40">MANUSCRIPT: <strong className="text-white">{paper.title}</strong></span>
          <span className={`px-3 py-1 uppercase tracking-widest border font-bold ${
            isWordCountValid ? 'bg-white text-black border-white' : 'border-white/20 text-white/60 bg-black'
          }`}>
            {wordCount} / 300 WORDS {isWordCountValid ? '✓' : '(MIN REQUIRED)'}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 border border-white bg-white/10 text-white font-ui text-xs uppercase tracking-widest text-center">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 border border-white/30 text-white/70 font-ui text-xs uppercase tracking-widest text-center">
          {errorMsg}
        </div>
      )}

      {/* 3-PANE REVIEWER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANE 1: OUTLINE (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-black border border-white/10 space-y-4 sticky top-24 font-ui text-xs">
          <div className="text-[10px] text-white/35 uppercase font-bold tracking-widest">PAPER OUTLINE</div>
          <div className="space-y-2 text-white/60">
            <a href="#abstract" className="block py-1 hover:text-white transition-colors">1. Abstract</a>
            <a href="#sec-1" className="block py-1 hover:text-white transition-colors">2. LIF Equations</a>
            <a href="#sec-2" className="block py-1 hover:text-white transition-colors">3. Lyapunov Proof</a>
            <a href="#sec-3" className="block py-1 hover:text-white transition-colors">4. C++ LIF Kernel</a>
          </div>
        </div>

        {/* PANE 2: MANUSCRIPT CONTENT (5 Cols) */}
        <div className="lg:col-span-5 p-6 bg-black border border-white/10 space-y-6 max-h-[80vh] overflow-y-auto">
          <div>
            <span className="text-[10px] font-ui text-white/40 uppercase tracking-widest block mb-1">READING PANE</span>
            <h2 className="font-display text-2xl text-white font-bold leading-tight mb-2">{paper.title}</h2>
            <p className="font-ui text-xs text-white/40">By {paper.authors.map(a => a.name).join(', ')}</p>
          </div>

          <div id="abstract" className="p-4 border border-white/10 space-y-2">
            <span className="text-[10px] font-ui text-white/40 uppercase tracking-widest block">Abstract</span>
            <p className="font-display text-xs text-white/80 italic leading-relaxed">{paper.abstract}</p>
          </div>

          {paper.versions[0]?.blocks.map(block => (
            <div key={block.id} className="space-y-2">
              {block.type === 'heading' && (
                <h3 className="font-display text-lg font-bold text-white pt-3 border-b border-white/10">
                  {block.content}
                </h3>
              )}
              {block.type === 'paragraph' && (
                <p className="font-display text-sm text-white/80 leading-relaxed">{block.content}</p>
              )}
              {block.type === 'equation' && (
                <div className="py-3 text-center bg-black border border-white/10 my-2">
                  <MathRenderer latex={block.metadata?.latex || block.content} />
                </div>
              )}
              {block.type === 'code' && (
                <pre className="p-4 bg-black border border-white/10 text-xs font-ui text-white/70 overflow-x-auto my-2">
                  <code>{block.content}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* PANE 3: ANNOTATION & EVALUATION WORKSPACE (5 Cols) */}
        <div className="lg:col-span-5 p-6 bg-black border border-white/20 space-y-6 max-h-[80vh] overflow-y-auto font-ui text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-white" />
              <span>Peer Review Evaluation</span>
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-white/40">Reciprocal Credit Workflow</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="uppercase tracking-widest font-bold text-white/60 text-[10px] block">Summary &amp; Key Findings</label>
              <textarea
                rows={3}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Summarize the paper's core hypothesis and main conclusions..."
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="uppercase tracking-widest font-bold text-white/60 text-[10px] block">Methodology &amp; Mathematical Rigor</label>
              <textarea
                rows={3}
                value={methodology}
                onChange={e => setMethodology(e.target.value)}
                placeholder="Evaluate the formal derivations, mathematical stability, or empirical design..."
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="uppercase tracking-widest font-bold text-white/60 text-[10px] block">Strengths &amp; Technical Merits</label>
              <textarea
                rows={3}
                value={strengths}
                onChange={e => setStrengths(e.target.value)}
                placeholder="Highlight novel contributions or hardware/algorithm optimizations..."
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="uppercase tracking-widest font-bold text-white/60 text-[10px] block">Weaknesses &amp; Constructive Suggestions</label>
              <textarea
                rows={3}
                value={weaknesses}
                onChange={e => setWeaknesses(e.target.value)}
                placeholder="Point out missing baselines, unaddressed edge cases, or clarity issues..."
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="uppercase tracking-widest font-bold text-white/60 text-[10px] block">Recommendation</label>
              <select
                value={recommendation}
                onChange={e => setRecommendation(e.target.value as Recommendation)}
                className="w-full bg-black border border-white/20 p-3 text-white focus:outline-none focus:border-white uppercase tracking-widest"
              >
                <option value="ACCEPT">ACCEPT (Publish as is)</option>
                <option value="MINOR_REVISION">MINOR REVISION (Accept conditionally)</option>
                <option value="MAJOR_REVISION">MAJOR REVISION (Requires re-review)</option>
                <option value="REJECT">REJECT (Insufficient novelty / flawed)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!isWordCountValid || isSubmitting}
              className={`w-full py-3.5 border font-bold uppercase tracking-widest text-xs transition-colors cursor-pointer ${
                isWordCountValid && !isSubmitting
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-black text-white/30 border-white/10 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</span>
              ) : (
                'Submit Peer Review & Earn +1 Credit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
