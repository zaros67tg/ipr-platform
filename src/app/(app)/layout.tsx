import React from 'react';
import { TopNav } from '@/components/shell/TopNav';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <TopNav />
      {/* ── Main layout wrapper — CIRCUIT 1: FORCE THE SPREAD ── */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 md:px-12 pt-24 pb-20">
        {children}
      </main>
      {/* Legal Footer */}
      <footer className="border-t border-current/10 px-4 md:px-12 py-6 flex flex-wrap items-center justify-between gap-4 w-full max-w-screen-2xl mx-auto">
        <span className="font-ui text-[10px] uppercase tracking-[0.25em] opacity-40">
          © 2026 Independent Press of Republic
        </span>
        <div className="flex items-center gap-6">
          <a href="/terms" className="font-ui text-[10px] uppercase tracking-[0.25em] opacity-40 hover:opacity-100 transition-opacity">Terms &amp; Conditions</a>
          <a href="/privacy" className="font-ui text-[10px] uppercase tracking-[0.25em] opacity-40 hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="/license" className="font-ui text-[10px] uppercase tracking-[0.25em] opacity-40 hover:opacity-100 transition-opacity">MIT License</a>
        </div>
      </footer>
    </div>
  );
}
