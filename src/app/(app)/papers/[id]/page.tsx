'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { MathRenderer } from '@/components/common/MathRenderer';
import { CitationModal } from '@/components/common/CitationModal';
import { ForkModal } from '@/components/common/ForkModal';
import { formatDate } from '@/lib/utils/format';
import { BookOpen, GitFork, Bookmark, MessageSquare, ThumbsUp, ExternalLink, Code, ArrowLeft } from 'lucide-react';
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
    <div className="bg-black text-white min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-white/10 px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link
          href="/papers"
          className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3 h-3" /> Manuscripts Archive
        </Link>

        <div className="flex items-center gap-4">
          <select
            value={selectedVersion}
            onChange={e => setSelectedVersion(e.target.value)}
            className="bg-black border border-white/20 px-3 py-1 font-ui text-[10px] uppercase tracking-widest text-white/60 focus:outline-none"
          >
            {paper.versions.map(v => (
              <option key={v.version} value={v.version}>{v.version} · {formatDate(v.releasedAt)}</option>
            ))}
          </select>
          <button
            onClick={() => setMarginaliaOpen(o => !o)}
            className={`font-ui text-[10px] uppercase tracking-[0.2em] border px-4 py-2 transition-colors flex items-center gap-2 ${marginaliaOpen ? 'bg-white text-black border-white' : 'border-white/20 text-white/40 hover:border-white hover:text-white'}`}
          >
            <MessageSquare className="w-3 h-3" />
            Marginalia ({paperComments.length})
          </button>
        </div>
      </div>

      <div className="flex">
        {/* ── Main Reading Column ── */}
        <div className={`flex-1 transition-all duration-300 ${marginaliaOpen ? 'lg:w-2/3' : 'w-full'}`}>
          {/* Paper header */}
          <div className="px-6 lg:px-16 py-12 border-b border-white/10 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-ui text-[9px] uppercase tracking-[0.25em] border border-white/20 px-2 py-1 text-white/50">
                {paper.primaryDomain}
              </span>
              <span className="font-ui text-[9px] uppercase tracking-[0.25em] text-white/30">
                {paper.readingTimeMinutes} min · {paper.license}
              </span>
              <span className="font-ui text-[9px] uppercase tracking-[0.25em] border border-white px-2 py-1 bg-white text-black font-bold">
                {paper.status}
              </span>
            </div>

            <h1
              className="font-display text-white leading-none mb-8"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
            >
              {paper.title}
            </h1>

            {/* Authors */}
            <div className="flex flex-wrap gap-6 border-y border-white/10 py-5 mb-6">
              {paper.authors.map(a => (
                <div key={a.id} className="flex items-center gap-3">
                  <img src={a.avatarUrl || ''} alt="" className="w-8 h-8 object-cover grayscale" />
                  <div>
                    <span className="font-ui text-[11px] uppercase tracking-[0.1em] text-white block">{a.name}</span>
                    <span className="font-ui text-[9px] text-white/40">{a.institution}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Abstract */}
            <div className="border border-white/10 p-6">
              <span className="font-ui text-[9px] uppercase tracking-[0.3em] text-white/30 block mb-3">Abstract</span>
              <p className="font-display text-lg text-white/80 italic leading-relaxed text-justify" style={{ letterSpacing: '-0.01em' }}>
                "{paper.abstract}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setIsCiteModalOpen(true)}
                className="font-ui text-[10px] uppercase tracking-[0.2em] border border-white px-4 py-2.5 hover:bg-white hover:text-black transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-3 h-3" /> Cite ({paper.citationCount})
              </button>
              <button
                onClick={() => setIsForkModalOpen(true)}
                className="font-ui text-[10px] uppercase tracking-[0.2em] border border-white/20 px-4 py-2.5 text-white/50 hover:border-white hover:text-white transition-colors flex items-center gap-2"
              >
                <GitFork className="w-3 h-3" /> Fork ({paper.forkCount})
              </button>
              <button
                onClick={() => { toggleBookmarkPaper(paper.id); setIsBookmarked(b => !b); }}
                className={`font-ui text-[10px] uppercase tracking-[0.2em] border px-4 py-2.5 transition-colors flex items-center gap-2 ${isBookmarked ? 'border-white bg-white text-black' : 'border-white/20 text-white/50 hover:border-white hover:text-white'}`}
              >
                <Bookmark className="w-3 h-3" /> {isBookmarked ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleUpvote}
                className={`font-ui text-[10px] uppercase tracking-[0.2em] border px-4 py-2.5 transition-colors flex items-center gap-2 ${hasUpvoted ? 'border-white bg-white text-black' : 'border-white/20 text-white/50 hover:border-white hover:text-white'}`}
              >
                <ThumbsUp className="w-3 h-3" /> {upvotes}
              </button>
            </div>
          </div>

          {/* Content blocks */}
          <div className="px-6 lg:px-16 py-10 space-y-2 max-w-3xl">
            {currentVersionData.blocks.map(block => {
              const isSelected = activeBlockId === block.id;
              return (
                <div
                  key={block.id}
                  onClick={() => setActiveBlockId(isSelected ? null : block.id)}
                  className={`relative p-4 border transition-all cursor-pointer ${isSelected ? 'border-white bg-white/5' : 'border-transparent hover:border-white/10'}`}
                >
                  {block.commentsCount > 0 && (
                    <span className="absolute -left-5 top-4 font-ui text-[9px] text-white/40">
                      {block.commentsCount}
                    </span>
                  )}
                  {block.type === 'heading' && (
                    <h2 className="font-display text-white border-b border-white/10 pb-2 mb-1" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.03em' }}>
                      {block.content}
                    </h2>
                  )}
                  {block.type === 'paragraph' && (
                    <p className="font-display text-white/80 text-lg leading-relaxed text-justify" style={{ letterSpacing: '-0.01em' }}>
                      {block.content}
                    </p>
                  )}
                  {block.type === 'equation' && (
                    <div className="border border-white/10 p-6 my-4 text-center bg-black">
                      <MathRenderer latex={block.metadata?.latex || block.content} displayMode={true} />
                    </div>
                  )}
                  {block.type === 'code' && (
                    <div className="border border-white/20 p-4 font-ui text-xs overflow-x-auto text-white/70 my-4 bg-black">
                      <pre><code>{block.content}</code></pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Marginalia Drawer (toggleable, right side) ── */}
        <AnimatePresence>
          {marginaliaOpen && (
            <motion.div
              key="marginalia"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex-shrink-0 h-[calc(100vh-7rem)] sticky top-14 overflow-hidden border-l border-white/10"
            >
              <div className="w-[380px] h-full flex flex-col bg-black">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                  <span className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/50 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    {activeBlockId ? 'Block Discussion' : 'Manuscript Marginalia'}
                  </span>
                  <button
                    onClick={() => setMarginaliaOpen(false)}
                    className="font-ui text-[10px] text-white/30 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddComment} className="border-b border-white/10 p-4 space-y-2">
                  <textarea
                    rows={3}
                    value={newCommentText}
                    onChange={e => setNewCommentText(e.target.value)}
                    placeholder="Add marginalia..."
                    className="w-full bg-black border border-white/10 p-3 font-ui text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/30 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="w-full py-2 border border-white font-ui text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors disabled:opacity-20"
                  >
                    Post Marginalia
                  </button>
                </form>

                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
                  {paperComments.length === 0 ? (
                    <p className="font-ui text-[10px] text-white/20 italic text-center pt-8">
                      No marginalia yet. Click any paragraph to start a discussion.
                    </p>
                  ) : (
                    paperComments.map(c => (
                      <div key={c.id} className="border-b border-white/5 pb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-ui text-[10px] uppercase tracking-[0.1em] text-white/70">{c.authorName}</span>
                          <span className="font-ui text-[9px] text-white/30">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="font-display text-sm text-white/60 leading-relaxed">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CitationModal paper={paper} isOpen={isCiteModalOpen} onClose={() => setIsCiteModalOpen(false)} />
      <ForkModal paper={paper} isOpen={isForkModalOpen} onClose={() => setIsForkModalOpen(false)} />
    </div>
  );
}
