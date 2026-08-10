'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-16 h-7 border border-foreground/20 opacity-20 ${className}`} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`font-ui text-[10px] uppercase tracking-[0.2em] border border-foreground/30 hover:border-foreground bg-transparent text-foreground px-3 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer ${className}`}
      aria-label="Toggle light/dark theme"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun className="w-3 h-3 text-foreground" />
          <span>LIGHT</span>
        </>
      ) : (
        <>
          <Moon className="w-3 h-3 text-foreground" />
          <span>DARK</span>
        </>
      )}
    </button>
  );
}
