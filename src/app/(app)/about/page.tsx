'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const PILLARS = [
  {
    number: 'I',
    title: 'Open Publishing',
    body: 'Every researcher, regardless of institution, credential, or geography, deserves the right to publish. We remove the gatekeepers and return science to the people.',
  },
  {
    number: 'II',
    title: 'Reciprocal Review',
    body: 'Peer review is a commons. Those who submit must contribute to it. Our credit system enforces this contract — review to publish, publish to advance.',
  },
  {
    number: 'III',
    title: 'Radical Collaboration',
    body: 'The lone genius is a myth. Our matchmaking engine pairs researchers by complementary skill and need — not by prestige, geography, or affiliation.',
  },
  {
    number: 'IV',
    title: 'Living Documents',
    body: 'A published paper is not a tombstone. Every manuscript on IPR is versioned, forkable, and annotatable. Knowledge compounds in the open.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen w-full max-w-[1600px] mx-auto px-6 md:px-12 pt-6 pb-20">
      {/* ── Hero Manifesto ── */}
      <div className="border-b border-white/10 pt-4 pb-20">
        <motion.p
          className="font-ui text-[10px] uppercase tracking-[0.45em] text-white/25 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Who We Are · The Manifesto
        </motion.p>

        <motion.h1
          className="font-display text-white leading-none mb-12 max-w-5xl"
          style={{ fontSize: 'clamp(3rem, 9vw, 9.5rem)', fontWeight: 600, letterSpacing: '-0.05em' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Science belongs to everyone. Full stop.
        </motion.h1>

        <motion.div
          className="max-w-2xl space-y-5 border-l-2 border-white/15 pl-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p
            className="font-display italic text-white/70 leading-relaxed"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', letterSpacing: '-0.01em' }}
          >
            The Independent Press of Republic is not a journal. It is not a platform. It is a covenant.
          </p>
          <p className="font-ui text-[14px] text-white/50 leading-relaxed">
            We built IPR because the existing infrastructure of academic publishing is broken — captured by legacy institutions, paywalled from the public it serves, and hostile to independent researchers working at the edges of knowledge.
          </p>
          <p className="font-ui text-[14px] text-white/50 leading-relaxed">
            We believe the next major breakthroughs in science will not come from inside institutional walls. They will come from independent researchers, collaborative networks, and people who refuse to wait for permission.
          </p>
        </motion.div>
      </div>

      {/* ── Four Pillars ── */}
      <div className="border-b border-white/10 py-16">
        <div>
          <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-white/25 mb-10">
            The Four Pillars
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/8">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.number}
                className="bg-black p-10 space-y-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className="font-display text-white/15 leading-none"
                    style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.05em' }}
                  >
                    {pillar.number}
                  </span>
                  <h2
                    className="font-display text-white"
                    style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 600, letterSpacing: '-0.03em' }}
                  >
                    {pillar.title}
                  </h2>
                </div>
                <p className="font-ui text-[14px] text-white/50 leading-relaxed">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 border-b border-white/10">
        {[
          { value: 'Open', label: 'Always Free' },
          { value: '∞', label: 'No Paywalls' },
          { value: '4', label: 'Core Pillars' },
          { value: '2026', label: 'Founded' },
        ].map(stat => (
          <div key={stat.label} className="bg-black px-8 py-10">
            <div
              className="font-display text-white mb-1"
              style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
            >
              {stat.value}
            </div>
            <div className="font-ui text-[11px] uppercase tracking-[0.25em] text-white/30">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div className="py-20 flex flex-col items-center text-center gap-8">
        <h3
          className="font-display text-white leading-none"
          style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', fontWeight: 600, letterSpacing: '-0.04em' }}
        >
          Join the Republic.
        </h3>
        <p className="font-ui text-[14px] text-white/40 max-w-md">
          Publish your research, find collaborators, complete peer reviews, and build the open science network we deserve.
        </p>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/feed" className="font-ui text-[12px] uppercase tracking-[0.2em] border border-white px-8 py-4 hover:bg-white hover:text-black transition-colors">
            Enter the Stream
          </Link>
          <Link href="/submit" className="font-ui text-[12px] uppercase tracking-[0.2em] border border-white/20 px-8 py-4 text-white/50 hover:border-white hover:text-white transition-colors">
            Publish a Paper
          </Link>
        </div>
      </div>
    </div>
  );
}
