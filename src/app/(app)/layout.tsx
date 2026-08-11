import React from 'react';
import { TopNav } from '@/components/shell/TopNav';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopNav />
      <main className="flex-1">
        {children}
      </main>
      {/* Legal Footer */}
      <footer className="border-t border-white/10 px-6 md:px-12 lg:px-24 py-6 flex flex-wrap items-center justify-between gap-4">
        <span className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/25">
          &copy; 2026 Independent Press of Republic
        </span>
        <div className="flex items-center gap-6">
          <a href="/terms" className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/25 hover:text-white transition-colors">Terms &amp; Conditions</a>
          <a href="/privacy" className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/25 hover:text-white transition-colors">Privacy Policy</a>
          <a href="/license" className="font-ui text-[10px] uppercase tracking-[0.25em] text-white/25 hover:text-white transition-colors">MIT License</a>
        </div>
      </footer>
    </div>
  );
}
