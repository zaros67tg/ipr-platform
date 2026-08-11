'use server';

import { db } from '@/db';
import { papers, users, reviewCreditsLedger } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * Server Action: Queries live papers with PAGINATION to prevent full table scans.
 */
export async function getPapers(limit = 20, offset = 0) {
  try {
    const livePapers = await db
      .select()
      .from(papers)
      .orderBy(desc(papers.createdAt))
      .limit(limit)
      .offset(offset);
    return livePapers;
  } catch (err) {
    console.error('Failed to query live papers from database:', err);
    return [];
  }
}

export async function getLivePapers(limit = 20, offset = 0) {
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
      primaryDomain: p.primaryDomain,
      subdomains: [],
      keywords: [p.primaryDomain],
      currentVersion: p.currentVersion,
      status: p.status,
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
 * Server Action: Submits paper with ATOMIC TRANSACTION and SERVER-SIDE AUTH.
 * SECURITY FIX: userId is NEVER accepted from client - extracted from session only.
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
  try {
    // CRITICAL SECURITY FIX: Extract userId from session - NEVER trust client
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    
    if (!session?.user?.id) {
      return { success: false, error: '401 Unauthorized: Authentication required' };
    }
    
    const userId = session.user.id;

    const userRecords = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const currentBalance = userRecords.length > 0 ? userRecords[0].reviewCredits : 3;

    if (currentBalance < 3) {
      return { success: false, error: `Insufficient Review Credits. Required: 3, Available: ${currentBalance}.` };
    }

    const paperId = `pap_${Date.now()}`;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBalance = currentBalance - 3;

    // CRITICAL DATA INTEGRITY FIX: Wrap all operations in a transaction
    await db.transaction(async (tx) => {
      await tx.insert(papers).values({
        id: paperId, authorId: userId, authorName: data.userName,
        authorAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        title: data.title, slug, abstract: data.abstract, contentMdx: data.contentMdx,
        primaryDomain: data.primaryDomain, repositoryUrl: data.repositoryUrl,
        readingTimeMinutes: Math.max(5, Math.ceil(data.contentMdx.length / 800)),
        status: 'PUBLISHED', createdAt: new Date(), publishedAt: new Date()
      });

      await tx.insert(reviewCreditsLedger).values({
        id: `tx_${Date.now()}`, userId, amount: -3, type: 'MANUSCRIPT_SUBMISSION',
        reason: `Submitted manuscript "${data.title}" for Peer Review`,
        timestamp: new Date(), balanceAfter: newBalance
      });

      if (userRecords.length > 0) {
        await tx.update(users).set({ reviewCredits: newBalance }).where(eq(users.id, userId));
      }
    });

    revalidatePath('/papers');
    revalidatePath('/feed');
    return { success: true, paperId, slug, newBalance, message: `Manuscript submitted successfully. New balance: ${newBalance} credits.` };
  } catch (err: unknown) {
    console.error('Failed to submit paper:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to submit manuscript.' };
  }
}