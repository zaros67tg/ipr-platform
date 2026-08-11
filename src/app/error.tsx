'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('[FATAL SYSTEM EXCEPTION]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <AlertTriangle className="w-20 h-20 text-white mx-auto animate-pulse" />
        <h1 className="font-display text-6xl md:text-8xl text-white tracking-tight">
          FATAL SYSTEM EXCEPTION
        </h1>
        <p className="font-mono text-sm text-white/40 uppercase tracking-widest">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-4 justify-center mt-12">
          <button
            onClick={reset}
            className="px-8 py-4 border border-white font-mono text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors"
          >
            RETRY OPERATION
          </button>
          <button
            onClick={() => router.push('/feed')}
            className="px-8 py-4 border border-white/30 font-mono text-xs uppercase tracking-widest text-white/50 hover:text-white hover:border-white transition-colors"
          >
            REBOOT ROUTE
          </button>
        </div>
        {error.digest && (
          <p className="font-mono text-[10px] text-white/20 mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}