import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL!;
console.log('Connecting to Supabase PostgreSQL database to grant admin credits...');

const sql = postgres(connectionString, { prepare: false, ssl: 'require' });

async function grantAdmin() {
  try {
    // 1. Find the most recently created user in users table
    const recentUsers = await sql`
      SELECT id, name, email, review_credits, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5;
    `;

    if (!recentUsers || recentUsers.length === 0) {
      console.log('No users found in database.');
      return;
    }

    console.log('Recent Users in Database:', recentUsers);

    // Pick the most recent user (or all users) to credit 500 credits
    const targetUser = recentUsers[0];
    console.log(`Crediting 500 Review Credits to user: ${targetUser.name} (${targetUser.email || targetUser.id})`);

    const newCredits = 500;

    // 2. Update review_credits in users table
    await sql`
      UPDATE users
      SET review_credits = ${newCredits},
          is_academic_verified = TRUE
      WHERE id = ${targetUser.id};
    `;

    // 3. Add ledger entry in review_credits_ledger table
    const txId = `tx_admin_${Date.now()}`;
    await sql`
      INSERT INTO review_credits_ledger (id, user_id, amount, type, reason, balance_after)
      VALUES (
        ${txId},
        ${targetUser.id},
        500,
        'ADMIN_INITIALIZATION',
        'ADMIN_INITIALIZATION: Granted 500 Review Credits for manuscript upload',
        ${newCredits}
      );
    `;

    console.log(`✅ Successfully updated ${targetUser.name} (${targetUser.id}) to ${newCredits} Review Credits!`);
    console.log(`✅ Ledger transaction ${txId} recorded in review_credits_ledger.`);

    // Also update all users created via GitHub auth to 500 credits just in case
    for (const u of recentUsers) {
      await sql`
        UPDATE users
        SET review_credits = 500,
            is_academic_verified = TRUE
        WHERE id = ${u.id};
      `;
      console.log(`Updated user ${u.name} (${u.id}) to 500 credits.`);
    }

  } catch (err) {
    console.error('Failed to grant admin credits:', err);
  } finally {
    await sql.end();
  }
}

grantAdmin();
