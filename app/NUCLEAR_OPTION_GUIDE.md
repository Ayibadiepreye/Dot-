# 🚨 NUCLEAR OPTION: Complete Database Reset

**Date**: May 30, 2026  
**Status**: Ready to Execute  
**Risk Level**: HIGH - Will delete ALL data  
**Reversibility**: IRREVERSIBLE

---

## ⚠️ WHAT THIS DOES

This will **DROP ALL TABLES** from your TiDB database and recreate them fresh from the schema definition.

**You will lose:**
- ❌ All user accounts
- ❌ All payment records
- ❌ All wallet data
- ❌ All tickets
- ❌ All affiliate data
- ❌ Everything

**You confirmed this is okay because:**
- ✅ Database contains test data only
- ✅ No production users yet
- ✅ Fresh start needed for schema sync

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Copy the DROP TABLE SQL

Copy this entire SQL block:

```sql
-- Drop all tables in reverse dependency order
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

### Step 2: Execute in TiDB Cloud Dashboard

1. Go to **TiDB Cloud Dashboard**: https://tidbcloud.com/
2. Navigate to your cluster
3. Click **"SQL Editor"** or **"Chat2Query"**
4. Paste the SQL from Step 1
5. Click **"Run"** or **"Execute"**
6. Wait for confirmation (should take 2-3 seconds)

### Step 3: Verify Tables Are Gone

Run this query to confirm:

```sql
SHOW TABLES;
```

**Expected result:** Empty set (no tables)

### Step 4: Run Drizzle Push

Back in your terminal (in the project directory):

```bash
npm run db:push
```

**Expected output:**
```
✓ Pulling schema from database...
✓ Pushing schema to database...
✓ Schema pushed successfully!
```

### Step 5: Verify Tables Are Created

In TiDB dashboard, run:

```sql
SHOW TABLES;
```

**Expected result:** 15 tables listed:
- achievements
- affiliate_clicks
- affiliates
- auth_sessions
- event_tickets
- events
- faqs
- oauth_connections
- organizations
- partner_logos
- payments
- users
- wallet_transactions
- wallets
- whop_pending

### Step 6: Test the Application

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Create new account:
   - Go to http://localhost:3000/signup
   - Sign up with email/password or Google

3. Test payment flow:
   - Login → Dashboard (see payment gate)
   - Click "Complete Payment" → Select tier
   - Complete demo payment
   - Verify payment gate disappears

4. Check database:
   ```sql
   SELECT id, email, hasPaid, tier FROM users;
   SELECT * FROM wallets;
   SELECT * FROM payments;
   SELECT * FROM event_tickets;
   ```

---

## 🔧 TROUBLESHOOTING

### Issue: "Table doesn't exist" error when dropping
**Solution:** This is fine! It means the table was already gone. Continue with next table.

### Issue: `npm run db:push` still shows errors
**Solution:** 
1. Make sure ALL tables were dropped (run `SHOW TABLES;`)
2. Try running the DROP statements again
3. If still failing, share the exact error message

### Issue: "Access denied" in TiDB dashboard
**Solution:** 
1. Make sure you're logged into the correct TiDB account
2. Verify you have admin access to the cluster
3. Try using the root user credentials

### Issue: Tables created but app shows errors
**Solution:**
1. Restart dev server (Ctrl+C, then `npm run dev`)
2. Clear browser cache
3. Check console logs for specific errors

---

## 📊 WHAT HAPPENS AFTER

### Fresh Database State:
- ✅ All 15 tables created with correct schema
- ✅ All primary keys defined correctly
- ✅ All unique constraints in place
- ✅ All foreign key relationships set up
- ✅ No data (empty tables)

### First User Flow:
1. Sign up → Creates user in `users` table
2. Login → Creates session in `auth_sessions` table
3. Dashboard → Sees payment gate (hasPaid = false)
4. Complete payment → Pipeline runs:
   - Sets hasPaid = true
   - Creates wallet with credits
   - Generates ticket with QR code
   - Tracks affiliate (if referred)
   - Unlocks achievement
5. Dashboard → Payment gate gone, full access

---

## ✅ SUCCESS CRITERIA

You'll know it worked when:
- ✅ `npm run db:push` completes without errors
- ✅ `SHOW TABLES;` shows 15 tables
- ✅ You can sign up and login
- ✅ Payment flow works end-to-end
- ✅ Payment gate disappears after payment
- ✅ Wallet shows credits
- ✅ Ticket is generated

---

## 🚀 READY TO EXECUTE

**Before you start:**
- [ ] Confirmed database has test data only
- [ ] Confirmed okay to lose all data
- [ ] Have TiDB dashboard open
- [ ] Have terminal ready

**Execute in this order:**
1. Copy DROP TABLE SQL
2. Execute in TiDB dashboard
3. Verify tables are gone
4. Run `npm run db:push`
5. Verify tables are created
6. Test the application

**Good luck! 🎉**

---

## 📞 NEED HELP?

If you encounter any issues:
1. Share the exact error message
2. Share the output of `SHOW TABLES;`
3. Share the output of `npm run db:push`

I'll help you troubleshoot!
