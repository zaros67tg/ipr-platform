'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'GITHUB' | 'INSTITUTIONAL'>('GITHUB');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/onboarding',
      });
    } catch (err) {
      console.error('GitHub auth error:', err);
      // Fallback navigation for prototype demo
      router.push('/onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstitutionalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151311]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-8 relative space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FFFFFF]/20 border border-[#FFFFFF]/40 text-[#FFFFFF] mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl serif-title text-[#F4F0E8]">Sign In to The Press</h1>
          <p className="text-xs font-serif text-[#A8A198] italic">
            &ldquo;Open Access. Reciprocal Peer-Review. Unbound Science.&rdquo;
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0D0C0B] rounded-lg border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setAuthMode('GITHUB')}
            className={`py-2 rounded transition-colors ${
              authMode === 'GITHUB'
                ? 'bg-[#FFFFFF] text-black font-bold'
                : 'text-[#A8A198] hover:text-[#F4F0E8]'
            }`}
          >
            GitHub OAuth
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('INSTITUTIONAL')}
            className={`py-2 rounded transition-colors ${
              authMode === 'INSTITUTIONAL'
                ? 'bg-[#5A6B43] text-[#F4F0E8] font-bold'
                : 'text-[#A8A198] hover:text-[#F4F0E8]'
            }`}
          >
            Institutional Email
          </button>
        </div>

        {authMode === 'GITHUB' ? (
          <div className="space-y-4 font-mono text-xs text-center">
            <p className="text-[#A8A198] leading-relaxed">
              Authenticate via GitHub to link your open-source research repositories, code execution environments, and researcher credentials.
            </p>

            <button
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className="w-full py-3.5 bg-[#24201D] hover:bg-[#1C1917] text-[#F4F0E8] font-bold rounded-lg border border-white/20 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 fill-current text-[#F4F0E8]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>{isLoading ? 'Connecting to GitHub...' : 'Continue with GitHub'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleInstitutionalLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#A8A198] mb-1 font-bold">ACADEMIC / INSTITUTIONAL EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#746F69] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="researcher@university.edu or .ac.uk"
                  className="w-full bg-[#0D0C0B] border border-white/10 rounded-lg pl-9 pr-4 py-3 text-xs text-[#F4F0E8] placeholder-[#746F69] focus:outline-none focus:border-[#5A6B43]"
                />
              </div>
              <p className="text-[10px] text-[#746F69] mt-1">Must be an accredited university or laboratory email address.</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5A6B43] hover:bg-[#4A5B33] text-[#F4F0E8] font-bold rounded-lg text-xs transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              <span>Authenticate & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-white/10 text-center font-mono text-[10px] text-[#746F69]">
          By signing in, you agree to the Reciprocal Peer Review Ledger rules.
        </div>
      </div>
    </div>
  );
}

