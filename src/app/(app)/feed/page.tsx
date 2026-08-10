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

// Asymmetric spanning patterns — 12-col grid chaos
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

const MIN_HEIGHTS = ['min-h-[520px]', 'min-h-[400px]', 'min-h-[500px]', 'min-h-[460px]', 'min-h-[600px]'];

export default function OrganizedChaosFeedPage() {
  const { posts, toggleUpvotePost, toggleBookmarkPost } = useApp();

  return (
    <div className="bg-black min-h-screen">
      {/* ── Masthead ── */}
      <div className="border-b border-white/10 px-6 lg:px-12 py-8 flex items-end justify-between">
        <div>
          <p className="font-ui text-[10px] uppercase tracking-[0.35em] text-white/30 mb-2">
            Volume I · Issue 1 · Open Edition
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700, letterSpacing: '-0.04em' }}
          >
            The Living Stream
          </h1>
        </div>
        <Link
          href="/submit"
          className="hidden sm:inline-block font-ui text-[11px] uppercase tracking-[0.2em] border border-white px-5 py-2.5 text-white hover:bg-white hover:text-black transition-colors"
        >
          + Publish
        </Link>
      </div>

      {/* ── Organized Chaos Poster Grid ── */}
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
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
            >
              <Link href={href} className="block h-full w-full relative">
                {/* ── Image (grayscale → color on hover) ── */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={img}
                    alt={post.title || post.authorName}
                    className="w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                </div>

                {/* ── Domain tag top-left ── */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="font-ui text-[9px] uppercase tracking-[0.25em] text-white/60 border border-white/20 px-2 py-1">
                    {post.authorDomain || 'Research'}
                  </span>
                </div>

                {/* ── Bottom content ── */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                  {post.title && (
                    <h2
                      className="font-display text-white leading-none mb-3 group-hover:opacity-90 transition-opacity"
                      style={{ fontSize: 'clamp(1.4rem, 3.5vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em' }}
                    >
                      {post.title}
                    </h2>
                  )}

                  {/* Author + date */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-6 h-6 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-white/60">
                      {post.authorName} · {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-5 border-t border-white/10 pt-3">
                    <button
                      onClick={e => { e.preventDefault(); toggleUpvotePost(post.id); }}
                      className={`flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest transition-opacity ${post.isUpvoted ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      {post.upvotes}
                    </button>
                    <span className="flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest opacity-40">
                      <MessageSquare className="w-3 h-3" />
                      {post.commentsCount}
                    </span>
                    <button
                      onClick={e => { e.preventDefault(); toggleBookmarkPost(post.id); }}
                      className={`flex items-center gap-1.5 font-ui text-[10px] uppercase tracking-widest transition-opacity ${post.isBookmarked ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
                    >
                      <Bookmark className="w-3 h-3" />
                      Save
                    </button>
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>

      {/* ── Footer rule ── */}
      <div className="border-t border-white/10 px-6 lg:px-12 py-6 flex items-center justify-between">
        <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/20">Independent Press of Republic</span>
        <Link href="/papers" className="font-ui text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
          View All Papers →
        </Link>
      </div>
    </div>
  );
}
