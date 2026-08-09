'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Sparkles, Award, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navs = [
    { name: 'HOME', href: '/', icon: Home },
    { name: 'STREAM', href: '/feed', icon: Compass },
    { name: 'MATCH', href: '/match', icon: Sparkles },
    { name: 'REVIEWS', href: '/reviews', icon: Award },
    { name: 'PROFILE', href: '/profile', icon: User }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 sm:gap-2 px-4 py-2 bg-[#141210]/80 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {navs.map(nav => {
          const Icon = nav.icon;
          const isActive = pathname === nav.href || (nav.href !== '/' && pathname?.startsWith(nav.href));
          return (
            <Link
              key={nav.name}
              href={nav.href}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-full transition-all text-xs font-mono font-bold ${
                isActive 
                  ? 'bg-[#A68A64] text-[#0A0908] shadow-lg scale-105' 
                  : 'text-[#C5BCB2] hover:text-[#F4EFEA] hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline tracking-wider">{nav.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
