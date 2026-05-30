# Environment Variables Reference

## Required for All Features

| Variable | Description | Source | Secret? |
|----------|-------------|--------|---------|
| `DATABASE_URL` | TiDB Cloud connection string | TiDB Dashboard → Connect | Yes |
| `APP_URL` | Application base URL | Set to your domain | No |
| `APP_ID` | Kimi OAuth app ID | Kimi Portal → Apps | No |
| `APP_SECRET` | Kimi OAuth app secret | Kimi Portal → Apps | Yes |
| `KIMI_AUTH_URL` | Kimi auth service URL | Kimi Portal | No |
| `KIMI_OPEN_URL` | Kimi open API URL | Kimi Portal | No |
| `CRON_SECRET` | Random secret for cron auth | `openssl rand -hex 32` | Yes |

## Payments

| Variable | Description | Source | Secret? |
|----------|-------------|--------|---------|
| `PAYSTACK_SECRET_KEY` | Paystack secret for webhooks | Paystack Dashboard → Settings | Yes |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key | Paystack Dashboard → Settings | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | Stripe Dashboard → API Keys | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Stripe Dashboard → API Keys | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret | Stripe Dashboard → Webhooks | Yes |

## Whop Integration

| Variable | Description | Source |
|----------|-------------|--------|
| `WHOP_API_KEY` | Whop API v2 key | Whop Dashboard → Settings |
| `WHOP_PLAN_STARTER` | Plan ID for Starter tier | Whop Dashboard → Plans |
| `WHOP_PLAN_VIP` | Plan ID for VIP tier | Whop Dashboard → Plans |
| `WHOP_PLAN_PIONEER` | Plan ID for Pioneer tier | Whop Dashboard → Plans |
| `WHOP_PLAN_CORPORATE` | Plan ID for Corporate tier | Whop Dashboard → Plans |
| `WHOP_PLAN_HUB` | Plan ID for Hub Partner tier | Whop Dashboard → Plans |

## Cloudflare R2 (File Storage)

| Variable | Description | Source |
|----------|-------------|--------|
| `R2_ACCOUNT_ID` | Cloudflare account ID | Cloudflare Dashboard |
| `R2_ACCESS_KEY_ID` | R2 API token key | Cloudflare → Manage R2 API Tokens |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret | Created with token |
| `R2_BUCKET_NAME` | Storage bucket name | Default: `dot-assets` |
| `R2_PUBLIC_URL` | Custom domain for assets | e.g., `https://assets.joindot.africa` |

## Email (Resend)

| Variable | Description | Source |
|----------|-------------|--------|
| `RESEND_API_KEY` | Resend API key | Resend Dashboard |
| `EMAIL_FROM` | Sender email address | Must be verified in Resend |

## WhatsApp (Twilio)

| Variable | Description | Source |
|----------|-------------|--------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Twilio Console |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Twilio Console |
| `WHATSAPP_FROM_NUMBER` | WhatsApp sender number | Twilio → WhatsApp |

## PostHog Analytics

| Variable | Description | Source |
|----------|-------------|--------|
| `NEXT_PUBLIC_POSTHOG_KEY` | Project API key | PostHog Project Settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog instance URL | Default: `https://app.posthog.com` |

## Rate Limiting (Upstash)

| Variable | Description | Source |
|----------|-------------|--------|
| `UPSTASH_REDIS_REST_URL` | Redis REST endpoint | Upstash Console |
| `UPSTASH_REDIS_REST_TOKEN` | Redis REST token | Upstash Console |

## Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `OWNER_UNION_ID` | Admin user union ID | (empty) |
| `MAY_29_EVENT_ID` | Event row ID (set after seed) | (empty) |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `https://joindot.africa` |

## Generating Secrets

```bash
# Cron secret
openssl rand -hex 32

# Paystack webhook secret (Paystack generates this)
# Stripe webhook secret (Stripe generates this)
```

## Security Notes

- Never commit `.env` to Git
- All `SECRET` and `KEY` variables should be marked as secret in Vercel
- Public variables (`NEXT_PUBLIC_*`) are exposed to the browser
- Rotate secrets quarterly
- Use separate credentials for staging vs production
