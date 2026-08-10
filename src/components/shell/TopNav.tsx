'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { SearchModal } from '../common/SearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';

const NAV_LINKS = [
  { label: 'Stream', href: '/feed' },
  { label: 'Papers', href: '/papers' },
  { label: 'Match', href: '/match' },
  { label: 'Projects', href: '/projects' },
  { label: 'People', href: '/people' },
];

export function TopNav() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/95 border-b border-white/8 flex items-center justify-between px-6 lg:px-12">
        {/* Logo — massive & crisp */}
        <Link
          href="/"
          className="font-display text-white font-bold leading-none select-none hover:opacity-70 transition-opacity"
          style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', letterSpacing: '-0.04em' }}
        >
          IPR
        </Link>

        {/* Center Nav — generous spacing */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-ui text-[13px] transition-opacity"
                style={{ opacity: isActive ? 1 : 0.5, fontWeight: isActive ? 600 : 400 }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-[1px] left-0 right-0 h-px bg-white"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-6">
          <Link
            href="/submit"
            className="hidden sm:inline-block font-ui text-[12px] border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            Publish
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            className="font-ui text-[12px] opacity-50 hover:opacity-100 transition-opacity"
          >
            Search
          </button>
          <button
            onClick={() => setNotifOpen(true)}
            className="font-ui text-[12px] opacity-50 hover:opacity-100 transition-opacity"
          >
            Alerts
          </button>
          {session?.user ? (
            <Link href="/profile" className="font-ui text-[12px] opacity-50 hover:opacity-100 transition-opacity">
              Profile
            </Link>
          ) : (
            <Link href="/auth" className="font-ui text-[12px] opacity-50 hover:opacity-100 transition-opacity">
              Sign In
            </Link>
          )}
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
