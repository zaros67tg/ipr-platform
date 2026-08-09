import React from 'react';
import { TopBar } from "@/components/shell/TopBar";
import { LeftRail } from "@/components/shell/LeftRail";
import { RightRail } from "@/components/shell/RightRail";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#0A0908] text-[#E8E0D2] font-sans selection:bg-[#8C6B4A]/35">
      <TopBar />
      
      {/* Responsive Auto-Adjusting CSS Grid Layout */}
      <div className="pt-16 flex-1 h-[calc(100vh-4rem)] w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Column (Responsive Grid Col 2.5 / Col 3) */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] border-r border-[#E8E0D2]/10 p-5">
          <LeftRail />
        </aside>

        {/* Center Column (Responsive Grid Col 6 / Col 7 - THE ONLY SCROLLING CONTAINER) */}
        <main className="col-span-12 lg:col-span-9 xl:col-span-7 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] min-w-0 break-words px-4 sm:px-8 py-6">
          {children}
        </main>

        {/* Right Column (Responsive Grid Col 3) */}
        <aside className="hidden xl:block xl:col-span-3 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] border-l border-[#E8E0D2]/10 p-5">
          <RightRail />
        </aside>
      </div>
    </div>
  );
}
