'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/services/store';
import { MathRenderer } from '@/components/common/MathRenderer';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { CitationModal } from '@/components/common/CitationModal';
import { ForkModal } from '@/components/common/ForkModal';
import { formatDate } from '@/lib/utils/format';
import { 
  BookOpen, 
  GitFork, 
  Bookmark, 
  MessageSquare, 
  ThumbsUp, 
  ExternalLink, 
  Code, 
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function InteractivePaperReaderPage() {
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
  const [isMarginaliaOpen, setIsMarginaliaOpen] = useState(false);

  const currentVersionData = paper.versions.find(v => v.version === selectedVersion) || paper.versions[0];
  const paperComments = comments.filter(c => c.targetId === paper.id);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    } else {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  const handleToggleBookmark = () => {
    toggleBookmarkPaper(paper.id);
    setIsBookmarked(!isBookmarked);
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
      content: newCommentText
    });
    setNewCommentText('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-serif text-white bg-black">
      {/* Top Breadcrumb & Return Handle */}
      <div className="flex items-center justify-between border-b border-white pb-4">
        <Link href="/papers" className="inline-flex items-center gap-1.5 text-xs font-serif text-white hover:underline uppercase font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manuscripts Archive</span>
        </Link>

        {/* Version Selector */}
        <div className="flex items-center gap-2 font-serif text-xs">
          <span className="text-white/70">VERSION:</span>
          <select
            value={selectedVersion}
            onChange={e => setSelectedVersion(e.target.value)}
            className="bg-black border border-white px-2 py-1 text-white focus:outline-none"
          >
            {paper.versions.map(v => (
              <option key={v.version} value={v.version}>
                {v.version} ({formatDate(v.releasedAt)})
              </option>
            ))}
          </select>

          {/* Toggle Marginalia Drawer Button */}
          <button
            onClick={() => setIsMarginaliaOpen(!isMarginaliaOpen)}
            className="px-2.5 py-1 bg-white text-black font-serif text-xs font-bold border border-white hover:bg-black hover:text-white uppercase flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Marginalia ({paperComments.length})</span>
          </button>
        </div>
      </div>

      {/* PAPER HEADER */}
      <header className="space-y-4 max-w-[780px] mx-auto text-left">
        <div className="flex items-center gap-3">
          <DisciplineTag domain={paper.primaryDomain} size="md" />
          <span className="text-xs font-serif text-white/70">
            {paper.readingTimeMinutes} MIN READ • LICENSE: {paper.license}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-serif border border-white bg-white text-black font-bold uppercase">
            {paper.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
          {paper.title}
        </h1>

        {/* Authors Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-serif border-y border-white py-3">
          {paper.authors.map(a => (
            <div key={a.id} className="flex items-center gap-2">
              <img src={a.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-7 h-7 object-cover border border-white" />
              <div>
                <span className="text-white font-bold block uppercase">{a.name}</span>
                <span className="text-white/70 text-[10px] block">{a.institution}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Abstract Block */}
        <div className="p-5 bg-black border border-white space-y-2">
          <span className="text-xs font-serif text-white uppercase tracking-widest font-bold block border-b border-white/40 pb-1">ABSTRACT</span>
          <p className="text-sm font-serif text-white leading-relaxed italic text-justify">
            "{paper.abstract}"
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCiteModalOpen(true)}
              className="px-3.5 py-1.5 bg-white text-black font-serif text-xs font-bold uppercase border border-white hover:bg-black hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CITE ({paper.citationCount})</span>
            </button>

            <button
              onClick={() => setIsForkModalOpen(true)}
              className="px-3.5 py-1.5 bg-black text-white border border-white font-serif text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors inline-flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>FORK ({paper.forkCount})</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`px-3 py-1.5 font-serif text-xs font-bold uppercase transition-colors border inline-flex items-center gap-1.5 ${
                isBookmarked 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black text-white border-white hover:bg-white hover:text-black'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`px-3 py-1.5 font-serif text-xs font-bold uppercase transition-colors border inline-flex items-center gap-1.5 ${
                hasUpvoted ? 'bg-white text-black border-white' : 'bg-black text-white border-white hover:bg-white hover:text-black'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upvotes} UPVOTES</span>
            </button>
          </div>
        </div>
      </header>

      {/* READING COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-white">
        <div className={`${isMarginaliaOpen ? 'lg:col-span-8' : 'lg:col-span-12'} max-w-[780px] mx-auto space-y-6`}>
          {currentVersionData.blocks.map(block => {
            const isSelected = activeBlockId === block.id;

            return (
              <div
                key={block.id}
                onClick={() => setActiveBlockId(isSelected ? null : block.id)}
                className={`relative group p-4 border transition-colors cursor-pointer ${
                  isSelected 
                    ? 'bg-white text-black border-white font-bold' 
                    : 'border-transparent hover:border-white bg-black text-white'
                }`}
              >
                {block.type === 'heading' && (
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white pt-2 pb-1 border-b border-white">
                    {block.content}
                  </h2>
                )}

                {block.type === 'paragraph' && (
                  <p className="text-base font-serif leading-relaxed text-justify">
                    {block.content}
                  </p>
                )}

                {block.type === 'equation' && (
                  <div className="text-center my-2 p-2 border border-white bg-black">
                    <MathRenderer latex={block.metadata?.latex || block.content} displayMode={true} />
                  </div>
                )}

                {block.type === 'code' && (
                  <div className="bg-black border border-white p-4 font-serif text-xs overflow-x-auto text-white my-3">
                    <pre className="leading-relaxed"><code>{block.content}</code></pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Toggleable Side Drawer for Marginalia */}
        {isMarginaliaOpen && (
          <div className="lg:col-span-4 space-y-4 p-4 border border-white bg-black">
            <div className="flex items-center justify-between border-b border-white pb-2">
              <h3 className="text-xs font-serif font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Manuscript Marginalia</span>
              </h3>
              <button onClick={() => setIsMarginaliaOpen(false)} className="text-xs text-white hover:underline">Close ✕</button>
            </div>

            <form onSubmit={handleAddComment} className="space-y-2">
              <textarea
                rows={3}
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                placeholder="Add feedback or discussion..."
                className="w-full bg-black border border-white p-2 text-xs text-white placeholder-white/50 focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="w-full py-1.5 bg-white text-black font-serif text-xs font-bold uppercase border border-white hover:bg-black hover:text-white transition-colors"
              >
                Post Marginalia
              </button>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {paperComments.map(c => (
                <div key={c.id} className="p-2 border border-white/50 space-y-1 text-xs font-serif">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase">{c.authorName}</span>
                    <span className="text-[10px] text-white/70">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-white">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CitationModal paper={paper} isOpen={isCiteModalOpen} onClose={() => setIsCiteModalOpen(false)} />
      <ForkModal paper={paper} isOpen={isForkModalOpen} onClose={() => setIsForkModalOpen(false)} />
    </div>
  );
}
