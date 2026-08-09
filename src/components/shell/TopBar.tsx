'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/services/store';
import { Search, Bell, PlusCircle, User } from 'lucide-react';
import { CreditBadge } from '../common/CreditBadge';
import { SearchModal } from '../common/SearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { authClient } from '@/lib/auth-client';

export const TopBar: React.FC = () => {
  const { currentUser, unreadNotificationsCount } = useApp();
  const { data: session } = authClient.useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const activeName = session?.user?.name || currentUser.name;
  const activeAvatar = session?.user?.image || currentUser.avatarUrl;
  const activeCredits = 500;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0A0908]/90 backdrop-blur-md border-b border-[#E8E0D2]/10 px-4 sm:px-6 lg:px-10 flex items-center justify-between font-sans antialiased">
        {/* RESPONSIVE SERIF BRAND LOGO */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <h1 className="text-lg sm:text-2xl md:text-3xl serif-title font-bold tracking-tight text-[#E8E0D2] hover:text-[#C5A880] transition-colors truncate">
              INDEPENDENT PRESS OF REPUBLIC
            </h1>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 font-sans">
          {/* Quick Submit CTA */}
          <Link
            href="/submit"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8C6B4A]/25 hover:bg-[#8C6B4A]/40 text-[#E8E0D2] border border-[#8C6B4A]/50 rounded-md text-xs font-sans font-semibold transition-all shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Publish</span>
          </Link>

          {/* Credit Badge */}
          <CreditBadge credits={activeCredits} showUnlockHint />

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 sm:p-2 rounded-md bg-[#141210] border border-[#E8E0D2]/10 hover:border-[#8C6B4A]/50 text-[#B8AF9F] hover:text-[#E8E0D2] transition-colors flex items-center gap-1.5 text-xs font-sans"
            title="Global Search"
          >
            <Search className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="hidden lg:inline text-[#8C8275]">Search...</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-1.5 sm:p-2 rounded-md bg-[#141210] border border-[#E8E0D2]/10 hover:border-[#8C6B4A]/50 text-[#B8AF9F] hover:text-[#E8E0D2] transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8C6B4A] text-[#0A0908] rounded-full text-[9px] font-bold font-sans flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Identity */}
          {session?.user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1 rounded-md bg-[#141210] border border-[#E8E0D2]/10 hover:border-[#8C6B4A]/50 transition-colors"
            >
              <img
                src={activeAvatar}
                alt={activeName}
                className="w-7 h-7 rounded-full object-cover border border-[#8C6B4A]/60"
              />
              <div className="hidden md:block text-left pr-1 text-xs font-sans">
                <span className="font-semibold text-[#E8E0D2] block leading-none">{activeName}</span>
              </div>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1.5 bg-[#8C6B4A] hover:bg-[#A68A64] text-[#0A0908] rounded-md text-xs font-sans font-bold transition-all inline-flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationsDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
