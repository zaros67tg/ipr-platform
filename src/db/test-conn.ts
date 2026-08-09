import postgres from 'postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
  const url = process.env.DATABASE_URL!;
  console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':****@'));

  // Test 1: Direct URL
  try {
    const sql = postgres(url, { ssl: 'require', connect_timeout: 10 });
    const res = await sql`SELECT 1 as connected`;
    console.log('Direct Connection Success:', res);
    await sql.end();
    return;
  } catch (err: any) {
    console.log('Direct connection failed:', err.message);
  }

  // Test 2: Pooler port 6543
  try {
    const poolerUrl = url.replace(':5432/', ':6543/');
    console.log('Testing Pooler connection:', poolerUrl.replace(/:[^:@]+@/, ':****@'));
    const sqlPooler = postgres(poolerUrl, { ssl: 'require', connect_timeout: 10 });
    const res = await sqlPooler`SELECT 1 as connected`;
    console.log('Pooler Connection Success:', res);
    await sqlPooler.end();
  } catch (err: any) {
    console.log('Pooler connection failed:', err.message);
  }
}

testConnection();
