'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';
import { DisciplineTag } from '@/components/common/DisciplineTag';
import { formatDate } from '@/lib/utils/format';

const FEED_COVER_IMAGES: Record<string, string> = {
  'temporal-stability-sparse-spiking-architectures': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600',
  'topological-invariants-quantum-gravity': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1600',
  'formal-constraints-emergent-computation': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1600',
  'geometric-methods-distributed-robotic-navigation': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600',
  'lattice-crypto-microarchitectural-isolation': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1600',
  'sparse-graph-neural-networks-protein-folding': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1600'
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600';

export default function ClassicPrintNewspaperFeedPage() {
  const { posts, toggleUpvotePost, toggleBookmarkPost } = useApp();

  return (
    <div className="space-y-8 font-serif antialiased bg-[#000000] text-[#FFFFFF]">
      {/* Newspaper Header Banner */}
      <div className="border-b-2 border-white pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold uppercase tracking-tight text-white mb-1">
            THE LIVING STREAM
          </h1>
          <p className="text-xs font-serif italic text-white/80 uppercase tracking-widest">
            Open-Source Research • Dispatch & Review Journal • Est. 2026
          </p>
        </div>

        <Link
          href="/submit"
          className="px-4 py-2 bg-white text-black font-serif text-xs font-bold uppercase transition-all border border-white hover:bg-black hover:text-white shrink-0"
        >
          + Publish
        </Link>
      </div>

      {/* Classic Print Newspaper Article Stream */}
      <div className="space-y-8">
        {posts.map(post => {
          const coverImg = (post.paperSlug && FEED_COVER_IMAGES[post.paperSlug]) || DEFAULT_COVER;

          return (
            <div 
              key={post.id}
              className="border border-white p-6 bg-black space-y-4 shadow-none rounded-none"
            >
              {/* Cover Image Banner (Sharp 1px border) */}
              <div className="relative w-full h-56 sm:h-72 overflow-hidden border border-white bg-black">
                <img 
                  src={coverImg} 
                  alt={post.title || post.authorName}
                  className="w-full h-full object-cover grayscale contrast-125" 
                />
                <div className="absolute top-3 left-3">
                  <DisciplineTag domain={post.authorDomain} size="sm" />
                </div>
              </div>

              {/* Author Metadata */}
              <div className="flex items-center gap-3 border-b border-white/30 pb-2">
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName} 
                  className="w-7 h-7 object-cover border border-white" 
                />
                <div className="text-xs font-serif">
                  <span className="font-bold text-white uppercase">{post.authorName}</span>
                  <span className="text-white/70 italic font-serif"> • {formatDate(post.createdAt)} • {post.type.replace(/_/g, ' ')}</span>
                </div>
              </div>

              {/* Article Serif Title */}
              {post.title && (
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight hover:underline">
                  <Link href={post.paperSlug ? `/papers/${post.paperSlug}` : '/feed'}>
                    {post.title}
                  </Link>
                </h2>
              )}

              {/* Print Justified Body Abstract */}
              <p className="text-sm font-serif leading-relaxed text-white/90 text-justify line-clamp-3">
                {post.content}
              </p>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-white text-xs font-serif text-white">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => toggleUpvotePost(post.id)}
                    className={`flex items-center gap-1.5 uppercase font-bold hover:underline ${post.isUpvoted ? 'underline font-extrabold' : ''}`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <div className="flex items-center gap-1.5 uppercase font-bold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} Comments</span>
                  </div>

                  <button
                    onClick={() => toggleBookmarkPost(post.id)}
                    className={`flex items-center gap-1.5 uppercase font-bold hover:underline ${post.isBookmarked ? 'underline font-extrabold' : ''}`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>

                {post.paperSlug && (
                  <Link
                    href={`/papers/${post.paperSlug}`}
                    className="px-3 py-1 bg-white text-black font-serif text-xs font-bold uppercase border border-white hover:bg-black hover:text-white"
                  >
                    Read Full Article →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
