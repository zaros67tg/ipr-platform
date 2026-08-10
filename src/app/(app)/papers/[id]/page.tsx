'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { MathRenderer } from '@/components/common/MathRenderer';
import { CitationModal } from '@/components/common/CitationModal';
import { ForkModal } from '@/components/common/ForkModal';
import { formatDate } from '@/lib/utils/format';
import {
  BookOpen, GitFork, Bookmark, MessageSquare,
  ThumbsUp, Code, ArrowLeft, Share2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorialPaperReaderPage() {
  const params = useParams();
  const slugOrId = params?.id as string;
  const { papers, comments, addComment, toggleBookmarkPaper, bookmarks } = useApp();

  const paper = papers.find(p => p.slug === slugOrId || p.id === slugOrId) || papers[0];

  const [selectedVersion, setSelectedVersion] = useState(paper.currentVersion);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [isCiteModalOpen, setIsCiteModalOpen] = useState(false);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarks.includes(paper.id));
  const [newCommentText, setNewCommentText] = useState('');
  const [upvotes, setUpvotes] = useState(paper.upvoteCount);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [marginaliaOpen, setMarginaliaOpen] = useState(false);

  const currentVersionData = paper.versions.find(v => v.version === selectedVersion) || paper.versions[0];
  const paperComments = comments.filter(c => c.targetId === paper.id);

  const handleUpvote = () => {
    setUpvotes(p => hasUpvoted ? p - 1 : p + 1);
    setHasUpvoted(p => !p);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment({
      targetId: paper.id,
      targetType: activeBlockId ? 'block' : 'paper',
      blockId: activeBlockId || undefined,
      authorId: 'usr_zaros',
      authorName: 'Dr. Zaros H. Vance',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      authorHandle: '@zaros',
      content: newCommentText,
    });
    setNewCommentText('');
  };

  return (
    <div className="bg-black text-white min-h-screen w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-6 pb-20">
      {/* ── Breadcrumb bar ── */}
      <div className="border-b border-white/8 py-4 flex items-center justify-between">
        <Link
          href="/papers"
          className="font-ui text-[11px] text-white/40 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Manuscripts
        </Link>
        <div className="flex items-center gap-4">
          <select
            value={selectedVersion}
            onChange={e => setSelectedVersion(e.target.value)}
            className="bg-black border border-white/15 px-3 py-1.5 font-ui text-[11px] text-white/60 focus:outline-none"
          >
            {paper.versions.map(v => (
              <option key={v.version} value={v.version}>{v.version} · {formatDate(v.releasedAt)}</option>
            ))}
          </select>
          <button
            onClick={() => setMarginaliaOpen(o => !o)}
            className={`font-ui text-[11px] border px-4 py-1.5 transition-colors flex items-center gap-2 ${marginaliaOpen ? 'bg-white text-black border-white' : 'border-white/20 text-white/40 hover:border-white hover:text-white'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Marginalia ({paperComments.length})
          </button>
        </div>
      </div>

      <div className="flex relative">
        {/* ── Main reading column — CENTERED ── */}
        <div className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-6 py-12">

            {/* Domain + meta */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-ui text-[10px] uppercase tracking-[0.25em] border border-white/20 px-2.5 py-1 text-white/50">
                {paper.primaryDomain}
              </span>
              <span className="font-ui text-[10px] text-white/30">
                {paper.readingTimeMinutes} min · {paper.license}
              </span>
              <span className="font-ui text-[10px] uppercase tracking-widest border border-white bg-white text-black px-2 py-0.5 font-bold">
                {paper.status}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display text-white leading-none mb-10"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
            >
              {paper.title}
            </h1>

            {/* Authors */}
            <div className="flex flex-wrap gap-8 border-y border-white/10 py-6 mb-10">
              {paper.authors.map(a => (
                <div key={a.id} className="flex items-center gap-3">
                  {a.avatarUrl ? (
                    <img src={a.avatarUrl} alt={a.name} className="w-9 h-9 object-cover" />
                  ) : (
                    <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-ui text-[11px] font-bold uppercase">
                      {a.name?.charAt(0) || '?'}
                    </div>
                  )}
                  <div>
                    <span className="font-ui text-[12px] font-semibold text-white block">{a.name}</span>
                    <span className="font-ui text-[10px] text-white/40">{a.institution}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Abstract */}
            <div className="border-l-2 border-white/20 pl-6 mb-12">
              <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-3">Abstract</span>
              <p
                className="font-display text-white/80 italic leading-relaxed text-justify"
                style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', letterSpacing: '-0.01em' }}
              >
                "{paper.abstract}"
              </p>
            </div>

            {/* Content blocks */}
            <div className="space-y-1">
              {currentVersionData.blocks.map(block => {
                const isSelected = activeBlockId === block.id;
                return (
                  <div
                    key={block.id}
                    onClick={() => setActiveBlockId(isSelected ? null : block.id)}
                    className={`relative p-5 border-l-2 transition-all cursor-pointer ${isSelected ? 'border-white bg-white/4' : 'border-transparent hover:border-white/15'}`}
                  >
                    {block.commentsCount > 0 && (
                      <span className="absolute -left-6 top-5 font-ui text-[9px] text-white/30">
                        {block.commentsCount}
                      </span>
                    )}
                    {block.type === 'heading' && (
                      <h2
                        className="font-display text-white border-b border-white/10 pb-3 mb-1"
                        style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', fontWeight: 600, letterSpacing: '-0.03em' }}
                      >
                        {block.content}
                      </h2>
                    )}
                    {block.type === 'paragraph' && (
                      <p
                        className="font-display text-white/80 leading-relaxed"
                        style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.8, letterSpacing: '0.01em' }}
                      >
                        {block.content}
                      </p>
                    )}
                    {block.type === 'equation' && (
                      <div className="border border-white/10 p-6 my-4 text-center">
                        <MathRenderer latex={block.metadata?.latex || block.content} displayMode={true} />
                      </div>
                    )}
                    {block.type === 'code' && (
                      <div className="border border-white/15 p-5 font-ui text-xs overflow-x-auto text-white/60 my-4">
                        <pre><code>{block.content}</code></pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Marginalia Drawer — right side ── */}
        <AnimatePresence>
          {marginaliaOpen && (
            <motion.div
              key="marginalia"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-shrink-0 h-[calc(100vh-7rem)] sticky top-16 overflow-hidden border-l border-white/10"
            >
              <div className="w-[360px] h-full flex flex-col bg-black scrollbar-hide overflow-y-auto">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 bg-black z-10">
                  <span className="font-ui text-[11px] text-white/50 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {activeBlockId ? 'Block Discussion' : 'Manuscript Marginalia'}
                  </span>
                  <button onClick={() => setMarginaliaOpen(false)} className="font-ui text-[11px] text-white/30 hover:text-white">✕</button>
                </div>

                <form onSubmit={handleAddComment} className="border-b border-white/10 p-4 space-y-3">
                  <textarea
                    rows={3}
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Add marginalia..."
                    className="w-full bg-transparent border border-white/10 p-3 font-ui text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="w-full py-2 border border-white font-ui text-[11px] uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors disabled:opacity-20"
                  >
                    Post
                  </button>
                </form>

                <div className="flex-1 p-4 space-y-5">
                  {paperComments.length === 0 ? (
                    <p className="font-ui text-[11px] text-white/20 italic text-center pt-10">
                      No marginalia yet. Click any paragraph.
                    </p>
                  ) : (
                    paperComments.map(c => (
                      <div key={c.id} className="border-b border-white/5 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-ui text-[11px] font-semibold text-white/70">{c.authorName}</span>
                          <span className="font-ui text-[9px] text-white/30">{formatDate(c.createdAt)}</span>
                        </div>
                        <p
                          className="font-display text-white/60 leading-relaxed"
                          style={{ fontSize: '1rem', letterSpacing: '0.01em' }}
                        >
                          {c.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating Social Dock ── */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-3 py-2.5 social-dock"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Upvote */}
        <button
          onClick={handleUpvote}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all hover:scale-110 ${hasUpvoted ? 'text-white' : 'text-white/40 hover:text-white'}`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="font-ui text-[9px]">{upvotes}</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* Comment / Marginalia */}
        <button
          onClick={() => setMarginaliaOpen(o => !o)}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all hover:scale-110 ${marginaliaOpen ? 'text-white' : 'text-white/40 hover:text-white'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="font-ui text-[9px]">{paperComments.length}</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* Bookmark */}
        <button
          onClick={() => { toggleBookmarkPaper(paper.id); setIsBookmarked(b => !b); }}
          className={`flex flex-col items-center gap-0.5 px-4 py-2 transition-all hover:scale-110 ${isBookmarked ? 'text-white' : 'text-white/40 hover:text-white'}`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="font-ui text-[9px]">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* Cite */}
        <button
          onClick={() => setIsCiteModalOpen(true)}
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-white/40 hover:text-white transition-all hover:scale-110"
        >
          <BookOpen className="w-4 h-4" />
          <span className="font-ui text-[9px]">Cite</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* Fork */}
        <button
          onClick={() => setIsForkModalOpen(true)}
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-white/40 hover:text-white transition-all hover:scale-110"
        >
          <GitFork className="w-4 h-4" />
          <span className="font-ui text-[9px]">Fork</span>
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* Share */}
        <button
          onClick={() => navigator.clipboard?.writeText(window.location.href)}
          className="flex flex-col items-center gap-0.5 px-4 py-2 text-white/40 hover:text-white transition-all hover:scale-110"
        >
          <Share2 className="w-4 h-4" />
          <span className="font-ui text-[9px]">Share</span>
        </button>
      </motion.div>

      <CitationModal paper={paper} isOpen={isCiteModalOpen} onClose={() => setIsCiteModalOpen(false)} />
      <ForkModal paper={paper} isOpen={isForkModalOpen} onClose={() => setIsForkModalOpen(false)} />
    </div>
  );
}
