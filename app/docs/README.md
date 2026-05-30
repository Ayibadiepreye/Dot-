# DOT Platform

Africa's largest builder ecosystem — a membership platform for founders, creators, and entrepreneurs.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: tRPC + Hono + Drizzle ORM + MySQL
- **Auth**: Kimi OAuth 2.0
- **Payments**: Paystack (NGN) + Stripe (USD) — webhook-ready architecture
- **Storage**: Cloudflare R2
- **Email**: Resend
- **Analytics**: PostHog
- **Rate Limiting**: Upstash Redis

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in all required values

# Push database schema
npm run db:push

# Seed database
npx tsx db/seed.ts

# Start development server
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build |
| `npm run check` | TypeScript type check |
| `npm run db:push` | Push schema changes to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Apply pending migrations |
| `npm run seed` | Seed database with initial data |
| `npm run test` | Run Vitest unit tests |
| `npm run format` | Format code with Prettier |

## Project Structure

```
├── api/                    # Backend API (tRPC + Hono)
│   ├── routers/            # tRPC routers (user, payment, admin, etc.)
│   ├── queries/            # Database query functions
│   ├── kimi/               # OAuth authentication
│   ├── router.ts           # Main tRPC router
│   ├── middleware.ts       # Auth + role middleware
│   └── boot.ts             # Hono app entry
├── db/                     # Database schema & migrations
│   ├── schema.ts           # All 13 Drizzle tables
│   ├── relations.ts        # Table relations
│   ├── seed.ts             # Seed script
│   └── reset.ts            # Reset script
├── contracts/              # Shared types/constants
├── src/
│   ├── pages/              # All page components
│   ├── components/         # Reusable components
│   │   ├── layout/         # Navbar, Footer, DashboardNav, AdminNav
│   │   └── landing/        # Hero, Pricing, FAQ, Countdown, etc.
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (cn, formatCurrency, etc.)
│   ├── types/              # TypeScript type definitions
│   └── providers/          # tRPC provider
├── docs/                   # Documentation
├── .env.example            # Environment variable template
└── package.json
```

## Architecture

### Authentication Flow
1. User clicks "Sign in with Kimi" → redirects to OAuth
2. After OAuth callback → JWT session cookie set
3. Protected routes check session via tRPC context

### Payment Flow
1. User selects tier → fills checkout form
2. Frontend calls `payment.initiate` tRPC mutation
3. Demo payment page simulates Paystack/Stripe
4. On success → account creation pipeline runs
5. User redirected to onboarding

### Database (13 Tables)
- `users` — member profiles with tier, role, referral code
- `wallets` — credit & reward balances, reputation score
- `wallet_transactions` — immutable transaction log
- `payments` — payment records (Paystack + Stripe)
- `organizations` — partner orgs
- `affiliates` — referral tracking
- `affiliate_clicks` — click analytics
- `achievements` — badge system
- `events` — launch events
- `event_tickets` — QR code tickets
- `partner_logos` — landing page logos
- `faqs` — FAQ content
- `whop_pending` — Whop provisioning retry queue

## Membership Tiers

| Tier | Price (NGN) | USD Equiv | Builder Credits |
|------|-------------|-----------|----------------|
| Starter | ₦30,000 | ~$20 | $2,000 |
| VIP | ₦1,000,000 | ~$650 | $5,000 |
| Pioneer | ₦3,000,000 | ~$2,000 | $10,000 |
| Corporate | ₦30,000,000 | ~$20,000 | $50,000 |
| Hub Partner | ₦300,000,000 | ~$200,000 | $200,000 |

## License

Private — joindot.africa
