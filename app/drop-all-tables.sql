-- ============================================================================
-- NUCLEAR OPTION: Drop All Tables
-- ============================================================================
-- WARNING: This will DELETE ALL DATA in your database
-- Only run this if you are absolutely sure you want to start fresh
-- ============================================================================

-- Drop all tables in reverse dependency order to avoid foreign key issues
DROP TABLE IF EXISTS whop_pending;
DROP TABLE IF EXISTS faqs;
DROP TABLE IF EXISTS partner_logos;
DROP TABLE IF EXISTS event_tickets;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS affiliate_clicks;
DROP TABLE IF EXISTS affiliates;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS wallet_transactions;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS oauth_connections;
DROP TABLE IF EXISTS auth_sessions;
DROP TABLE IF EXISTS users;

-- Verify all tables are gone
SHOW TABLES;

-- Expected result: Empty set (no tables)
-- If you see any tables remaining, run the DROP statements again
