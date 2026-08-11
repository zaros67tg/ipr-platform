// CRITICAL: Validate auth secret at module load - fail fast
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('FATAL: BETTER_AUTH_SECRET is missing from environment');
}

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import * as schema from '@/db/schema';

// Fail fast: in production the canonical public URL is required for OAuth callbacks.
// A silent fallback to localhost would break every OAuth flow with a confusing error.
if (process.env.NODE_ENV === 'production' && !process.env.BETTER_AUTH_URL) {
  throw new Error('FATAL: BETTER_AUTH_URL is required in production');
}

// GitHub OAuth credentials must be present together. Missing creds silently disable
// the GitHub button in the UI with an opaque failure — surface the misconfig instead.
const hasGithubClientId = !!process.env.GITHUB_CLIENT_ID;
const hasGithubClientSecret = !!process.env.GITHUB_CLIENT_SECRET;
if (hasGithubClientId !== hasGithubClientSecret) {
  throw new Error('FATAL: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET must both be set');
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});
