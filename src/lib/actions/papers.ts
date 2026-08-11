'use server';

import { randomUUID } from 'crypto';
import { db } from '@/db';
import { papers, users, reviewCreditsLedger } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { Paper, PaperStatus, ResearchDomain } from '@/types';

// Server-side input limits (client-side maxLength can be bypassed)
const TITLE_MAX = 180;
const ABSTRACT_MAX = 3000;
const CONTENT_MAX = 200_000;

/**
 * Server Action: Queries live papers with PAGINATION to prevent full table scans.
 */
export async function getPapers(limit = 20, offset = 0) {
  try {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeOffset = Math.max(offset, 0);
    const livePapers = await db
      .select()
      .from(papers)
      .orderBy(desc(papers.createdAt))
      .limit(safeLimit)
      .offset(safeOffset);
    return livePapers;
  } catch (err) {
    console.error('Failed to query live papers from database:', err);
    return [];
  }
}

export async function getLivePapers(limit = 20, offset = 0): Promise<Paper[]> {
  const dbPapers = await getPapers(limit, offset);
  if (dbPapers && dbPapers.length > 0) {
    return dbPapers.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      abstract: p.abstract,
      authors: [{
        id: p.authorId,
        name: p.authorName,
        handle: `@${p.authorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        avatarUrl: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      }],
      primaryDomain: p.primaryDomain as ResearchDomain,
      subdomains: [],
      keywords: [p.primaryDomain],
      currentVersion: p.currentVersion,
      status: p.status as PaperStatus,
      license: p.license,
      readingTimeMinutes: p.readingTimeMinutes,
      repositoryUrl: p.repositoryUrl || undefined,
      codespacesUrl: p.repositoryUrl ? `https://github.com/codespaces/new?repo=${p.repositoryUrl.replace('https://github.com/', '')}` : undefined,
      citationCount: p.citationCount,
      forkCount: p.forkCount,
      upvoteCount: p.upvoteCount,
      createdAt: p.createdAt.toISOString(),
      publishedAt: p.publishedAt.toISOString(),
      versions: [{
        version: p.currentVersion,
        releasedAt: p.publishedAt.toISOString(),
        changelog: 'Initial version',
        blocks: [{ id: `b_live_1`, type: 'paragraph' as const, content: p.contentMdx, commentsCount: 0 }]
      }]
    }));
  }
  return [];
}

/**
 * Server-side input validation. Returns a human-readable error string or null.
 */
function validatePaperInput(data: {
  title?: string;
  abstract?: string;
  contentMdx?: string;
  primaryDomain?: string;
  repositoryUrl?: string;
}): string | null {
  const title = (data.title ?? '').trim();
  const abstract = (data.abstract ?? '').trim();
  const contentMdx = (data.contentMdx ?? '').trim();
  const primaryDomain = (data.primaryDomain ?? '').trim();

  if (!title) return 'Title is required.';
  if (title.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or fewer.`;
  if (!abstract) return 'Abstract is required.';
  if (abstract.length > ABSTRACT_MAX) return `Abstract must be ${ABSTRACT_MAX} characters or fewer.`;
  if (!contentMdx) return 'Manuscript content is required.';
  if (contentMdx.length > CONTENT_MAX) return `Manuscript exceeds the ${CONTENT_MAX.toLocaleString()} character limit.`;
  if (!primaryDomain) return 'Primary domain is required.';
  if (data.repositoryUrl && !/^https?:\/\/.+\..+/.test(data.repositoryUrl)) {
    return 'Repository URL must be a valid http(s) URL.';
  }
  return null;
}

/**
 * Server Action: Submits paper with ATOMIC TRANSACTION and SERVER-SIDE AUTH.
 * SECURITY:
 *  - userId is NEVER accepted from client - extracted from session only.
 *  - Balance is checked and deducted under a row lock (FOR UPDATE) inside the
 *    transaction, preventing concurrent double-spend of review credits.
 *  - Raw errors are never leaked to the client.
 */
export async function submitPaper(data: {
  userName: string;
  userAvatar?: string;
  title: string;
  abstract: string;
  contentMdx: string;
  primaryDomain: string;
  repositoryUrl?: string;
}) {
  // Validate inputs BEFORE touching the DB
  const validationError = validatePaperInput(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    // Extract userId from session - NEVER trust client
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user?.id) {
      return { success: false, error: '401 Unauthorized: Authentication required' };
    }

    const userId = session.user.id;
    const title = data.title.trim();
    const abstract = data.abstract.trim();
    const contentMdx = data.contentMdx.trim();
    const primaryDomain = data.primaryDomain.trim();
    const repositoryUrl = data.repositoryUrl?.trim() || undefined;

    // ATOMIC + RACE-SAFE: the whole operation happens in one transaction with a
    // locked read of the user row. Two concurrent submissions cannot both pass
    // the 3-credit check.
    const result = await db.transaction(async (tx) => {
      // Lock the user row for the duration of the transaction
      const [lockedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .for('update');

      const currentBalance = lockedUser?.reviewCredits ?? 0;
      if (currentBalance < 3) {
        throw new Error(
          `Insufficient Review Credits. Required: 3, Available: ${currentBalance}.`
        );
      }

      const newBalance = currentBalance - 3;
      const paperId = `pap_${randomUUID()}`;

      // Slug: base from title; disambiguate if already taken
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'manuscript';
      const existing = await tx
        .select({ slug: papers.slug })
        .from(papers)
        .where(eq(papers.slug, baseSlug))
        .limit(1);
      const slug = existing.length > 0
        ? `${baseSlug}-${randomUUID().slice(0, 8)}`
        : baseSlug;

      // Insert paper
      await tx.insert(papers).values({
        id: paperId,
        authorId: userId,
        authorName: data.userName,
        authorAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        title,
        slug,
        abstract,
        contentMdx,
        primaryDomain,
        repositoryUrl,
        readingTimeMinutes: Math.max(5, Math.ceil(contentMdx.length / 800)),
        status: 'PUBLISHED',
        createdAt: new Date(),
        publishedAt: new Date(),
      });

      // Record -3 deduction in the ledger
      await tx.insert(reviewCreditsLedger).values({
        id: `tx_${randomUUID()}`,
        userId,
        amount: -3,
        type: 'MANUSCRIPT_SUBMISSION',
        reason: `Submitted manuscript "${title}" for Peer Review`,
        timestamp: new Date(),
        balanceAfter: newBalance,
      });

      // Deduct credits
      await tx.update(users).set({ reviewCredits: newBalance }).where(eq(users.id, userId));

      return { paperId, slug, newBalance };
    });

    revalidatePath('/papers');
    revalidatePath('/feed');

    return {
      success: true,
      paperId: result.paperId,
      slug: result.slug,
      newBalance: result.newBalance,
      message: `Manuscript submitted successfully. New balance: ${result.newBalance} credits.`,
    };
  } catch (err) {
    console.error('Failed to submit paper via Server Action:', err);
    // Friendly message for the credit-check failure; generic otherwise (no leak)
    const message = err instanceof Error && err.message.startsWith('Insufficient Review Credits')
      ? err.message
      : 'Failed to submit manuscript. Please try again.';
    return { success: false, error: message };
  }
}
