'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { SearchModal } from '../common/SearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { ThemeToggle } from './ThemeToggle';
import { ChevronDown } from 'lucide-react';

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
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    authClient.signOut().then(() => {
      window.location.href = '/auth';
    });
  };

  return (
    <>
      {/* ── Fixed Top Navigation Bar — Semantic Light/Dark ── */}
      <header className="fixed top-0 left-0 w-full z-50 h-16 bg-background/90 backdrop-blur-md border-b border-foreground/10 flex items-center justify-between px-4 md:px-12 transition-colors duration-300">
        {/* Logo — links to /about */}
        <Link
          href="/about"
          className="flex items-center gap-2.5 hover:opacity-75 transition-opacity text-foreground"
        >
          <img src="/logo-placeholder.png" alt="" className="w-8 h-8 hidden" />
          <span
            className="font-display font-bold leading-none select-none text-foreground"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '-0.04em' }}
          >
            IPR
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-ui text-[13px] text-foreground transition-opacity"
                style={{ opacity: isActive ? 1 : 0.5, fontWeight: isActive ? 600 : 400 }}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-[1px] left-0 right-0 h-px bg-foreground"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/submit"
            className="hidden sm:inline-block font-ui text-[12px] border border-foreground/30 px-4 py-1.5 bg-foreground text-background hover:opacity-80 transition-opacity font-bold"
          >
            Publish
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="font-ui text-[12px] text-foreground opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            Search
          </button>

          <button
            onClick={() => setNotifOpen(true)}
            className="font-ui text-[12px] text-foreground opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          >
            Alerts
          </button>

          {/* Stark Brutalist Light/Dark Theme Switcher */}
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-1 font-ui text-[12px] text-foreground opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            >
              {session?.user?.name?.split(' ')[0] || 'Profile'}
              <ChevronDown className={`w-3 h-3 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-44 bg-background border border-foreground/20 z-50 py-1"
                >
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block font-ui text-[12px] px-4 py-2.5 opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block font-ui text-[12px] px-4 py-2.5 opacity-60 hover:opacity-100 hover:bg-foreground/5 transition-colors"
                  >
                    Settings &amp; Preferences
                  </Link>
                  <div className="border-t border-foreground/10 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left font-ui text-[12px] px-4 py-2.5 opacity-40 hover:opacity-100 hover:bg-foreground/5 transition-colors cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!session?.user && (
            <Link href="/auth" className="font-ui text-[12px] text-foreground opacity-50 hover:opacity-100 transition-opacity">
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
