-- ============================================================================
-- ALTERNATIVE: Drop Tables One by One
-- ============================================================================
-- TiDB Cloud SQL Editor may not support multiple statements
-- Execute each DROP statement separately, one at a time
-- ============================================================================

-- STEP 1: Copy and run this first
DROP TABLE IF EXISTS whop_pending;

-- STEP 2: Copy and run this second
DROP TABLE IF EXISTS faqs;

-- STEP 3: Copy and run this third
DROP TABLE IF EXISTS partner_logos;

-- STEP 4: Copy and run this fourth
DROP TABLE IF EXISTS event_tickets;

-- STEP 5: Copy and run this fifth
DROP TABLE IF EXISTS events;

-- STEP 6: Copy and run this sixth
DROP TABLE IF EXISTS achievements;

-- STEP 7: Copy and run this seventh
DROP TABLE IF EXISTS affiliate_clicks;

-- STEP 8: Copy and run this eighth
DROP TABLE IF EXISTS affiliates;

-- STEP 9: Copy and run this ninth
DROP TABLE IF EXISTS organizations;

-- STEP 10: Copy and run this tenth
DROP TABLE IF EXISTS payments;

-- STEP 11: Copy and run this eleventh
DROP TABLE IF EXISTS wallet_transactions;

-- STEP 12: Copy and run this twelfth
DROP TABLE IF EXISTS wallets;

-- STEP 13: Copy and run this thirteenth
DROP TABLE IF EXISTS oauth_connections;

-- STEP 14: Copy and run this fourteenth
DROP TABLE IF EXISTS auth_sessions;

-- STEP 15: Copy and run this last
DROP TABLE IF EXISTS users;

-- STEP 16: Verify all tables are gone
SHOW TABLES;

-- Expected: Empty result set
