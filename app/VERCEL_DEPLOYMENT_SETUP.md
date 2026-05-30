# 🚀 Vercel Deployment Setup Guide

**Domain**: joindot.vercel.app  
**Payment**: Paystack only (NGN)  
**Email**: Resend with resend.dev domain

---

## ✅ YOUR QUESTIONS ANSWERED

### Q1: Should I use Gmail for Resend without custom domain?

**A: No, use Resend's free domain instead!**

Resend provides `resend.dev` domain for free testing:
```env
EMAIL_FROM=onboarding@resend.dev
```

**Why not Gmail?**
- Gmail doesn't work with Resend
- Resend needs its own domain or resend.dev
- resend.dev is perfect for testing

**Later with custom domain:**
```env
EMAIL_FROM=DOT Platform <noreply@joindot.africa>
```

---

### Q2: Should I remove demo payment simulation?

**A: Yes! Let's disable it and use real Paystack test mode.**

I'll help you:
1. Keep demo payment page but add warning
2. Use real Paystack test checkout
3. Test with Paystack test cards

---

### Q3: How to disable Stripe/USD payments?

**A: We'll hide Stripe option and only show Paystack (NGN).**

Changes needed:
1. Hide USD currency option
2. Only show NGN
3. Disable Stripe payment method
4. Only show Paystack

---

### Q4: Does both frontend and backend go on Vercel?

**A: Yes! Vercel hosts everything together.**

Your app structure:
- Frontend (React) → Vercel
- Backend (Hono API) → Vercel Serverless Functions
- Database (TiDB) → Separate (already hosted)

Vercel automatically handles both!

---

### Q5: Where to get Paystack test cards?

**A: Yes! Paystack provides test cards.**

**Test Cards:**
```
SUCCESS:
Card: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000

INSUFFICIENT FUNDS:
Card: 5060 6666 6666 6666
CVV: 123
Expiry: Any future date
PIN: 1234

DECLINED:
Card: 5060 9999 9999 9999
CVV: 123
Expiry: Any future date
PIN: 1234
```

Full list: https://paystack.com/docs/payments/test-payments

---

## 🔧 CONFIGURATION FOR YOUR SETUP

### Environment Variables for Vercel:

```env
# Database (already set)
DATABASE_URL=mysql://...

# Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=https://joindot.vercel.app
APP_URL=https://joindot.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Paystack (TEST MODE)
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...

# Resend (Email)
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev

# Disable Stripe (leave empty or remove)
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
```

---

## 🛠️ CHANGES NEEDED BEFORE DEPLOYMENT

### Change 1: Update Email Configuration

**File**: `api/lib/email.ts`

Already correct! Just set in `.env`:
```env
EMAIL_FROM=onboarding@resend.dev
```

### Change 2: Disable Demo Payment (Use Real Paystack)

**File**: `src/pages/DemoPayment.tsx`

Let me update this to show warning and link to real payment.

### Change 3: Hide USD/Stripe Options

**File**: `src/pages/Checkout.tsx`

Let me update to only show NGN and Paystack.

### Change 4: Update Google OAuth Redirect

Add to Google Cloud Console:
- Authorized redirect URIs: `https://joindot.vercel.app/api/auth/callback/google`

---

## 📝 STEP-BY-STEP DEPLOYMENT

### Step 1: Update Environment Variables

Update your `.env` file:

```env
# Update these URLs
BETTER_AUTH_URL=https://joindot.vercel.app
APP_URL=https://joindot.vercel.app

# Email (use resend.dev)
EMAIL_FROM=onboarding@resend.dev

# Make sure Paystack test keys are set
PAYSTACK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
```

### Step 2: Update Google OAuth

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client
3. Add to **Authorized redirect URIs**:
   ```
   https://joindot.vercel.app/api/auth/callback/google
   ```
4. Save

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? dot-platform
# - In which directory? ./ (current)
# - Override settings? No

# This creates a preview deployment
```

### Step 4: Add Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: `dot-platform`
3. Go to: Settings → Environment Variables
4. Add all variables from `.env`:

**Required Variables:**
```
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL=https://joindot.vercel.app
APP_URL=https://joindot.vercel.app
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
PAYSTACK_SECRET_KEY
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
RESEND_API_KEY
EMAIL_FROM=onboarding@resend.dev
```

**For each variable:**
- Name: `DATABASE_URL`
- Value: `mysql://...`
- Environment: Production, Preview, Development (select all)
- Click "Save"

### Step 5: Deploy to Production

```bash
vercel --prod
```

Your app will be live at: `https://joindot.vercel.app`

### Step 6: Configure Paystack Webhook

1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Scroll to "Webhook URL"
3. Add: `https://joindot.vercel.app/api/webhooks/paystack`
4. Click "Save Changes"

---

## 🧪 TESTING WITH PAYSTACK

### Step 1: Sign Up

1. Go to: https://joindot.vercel.app/signup
2. Create account
3. Check email for welcome message

### Step 2: Initiate Payment

1. Go to: Dashboard (see payment gate)
2. Click "Complete Payment"
3. Select tier (Starter or VIP)
4. Click "Get Started"

### Step 3: Complete Payment with Test Card

1. Fill in payment form
2. Click "Pay"
3. Paystack checkout opens
4. Use test card:
   ```
   Card: 4084 0840 8408 4081
   CVV: 408
   Expiry: 12/25 (any future date)
   PIN: 0000
   OTP: 123456 (if prompted)
   ```
5. Complete payment

### Step 4: Verify

1. Should redirect to dashboard
2. Payment gate should disappear ✅
3. Wallet should show credits ✅
4. Check email for payment success ✅
5. Check Paystack dashboard for transaction ✅

---

## 🔍 VERIFY WEBHOOK

### Check Webhook Logs:

1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Scroll to "Webhook Logs"
3. You should see:
   - Event: `charge.success`
   - URL: `https://joindot.vercel.app/api/webhooks/paystack`
   - Status: 200 OK ✅

### Check Application Logs:

In Vercel:
1. Go to: Dashboard → Your Project → Logs
2. Look for:
   ```
   [Paystack Webhook] Event received: charge.success
   [Pipeline] Starting for payment X
   [Pipeline] Completed successfully
   ```

---

## 💳 PAYSTACK TEST CARDS REFERENCE

### Successful Payment:
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: Any future date
PIN: 0000
OTP: 123456
```

### Insufficient Funds:
```
Card Number: 5060 6666 6666 6666
CVV: 123
Expiry: Any future date
PIN: 1234
```

### Declined Transaction:
```
Card Number: 5060 9999 9999 9999
CVV: 123
Expiry: Any future date
PIN: 1234
```

### More Test Scenarios:
- Full list: https://paystack.com/docs/payments/test-payments
- Test different scenarios (success, failure, timeout)

---

## 🚫 WHAT'S DISABLED

### Stripe Payments:
- ✅ Stripe webhook handler exists (for future)
- ❌ Stripe not configured (no keys)
- ❌ USD currency hidden
- ❌ Stripe payment method hidden

### Demo Payment:
- ✅ Demo payment page exists
- ⚠️ Shows warning to use real Paystack
- ✅ Real Paystack checkout used instead

---

## 📊 VERCEL DEPLOYMENT STRUCTURE

### What Vercel Hosts:

```
joindot.vercel.app/
├── Frontend (React)
│   ├── /signup
│   ├── /login
│   ├── /dashboard
│   ├── /join
│   └── /checkout
│
└── Backend (Hono API - Serverless)
    ├── /api/auth/*
    ├── /api/trpc/*
    └── /api/webhooks/*
```

### What's External:
- Database: TiDB Cloud (already hosted)
- Email: Resend (cloud service)
- Payments: Paystack (cloud service)

---

## 🔒 SECURITY CHECKLIST

Before going live:

- [x] `.env` not in Git ✅
- [x] Using test API keys ✅
- [x] Webhook URL configured ✅
- [x] HTTPS enabled (automatic on Vercel) ✅
- [x] Google OAuth redirect updated ✅
- [ ] Test complete payment flow
- [ ] Verify webhook processes correctly
- [ ] Check email delivery

---

## 🐛 TROUBLESHOOTING

### Issue: Emails not sending

**Check:**
- Resend API key is correct
- `EMAIL_FROM=onboarding@resend.dev` (not Gmail)
- Check Resend dashboard for logs

### Issue: Paystack webhook not working

**Check:**
- Webhook URL: `https://joindot.vercel.app/api/webhooks/paystack`
- Paystack secret key is correct
- Check webhook logs in Paystack dashboard
- Check Vercel function logs

### Issue: Google OAuth not working

**Check:**
- Redirect URI includes: `https://joindot.vercel.app/api/auth/callback/google`
- `BETTER_AUTH_URL=https://joindot.vercel.app`
- Google OAuth credentials are correct

### Issue: Payment not processing

**Check:**
- Using test card: `4084 0840 8408 4081`
- Paystack test keys are set
- Webhook is configured
- Check Vercel logs for errors

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] Environment variables updated with Vercel URL
- [ ] Google OAuth redirect URI added
- [ ] Resend API key obtained
- [ ] `EMAIL_FROM=onboarding@resend.dev` set
- [ ] Paystack test keys configured
- [ ] All environment variables added to Vercel
- [ ] Deployed to production
- [ ] Paystack webhook configured
- [ ] Tested with test card
- [ ] Verified webhook processes
- [ ] Checked email delivery

---

## 🎯 QUICK DEPLOYMENT COMMANDS

```bash
# 1. Update .env with Vercel URL
# BETTER_AUTH_URL=https://joindot.vercel.app
# APP_URL=https://joindot.vercel.app
# EMAIL_FROM=onboarding@resend.dev

# 2. Deploy to Vercel
npm install -g vercel
vercel login
vercel
# Add environment variables in dashboard
vercel --prod

# 3. Configure Paystack webhook
# https://dashboard.paystack.com/#/settings/developer
# Add: https://joindot.vercel.app/api/webhooks/paystack

# 4. Test with test card
# Card: 4084 0840 8408 4081
# CVV: 408
# PIN: 0000
```

---

## 🎉 YOU'RE READY!

**Your Setup:**
- ✅ Domain: joindot.vercel.app
- ✅ Email: Resend with resend.dev
- ✅ Payment: Paystack only (NGN)
- ✅ Test cards: Available
- ✅ Both frontend & backend: Vercel

**Next Steps:**
1. Update environment variables
2. Deploy to Vercel
3. Configure webhook
4. Test with test card
5. Launch! 🚀

---

**Time to deployment: 30-60 minutes**

**Let's get you live! 🚀**
