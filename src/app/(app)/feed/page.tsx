'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/services/store';
import { ThumbsUp, MessageSquare, Bookmark } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';

const COVER_IMAGES: Record<string, string> = {
  'temporal-stability-sparse-spiking-architectures':
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600',
  'topological-invariants-quantum-gravity':
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1600',
  'formal-constraints-emergent-computation':
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=1600',
  'geometric-methods-distributed-robotic-navigation':
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600',
  'lattice-crypto-microarchitectural-isolation':
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1600',
  'sparse-graph-neural-networks-protein-folding':
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1600',
};
const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600';

// Asymmetric 12-col span patterns
const SPANS = [
  'col-span-12 sm:col-span-8',
  'col-span-12 sm:col-span-4',
  'col-span-12 sm:col-span-4',
  'col-span-12 sm:col-span-8',
  'col-span-12 sm:col-span-6',
  'col-span-12 sm:col-span-6',
  'col-span-12',
  'col-span-12 sm:col-span-5',
  'col-span-12 sm:col-span-7',
];
const MIN_HEIGHTS = ['min-h-[540px]', 'min-h-[420px]', 'min-h-[500px]', 'min-h-[480px]', 'min-h-[620px]'];

export default function FeedPage() {
  const { posts, toggleUpvotePost, toggleBookmarkPost } = useApp();

  return (
    <div className="bg-black min-h-screen w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-6 pb-20">
      {/* ── Masthead — fixed top padding ── */}
      <div className="border-b border-white/10 pb-8 flex items-end justify-between">
        <div>
          <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-white/30 mb-3">
            Volume I · Issue 1 · Open Edition
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
          >
            The Living Stream
          </h1>
        </div>
        <Link
          href="/submit"
          className="hidden sm:inline-block font-ui text-[12px] border border-white/30 px-5 py-2.5 text-white hover:bg-white hover:text-black transition-colors"
        >
          + Publish
        </Link>
      </div>

      {/* ── Poster Grid — full color, zoom on hover ── */}
      <div className="poster-grid">
        {posts.map((post, i) => {
          const img = (post.paperSlug && COVER_IMAGES[post.paperSlug]) || DEFAULT_IMG;
          const span = SPANS[i % SPANS.length];
          const minH = MIN_HEIGHTS[i % MIN_HEIGHTS.length];
          const href = post.paperSlug ? `/papers/${post.paperSlug}` : '/feed';

          return (
            <motion.article
              key={post.id}
              className={`${span} ${minH} relative overflow-hidden group`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.07 }}
            >
              <Link href={href} className="block h-full w-full relative">
                {/* ── Full Color Image — cinematic zoom on hover ── */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={img}
                    alt={post.title || post.authorName}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:brightness-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/70 group-hover:via-black/20" />
                </div>

                {/* ── Domain pill ── */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="font-ui text-[9px] uppercase tracking-[0.25em] text-white/70 border border-white/20 bg-black/40 px-2 py-1">
                    {post.authorDomain || 'Research'}
                  </span>
                </div>

                {/* ── Bottom content — slides up on hover ── */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  {post.title && (
                    <h2
                      className="font-display text-white leading-none mb-4"
                      style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3.5rem)', fontWeight: 600, letterSpacing: '-0.03em' }}
                    >
                      {post.title}
                    </h2>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-6 h-6 object-cover"
                    />
                    <span className="font-ui text-[10px] uppercase tracking-[0.15em] text-white/60">
                      {post.authorName} · {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-5 border-t border-white/10 pt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={e => { e.preventDefault(); toggleUpvotePost(post.id); }}
                      className={`flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest transition-opacity ${post.isUpvoted ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                    >
                      <ThumbsUp className="w-3 h-3" /> {post.upvotes}
                    </button>
                    <span className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest opacity-50">
                      <MessageSquare className="w-3 h-3" /> {post.commentsCount}
                    </span>
                    <button
                      onClick={e => { e.preventDefault(); toggleBookmarkPost(post.id); }}
                      className={`flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest transition-opacity ${post.isBookmarked ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                    >
                      <Bookmark className="w-3 h-3" /> Save
                    </button>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>

      <div className="border-t border-white/10 py-6 flex items-center justify-between">
        <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/20">Independent Press of Republic</span>
        <Link href="/papers" className="font-ui text-[11px] text-white/40 hover:text-white transition-colors">
          View All Papers →
        </Link>
      </div>
    </div>
  );
}
