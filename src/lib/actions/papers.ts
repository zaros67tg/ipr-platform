'use server';

import { db } from '@/db';
import { papers, users, reviewCreditsLedger } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: Queries live papers directly from the Supabase database using Drizzle ORM.
 */
export async function getPapers() {
  try {
    const livePapers = await db.select().from(papers).orderBy(desc(papers.createdAt));
    return livePapers;
  } catch (err) {
    console.error('Failed to query live papers from database:', err);
    return [];
  }
}

/**
 * Server Action: Alias for getPapers() for compatibility.
 */
export async function getLivePapers() {
  const dbPapers = await getPapers();
  if (dbPapers && dbPapers.length > 0) {
    return dbPapers.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      abstract: p.abstract,
      authors: [
        {
          id: p.authorId,
          name: p.authorName,
          handle: `@${p.authorName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          avatarUrl: p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
        }
      ],
      primaryDomain: p.primaryDomain as any,
      subdomains: [],
      keywords: [p.primaryDomain],
      currentVersion: p.currentVersion,
      status: p.status as any,
      license: p.license,
      readingTimeMinutes: p.readingTimeMinutes,
      repositoryUrl: p.repositoryUrl || undefined,
      codespacesUrl: p.repositoryUrl ? `https://github.com/codespaces/new?repo=${p.repositoryUrl.replace('https://github.com/', '')}` : undefined,
      citationCount: p.citationCount,
      forkCount: p.forkCount,
      upvoteCount: p.upvoteCount,
      createdAt: p.createdAt.toISOString(),
      publishedAt: p.publishedAt.toISOString(),
      versions: [
        {
          version: p.currentVersion,
          releasedAt: p.publishedAt.toISOString(),
          changelog: 'Initial version',
          blocks: [
            {
              id: `b_live_1`,
              type: 'paragraph' as const,
              content: p.contentMdx,
              commentsCount: 0
            }
          ]
        }
      ]
    }));
  }
  return [];
}

/**
 * Server Action: Verifies user has >= 3 Review Credits before inserting paper & recording ledger deduction.
 */
export async function submitPaper(data: {
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  abstract: string;
  contentMdx: string;
  primaryDomain: string;
  repositoryUrl?: string;
}) {
  try {
    // 1. Fetch user to check Review Credit balance
    const userRecords = await db.select().from(users).where(eq(users.id, data.userId)).limit(1);

    const currentBalance = userRecords.length > 0 ? userRecords[0].reviewCredits : 3;

    if (currentBalance < 3) {
      return {
        success: false,
        error: `Insufficient Review Credits. Required: 3, Available: ${currentBalance}. Please complete a peer review to earn credits.`
      };
    }

    const paperId = `pap_${Date.now()}`;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBalance = currentBalance - 3;

    // 2. Insert new paper into papers table
    await db.insert(papers).values({
      id: paperId,
      authorId: data.userId,
      authorName: data.userName,
      authorAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      title: data.title,
      slug,
      abstract: data.abstract,
      contentMdx: data.contentMdx,
      primaryDomain: data.primaryDomain,
      repositoryUrl: data.repositoryUrl,
      readingTimeMinutes: Math.max(5, Math.ceil(data.contentMdx.length / 800)),
      status: 'PUBLISHED',
      createdAt: new Date(),
      publishedAt: new Date()
    });

    // 3. Record -3 deduction transaction in reviewCreditsLedger table
    await db.insert(reviewCreditsLedger).values({
      id: `tx_${Date.now()}`,
      userId: data.userId,
      amount: -3,
      type: 'MANUSCRIPT_SUBMISSION',
      reason: `Submitted manuscript "${data.title}" for Peer Review`,
      timestamp: new Date(),
      balanceAfter: newBalance
    });

    // 4. Update user's reviewCredits balance
    if (userRecords.length > 0) {
      await db.update(users).set({ reviewCredits: newBalance }).where(eq(users.id, data.userId));
    }

    revalidatePath('/papers');
    revalidatePath('/feed');

    return {
      success: true,
      paperId,
      slug,
      newBalance,
      message: `Manuscript submitted successfully. 3 Review Credits deducted. New balance: ${newBalance} credits.`
    };
  } catch (err: any) {
    console.error('Failed to submit paper via Server Action:', err);
    return {
      success: false,
      error: err.message || 'Failed to submit manuscript to live database.'
    };
  }
}
