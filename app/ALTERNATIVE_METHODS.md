# 🔧 Alternative Methods to Drop Tables

**Problem**: TiDB Cloud SQL Editor doesn't support multiple statements  
**Solution**: Use one of these alternative methods

---

## 🚀 METHOD 1: Node.js Script (RECOMMENDED - Fastest)

### Step 1: Run the Script
```bash
node drop-all-tables.js
```

### What It Does:
- ✅ Connects to your TiDB database
- ✅ Drops all 15 tables automatically
- ✅ Verifies tables are gone
- ✅ Shows clear success/error messages

### Expected Output:
```
🚨 WARNING: This will DROP ALL TABLES from your database!
📊 Database: your_database_name

🔌 Connecting to database...
✅ Connected successfully

🗑️  Dropping table: whop_pending...
   ✅ Dropped: whop_pending
🗑️  Dropping table: faqs...
   ✅ Dropped: faqs
... (continues for all tables)

📋 Verifying tables are gone...
✅ SUCCESS: All tables dropped!

🚀 Next steps:
   1. Run: npm run db:push
   2. Run: npm run dev
   3. Test the application
```

### Step 2: Recreate Schema
```bash
npm run db:push
```

### Step 3: Test
```bash
npm run dev
```

**This is the fastest and most reliable method!**

---

## 📝 METHOD 2: One Statement at a Time (Manual)

If the Node.js script doesn't work, execute each statement separately in TiDB Cloud SQL Editor.

### Copy and run ONE at a time:

```sql
DROP TABLE IF EXISTS whop_pending;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS faqs;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS partner_logos;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS event_tickets;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS events;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS achievements;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS affiliate_clicks;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS affiliates;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS organizations;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS payments;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS wallet_transactions;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS wallets;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS oauth_connections;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS auth_sessions;
```
*(Click Run, wait for success)*

```sql
DROP TABLE IF EXISTS users;
```
*(Click Run, wait for success)*

### Verify:
```sql
SHOW TABLES;
```
*(Should show empty result)*

**Yes, it's tedious, but it works!**

---

## 🔧 METHOD 3: MySQL Client (Command Line)

If you have MySQL client installed:

### Step 1: Connect to TiDB
```bash
mysql -h your-tidb-host -P 4000 -u your-username -p --ssl-mode=REQUIRED your-database
```

### Step 2: Run All Drops
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

### Step 3: Verify
```sql
SHOW TABLES;
```

---

## 💻 METHOD 4: Drizzle Studio (If Available)

If you have Drizzle Studio running:

### Step 1: Start Drizzle Studio
```bash
npx drizzle-kit studio
```

### Step 2: Use the UI
- Open browser at http://localhost:4983
- Navigate to each table
- Click "Drop Table" button
- Confirm deletion

**Note**: This method requires Drizzle Studio to be compatible with your setup.

---

## 🎯 RECOMMENDED APPROACH

### Best Option: Node.js Script (Method 1)
**Why:**
- ✅ Fastest (30 seconds)
- ✅ Automated
- ✅ Shows clear progress
- ✅ Verifies success
- ✅ No manual clicking

**How:**
```bash
node drop-all-tables.js
npm run db:push
npm run dev
```

### Fallback: Manual One-by-One (Method 2)
**Why:**
- ✅ Always works
- ✅ No dependencies
- ✅ Uses TiDB Cloud UI

**How:**
- Copy each DROP statement
- Paste in SQL Editor
- Click Run
- Repeat 15 times

---

## 🚨 TROUBLESHOOTING

### Issue: "Cannot find module 'mysql2'"
**Solution:**
```bash
npm install mysql2
```

### Issue: "Cannot find module 'dotenv'"
**Solution:**
```bash
npm install dotenv
```

### Issue: "Connection refused"
**Solution:**
- Check DATABASE_URL in .env file
- Verify TiDB cluster is running
- Check firewall/network settings

### Issue: "Access denied"
**Solution:**
- Verify username/password in DATABASE_URL
- Check user has DROP TABLE permissions

### Issue: "Table doesn't exist"
**Solution:**
- This is fine! It means the table was already gone
- Continue with next table

---

## ✅ AFTER TABLES ARE DROPPED

### Step 1: Verify
```sql
SHOW TABLES;
```
Expected: Empty result set

### Step 2: Recreate Schema
```bash
npm run db:push
```
Expected: "Schema pushed successfully!"

### Step 3: Verify Tables Created
```sql
SHOW TABLES;
```
Expected: 15 tables listed

### Step 4: Test Application
```bash
npm run dev
```
Then:
- Sign up at http://localhost:3000/signup
- Login → Dashboard (see payment gate)
- Complete payment
- Payment gate disappears ✅

---

## 📊 COMPARISON

| Method | Time | Difficulty | Reliability |
|--------|------|------------|-------------|
| Node.js Script | 30 sec | Easy | ⭐⭐⭐⭐⭐ |
| One-by-One | 5 min | Tedious | ⭐⭐⭐⭐ |
| MySQL Client | 1 min | Medium | ⭐⭐⭐⭐ |
| Drizzle Studio | 2 min | Easy | ⭐⭐⭐ |

**Recommendation: Use Node.js Script (Method 1)**

---

## 🎉 YOU'RE READY!

Choose your method and execute. After tables are dropped:
1. Run `npm run db:push`
2. Run `npm run dev`
3. Test the application

**Good luck! 🚀**
