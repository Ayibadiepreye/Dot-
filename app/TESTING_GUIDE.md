# 🧪 COMPLETE TESTING GUIDE

## 🚀 Step 1: Push Database & Start App

### 1.1 Push Database Schema
This adds the `hasPaid` field to your database:

```bash
npm run db:push
```

**Expected output:**
```
[✓] Pulling schema from database...
[✓] Changes applied
```

### 1.2 Start the Application

```bash
npm run dev
```

**Expected output:**
```
VITE v7.x.x  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

## 🧪 Step 2: Test Payment Gate (Regular Users)

### Test Case 1: Sign Up First (Email/Password)

**Steps:**
1. Open browser: `http://localhost:3000/signup`
2. Fill in the form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Create Account"
4. ✅ **Should**: Redirect to home page (logged in)
5. Go to: `http://localhost:3000/dashboard`
6. ✅ **Should see**: Yellow "🔒 Payment Required" banner
7. ✅ **Should see**: Grayed-out preview of features

**Try accessing features:**
- Click "Wallet" card → ✅ Should show payment gate
- Go to `/dashboard/referrals` → ✅ Should show payment gate
- Go to `/dashboard/ticket` → ✅ Should show payment gate
- Go to `/dashboard/community` → ✅ Should show payment gate

**Check database:**
```sql
SELECT id, email, name, hasPaid, tier FROM users WHERE email = 'test@example.com';
```
✅ **Should show**: `hasPaid: 0` (false)

---

### Test Case 2: Sign Up with Google OAuth

**Steps:**
1. Logout (if logged in)
2. Go to: `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Authorize with Google
5. ✅ **Should**: Redirect to home page (logged in)
6. Go to: `http://localhost:3000/dashboard`
7. ✅ **Should see**: Yellow "🔒 Payment Required" banner

**Check database:**
```sql
SELECT id, email, name, hasPaid, tier FROM users ORDER BY createdAt DESC LIMIT 1;
```
✅ **Should show**: `hasPaid: 0` (false)

---

### Test Case 3: Payment Flow (Current Behavior)

**Steps:**
1. While logged in as unpaid user, click "Complete Payment" button
2. ✅ **Should**: Redirect to `/payment` or pricing page
3. Select a tier (e.g., Starter)
4. Enter email and click "Pay"
5. ✅ **Should**: Redirect to demo payment page
6. Click "Simulate Successful Payment"
7. ✅ **Should**: Payment succeeds
8. Go back to dashboard
9. ❌ **Current behavior**: Still shows payment gate (Phase 2 will fix this)

---

## 👨‍💼 Step 3: Test Admin Access

### Test Case 4: Admin Should NOT See Payment Gate

**Important**: Admins should have full access regardless of payment status!

**Steps:**
1. Create an admin user in the database:
```sql
-- First, create a regular user via signup
-- Then update their role to admin:
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

2. Login as admin user
3. Go to: `http://localhost:3000/dashboard`
4. ✅ **Should see**: Full dashboard (NO payment gate)
5. Go to: `http://localhost:3000/admin`
6. ✅ **Should see**: Admin overview page
7. Try other admin pages:
   - `/admin/users` → ✅ Should work
   - `/admin/payments` → ✅ Should work
   - `/admin/events` → ✅ Should work

**Why this works:**
- Admin routes use `adminQuery` middleware
- `adminQuery` requires authentication + admin role
- `adminQuery` does NOT require payment
- Admins bypass payment gate ✅

---

## 🏢 Step 4: Test Organization Admin Access

### Test Case 5: Org Admin Access

**Steps:**
1. Create an org admin user:
```sql
-- Create organization first
INSERT INTO organizations (name, slug, contactEmail, referralCode, status)
VALUES ('Test Org', 'test-org', 'org@example.com', 'ORG123', 'active');

-- Create user and set as org_admin
UPDATE users SET role = 'org_admin', organizationId = 1 WHERE email = 'orgadmin@example.com';
```

2. Login as org admin
3. ✅ **Should see**: Payment gate on regular dashboard pages
4. ✅ **Should have**: Access to org-specific features (if implemented)

**Note**: Org admins are NOT exempt from payment gate unless you want them to be.

**To exempt org admins from payment gate:**
Update `api/middleware.ts`:
```typescript
const requirePayment = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  // Exempt admins and org admins from payment requirement
  if (ctx.user?.role === 'admin' || 
      ctx.user?.role === 'super_admin' || 
      ctx.user?.role === 'org_admin') {
    return next({ ctx });
  }
  if (!ctx.user?.hasPaid) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Payment required to access this feature",
    });
  }
  return next({ ctx });
});
```

---

## 🎯 Step 5: Test Payment from Landing Page

### Test Case 6: Pay First, Then Sign Up (Known Issue)

**Steps:**
1. Logout (if logged in)
2. Go to: `http://localhost:3000/`
3. Scroll to pricing section
4. Click "Get Started" on Starter tier
5. ✅ **Should**: Redirect to `/checkout/starter?currency=NGN`
6. Enter email: `paytest@example.com`
7. Click "Pay"
8. ✅ **Should**: Redirect to demo payment page
9. Click "Simulate Successful Payment"
10. ✅ **Should**: Redirect to `/auth/setup?ref=...&tier=starter&email=...`
11. Create account (email/password or Google)
12. Login
13. Go to dashboard
14. ❌ **Current behavior**: Shows payment gate (even though you paid!)

**Why this happens:**
- Payment is created with `userId: NULL` (no user exists yet)
- User signs up AFTER payment
- Signup sets `hasPaid: false` by default
- No connection between payment and user account

**This will be fixed in Phase 2!**

---

## 📊 Step 6: Verify Database

### Check Users Table
```sql
SELECT id, email, name, hasPaid, tier, role FROM users ORDER BY createdAt DESC LIMIT 10;
```

**Expected results:**
- Regular users: `hasPaid: 0`, `role: member`
- Admin users: `hasPaid: 0` (doesn't matter), `role: admin`
- All new users should have `hasPaid: 0` by default

### Check Payments Table
```sql
SELECT id, email, tier, status, amount, currency, userId FROM payments ORDER BY createdAt DESC LIMIT 10;
```

**Expected results:**
- Payments from logged-in users: `userId: [number]`
- Payments from landing page: `userId: NULL` (no user yet)
- All successful payments: `status: success`

---

## ✅ EXPECTED RESULTS SUMMARY

### What Should Work (Phase 1):
- ✅ Sign up → See payment gate
- ✅ Login → See payment gate (if not paid)
- ✅ Try to access features → Locked
- ✅ Payment gate shows on all dashboard pages
- ✅ Admin users → Full access (no payment gate)
- ✅ Beautiful yellow banner with clear CTA

### What Doesn't Work Yet (Phase 2):
- ❌ Pay first → Sign up → Still see payment gate
- ❌ Pay while logged in → Payment gate doesn't disappear
- ❌ No wallet creation after payment
- ❌ No tier upgrade after payment
- ❌ No ticket generation after payment

---

## 🐛 TROUBLESHOOTING

### Issue: "hasPaid field doesn't exist"
**Solution**: Run `npm run db:push` again

### Issue: "Payment gate doesn't show"
**Solution**: 
1. Check if user is admin (admins bypass payment gate)
2. Clear browser cache and reload
3. Check console for errors

### Issue: "Can't access admin pages"
**Solution**: 
1. Check user role in database: `SELECT role FROM users WHERE email = 'your@email.com'`
2. Update role to admin: `UPDATE users SET role = 'admin' WHERE email = 'your@email.com'`

### Issue: "Google OAuth doesn't work"
**Solution**: 
1. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Check redirect URI in Google Console: `http://localhost:3000/api/auth/callback/google`

---

## 🎯 NEXT STEPS AFTER TESTING

### If Phase 1 Works:
1. ✅ Confirm payment gate shows for regular users
2. ✅ Confirm admins have full access
3. ✅ Move to Phase 2 implementation

### Phase 2 Will Add:
1. Post-payment pipeline
2. Set `hasPaid: true` on payment success
3. Create wallet with credits
4. Upgrade user tier
5. Generate event ticket
6. Link payment to user account
7. Webhook handlers for Paystack/Stripe

---

## 📝 TESTING CHECKLIST

Copy this checklist and mark items as you test:

**Regular User Flow:**
- [ ] Sign up with email/password → See payment gate
- [ ] Sign up with Google OAuth → See payment gate
- [ ] Try to access wallet → Locked
- [ ] Try to access referrals → Locked
- [ ] Try to access ticket → Locked
- [ ] Try to access community → Locked
- [ ] Payment gate shows yellow banner
- [ ] "Complete Payment" button works

**Admin Flow:**
- [ ] Create admin user in database
- [ ] Login as admin → NO payment gate
- [ ] Access admin overview → Works
- [ ] Access admin users → Works
- [ ] Access admin payments → Works
- [ ] Access regular dashboard → Works

**Payment Flow:**
- [ ] Click payment from dashboard → Redirects to checkout
- [ ] Enter email and pay → Payment succeeds
- [ ] Check database → Payment record created
- [ ] Dashboard still shows payment gate (expected for Phase 1)

**Database Verification:**
- [ ] New users have `hasPaid: 0`
- [ ] Admin users have `role: admin`
- [ ] Payments are recorded correctly

---

**Ready to test! Follow the steps above and let me know what you find.** 🚀
