'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <div className="space-y-6 font-serif text-sm">
      {/* Newspaper Column Navigation */}
      <div className="pb-4 border-b border-white space-y-2">
        <h3 className="text-xs font-serif uppercase tracking-widest mb-3 font-bold px-1 text-white border-b border-white/30 pb-1">
          NAVIGATION
        </h3>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-serif transition-colors ${
                  isActive
                    ? 'bg-white text-black font-bold'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Editorial Motto */}
      <div className="px-1">
        <p className="text-xs font-serif italic text-white/80 leading-relaxed border-l border-white pl-2">
          "Review to Submit. Match to Collaborate. Publish Free."
        </p>
      </div>
    </div>
  );
};
