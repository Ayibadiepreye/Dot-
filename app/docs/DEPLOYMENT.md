# Deployment Guide

## Prerequisites

- Node.js 20+
- MySQL/TiDB database
- Domain name (joindot.africa)

## Step 1: Database Setup (TiDB Cloud)

1. Create a TiDB Cloud cluster (free tier available)
2. Get connection string from dashboard
3. Set `DATABASE_URL` in `.env`

```bash
npm run db:push
npx tsx db/seed.ts
```

## Step 2: Configure OAuth (Kimi)

1. Register app in Kimi portal
2. Set callback URL: `https://joindot.africa/api/oauth/callback`
3. Copy APP_ID and APP_SECRET to `.env`

## Step 3: Configure Payment Providers

### Paystack (for NGN payments)
1. Create Paystack account
2. Get test keys from dashboard
3. Set `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
4. Configure webhook URL: `POST /api/webhooks/paystack`

### Stripe (for USD payments)
1. Create Stripe account
2. Get API keys from dashboard
3. Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
4. Configure webhook URL: `POST /api/webhooks/stripe`

## Step 4: Configure Whop

1. Create Whop account
2. Create product with 5 plans (matching tiers)
3. Get API key and plan IDs
4. Set `WHOP_API_KEY` and all `WHOP_PLAN_*` env vars

## Step 5: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel

Add all env vars from `.env.example` in Vercel dashboard → Settings → Environment Variables.

### Vercel Cron Job

Add to `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/whop/provision?secret=YOUR_CRON_SECRET", "schedule": "*/5 * * * *" }
  ]
}
```

## Step 6: Domain Setup

1. Add custom domain in Vercel dashboard
2. Configure DNS: Add A record pointing to Vercel IPs
3. Enable HTTPS (auto-enabled on Vercel)

## Step 7: Cloudflare R2 (Optional)

1. Create R2 bucket
2. Create API token with read/write access
3. Set all `R2_*` environment variables
4. Configure custom domain for R2 public URL

## Launch Checklist

- [ ] Database migrated and seeded
- [ ] OAuth configured
- [ ] Payment webhooks configured
- [ ] Whop plans created
- [ ] R2 bucket configured
- [ ] Email (Resend) configured
- [ ] PostHog project created
- [ ] Upstash Redis configured
- [ ] Cron secret set
- [ ] Environment variables set on Vercel
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Test payment flow end-to-end
- [ ] Test affiliate tracking
- [ ] Verify QR generation works
- [ ] Admin dashboard accessible
- [ ] Check-in scanner tested

## Monitoring

- Vercel Analytics for frontend performance
- TiDB Cloud monitoring for database
- PostHog for user events and funnels
- Paystack/Stripe dashboards for payments
