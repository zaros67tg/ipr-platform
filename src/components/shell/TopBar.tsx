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
      <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#000000] border-b border-white px-6 lg:px-10 flex items-center justify-between font-serif">
        {/* BRAND TITLE */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold tracking-tight text-white hover:underline transition-colors uppercase">
              INDEPENDENT PRESS OF REPUBLIC
            </h1>
          </Link>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 font-serif">
          {/* Quick Submit CTA */}
          <Link
            href="/submit"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-white text-black font-serif text-xs font-bold transition-all border border-white hover:bg-black hover:text-white"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publish</span>
          </Link>

          {/* Credit Badge */}
          <CreditBadge credits={activeCredits} showUnlockHint />

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2 text-xs font-serif"
            title="Global Search"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Search...</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-1.5 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white text-black text-[9px] font-bold flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Identity */}
          {session?.user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 p-1 bg-black border border-white hover:bg-white hover:text-black transition-colors text-xs font-serif"
            >
              <img
                src={activeAvatar}
                alt={activeName}
                className="w-6 h-6 object-cover border border-white"
              />
              <span className="hidden md:inline font-semibold">{activeName}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-3 py-1 bg-white text-black font-serif text-xs font-bold transition-all inline-flex items-center gap-1.5 border border-white hover:bg-black hover:text-white"
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
