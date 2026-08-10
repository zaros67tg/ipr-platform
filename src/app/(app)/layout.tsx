import React from 'react';
import { TopNav } from '@/components/shell/TopNav';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      {/* Single content column — no sidebars */}
      <main className="pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
