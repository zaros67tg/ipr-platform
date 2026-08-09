import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
console.log('Connecting to Supabase PostgreSQL database...');

const sql = postgres(connectionString, { prepare: false, ssl: 'require', connect_timeout: 10 });

async function main() {
  try {
    console.log('Creating database tables if not exist...');
    
    // Core Better-Auth & IPR tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified BOOLEAN DEFAULT FALSE NOT NULL,
        image TEXT,
        institution TEXT,
        is_academic_verified BOOLEAN DEFAULT FALSE NOT NULL,
        review_credits INTEGER DEFAULT 3 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        expires_at TIMESTAMP NOT NULL,
        token TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        provider_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        access_token TEXT,
        refresh_token TEXT,
        id_token TEXT,
        access_token_expires_at TIMESTAMP,
        refresh_token_expires_at TIMESTAMP,
        scope TEXT,
        password TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS researcher_profiles (
        user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        domains TEXT[] NOT NULL,
        skills TEXT[] NOT NULL,
        research_statement TEXT,
        looking_for TEXT,
        availability_status TEXT DEFAULT 'AVAILABLE' NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS papers (
        id TEXT PRIMARY KEY,
        author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        author_avatar TEXT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        abstract TEXT NOT NULL,
        content_mdx TEXT NOT NULL,
        primary_domain TEXT NOT NULL,
        repository_url TEXT,
        doi TEXT,
        is_featured BOOLEAN DEFAULT FALSE NOT NULL,
        reading_time_minutes INTEGER DEFAULT 10 NOT NULL,
        citation_count INTEGER DEFAULT 0 NOT NULL,
        fork_count INTEGER DEFAULT 0 NOT NULL,
        upvote_count INTEGER DEFAULT 1 NOT NULL,
        current_version TEXT DEFAULT 'v1.0.0' NOT NULL,
        status TEXT DEFAULT 'PUBLISHED' NOT NULL,
        license TEXT DEFAULT 'CC-BY-4.0' NOT NULL,
        parent_paper_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        published_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS review_credits_ledger (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
        balance_after INTEGER NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS peer_reviews (
        id TEXT PRIMARY KEY,
        paper_id TEXT NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
        reviewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_count INTEGER NOT NULL,
        summary TEXT NOT NULL,
        methodology TEXT NOT NULL,
        technical_feedback TEXT NOT NULL,
        recommendation TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        target_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        status TEXT DEFAULT 'PENDING' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    console.log('✅ Live database tables created successfully on Supabase PostgreSQL!');

    // Seed default research user & initial papers if empty
    console.log('Seeding initial paper data into database...');
    await sql`
      INSERT INTO users (id, name, email, email_verified, image, institution, is_academic_verified, review_credits)
      VALUES (
        'usr_zaros',
        'Dr. Zaros H. Vance',
        'zaros@republic-research.org',
        TRUE,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        'Republic Institute for Neuromorphic Computing',
        TRUE,
        7
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    await sql`
      INSERT INTO papers (id, author_id, author_name, author_avatar, title, slug, abstract, content_mdx, primary_domain, repository_url, citation_count, fork_count, upvote_count, reading_time_minutes)
      VALUES (
        'pap_neuromorphic_stability',
        'usr_zaros',
        'Dr. Zaros H. Vance',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        'Temporal Stability in Sparse Spiking Neural Architectures Under Noise',
        'temporal-stability-sparse-spiking-architectures',
        'We present a rigorous mathematical proof of temporal phase-locking stability in event-driven neuromorphic networks characterized by sparse coupling.',
        '# Temporal Stability in Sparse Spiking Neural Architectures\n\n## 1. Introduction\nBiological cortical networks operate with remarkable energetic efficiency. Consider leaky integrate-and-fire membrane dynamics:',
        'Neuroscience',
        'https://github.com/republic-research/neuromorphic-temporal-stability',
        48,
        12,
        184,
        14
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    await sql`
      INSERT INTO papers (id, author_id, author_name, author_avatar, title, slug, abstract, content_mdx, primary_domain, repository_url, citation_count, fork_count, upvote_count, reading_time_minutes)
      VALUES (
        'pap_formal_constraints',
        'usr_zaros',
        'Prof. Liam K. Solloway',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
        'Formal Constraints on Emergent Computation in Distributed Agent Networks',
        'formal-constraints-emergent-computation',
        'We establish fundamental bounds on the computational complexity achievable by self-modifying autonomous multi-agent systems operating under bounded bandwidth.',
        '# Formal Constraints on Emergent Computation\n\nCategory-theoretic bounds on multi-agent consensus.',
        'Mathematics',
        'https://github.com/republic-research/emergent-formal-bounds',
        92,
        21,
        230,
        18
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('✅ Seed completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sql.end();
  }
}

main();
