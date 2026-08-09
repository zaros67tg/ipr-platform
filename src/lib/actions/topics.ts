'use server';

import { db } from '@/db';
import { topics } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getTopics() {
  try {
    const list = await db.select().from(topics).orderBy(desc(topics.createdAt));
    if (list && list.length > 0) {
      return list.map(t => t.name);
    }
  } catch (err) {
    console.error('Failed to fetch dynamic topics:', err);
  }
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
    const trimmed = name.trim();
    if (!trimmed) return { success: false };
    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = `top_${slug}_${Date.now()}`;

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
    return { success: false };
  }
}
