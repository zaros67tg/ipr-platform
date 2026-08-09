'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { PlusCircle, ArrowLeft, AlertCircle, BookOpen, UploadCloud, FileText, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { getTopics, createCustomTopic } from '@/lib/actions/topics';

export default function PaperSubmissionPage() {
  const { availableCredits, submitPaper } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [topicsList, setTopicsList] = useState<string[]>([
    'Theoretical Physics',
    'Systems Programming',
    'Neuroscience',
    'Robotics',
    'Mathematics',
    'Artificial Intelligence',
    'Quantum Computing',
    'Spiking Neural Networks',
    'Quantum Gravity',
    'Bioinformatics'
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

  const TITLE_LIMIT = 180;
  const ABSTRACT_LIMIT = 3000;

  useEffect(() => {
    getTopics().then(list => {
      if (list && list.length > 0) {
        setTopicsList(list);
      }
    });
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
      const fileName = file.name;
      const text = await file.text();

      // Extract title from first heading or filename
      const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^Title:\s+(.+)$/m);
      const extractedTitle = titleMatch ? titleMatch[1].trim() : fileName.replace(/\.[^/.]+$/, '');
      
      // Extract abstract or first paragraph
      const abstractMatch = text.match(/(?:Abstract|ABSTRACT)[:\n]+([\s\S]{50,600}?)(?:\n\n|\n#)/i);
      const extractedAbstract = abstractMatch ? abstractMatch[1].trim() : text.slice(0, 450).trim();

      setTitle(extractedTitle.slice(0, TITLE_LIMIT));
      setAbstract(extractedAbstract.slice(0, ABSTRACT_LIMIT));
      setContentMarkdown(text);
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg('Failed to parse file text. Please paste content directly into the form.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = submitPaper({
      title,
      abstract,
      primaryDomain: primaryDomain as any,
      subdomains: [],
      keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
      license,
      repositoryUrl: repositoryUrl.trim() || undefined,
      contentMarkdown
    });

    if (!res.success) {
      setErrorMsg(res.message);
    } else if (res.paper) {
      router.push(`/papers/${res.paper.slug}`);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <Link href="/papers" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A8A198] hover:text-[#C85A32]">
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel</span>
      </Link>

      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-[#C85A32] uppercase font-bold tracking-wider">MANUSCRIPT INGESTION</span>
          <h1 className="text-3xl serif-title text-[#F4F0E8]">Submit Research Paper</h1>
        </div>

        <div className="p-3 rounded-lg bg-[#151311] border border-white/10 text-right font-mono text-xs">
          <div className="text-[#746F69]">AVAILABLE CREDITS</div>
          <div className="text-xl font-bold text-emerald-400">
            500 / 03 REQ
          </div>
        </div>
      </div>

      {/* Drag & Drop File Parser Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed transition-colors text-center relative ${
          isDragOver 
            ? 'bg-[#C85A32]/10 border-[#C85A32]' 
            : 'bg-[#151311] border-white/15 hover:border-white/30'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.docx,.md,.txt"
          onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="space-y-3 pointer-events-none">
          <UploadCloud className="w-10 h-10 text-[#C85A32] mx-auto animate-bounce" />
          <h3 className="text-sm font-bold font-mono text-[#F4F0E8]">
            {isParsing ? 'Parsing & Auto-extracting Text...' : 'Drag & Drop Paper File (.pdf, .docx, .md, .txt)'}
          </h3>
          <p className="text-xs text-[#A8A198] font-serif">
            Drop your paper file to automatically parse Title, Abstract, and LaTeX equations.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-lg bg-[#C85A32]/20 border border-[#C85A32]/50 text-[#E89574] font-mono text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="ipr-card p-6 sm:p-8 space-y-6 font-mono text-xs">
        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[#A8A198] font-bold">MANUSCRIPT TITLE *</label>
            <span className={`text-[10px] ${title.length > TITLE_LIMIT ? 'text-[#C85A32] font-bold' : 'text-[#746F69]'}`}>
              {title.length} / {TITLE_LIMIT} CHARS
            </span>
          </div>
          <input
            type="text"
            required
            maxLength={TITLE_LIMIT}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Temporal Stability in Sparse Spiking Neural Architectures Under Noise"
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Abstract */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[#A8A198] font-bold">ABSTRACT *</label>
            <span className={`text-[10px] ${abstract.length > ABSTRACT_LIMIT ? 'text-[#C85A32] font-bold' : 'text-[#746F69]'}`}>
              {abstract.length} / {ABSTRACT_LIMIT} CHARS
            </span>
          </div>
          <textarea
            required
            rows={4}
            maxLength={ABSTRACT_LIMIT}
            value={abstract}
            onChange={e => setAbstract(e.target.value)}
            placeholder="Provide a comprehensive abstract summarizing research hypothesis, mathematical derivations, or findings..."
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32] resize-none"
          />
        </div>

        {/* Dynamic Topic / Domain Selection & Custom Topic Creation */}
        <div className="space-y-2">
          <label className="block text-[#A8A198] font-bold">PRIMARY RESEARCH TOPIC / DOMAIN *</label>
          <div className="flex gap-2">
            <select
              value={primaryDomain}
              onChange={e => setPrimaryDomain(e.target.value)}
              className="flex-1 bg-[#0D0C0B] border border-white/10 rounded p-3 text-sm text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
            >
              {topicsList.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Create Custom Topic Input */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={customTopicInput}
              onChange={e => setCustomTopicInput(e.target.value)}
              placeholder="Or add new custom topic (e.g. Spiking Neural Networks)"
              className="flex-1 bg-[#0D0C0B] border border-white/10 rounded p-2.5 text-xs text-[#F4F0E8] placeholder-[#746F69] focus:outline-none focus:border-[#5A6B43]"
            />
            <button
              type="button"
              onClick={handleAddCustomTopic}
              className="px-4 py-2.5 bg-[#5A6B43] hover:bg-[#4A5B33] text-[#F4F0E8] font-bold rounded text-xs transition-colors shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Add Topic
            </button>
          </div>
        </div>

        {/* Keywords & Open License */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#A8A198] mb-1 font-bold">KEYWORDS (Comma Separated)</label>
            <input
              type="text"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="Spiking SNNs, Lyapunov, C++"
              className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
            />
          </div>
          <div>
            <label className="block text-[#A8A198] mb-1 font-bold">OPEN LICENSE</label>
            <select
              value={license}
              onChange={e => setLicense(e.target.value)}
              className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
            >
              <option value="CC-BY-4.0">CC-BY-4.0 (Creative Commons Attribution)</option>
              <option value="MIT">MIT License</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="BSD-3-Clause">BSD 3-Clause</option>
            </select>
          </div>
        </div>

        {/* Code Repository */}
        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">OPEN CODE REPOSITORY (GitHub URL)</label>
          <input
            type="url"
            value={repositoryUrl}
            onChange={e => setRepositoryUrl(e.target.value)}
            placeholder="https://github.com/republic-research/spiking-stability"
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
          />
        </div>

        {/* Manuscript Content Markdown / LaTeX */}
        <div>
          <label className="block text-[#A8A198] mb-1 font-bold">MANUSCRIPT CONTENT (Markdown / LaTeX)</label>
          <textarea
            rows={8}
            value={contentMarkdown}
            onChange={e => setContentMarkdown(e.target.value)}
            placeholder="Paste your manuscript markdown with LaTeX math formulas (e.g. $\tau_m \frac{dV}{dt} = -V + I$)...."
            className="w-full bg-[#0D0C0B] border border-white/10 rounded p-3 text-xs text-[#F4F0E8] focus:outline-none focus:border-[#C85A32] font-mono leading-relaxed"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] font-bold rounded-lg text-xs font-mono shadow-lg transition-colors inline-flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          <span>Submit Manuscript for Peer Review (-3 Credits)</span>
        </button>
      </form>
    </div>
  );
}
