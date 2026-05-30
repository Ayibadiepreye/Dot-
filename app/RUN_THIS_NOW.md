# ⚡ RUN THIS NOW - Fastest Solution

**TiDB Cloud SQL Editor doesn't support multiple statements.**  
**Use this Node.js script instead - it's faster and automated!**

---

## 🚀 STEP 1: Run the Script

Open your terminal in the project directory and run:

```bash
node drop-all-tables.js
```

**What it does:**
- Connects to your TiDB database
- Drops all 15 tables automatically
- Shows progress for each table
- Verifies all tables are gone

**Expected output:**
```
🚨 WARNING: This will DROP ALL TABLES from your database!
📊 Database: your_database_name

🔌 Connecting to database...
✅ Connected successfully

🗑️  Dropping table: whop_pending...
   ✅ Dropped: whop_pending
🗑️  Dropping table: faqs...
   ✅ Dropped: faqs
... (continues for all 15 tables)

📋 Verifying tables are gone...
✅ SUCCESS: All tables dropped!

🚀 Next steps:
   1. Run: npm run db:push
   2. Run: npm run dev
   3. Test the application
```

---

## 🚀 STEP 2: Recreate Schema

```bash
npm run db:push
```

**Expected output:**
```
✓ Pulling schema from database...
✓ Pushing schema to database...
✓ Schema pushed successfully!
```

---

## 🚀 STEP 3: Test the App

```bash
npm run dev
```

Then test:
1. Go to http://localhost:3000/signup
2. Sign up with email/password or Google
3. Login → Dashboard (see payment gate)
4. Click "Complete Payment" → Select tier
5. Complete demo payment
6. ✅ Payment gate disappears
7. ✅ Wallet shows credits
8. ✅ Ticket is generated

---

## ⚠️ IF SCRIPT FAILS

### Error: "Cannot find module 'mysql2'"
**Solution:**
```bash
npm install mysql2
```
Then run the script again.

### Error: "DATABASE_URL not found"
**Solution:**
Check your `.env` file has `DATABASE_URL` set.

### Error: "Connection refused"
**Solution:**
- Verify TiDB cluster is running
- Check DATABASE_URL is correct
- Check network/firewall settings

---

## 📝 ALTERNATIVE: Manual Method

If the script doesn't work, you can drop tables one by one in TiDB Cloud SQL Editor.

**Read:** `ALTERNATIVE_METHODS.md` for step-by-step instructions.

---

## ✅ THAT'S IT!

**Three commands:**
1. `node drop-all-tables.js`
2. `npm run db:push`
3. `npm run dev`

**Total time: 2 minutes**

**Good luck! 🚀**
