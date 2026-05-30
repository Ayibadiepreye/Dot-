/**
 * Drop All Tables Script
 * 
 * This script connects to your TiDB database and drops all tables.
 * Run with: node drop-all-tables.js
 */

import mysql from 'mysql2/promise';
import 'dotenv/config';

const tables = [
  'whop_pending',
  'faqs',
  'partner_logos',
  'event_tickets',
  'events',
  'achievements',
  'affiliate_clicks',
  'affiliates',
  'organizations',
  'payments',
  'wallet_transactions',
  'wallets',
  'oauth_connections',
  'auth_sessions',
  'users',
];

async function dropAllTables() {
  console.log('🚨 WARNING: This will DROP ALL TABLES from your database!');
  console.log('📊 Database:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[1] || 'Unknown');
  console.log('');
  
  // Parse DATABASE_URL
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ ERROR: DATABASE_URL not found in .env file');
    process.exit(1);
  }

  // Extract connection details from URL
  // Format: mysql://user:password@host:port/database?ssl={"rejectUnauthorized":true}
  const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!urlMatch) {
    console.error('❌ ERROR: Invalid DATABASE_URL format');
    process.exit(1);
  }

  const [, user, password, host, port, database] = urlMatch;

  console.log('🔌 Connecting to database...');
  
  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
      database,
      ssl: {
        rejectUnauthorized: true,
      },
    });

    console.log('✅ Connected successfully\n');

    // Drop each table
    for (const table of tables) {
      try {
        console.log(`🗑️  Dropping table: ${table}...`);
        await connection.execute(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`   ✅ Dropped: ${table}`);
      } catch (error) {
        console.log(`   ⚠️  Warning: ${error.message}`);
      }
    }

    console.log('\n📋 Verifying tables are gone...');
    const [rows] = await connection.execute('SHOW TABLES');
    
    if (rows.length === 0) {
      console.log('✅ SUCCESS: All tables dropped!');
      console.log('\n🚀 Next steps:');
      console.log('   1. Run: npm run db:push');
      console.log('   2. Run: npm run dev');
      console.log('   3. Test the application');
    } else {
      console.log('⚠️  WARNING: Some tables still exist:');
      rows.forEach(row => {
        console.log(`   - ${Object.values(row)[0]}`);
      });
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Run the script
dropAllTables().catch(console.error);
