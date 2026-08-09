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
  Share2, 
  Bookmark, 
  MessageSquare, 
  ThumbsUp, 
  ExternalLink, 
  Code, 
  Copy, 
  Check, 
  ArrowLeft,
  ChevronDown
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Return Handle */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/papers" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A8A198] hover:text-[#C85A32]">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manuscripts Archive</span>
        </Link>

        {/* Version Selector */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-[#746F69]">VERSION:</span>
          <select
            value={selectedVersion}
            onChange={e => setSelectedVersion(e.target.value)}
            className="bg-[#151311] border border-white/15 rounded px-2 py-1 text-[#F4F0E8] focus:outline-none focus:border-[#C85A32]"
          >
            {paper.versions.map(v => (
              <option key={v.version} value={v.version}>
                {v.version} ({formatDate(v.releasedAt)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PAPER HEADER */}
      <header className="space-y-4 max-w-[780px] mx-auto text-left">
        <div className="flex items-center gap-3">
          <DisciplineTag domain={paper.primaryDomain} size="md" />
          <span className="text-xs font-mono text-[#746F69]">
            {paper.readingTimeMinutes} MIN READ • LICENSE: {paper.license}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold">
            {paper.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl serif-title font-bold text-[#F4F0E8] leading-tight">
          {paper.title}
        </h1>

        {/* Authors Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono border-y border-white/10 py-3">
          {paper.authors.map(a => (
            <div key={a.id} className="flex items-center gap-2">
              <img src={a.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-7 h-7 rounded-full object-cover border border-white/10" />
              <div>
                <span className="text-[#F4F0E8] font-bold block">{a.name}</span>
                <span className="text-[#746F69] text-[10px] block">{a.institution}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fork Origin Lineage Banner */}
        {paper.parentPaperTitle && (
          <div className="p-3 rounded-lg bg-[#151311] border border-[#D97706]/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#D97706]">
              <GitFork className="w-4 h-4" />
              <span>FORKED FROM: <strong>{paper.parentPaperTitle}</strong> (Version {paper.parentVersion})</span>
            </div>
            <Link href={`/papers/${paper.parentPaperId}`} className="text-[#C85A32] hover:underline">
              View Parent Lineage →
            </Link>
          </div>
        )}

        {/* Abstract Block */}
        <div className="p-6 rounded-xl bg-[#151311] border border-white/10 space-y-2">
          <span className="text-xs font-mono text-[#C85A32] uppercase tracking-widest font-bold block">ABSTRACT</span>
          <p className="text-sm font-serif text-[#E8E0D2] leading-relaxed italic">
            "{paper.abstract}"
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCiteModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] rounded-md text-xs font-mono font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>CITE ({paper.citationCount})</span>
            </button>

            <button
              onClick={() => setIsForkModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#1C1917] hover:bg-[#24201D] text-[#E8E0D2] border border-white/10 rounded-md text-xs font-mono transition-colors inline-flex items-center gap-1.5"
            >
              <GitFork className="w-3.5 h-3.5 text-[#D97706]" />
              <span>FORK ({paper.forkCount})</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors border inline-flex items-center gap-1.5 ${
                isBookmarked 
                  ? 'bg-[#D97706]/20 text-[#D97706] border-[#D97706]/40' 
                  : 'bg-[#1C1917] text-[#A8A198] border-white/10 hover:text-[#F4F0E8]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isBookmarked ? 'SAVED' : 'SAVE'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleUpvote}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors border inline-flex items-center gap-1.5 ${
                hasUpvoted ? 'bg-[#C85A32] text-[#F4F0E8] border-[#C85A32]' : 'bg-[#1C1917] text-[#A8A198] border-white/10'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{upvotes}</span>
            </button>
          </div>
        </div>

        {/* Code Repository Badge */}
        {paper.repositoryUrl && (
          <div className="p-3 rounded-lg bg-[#0D0C0B] border border-white/10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-[#A8A198]">
              <Code className="w-4 h-4 text-[#5A6B43]" />
              <span>REPOSITORY: {paper.repositoryUrl.replace('https://github.com/', '')}</span>
            </div>
            {paper.codespacesUrl && (
              <a
                href={paper.codespacesUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-[#5A6B43]/20 text-[#A8C980] border border-[#5A6B43]/40 rounded hover:bg-[#5A6B43]/30 transition-colors inline-flex items-center gap-1"
              >
                <span>OPEN IN CODESPACE</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </header>

      {/* CENTRAL READING COLUMN (680px - 780px) & CONTEXT SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-white/10">
        {/* Main Content Column */}
        <div className="lg:col-span-8 max-w-[780px] mx-auto space-y-6">
          {currentVersionData.blocks.map(block => {
            const isSelected = activeBlockId === block.id;

            return (
              <div
                key={block.id}
                onClick={() => setActiveBlockId(isSelected ? null : block.id)}
                className={`relative group p-4 rounded-lg transition-colors cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#1C1917] border-[#C85A32]/50 shadow-md' 
                    : 'border-transparent hover:border-white/10 hover:bg-[#151311]/50'
                }`}
              >
                {/* Block Comment Indicator */}
                {block.commentsCount > 0 && (
                  <span className="absolute -left-3 top-4 px-1.5 py-0.5 rounded-full bg-[#C85A32] text-[#F4F0E8] text-[9px] font-mono font-bold shadow-md">
                    {block.commentsCount}
                  </span>
                )}

                {/* Render Block Types */}
                {block.type === 'heading' && (
                  <h2 className="text-xl sm:text-2xl serif-title font-bold text-[#F4F0E8] pt-2 pb-1 border-b border-white/10">
                    {block.content}
                  </h2>
                )}

                {block.type === 'paragraph' && (
                  <p className="text-base sm:text-lg font-serif text-[#E8E0D2] leading-relaxed">
                    {block.content}
                  </p>
                )}

                {block.type === 'equation' && (
                  <div className="text-center my-2 p-2">
                    <MathRenderer latex={block.metadata?.latex || block.content} displayMode={true} />
                    <div className="text-[10px] font-mono text-[#746F69] mt-1">Equation Block • Click to discuss</div>
                  </div>
                )}

                {block.type === 'code' && (
                  <div className="bg-[#0D0C0B] rounded-lg border border-white/10 p-4 font-mono text-xs overflow-x-auto text-[#E8E0D2] my-3">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] text-[#746F69]">
                      <span>LANGUAGE: {block.metadata?.codeLanguage || 'C++'}</span>
                      <span>PATH: {block.metadata?.repoPath || 'src/main.cpp'}</span>
                    </div>
                    <pre className="leading-relaxed"><code>{block.content}</code></pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Marginalia & Context Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-20 p-5 rounded-xl bg-[#151311] border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-bold text-[#C85A32] uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                {activeBlockId ? 'Block Discussion' : 'Manuscript Marginalia'}
              </h3>
              <span className="text-[10px] font-mono text-[#746F69]">{paperComments.length} Comments</span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-2">
              <textarea
                rows={2}
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                placeholder={activeBlockId ? "Add inline feedback on selected block..." : "Add general comment on manuscript..."}
                className="w-full bg-[#0D0C0B] border border-white/10 rounded-lg p-2.5 text-xs text-[#F4F0E8] placeholder-[#746F69] focus:outline-none focus:border-[#C85A32] resize-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="w-full py-1.5 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] rounded text-xs font-mono font-bold transition-colors disabled:opacity-50"
              >
                Post Marginalia
              </button>
            </form>

            {/* Comment Stream */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {paperComments.length === 0 ? (
                <div className="text-center py-6 text-xs font-mono text-[#746F69] italic">
                  No marginalia yet. Click any equation or paragraph to start discussion.
                </div>
              ) : (
                paperComments.map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-[#0D0C0B] border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={c.authorAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-semibold text-[#F4F0E8]">{c.authorName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#746F69]">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-[#E8E0D2] font-serif leading-relaxed">{c.content}</p>

                    {c.replies && c.replies.map(r => (
                      <div key={r.id} className="ml-3 pl-2 border-l border-white/10 pt-1 text-[11px] text-[#A8A198] font-serif">
                        <strong className="text-[#F4F0E8]">{r.authorName}:</strong> {r.content}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CitationModal paper={paper} isOpen={isCiteModalOpen} onClose={() => setIsCiteModalOpen(false)} />
      <ForkModal paper={paper} isOpen={isForkModalOpen} onClose={() => setIsForkModalOpen(false)} />
    </div>
  );
}
