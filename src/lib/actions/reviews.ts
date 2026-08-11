'use server';

import { randomUUID } from 'crypto';
import { db } from '@/db';
import { users, peerReviews, reviewCreditsLedger } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Server-side limits (client-side checks can be bypassed)
const MIN_WORD_COUNT = 300;
const FIELD_MAX = 10_000;
const RECOMMENDATIONS = ['ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT'] as const;
type Recommendation = (typeof RECOMMENDATIONS)[number];

/**
 * Server-side word count — the authoritative count. Client-spoofed counts are ignored.
 */
function countWords(text: string): number {
  const words = text.trim().match(/\b[a-zA-Z0-9]+\b/g);
  return words ? words.length : 0;
}

function validateReviewInput(data: {
  paperId?: string;
  summary?: string;
  methodology?: string;
  technicalFeedback?: string;
  recommendation?: string;
}): string | null {
  if (!data.paperId || !data.paperId.trim()) return 'Paper is required.';

  const summary = (data.summary ?? '').trim();
  const methodology = (data.methodology ?? '').trim();
  const technicalFeedback = (data.technicalFeedback ?? '').trim();

  if (!summary) return 'Review summary is required.';
  if (summary.length > FIELD_MAX) return `Summary must be ${FIELD_MAX.toLocaleString()} characters or fewer.`;
  if (!methodology) return 'Methodology feedback is required.';
  if (methodology.length > FIELD_MAX) return `Methodology must be ${FIELD_MAX.toLocaleString()} characters or fewer.`;
  if (!technicalFeedback) return 'Technical feedback is required.';
  if (technicalFeedback.length > FIELD_MAX) return `Technical feedback must be ${FIELD_MAX.toLocaleString()} characters or fewer.`;

  if (!RECOMMENDATIONS.includes(data.recommendation as Recommendation)) {
    return 'Invalid recommendation value.';
  }

  const wordCount = countWords(`${summary} ${methodology} ${technicalFeedback}`);
  if (wordCount < MIN_WORD_COUNT) {
    return `Your review contains ${wordCount} words. A qualifying peer review requires a minimum of ${MIN_WORD_COUNT} words with substantive technical feedback.`;
  }

  return null;
}

/**
 * Server Action: Submits a peer review with ATOMIC TRANSACTION + ROW LOCK.
 * SECURITY:
 *  - userId comes from the session ONLY — never from the client payload.
 *  - wordCount is computed server-side — client spoofing is impossible.
 *  - The paperId existence is enforced by the peer_reviews foreign key.
 *  - Credits are earned under a SELECT ... FOR UPDATE row lock, so concurrent
 *    review submissions cannot lose or double-count credits.
 *  - No raw errors are ever leaked to the client.
 */
export async function submitReview(data: {
  paperId: string;
  summary: string;
  methodology: string;
  technicalFeedback: string;
  recommendation: string;
}) {
  // Validate inputs BEFORE touching the DB
  const validationError = validateReviewInput(data);
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    // Extract userId from session — NEVER trust client
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user?.id) {
      return { success: false, error: '401 Unauthorized: Authentication required' };
    }

    const userId = session.user.id;
    const paperId = data.paperId.trim();
    const summary = data.summary.trim();
    const methodology = data.methodology.trim();
    const technicalFeedback = data.technicalFeedback.trim();
    const recommendation = data.recommendation;
    const wordCount = countWords(`${summary} ${methodology} ${technicalFeedback}`);

    // ATOMIC + RACE-SAFE: review insert, ledger entry, and credit award all in one
    // transaction under a locked read of the reviewer's row.
    const result = await db.transaction(async (tx) => {
      // Lock the reviewer's row for the duration of the transaction
      const [lockedUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
        .for('update');

      if (!lockedUser) {
        throw new Error('REVIEWER_NOT_FOUND');
      }

      const newBalance = lockedUser.reviewCredits + 1;
      const reviewId = `rev_${randomUUID()}`;

      // FK on paperId validates the paper exists — no mock-checking logic needed
      await tx.insert(peerReviews).values({
        id: reviewId,
        paperId,
        reviewerId: userId,
        wordCount,
        summary,
        methodology,
        technicalFeedback,
        recommendation,
        isVerified: true,
        createdAt: new Date(),
      });

      // Record +1 credit earned in the ledger
      await tx.insert(reviewCreditsLedger).values({
        id: `tx_${randomUUID()}`,
        userId,
        amount: 1,
        type: 'REVIEW_EARNED',
        reason: `Completed ${wordCount}-word qualifying peer review`,
        timestamp: new Date(),
        balanceAfter: newBalance,
      });

      // Award the credit
      await tx.update(users).set({ reviewCredits: newBalance }).where(eq(users.id, userId));

      return { reviewId, newBalance };
    });

    revalidatePath('/reviews');
    revalidatePath('/feed');

    return {
      success: true,
      reviewId: result.reviewId,
      newBalance: result.newBalance,
      message: `Review submitted successfully! +1 Review Credit awarded. Available balance: ${result.newBalance} credits.`,
    };
  } catch (err) {
    console.error('Failed to submit review via Server Action:', err);
    return { success: false, error: 'Failed to submit review. Please try again.' };
  }
}
