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
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#000000] text-[#FFFFFF] font-serif selection:bg-white selection:text-black">
      <TopBar />
      
      {/* Classic Print Newspaper 3-Column Grid Layout */}
      <div className="pt-16 flex-1 h-[calc(100vh-4rem)] w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Column (1px Solid White Border Divider) */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] border-r border-white p-5 bg-[#000000]">
          <LeftRail />
        </aside>

        {/* Center Column (THE ONLY SCROLLING CONTAINER) */}
        <main className="col-span-12 lg:col-span-9 xl:col-span-7 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] min-w-0 break-words px-4 sm:px-8 py-6 bg-[#000000]">
          {children}
        </main>

        {/* Right Column (1px Solid White Border Divider) */}
        <aside className="hidden xl:block xl:col-span-3 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] border-l border-white p-5 bg-[#000000]">
          <RightRail />
        </aside>
      </div>
    </div>
  );
}
