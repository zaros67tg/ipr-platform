'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CinematicSplashPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0D0C0B] flex items-center justify-center selection:bg-[#C85A32]/40">
      {/* Gothic Atmospheric Shadowed Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2000')`
        }}
      />
      {/* Deep Vignette & Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/90 to-[#0D0C0B]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D0C0B]/60 to-[#0D0C0B]" />

      {/* Pure Centerpiece */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl serif-title text-[#F4F0E8] tracking-tight leading-none drop-shadow-2xl">
            INDEPENDENT PRESS <br />
            <span className="text-[#C85A32]">OF REPUBLIC</span>
          </h1>

          <p className="text-base sm:text-xl font-mono text-[#E8E0D2] tracking-[0.25em] uppercase pt-2">
            Publish Free. Find Collaborators. Build Together.
          </p>

          <p className="text-xs sm:text-sm font-serif text-[#A8A198] italic max-w-lg mx-auto opacity-80 pt-1">
            "The Open Hub for Blogs, Projects, and Collaborators."
          </p>
        </div>

        {/* The Only Action */}
        <div className="pt-6 flex justify-center">
          <Link
            href="/feed"
            className="group relative px-10 py-4 bg-[#C85A32] hover:bg-[#B54E29] text-[#F4F0E8] font-mono font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-[0_0_40px_rgba(200,90,50,0.35)] hover:shadow-[0_0_60px_rgba(200,90,50,0.55)] hover:scale-105 inline-flex items-center justify-center gap-3 border border-white/20"
          >
            <span>Enter</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  );
}
