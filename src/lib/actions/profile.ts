'use server';

import { db } from '@/db';
import { users, researcherProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

    const name = formData.get('name')?.toString();
    const institution = formData.get('institution')?.toString();
    const researchStatement = formData.get('researchStatement')?.toString();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name && name.trim()) updateData.name = name.trim();
    if (institution !== undefined) updateData.institution = institution.trim();

    await db.update(users).set(updateData).where(eq(users.id, userId));

    if (researchStatement !== undefined) {
      await db.insert(researcherProfiles).values({
        userId, domains: ['Systems Programming', 'Neuroscience', 'Artificial Intelligence'],
        skills: ['C++', 'Rust', 'CUDA', 'Spiking Neural Networks'],
        researchStatement: researchStatement.trim(), availabilityStatus: 'AVAILABLE',
      }).onConflictDoUpdate({
        target: researcherProfiles.userId,
        set: { researchStatement: researchStatement.trim() },
      });
    }

    revalidatePath('/', 'layout');
    return { success: true, message: 'Profile successfully updated.', name: name?.trim(), institution: institution?.trim(), researchStatement: researchStatement?.trim() };
  } catch (err: unknown) {
    console.error('Failed to update profile:', err);
    return { success: false, message: err instanceof Error ? err.message : 'Database update failed.' };
  }
}