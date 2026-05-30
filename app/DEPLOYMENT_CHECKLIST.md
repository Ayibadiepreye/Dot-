# 🚀 Vercel Deployment Checklist

**Domain**: joindot.vercel.app  
**Status**: Ready to Deploy  
**Time Estimate**: 30-45 minutes

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Configuration Files:
- [x] `vercel.json` created ✅
- [x] `.env` updated with Vercel URLs ✅
- [x] Currency locked to NGN (Paystack only) ✅
- [x] Email configured for `onboarding@resend.dev` ✅
- [x] Paystack test keys configured ✅
- [x] Database schema synced ✅

### Code Changes:
- [x] `src/pages/Join.tsx` - Currency locked to NGN ✅
- [x] `src/components/landing/PricingSection.tsx` - Currency locked to NGN ✅
- [x] `api/webhooks/paystack.ts` - Webhook handler ready ✅
- [x] `api/lib/email.ts` - Email service ready ✅
- [x] `api/lib/post-payment-pipeline.ts` - Credits updated (Starter: 2,000, VIP: 5,000) ✅

---

## 📋 DEPLOYMENT STEPS

### Step 1: Install Vercel CLI (5 minutes)

```bash
npm install -g vercel
```

**Verify installation:**
```bash
vercel --version
```

---

### Step 2: Login to Vercel (2 minutes)

```bash
vercel login
```

This will open your browser. Choose your login method:
- GitHub
- GitLab
- Bitbucket
- Email

---

### Step 3: Initial Deployment (10 minutes)

```bash
cd "c:\Users\bonni\Downloads\Kimi_Agent_Complete Platform Build\app"
vercel
```

**Answer the prompts:**

```
? Set up and deploy "~/app"? [Y/n] Y
? Which scope do you want to deploy to? [Your Account]
? Link to existing project? [y/N] N
? What's your project's name? dot-platform
? In which directory is your code located? ./
```

**Vercel will:**
1. Analyze your project
2. Detect build settings
3. Deploy to a preview URL
4. Give you a URL like: `https://dot-platform-xxx.vercel.app`

**Note:** This is a PREVIEW deployment, not production yet.

---

### Step 4: Add Environment Variables in Vercel Dashboard (10 minutes)

1. Go to: https://vercel.com/dashboard
2. Click on your project: `dot-platform`
3. Go to: **Settings** → **Environment Variables**

**Add these variables ONE BY ONE:**

#### Required Variables:

```env
DATABASE_URL
Value: mysql://3TNQu3siWtbsVhR.root:2IpubNAlfc1Ya582@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test
Environment: Production, Preview, Development ✓
```

```env
BETTER_AUTH_SECRET
Value: 7ArnFGD2h6Fds9lUs0RmW6S5hkeBY0CeVXBuyxvN5yM=
Environment: Production, Preview, Development ✓
```

```env
BETTER_AUTH_URL
Value: https://joindot.vercel.app
Environment: Production ✓
```

```env
APP_URL
Value: https://joindot.vercel.app
Environment: Production ✓
```

```env
GOOGLE_CLIENT_ID
Value: 710514042883-976al1ehjt10ejnggbpstmtk3u15jdv8.apps.googleusercontent.com
Environment: Production, Preview, Development ✓
```

```env
GOOGLE_CLIENT_SECRET
Value: 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
Environment: Production, Preview, Development ✓
```

```env
VITE_GOOGLE_CLIENT_ID
Value: 710514042883-976al1ehjt10ejnggbpstmtk3u15jdv8.apps.googleusercontent.com
Environment: Production, Preview, Development ✓
```

```env
PAYSTACK_SECRET_KEY
Value: sk_test_8261a3e57c6e3e8d1ef45b248781cf32e6a4faab
Environment: Production, Preview, Development ✓
```

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
Value: pk_test_abdb597bf6b89a7515de455fb81f819fdd5c3373
Environment: Production, Preview, Development ✓
```

```env
RESEND_API_KEY
Value: re_4S8TdtnV_NPEeNNdwQ8ggXgWxqNbN3KRr
Environment: Production, Preview, Development ✓
```

```env
EMAIL_FROM
Value: onboarding@resend.dev
Environment: Production, Preview, Development ✓
```

```env
NEXT_PUBLIC_APP_URL
Value: https://joindot.vercel.app
Environment: Production ✓
```

**Click "Save" after each variable.**

---

### Step 5: Update Google OAuth Redirect URI (5 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Scroll to **Authorized redirect URIs**
4. Click **+ ADD URI**
5. Add: `https://joindot.vercel.app/api/auth/callback/google`
6. Click **SAVE**

**Your redirect URIs should now include:**
- `http://localhost:3000/api/auth/callback/google` (for local dev)
- `https://joindot.vercel.app/api/auth/callback/google` (for production)

---

### Step 6: Deploy to Production (2 minutes)

```bash
vercel --prod
```

**This will:**
1. Build your project
2. Deploy to production
3. Assign the domain: `https://joindot.vercel.app`

**Wait for:**
```
✅ Production: https://joindot.vercel.app [copied to clipboard]
```

---

### Step 7: Configure Paystack Webhook (3 minutes)

1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Scroll to **Webhook URL**
3. Enter: `https://joindot.vercel.app/api/webhooks/paystack`
4. Click **Save Changes**

**Verify:**
- URL should show as saved
- Status should be active

---

### Step 8: Test the Deployment (10 minutes)

#### Test 1: Sign Up
1. Go to: https://joindot.vercel.app/signup
2. Create a new account with your email
3. Check your email for welcome message ✅

**Expected:**
- Account created successfully
- Welcome email received from `onboarding@resend.dev`
- Redirected to dashboard

#### Test 2: Payment Gate
1. After signup, you should see payment gate on dashboard
2. Click "Complete Payment"
3. Should redirect to `/join` page

**Expected:**
- Payment gate visible
- "Complete Payment" button works
- Join page shows NGN prices only

#### Test 3: Payment Flow
1. On `/join` page, select a tier (Starter or VIP)
2. Click "Get Started"
3. Fill in payment form
4. Click "Pay"

**Expected:**
- Redirected to Paystack checkout
- Checkout shows correct amount in NGN

#### Test 4: Complete Payment with Test Card
1. On Paystack checkout, enter test card:
   ```
   Card Number: 4084 0840 8408 4081
   CVV: 408
   Expiry: 12/25 (any future date)
   PIN: 0000
   OTP: 123456 (if prompted)
   ```
2. Complete payment

**Expected:**
- Payment successful
- Redirected back to dashboard
- Payment gate disappears ✅
- Wallet shows credits ✅

#### Test 5: Verify Webhook
1. Go to: https://dashboard.paystack.com/#/settings/developer
2. Scroll to **Webhook Logs**
3. Check latest webhook

**Expected:**
- Event: `charge.success`
- URL: `https://joindot.vercel.app/api/webhooks/paystack`
- Status: `200 OK` ✅

#### Test 6: Check Email
1. Check your email inbox
2. Look for payment success email

**Expected:**
- Email received from `onboarding@resend.dev`
- Subject: "Payment Successful - Welcome to DOT!"
- Contains payment details and credits

---

## 🔍 VERIFICATION CHECKLIST

After deployment, verify:

- [ ] App loads at `https://joindot.vercel.app` ✅
- [ ] Signup works ✅
- [ ] Welcome email received ✅
- [ ] Login works ✅
- [ ] Google OAuth works ✅
- [ ] Payment gate shows on dashboard ✅
- [ ] Join page shows NGN prices only ✅
- [ ] Paystack checkout opens ✅
- [ ] Test payment completes ✅
- [ ] Webhook processes payment ✅
- [ ] Payment gate disappears after payment ✅
- [ ] Wallet shows correct credits ✅
- [ ] Payment success email received ✅

---

## 💳 PAYSTACK TEST CARDS

### Successful Payment:
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: 12/25 (any future date)
PIN: 0000
OTP: 123456 (if prompted)
```

### Insufficient Funds:
```
Card Number: 5060 6666 6666 6666
CVV: 123
Expiry: 12/25
PIN: 1234
```

### Declined Transaction:
```
Card Number: 5060 9999 9999 9999
CVV: 123
Expiry: 12/25
PIN: 1234
```

**Full list**: https://paystack.com/docs/payments/test-payments

---

## 🐛 TROUBLESHOOTING

### Issue: Build fails on Vercel

**Check:**
- Build command in `package.json`: `npm run build`
- All dependencies installed
- TypeScript errors fixed

**Solution:**
```bash
# Test build locally first
npm run build
```

### Issue: Environment variables not working

**Check:**
- All variables added in Vercel dashboard
- Variables assigned to correct environment (Production)
- Redeployed after adding variables

**Solution:**
```bash
# Redeploy after adding variables
vercel --prod
```

### Issue: Google OAuth not working

**Check:**
- Redirect URI added: `https://joindot.vercel.app/api/auth/callback/google`
- `BETTER_AUTH_URL=https://joindot.vercel.app`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` correct

**Solution:**
- Verify redirect URI in Google Console
- Check environment variables in Vercel

### Issue: Paystack webhook not working

**Check:**
- Webhook URL: `https://joindot.vercel.app/api/webhooks/paystack`
- `PAYSTACK_SECRET_KEY` is correct
- Webhook logs in Paystack dashboard

**Solution:**
- Check Vercel function logs
- Verify webhook URL in Paystack
- Test with Paystack test card

### Issue: Emails not sending

**Check:**
- `RESEND_API_KEY` is correct
- `EMAIL_FROM=onboarding@resend.dev` (NOT Gmail)
- Resend dashboard for logs

**Solution:**
- Verify API key in Resend dashboard
- Check email logs in Resend
- Ensure using `onboarding@resend.dev`

### Issue: Payment not processing

**Check:**
- Using test card: `4084 0840 8408 4081`
- Paystack test keys configured
- Webhook configured
- Vercel function logs

**Solution:**
- Test with different test card
- Check Paystack dashboard for transaction
- Check webhook logs
- Check Vercel function logs

---

## 📊 VERCEL DASHBOARD

### Useful Links:

**Project Dashboard:**
https://vercel.com/dashboard

**Deployments:**
https://vercel.com/[your-username]/dot-platform/deployments

**Environment Variables:**
https://vercel.com/[your-username]/dot-platform/settings/environment-variables

**Function Logs:**
https://vercel.com/[your-username]/dot-platform/logs

**Domains:**
https://vercel.com/[your-username]/dot-platform/settings/domains

---

## 🎯 POST-DEPLOYMENT TASKS

### Immediate:
- [ ] Test complete user flow
- [ ] Verify webhook processes correctly
- [ ] Check email delivery
- [ ] Monitor Vercel function logs
- [ ] Check Paystack dashboard for transactions

### Within 24 Hours:
- [ ] Test with multiple users
- [ ] Monitor error logs
- [ ] Check database for correct data
- [ ] Verify all emails sending
- [ ] Test all payment scenarios

### Within 1 Week:
- [ ] Set up custom domain (optional)
- [ ] Switch to production API keys
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Add analytics (PostHog)
- [ ] Implement rate limiting

---

## 🔒 SECURITY CHECKLIST

Before going live with real payments:

- [x] `.env` not in Git ✅
- [x] Using test API keys ✅
- [x] Webhook signature verification enabled ✅
- [x] HTTPS enabled (automatic on Vercel) ✅
- [x] Google OAuth redirect updated ✅
- [ ] Test complete payment flow ⏳
- [ ] Verify webhook processes correctly ⏳
- [ ] Check email delivery ⏳
- [ ] Monitor for errors ⏳

---

## 📈 MONITORING

### Vercel Logs:
- Go to: Dashboard → Your Project → Logs
- Filter by: Functions, Errors, All

### Paystack Dashboard:
- Transactions: https://dashboard.paystack.com/#/transactions
- Webhook Logs: https://dashboard.paystack.com/#/settings/developer

### Resend Dashboard:
- Email Logs: https://resend.com/emails
- API Keys: https://resend.com/api-keys

---

## 🎉 SUCCESS CRITERIA

You'll know deployment is successful when:

1. ✅ App loads at `https://joindot.vercel.app`
2. ✅ Can sign up and receive welcome email
3. ✅ Can login (email/password and Google OAuth)
4. ✅ Payment gate shows on dashboard
5. ✅ Can select tier and see NGN prices only
6. ✅ Paystack checkout opens
7. ✅ Can complete payment with test card
8. ✅ Webhook processes payment (check logs)
9. ✅ Payment gate disappears after payment
10. ✅ Wallet shows correct credits
11. ✅ Payment success email received
12. ✅ All features work as expected

---

## 🚀 QUICK DEPLOYMENT COMMANDS

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Initial deployment
cd "c:\Users\bonni\Downloads\Kimi_Agent_Complete Platform Build\app"
vercel

# 4. Add environment variables in dashboard
# https://vercel.com/dashboard → Settings → Environment Variables

# 5. Update Google OAuth redirect URI
# https://console.cloud.google.com/apis/credentials
# Add: https://joindot.vercel.app/api/auth/callback/google

# 6. Deploy to production
vercel --prod

# 7. Configure Paystack webhook
# https://dashboard.paystack.com/#/settings/developer
# Add: https://joindot.vercel.app/api/webhooks/paystack

# 8. Test with test card
# Card: 4084 0840 8408 4081
# CVV: 408
# PIN: 0000
```

---

## 📞 SUPPORT RESOURCES

**Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Paystack:**
- Docs: https://paystack.com/docs
- Support: https://paystack.com/contact

**Resend:**
- Docs: https://resend.com/docs
- Support: https://resend.com/support

**Google OAuth:**
- Docs: https://developers.google.com/identity/protocols/oauth2
- Console: https://console.cloud.google.com

---

## ✅ FINAL CHECKLIST

Before marking as complete:

- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Initial deployment successful
- [ ] All environment variables added
- [ ] Google OAuth redirect URI updated
- [ ] Production deployment successful
- [ ] Paystack webhook configured
- [ ] Complete user flow tested
- [ ] Webhook verified working
- [ ] Emails verified sending
- [ ] All features working

---

**Time to deployment: 30-45 minutes**

**You're ready to launch! 🚀**

---

## 📝 NOTES

- Using Vercel's free domain: `joindot.vercel.app`
- Email sending from: `onboarding@resend.dev`
- Payment processing: Paystack only (NGN)
- Test mode: Using Paystack test keys
- Database: TiDB Cloud (already hosted)

**Next Steps After Launch:**
1. Monitor for 24-48 hours
2. Test with real users
3. Switch to production API keys when ready
4. Consider custom domain
5. Add monitoring and analytics
