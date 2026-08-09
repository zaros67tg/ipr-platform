'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

export default function FeedStreamPage() {
  const { posts, toggleUpvotePost, toggleBookmarkPost } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="space-y-8 font-sans antialiased"
    >
      {/* PRESERVE SERIF HEADER */}
      <div className="border-b border-[#E8E0D2]/10 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl serif-title font-bold text-[#E8E0D2] mb-1">
            The Living Stream
          </h1>
          <p className="text-sm font-sans text-[#B8AF9F] leading-relaxed">
            Open-source research, blogs, projects, and collaboration calls.
          </p>
        </div>

        <motion.div whileTap={{ scale: 0.95 }}>
          <Link
            href="/submit"
            className="px-4 py-2 bg-[#8C6B4A] hover:bg-[#A68A64] text-[#0A0908] rounded-md font-sans text-xs font-semibold transition-all shadow-sm shrink-0 inline-block"
          >
            + Publish
          </Link>
        </motion.div>
      </div>

      {/* Substack-Style Feed Cards */}
      <div className="space-y-8">
        {posts.map(post => {
          const coverImg = (post.paperSlug && FEED_COVER_IMAGES[post.paperSlug]) || DEFAULT_COVER;

          return (
            <motion.div 
              key={post.id}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="newspaper-card overflow-hidden group border border-[#E8E0D2]/10 hover:border-[#8C6B4A]/50 transition-colors"
            >
              {/* TOP OF CARD: Edge-to-Edge Cover Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#0A0908]">
                <img 
                  src={coverImg} 
                  alt={post.title || post.authorName}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908]/90 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <DisciplineTag domain={post.authorDomain} size="sm" />
                </div>
              </div>

              {/* BOTTOM OF CARD: Smooth Content */}
              <div className="p-5 sm:p-6 space-y-3.5">
                {/* Author Info */}
                <div className="flex items-center gap-2.5">
                  <img 
                    src={post.authorAvatar} 
                    alt={post.authorName} 
                    className="w-8 h-8 rounded-full object-cover border border-[#E8E0D2]/20" 
                  />
                  <div>
                    <span className="text-sm font-semibold font-sans text-[#E8E0D2] block leading-tight">{post.authorName}</span>
                    <span className="text-xs font-sans text-[#8C8275]">
                      {formatDate(post.createdAt)} • {post.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* PRESERVE ELEGANT SERIF TITLE */}
                {post.title && (
                  <h2 className="text-xl sm:text-2xl serif-title font-bold text-[#E8E0D2] group-hover:text-[#C5A880] transition-colors leading-snug">
                    <Link href={post.paperSlug ? `/papers/${post.paperSlug}` : '/feed'}>
                      {post.title}
                    </Link>
                  </h2>
                )}

                {/* Abstract Text */}
                <p className="text-sm sm:text-base text-[#B8AF9F] font-serif leading-relaxed line-clamp-3">
                  {post.content}
                </p>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E8E0D2]/10 text-xs font-sans text-[#8C8275]">
                  <div className="flex items-center gap-5">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleUpvotePost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${post.isUpvoted ? 'text-[#C5A880] font-semibold' : 'hover:text-[#E8E0D2]'}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.upvotes}</span>
                    </motion.button>

                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} Comments</span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleBookmarkPost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${post.isBookmarked ? 'text-[#C5A880] font-semibold' : 'hover:text-[#E8E0D2]'}`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </motion.button>
                  </div>

                  {post.paperSlug && (
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Link
                        href={`/papers/${post.paperSlug}`}
                        className="px-3.5 py-1.5 bg-[#8C6B4A]/20 hover:bg-[#8C6B4A]/35 text-[#C5A880] font-semibold rounded-md text-xs font-sans transition-colors border border-[#8C6B4A]/40 inline-block"
                      >
                        Read Full →
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
