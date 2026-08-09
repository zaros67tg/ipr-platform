import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
console.log('Connecting to Supabase PostgreSQL for clean slate reset...');

const sql = postgres(connectionString, { prepare: false, ssl: 'require' });

async function cleanSlateReset() {
  try {
    console.log('Creating topics table if not exists...');
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    console.log('Wiping dummy seed papers, reviews, and fake users...');
    await sql`DELETE FROM peer_reviews;`;
    await sql`DELETE FROM review_credits_ledger WHERE reason LIKE '%qualifying%' OR reason LIKE '%Submitted manuscript%';`;
    await sql`DELETE FROM papers;`;
    await sql`DELETE FROM users WHERE id LIKE 'usr_%';`;

    // Ensure all real GitHub logged-in users have 500 credits
    console.log('Granting 500 Review Credits to active GitHub users...');
    const githubUsers = await sql`
      SELECT id, name, email, review_credits FROM users;
    `;

    for (const user of githubUsers) {
      await sql`
        UPDATE users
        SET review_credits = 500,
            is_academic_verified = TRUE
        WHERE id = ${user.id};
      `;
      console.log(`✅ Granted 500 credits to active user: ${user.name} (${user.email || user.id})`);

      // Ledger entry
      const txId = `tx_admin_reset_${Date.now()}`;
      await sql`
        INSERT INTO review_credits_ledger (id, user_id, amount, type, reason, balance_after)
        VALUES (
          ${txId},
          ${user.id},
          500,
          'ADMIN_INITIALIZATION',
          'ADMIN_INITIALIZATION: Granted 500 Review Credits for manuscript upload',
          500
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }

    // Seed initial standard topics into database
    console.log('Seeding initial dynamic research topics...');
    const defaultTopics = [
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

    for (const t of defaultTopics) {
      const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await sql`
        INSERT INTO topics (id, name, slug)
        VALUES (${`top_${slug}`}, ${t}, ${slug})
        ON CONFLICT (name) DO NOTHING;
      `;
    }

    console.log('✅ Clean slate reset completed successfully! Feed is now ready for live published documents.');
  } catch (err) {
    console.error('Reset failed:', err);
  } finally {
    await sql.end();
  }
}

cleanSlateReset();
