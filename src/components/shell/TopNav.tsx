'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { SearchModal } from '../common/SearchModal';
import { NotificationsDrawer } from './NotificationsDrawer';
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
      <header className="fixed top-0 left-0 w-full z-[100] bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center justify-between px-6 md:px-12">
        {/* Logo — links to /about, with placeholder slot for graphical logo */}
        <Link
          href="/about"
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
        >
          {/* Placeholder image slot — replace src with real logo when ready */}
          <img src="/logo-placeholder.png" alt="" className="w-8 h-8 hidden" />
          <span
            className="font-display text-white font-bold leading-none"
            style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '-0.04em' }}
          >
            IPR
          </span>
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

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-1 font-ui text-[12px] opacity-50 hover:opacity-100 transition-opacity"
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
                  className="absolute right-0 top-full mt-3 w-40 bg-black border border-white/10 z-50 py-1"
                >
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block font-ui text-[12px] px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block font-ui text-[12px] px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Settings
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block font-ui text-[12px] px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Preferences
                  </Link>
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left font-ui text-[12px] px-4 py-2.5 text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!session?.user && (
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
