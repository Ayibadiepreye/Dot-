# 🚀 Deploy to Vercel NOW - Quick Guide

**Time**: 30 minutes | **Domain**: joindot.vercel.app

---

## ⚡ STEP 1: Install & Login (2 minutes)

```bash
npm install -g vercel
vercel login
```

---

## ⚡ STEP 2: Deploy (5 minutes)

```bash
cd "c:\Users\bonni\Downloads\Kimi_Agent_Complete Platform Build\app"
vercel
```

**Answer prompts:**
- Set up and deploy? **Y**
- Which scope? **Your Account**
- Link to existing project? **N**
- Project name? **dot-platform**
- Directory? **./  (just press Enter)**

---

## ⚡ STEP 3: Add Environment Variables (10 minutes)

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Copy-paste these (one by one):**

```
DATABASE_URL
mysql://3TNQu3siWtbsVhR.root:2IpubNAlfc1Ya582@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test

BETTER_AUTH_SECRET
7ArnFGD2h6Fds9lUs0RmW6S5hkeBY0CeVXBuyxvN5yM=

BETTER_AUTH_URL
https://joindot.vercel.app

APP_URL
https://joindot.vercel.app

GOOGLE_CLIENT_ID
710514042883-976al1ehjt10ejnggbpstmtk3u15jdv8.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET
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

VITE_GOOGLE_CLIENT_ID
710514042883-976al1ehjt10ejnggbpstmtk3u15jdv8.apps.googleusercontent.com

PAYSTACK_SECRET_KEY
sk_test_8261a3e57c6e3e8d1ef45b248781cf32e6a4faab

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
pk_test_abdb597bf6b89a7515de455fb81f819fdd5c3373

RESEND_API_KEY
re_4S8TdtnV_NPEeNNdwQ8ggXgWxqNbN3KRr

EMAIL_FROM
onboarding@resend.dev

NEXT_PUBLIC_APP_URL
https://joindot.vercel.app
```

**For each variable:**
- Select: Production, Preview, Development ✓
- Click: Save

---

## ⚡ STEP 4: Update Google OAuth (3 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client
3. Add to **Authorized redirect URIs**:
   ```
   https://joindot.vercel.app/api/auth/callback/google
   ```
4. Click **SAVE**

---

## ⚡ STEP 5: Deploy to Production (2 minutes)

```bash
vercel --prod
```

Wait for: ✅ Production: https://joindot.vercel.app

---

## ⚡ STEP 6: Configure Paystack Webhook (2 minutes)

1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Webhook URL: `https://joindot.vercel.app/api/webhooks/paystack`
3. Click **Save Changes**

---

## ⚡ STEP 7: Test (5 minutes)

### Test 1: Sign Up
1. Go to: https://joindot.vercel.app/signup
2. Create account
3. Check email ✅

### Test 2: Payment
1. See payment gate on dashboard
2. Click "Complete Payment"
3. Select tier (Starter or VIP)
4. Click "Get Started"
5. Fill form and click "Pay"

### Test 3: Complete Payment
**Use test card:**
```
Card: 4084 0840 8408 4081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 123456
```

### Test 4: Verify
- Payment gate disappears ✅
- Wallet shows credits ✅
- Check email for payment success ✅

---

## ✅ DONE!

Your app is live at: **https://joindot.vercel.app**

---

## 🐛 Quick Fixes

### Build fails?
```bash
npm run build
# Fix any errors, then redeploy
vercel --prod
```

### Webhook not working?
- Check URL: `https://joindot.vercel.app/api/webhooks/paystack`
- Check Paystack secret key
- Check webhook logs in Paystack dashboard

### Emails not sending?
- Verify: `EMAIL_FROM=onboarding@resend.dev` (NOT Gmail)
- Check Resend API key
- Check Resend dashboard logs

### Google OAuth not working?
- Verify redirect URI: `https://joindot.vercel.app/api/auth/callback/google`
- Check `BETTER_AUTH_URL=https://joindot.vercel.app`

---

## 📊 Monitor

**Vercel Logs:**
https://vercel.com/dashboard → Your Project → Logs

**Paystack Transactions:**
https://dashboard.paystack.com/#/transactions

**Paystack Webhook Logs:**
https://dashboard.paystack.com/#/settings/developer

**Resend Email Logs:**
https://resend.com/emails

---

## 🎉 Success Criteria

- [x] App loads ✅
- [x] Signup works ✅
- [x] Welcome email received ✅
- [x] Login works ✅
- [x] Payment gate shows ✅
- [x] Paystack checkout opens ✅
- [x] Test payment completes ✅
- [x] Webhook processes ✅
- [x] Payment gate disappears ✅
- [x] Wallet shows credits ✅
- [x] Payment email received ✅

---

**Read `DEPLOYMENT_CHECKLIST.md` for detailed guide!**
