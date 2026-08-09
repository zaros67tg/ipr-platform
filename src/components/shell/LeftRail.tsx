'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Compass, 
  FileText, 
  FolderGit2, 
  Users, 
  Sparkles, 
  Flame, 
  BookMarked, 
  Award,
  BookOpen
} from 'lucide-react';

export const LeftRail: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Stream', href: '/feed', icon: Flame },
    { name: 'Publications', href: '/papers', icon: FileText },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Matchmaker', href: '/match', icon: Sparkles },
    { name: 'Peer Reviews', href: '/reviews', icon: Award },
    { name: 'Collaborators', href: '/people', icon: Users },
    { name: 'My Bookmarks', href: '/bookmarks', icon: BookMarked },
    { name: 'My Citations', href: '/citations', icon: BookOpen }
  ];

  return (
    <div className="space-y-6 font-sans text-sm antialiased">
      {/* Clean Smooth Navigation Links (14px font-medium, no pixel font, no wide tracking) */}
      <div className="pb-4 border-b border-[#E8E0D2]/10 space-y-2">
        <h3 className="text-xs font-sans text-[#8C8275] uppercase tracking-wider mb-3 font-semibold px-2">
          Navigation
        </h3>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <motion.div key={item.name} whileTap={{ scale: 0.97 }}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md font-sans text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#E8E0D2] bg-[#8C6B4A]/20 border-l-2 border-[#8C6B4A] pl-3.5 font-semibold'
                      : 'text-[#B8AF9F] hover:text-[#E8E0D2] hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-[#8C8275]'}`} />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Editorial Quote */}
      <div className="px-2">
        <p className="text-xs font-serif italic text-[#8C8275] leading-relaxed">
          "Review to Submit. Match to Collaborate. Publish Free."
        </p>
      </div>
    </div>
  );
};
