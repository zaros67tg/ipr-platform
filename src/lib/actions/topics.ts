'use server';

import { randomUUID } from 'crypto';
import { db } from '@/db';
import { topics } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const TOPIC_NAME_MAX = 60;
const TOPIC_LIST_LIMIT = 100;

export async function getTopics() {
  try {
    // Bounded query: prevents unbounded full scans as the topics table grows
    const list = await db
      .select()
      .from(topics)
      .orderBy(desc(topics.createdAt))
      .limit(TOPIC_LIST_LIMIT);
    if (list && list.length > 0) {
      return list.map(t => t.name);
    }
  } catch (err) {
    console.error('Failed to fetch dynamic topics:', err);
  }

  // Fallback default topics if DB query fails or is empty
  return [
    'Theoretical Physics',
    'Systems Programming',
    'Neuroscience',
    'Robotics',
    'Mathematics',
    'Artificial Intelligence',
    'Quantum Computing',
    'Philosophy of Technology',
    'Materials Science',
    'Computational Biology',
    'Cybersecurity',
    'Computer Vision',
    'Spiking Neural Networks',
    'Quantum Gravity',
    'Bioinformatics'
  ];
}

export async function createCustomTopic(name: string) {
  try {
    // SECURITY: Validate session - prevent unauthenticated inserts
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user?.id) {
      return { success: false, error: '401 Unauthorized: Authentication required' };
    }

    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: 'Topic name cannot be empty' };
    if (trimmed.length > TOPIC_NAME_MAX) {
      return { success: false, error: `Topic name must be ${TOPIC_NAME_MAX} characters or fewer.` };
    }

    // Collision-proof id; onConflictDoNothing keeps existing rows intact
    const id = `top_${randomUUID()}`;
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await db.insert(topics).values({
      id,
      name: trimmed,
      slug,
      createdAt: new Date(),
    }).onConflictDoNothing();

    revalidatePath('/submit');
    revalidatePath('/discover');

    return { success: true, name: trimmed };
  } catch (err) {
    console.error('Failed to save custom topic:', err);
    return { success: false, error: 'Internal server error' };
  }
}
