'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const WORDS = ['INDEPENDENT', 'PRESS', 'OF', 'REPUBLIC'];

export default function KineticGatePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'entering' | 'ready' | 'shattering'>('entering');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // After words animate in, set ready
    const timer = setTimeout(() => setPhase('ready'), WORDS.length * 180 + 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (phase !== 'ready') return;
    setPhase('shattering');
    setTimeout(() => router.push('/feed'), 900);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative h-screen w-screen bg-black overflow-hidden select-none"
      style={{ cursor: 'none' }}
    >
      {/* ── Monochrome background texture lines ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)',
        }}
      />

      {/* ── Word-by-word cinematic title ── */}
      <AnimatePresence>
        {phase !== 'shattering' && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-4 px-6"
            exit={{
              y: '-100%',
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <div className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-1 sm:gap-y-3">
              {WORDS.map((word, i) => (
                <motion.span
                  key={word}
                  className="font-display block leading-none text-white"
                  style={{
                    fontSize: 'clamp(3.5rem, 12vw, 11rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.9,
                  }}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.18,
                    duration: 0.7,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Subtitle + CTA hint */}
            <motion.div
              className="mt-12 flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'ready' ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-ui text-xs uppercase tracking-[0.3em] text-white/50">
                Open Research · Peer Review · Co-Author Matchmaking
              </p>
              <motion.div
                className="mt-4 px-8 py-3 border border-white font-ui text-xs uppercase tracking-[0.25em] text-white"
                animate={phase === 'ready' ? {
                  opacity: [0.6, 1, 0.6],
                } : { opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              >
                CLICK ANYWHERE TO ENTER
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Subtle corner label ── */}
      <div className="absolute bottom-8 left-8 font-ui text-[10px] uppercase tracking-[0.3em] text-white/20">
        IPR — Est. 2026
      </div>
      <div className="absolute bottom-8 right-8 font-ui text-[10px] uppercase tracking-[0.3em] text-white/20">
        Open Edition I
      </div>
    </div>
  );
}