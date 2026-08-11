'use server';

import { db } from '@/db';
import { users, researcherProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Server-side input limits (client-side maxLength can be bypassed)
const NAME_MAX = 120;
const INSTITUTION_MAX = 200;
const RESEARCH_STATEMENT_MAX = 3000;

/**
 * Server Action: Updates user profile with SERVER-SIDE AUTH.
 * SECURITY FIX: userId is NEVER accepted from client - extracted from session only.
 * NUKE MOCK DATA: No fallback to 'usr_zaros' - session required.
 */
export async function updateProfile(formData: FormData) {
  try {
    // CRITICAL SECURITY FIX: Extract userId from session - NEVER trust client
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user?.id) {
      return { success: false, message: '401 Unauthorized: Authentication required' };
    }

    const userId = session.user.id;

    const name = formData.get('name')?.toString().trim();
    const institution = formData.get('institution')?.toString().trim();
    const researchStatement = formData.get('researchStatement')?.toString().trim();

    // Server-side validation (defense in depth)
    if (name && name.length > NAME_MAX) {
      return { success: false, message: `Name must be ${NAME_MAX} characters or fewer.` };
    }
    if (institution && institution.length > INSTITUTION_MAX) {
      return { success: false, message: `Institution must be ${INSTITUTION_MAX} characters or fewer.` };
    }
    if (researchStatement && researchStatement.length > RESEARCH_STATEMENT_MAX) {
      return { success: false, message: `Research statement must be ${RESEARCH_STATEMENT_MAX} characters or fewer.` };
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (institution !== undefined) updateData.institution = institution;

    await db.update(users).set(updateData).where(eq(users.id, userId));

    if (researchStatement !== undefined) {
      await db.insert(researcherProfiles)
        .values({
          userId,
          domains: ['Systems Programming', 'Neuroscience', 'Artificial Intelligence'],
          skills: ['C++', 'Rust', 'CUDA', 'Spiking Neural Networks'],
          researchStatement,
          availabilityStatus: 'AVAILABLE',
        })
        .onConflictDoUpdate({
          target: researcherProfiles.userId,
          set: { researchStatement },
        });
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Profile successfully updated.',
      name,
      institution,
      researchStatement,
    };
  } catch (err) {
    console.error('Failed to update profile in database:', err);
    return { success: false, message: 'Failed to update profile. Please try again.' };
  }
}
