'use server';

import { db } from '@/db';
import { users, researcherProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  try {
    const userId = formData.get('userId')?.toString() || 'usr_zaros';
    const name = formData.get('name')?.toString();
    const institution = formData.get('institution')?.toString();
    const researchStatement = formData.get('researchStatement')?.toString();

    // 1. Execute UPDATE query on users table in Supabase
    if (userId) {
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (name && name.trim()) updateData.name = name.trim();
      if (institution !== undefined) updateData.institution = institution.trim();

      await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      // 2. Upsert researcher_profiles table for research statement
      if (researchStatement !== undefined) {
        await db.insert(researcherProfiles)
          .values({
            userId,
            domains: ['Systems Programming', 'Neuroscience', 'Artificial Intelligence'],
            skills: ['C++', 'Rust', 'CUDA', 'Spiking Neural Networks'],
            researchStatement: researchStatement.trim(),
            availabilityStatus: 'AVAILABLE',
          })
          .onConflictDoUpdate({
            target: researcherProfiles.userId,
            set: {
              researchStatement: researchStatement.trim(),
            },
          });
      }
    }

    // 3. Instant global UI revalidation
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Profile successfully updated in database.',
      name: name?.trim(),
      institution: institution?.trim(),
      researchStatement: researchStatement?.trim()
    };
  } catch (err: any) {
    console.error('Failed to update profile in database:', err);
    return { success: false, message: err.message || 'Database update failed.' };
  }
}
