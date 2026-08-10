'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ClassicPrintNewspaperSplashPage() {
  return (
    <div className="h-screen w-screen bg-[#000000] text-[#FFFFFF] font-serif flex items-center justify-center selection:bg-white selection:text-black p-6">
      {/* Newspaper Border Box */}
      <main className="max-w-4xl mx-auto border-2 border-white p-8 sm:p-12 text-center space-y-8 bg-black">
        <div className="space-y-6 border-b border-white pb-8">
          <span className="text-xs font-serif uppercase tracking-widest text-white/80 block">
            THE OFFICIAL DISPATCH JOURNAL • EST. 2026
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold text-white tracking-tight uppercase leading-none">
            INDEPENDENT PRESS <br /> OF REPUBLIC
          </h1>

          <p className="text-sm sm:text-base font-serif text-white uppercase tracking-widest font-bold">
            Publish Free. Find Collaborators. Build Together.
          </p>

          <p className="text-xs sm:text-sm font-serif italic text-white/80 max-w-md mx-auto">
            "The Open Science & Creative Research Network"
          </p>
        </div>

        {/* Entry Gate Button */}
        <div className="pt-4 flex justify-center">
          <Link
            href="/feed"
            className="px-8 py-3 bg-white text-black font-serif text-sm font-bold uppercase tracking-wider border border-white hover:bg-black hover:text-white transition-colors inline-flex items-center gap-3"
          >
            <span>Enter The Republic</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
