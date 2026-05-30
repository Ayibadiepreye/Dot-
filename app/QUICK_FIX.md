# ⚡ QUICK FIX: Database Reset

**Problem**: `npm run db:push` fails with "Multiple primary key defined"  
**Solution**: Drop all tables and recreate fresh  
**Time**: 2-3 minutes

---

## 🚀 FASTEST PATH TO WORKING APP

### 1️⃣ Open TiDB Dashboard
Go to: https://tidbcloud.com/ → Your Cluster → SQL Editor

### 2️⃣ Copy & Paste This SQL
```sql
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
```

### 3️⃣ Click "Run" or "Execute"
Wait 2-3 seconds for confirmation.

### 4️⃣ Run This Command
In your terminal:
```bash
npm run db:push
```

### 5️⃣ Start Testing
```bash
npm run dev
```

Then:
- Sign up at http://localhost:3000/signup
- Login → Dashboard (see payment gate)
- Complete payment
- Payment gate disappears ✅

---

## ✅ DONE!

Your database is now fresh and synced with the schema.

**For detailed explanation, read**: `NUCLEAR_OPTION_GUIDE.md`
