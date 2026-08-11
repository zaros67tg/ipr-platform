import { createAuthClient } from 'better-auth/react';

// CRITICAL FIX: Use NEXT_PUBLIC_ prefix so browser can access this variable
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
});

export const { useSession, signIn, signOut } = authClient;