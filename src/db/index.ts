import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

// Fail fast with a clear message instead of an opaque postgres connection error.
if (!connectionString) {
  throw new Error('FATAL: DATABASE_URL is missing from environment');
}

// Connection for serverless Postgres (Supabase)
const client = postgres(connectionString, { prepare: false, ssl: 'require' });
export const db = drizzle(client, { schema });
