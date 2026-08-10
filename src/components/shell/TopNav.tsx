'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { SearchModal } from '../common/SearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';

const NAV_LINKS = [
  { label: 'STREAM', href: '/feed' },
  { label: 'PAPERS', href: '/papers' },
  { label: 'MATCH', href: '/match' },
  { label: 'PROJECTS', href: '/projects' },
  { label: 'PEOPLE', href: '/people' },
  { label: 'SUBMIT', href: '/submit' },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 h-14 bg-black border-b border-white/10 flex items-center justify-between px-6 lg:px-12"
        style={{ backdropFilter: 'none' }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-white font-bold tracking-tight hover:opacity-70 transition-opacity"
          style={{ fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)', letterSpacing: '-0.02em' }}
        >
          IPR
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-ui text-[11px] uppercase tracking-[0.2em] transition-opacity"
                style={{ opacity: isActive ? 1 : 0.45 }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-[1px] left-0 right-0 h-px bg-white"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setSearchOpen(true)}
            className="font-ui text-[11px] uppercase tracking-[0.2em] opacity-45 hover:opacity-100 transition-opacity"
          >
            SEARCH
          </button>
          <button
            onClick={() => setNotifOpen(true)}
            className="font-ui text-[11px] uppercase tracking-[0.2em] opacity-45 hover:opacity-100 transition-opacity"
          >
            ALERTS
          </button>
          {session?.user ? (
            <Link
              href="/profile"
              className="font-ui text-[11px] uppercase tracking-[0.2em] opacity-45 hover:opacity-100 transition-opacity"
            >
              PROFILE
            </Link>
          ) : (
            <Link
              href="/auth"
              className="font-ui text-[11px] uppercase tracking-[0.2em] opacity-45 hover:opacity-100 transition-opacity"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
