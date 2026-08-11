'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { ArrowLeft, BookOpen, UploadCloud, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getTopics, createCustomTopic } from '@/lib/actions/topics';
import { motion } from 'framer-motion';
import type { ResearchDomain } from '@/types';

export default function SubmitPage() {
  const { submitPaper } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [topicsList, setTopicsList] = useState<string[]>([
    'Theoretical Physics', 'Systems Programming', 'Neuroscience', 'Robotics',
    'Mathematics', 'Artificial Intelligence', 'Quantum Computing',
    'Spiking Neural Networks', 'Quantum Gravity', 'Bioinformatics'
  ]);
  const [primaryDomain, setPrimaryDomain] = useState('Systems Programming');
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [keywords, setKeywords] = useState('');
  const [license, setLicense] = useState('CC-BY-4.0');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  // FIX (double-submission): block duplicate submits while a request is in flight
  const [isSubmitting, setIsSubmitting] = useState(false);

  const TITLE_LIMIT = 180;
  const ABSTRACT_LIMIT = 3000;

  useEffect(() => {
    getTopics().then(list => { if (list?.length) setTopicsList(list); });
  }, []);

  const handleAddCustomTopic = async () => {
    if (!customTopicInput.trim()) return;
    const name = customTopicInput.trim();
    if (!topicsList.includes(name)) {
      setTopicsList(prev => [...prev, name]);
      setPrimaryDomain(name);
      await createCustomTopic(name);
    }
    setCustomTopicInput('');
  };

  const handleFileUpload = async (file: File) => {
    setIsParsing(true);
    setErrorMsg(null);
    try {
      const text = await file.text();
      const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^Title:\s+(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : file.name.replace(/\.[^/.]+$/, '');
      const abstractMatch = text.match(/(?:Abstract|ABSTRACT)[:\n]+([\s\S]{50,600}?)(?:\n\n|\n#)/i);
      const extractedAbstract = abstractMatch ? abstractMatch[1].trim() : text.slice(0, 450).trim();
      setTitle(extractedTitle.slice(0, TITLE_LIMIT));
      setAbstract(extractedAbstract.slice(0, ABSTRACT_LIMIT));
      setContentMarkdown(text);
    } catch {
      setErrorMsg('Failed to parse file. Please paste content directly.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await submitPaper({
        title, abstract,
        primaryDomain: primaryDomain as ResearchDomain,
        subdomains: [],
        keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
        license,
        repositoryUrl: repositoryUrl.trim() || undefined,
        contentMarkdown,
      });
      if (!res.success) {
        setErrorMsg(res.message);
        setIsSubmitting(false);
        return;
      }
      if (res.paper) router.push(`/papers/${res.paper.slug}`);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Failed to submit manuscript. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page header */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-8">
        <Link href="/papers" className="inline-flex items-center gap-2 font-ui text-[11px] text-white/40 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Manuscripts
        </Link>
        <div className="max-w-2xl mx-auto">
          <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-3">Manuscript Submission</p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
          >
            Submit Your Work
          </h1>
        </div>
      </div>

      {/* Form — centered max-w-2xl */}
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-14">

        {/* Drag & Drop Zone — huge and inviting */}
        <motion.div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={e => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
          animate={{ borderColor: isDragOver ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.15)' }}
          className="relative border-2 border-dashed border-white/15 p-16 text-center transition-colors"
        >
          <input
            type="file" accept=".pdf,.docx,.md,.txt"
            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="pointer-events-none space-y-4">
            <UploadCloud className={`w-12 h-12 mx-auto transition-colors ${isDragOver ? 'text-white' : 'text-white/30'}`} />
            <p
              className="font-display text-white/70 leading-tight"
              style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              {isParsing ? 'Parsing manuscript…' : 'Drop your paper here'}
            </p>
            <p className="font-ui text-[12px] text-white/30">
              .pdf · .docx · .md · .txt — Auto-extracts title, abstract & equations
            </p>
          </div>
        </motion.div>

        {errorMsg && (
          <div className="border border-white/20 p-4 font-ui text-[12px] text-white/60">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Title */}
          <div className="space-y-3">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
              Title <span className="text-white/20">({title.length}/{TITLE_LIMIT})</span>
            </label>
            <input
              type="text" required maxLength={TITLE_LIMIT}
              value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Temporal Stability in Sparse Spiking Neural Architectures"
              className="editorial-input font-display text-white py-3"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', letterSpacing: '-0.02em' }}
            />
          </div>

          {/* Abstract */}
          <div className="space-y-3">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">
              Abstract <span className="text-white/20">({abstract.length}/{ABSTRACT_LIMIT})</span>
            </label>
            <textarea
              required rows={6} maxLength={ABSTRACT_LIMIT}
              value={abstract} onChange={e => setAbstract(e.target.value)}
              placeholder="Summarize your research hypothesis, methodology, and key findings…"
              className="editorial-input font-display text-white/80 py-3 resize-none leading-relaxed"
              style={{ fontSize: '1.1rem', letterSpacing: '0.01em' }}
            />
          </div>

          {/* Domain */}
          <div className="space-y-3">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">Primary Domain</label>
            <div className="flex gap-3">
              <select
                value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)}
                className="flex-1 bg-transparent border-b border-white/20 py-2.5 font-ui text-[13px] text-white focus:outline-none"
              >
                {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <input
                type="text" value={customTopicInput} onChange={e => setCustomTopicInput(e.target.value)}
                placeholder="Or add a custom topic…"
                className="flex-1 bg-transparent border-b border-white/10 py-2 font-ui text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-white/30"
              />
              <button type="button" onClick={handleAddCustomTopic}
                className="font-ui text-[11px] border border-white/20 px-3 py-2 hover:bg-white hover:text-black transition-colors flex items-center gap-1.5 text-white/50"
              >
                <Sparkles className="w-3 h-3" /> Add
              </button>
            </div>
          </div>

          {/* Keywords + License */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">Keywords</label>
              <input
                type="text" value={keywords} onChange={e => setKeywords(e.target.value)}
                placeholder="Spiking SNNs, Lyapunov, C++"
                className="editorial-input font-ui text-[13px] text-white py-2.5"
              />
            </div>
            <div className="space-y-3">
              <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">License</label>
              <select
                value={license} onChange={e => setLicense(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-2.5 font-ui text-[13px] text-white focus:outline-none"
              >
                <option value="CC-BY-4.0">CC-BY-4.0</option>
                <option value="MIT">MIT License</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="BSD-3-Clause">BSD 3-Clause</option>
              </select>
            </div>
          </div>

          {/* Repository */}
          <div className="space-y-3">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">Code Repository (optional)</label>
            <input
              type="url" value={repositoryUrl} onChange={e => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/republic-research/…"
              className="editorial-input font-ui text-[13px] text-white py-2.5"
            />
          </div>

          {/* Manuscript content */}
          <div className="space-y-3">
            <label className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 block">Manuscript (Markdown / LaTeX)</label>
            <textarea
              rows={10} value={contentMarkdown} onChange={e => setContentMarkdown(e.target.value)}
              placeholder="Paste your manuscript…"
              className="w-full bg-transparent border border-white/10 p-4 font-ui text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-white/30 resize-none leading-relaxed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 border border-white font-ui text-[12px] uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                Submit Manuscript for Peer Review · −3 Credits
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
