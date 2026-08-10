'use server';

import { db } from '@/db';
import { users, researcherProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: {
  userId: string;
  name: string;
  institution?: string;
  researchStatement?: string;
}) {
  try {
    if (!data.userId) {
      return { success: false, error: 'User ID is required' };
    }

    // 1. Update users table in Supabase DB via Drizzle ORM
    await db.update(users)
      .set({
        name: data.name,
        institution: data.institution || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.userId));

    // 2. Update or upsert researcher_profiles table
    if (data.researchStatement !== undefined) {
      const existing = await db.select().from(researcherProfiles).where(eq(researcherProfiles.userId, data.userId)).limit(1);
      if (existing.length > 0) {
        await db.update(researcherProfiles)
          .set({ researchStatement: data.researchStatement })
          .where(eq(researcherProfiles.userId, data.userId));
      } else {
        await db.insert(researcherProfiles).values({
          userId: data.userId,
          domains: ['Systems Programming'],
          skills: [],
          researchStatement: data.researchStatement,
          availabilityStatus: 'AVAILABLE',
        });
      }
    }

    // 3. Revalidate global layout so user profile updates instantly across entire app
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Profile and preferences updated successfully in database.',
      name: data.name,
      institution: data.institution,
      researchStatement: data.researchStatement,
    };
  } catch (err: any) {
    console.error('Failed to update profile via Server Action:', err);
    return {
      success: false,
      error: err?.message || 'Failed to update user profile in database.',
    };
  }
}
