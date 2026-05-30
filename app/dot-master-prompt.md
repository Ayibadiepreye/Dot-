# MASTER BUILD PROMPT — DOT PLATFORM
### For: Kimi 2.6 · Attached: dot-engineering-blueprint.html

---

## ▸ READ THIS FIRST

You have been given an HTML engineering blueprint document (attached). That document is the single source of truth for what this platform does. Read it completely before writing a single line of code.

Your job: Build the **entire DOT platform** — frontend, backend, database — production-ready, deployment-ready, documentation-complete, with zero gaps. The team that receives your output will only need to:
1. Fill in real API keys and secrets
2. Run test scripts
3. Deploy

Nothing should be missing. No stubs. No placeholder logic. No "TODO" in production code paths. If something in the blueprint is ambiguous, make the most reasonable engineering decision and document it clearly.

---

## ▸ SECTION 1: PLATFORM IDENTITY

**DOT** (joindot.africa) is Africa's Largest Builder Ecosystem — a membership platform for founders, creators, and entrepreneurs.

**Cohort I Launch Date:** Friday, May 29, 2026  
**Target:** 1,000,000 Cohort I users  
**Domain:** joindot.africa  
**Primary market:** Nigeria (Paystack/NGN) + Global (Stripe/USD)

**Membership tiers:**
| Tier | Price (NGN) | USD Equiv | Builder Credits | Whop Access |
|---|---|---|---|---|
| Starter | ₦30,000 | ~$20 | $2,000 | General |
| VIP | ₦1,000,000 | ~$650 | $5,000 | + VIP Rooms |
| Pioneer | ₦3,000,000 | ~$2,000 | $10,000 | + Founder Rooms |
| Corporate | ₦30,000,000 | ~$20,000 | $50,000 | + Partner Rooms |
| Hub Partner | ₦300,000,000 | ~$200,000 | $200,000 | Full Access |

**Out of scope for MVP — do NOT build or stub:** public token trading, P2P marketplace, external withdrawals, lending, AI assistant.

---

## ▸ SECTION 2: FINAL TECHNOLOGY STACK

The blueprint specifies Supabase for DB, Auth, and Edge Functions. **We are replacing those with the following** (all other integrations stay the same):

| Blueprint Layer | Replacement | Package |
|---|---|---|
| Supabase PostgreSQL | **Neon Serverless PostgreSQL** | `@neondatabase/serverless` |
| Supabase Auth | **NextAuth.js v5 (Auth.js)** | `next-auth@beta` |
| Supabase Edge Functions | **Next.js 14 Route Handlers** (Vercel Edge) | Built-in |
| Supabase RLS | **Middleware + query-level row filtering** | Custom |
| Supabase Realtime | **Polling + Server-Sent Events** where needed | Built-in |
| Supabase Storage | **Cloudflare R2** | `@aws-sdk/client-s3` |

**Complete final stack:**

```
Framework:      Next.js 14.2+ (App Router, TypeScript)
Styling:        Tailwind CSS v3 + shadcn/ui components
Database:       Neon Serverless PostgreSQL (connection pooling enabled)
ORM:            Drizzle ORM + drizzle-kit for migrations
Auth:           NextAuth.js v5 — Google OAuth, Resend Email OTP, phone custom
Payments (NG):  Paystack (inline SDK + webhook)
Payments (GL):  Stripe (Checkout Session + webhook)
Community:      Whop API v2
Analytics:      PostHog (cloud)
Storage:        Cloudflare R2 (via S3-compatible SDK)
Email:          Resend
WhatsApp:       Meta Business API (via Twilio as proxy)
QR Codes:       qrcode npm package (server-side)
Hosting:        Vercel (Edge runtime for webhooks)
DNS:            Cloudflare
Rate Limiting:  Upstash Redis + @upstash/ratelimit
Validation:     Zod
Testing:        Vitest + Playwright + Testing Library
```

---

## ▸ SECTION 3: COMPLETE PROJECT FILE STRUCTURE

Generate every file listed. Every directory. No omissions.

```
dot-platform/
├── app/                                    # Next.js App Router root
│   ├── layout.tsx                          # Root layout (fonts, providers, global CSS)
│   ├── not-found.tsx                       # Global 404 page
│   ├── error.tsx                           # Global error boundary
│   ├── loading.tsx                         # Global loading UI
│   │
│   ├── (public)/                           # Public routes (no auth)
│   │   ├── page.tsx                        # / — Landing page
│   │   ├── join/
│   │   │   └── page.tsx                    # /join — Plan selection
│   │   ├── checkout/
│   │   │   └── [tier]/
│   │   │       └── page.tsx               # /checkout/[tier] — Checkout form
│   │   ├── r/
│   │   │   └── [code]/
│   │   │       └── route.ts              # /r/[code] — Affiliate redirect handler
│   │   ├── become-partner/
│   │   │   └── page.tsx                   # /become-partner — Partner application
│   │   └── become-affiliate/
│   │       └── page.tsx                   # /become-affiliate — Affiliate info page
│   │
│   ├── (auth)/                             # Auth routes
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── route.ts              # /auth/callback — OAuth callback
│   │   │   └── setup/
│   │   │       └── page.tsx              # /auth/setup — Post-payment account setup
│   │   ├── login/
│   │   │   └── page.tsx                   # /login
│   │   └── signup/
│   │       └── page.tsx                   # /signup
│   │
│   ├── onboarding/
│   │   └── page.tsx                        # /onboarding — 5-step onboarding (protected)
│   │
│   ├── dashboard/                          # Member dashboard (protected)
│   │   ├── layout.tsx                      # Dashboard shell layout
│   │   ├── page.tsx                        # /dashboard — Home
│   │   ├── wallet/
│   │   │   └── page.tsx                   # /dashboard/wallet
│   │   ├── referrals/
│   │   │   └── page.tsx                   # /dashboard/referrals
│   │   ├── ticket/
│   │   │   └── page.tsx                   # /dashboard/ticket
│   │   └── community/
│   │       └── page.tsx                   # /dashboard/community
│   │
│   ├── org/                                # Org dashboard (org_admin role)
│   │   └── [slug]/
│   │       ├── layout.tsx
│   │       └── page.tsx                   # /org/[slug]
│   │
│   ├── admin/                              # Admin dashboard (admin role)
│   │   ├── layout.tsx                      # Admin shell layout
│   │   ├── page.tsx                        # /admin — Overview
│   │   ├── users/
│   │   │   └── page.tsx                   # /admin/users
│   │   ├── payments/
│   │   │   └── page.tsx                   # /admin/payments
│   │   ├── affiliates/
│   │   │   └── page.tsx                   # /admin/affiliates
│   │   ├── organizations/
│   │   │   └── page.tsx                   # /admin/organizations
│   │   ├── events/
│   │   │   └── page.tsx                   # /admin/events — QR scanner
│   │   └── content/
│   │       └── page.tsx                   # /admin/content — FAQs, logos
│   │
│   └── api/                               # API Route Handlers
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts              # NextAuth handler
│       ├── stats/
│       │   └── route.ts                  # GET /api/stats — public metrics
│       ├── user/
│       │   ├── me/
│       │   │   └── route.ts             # GET /api/user/me
│       │   ├── transactions/
│       │   │   └── route.ts             # GET /api/user/transactions
│       │   └── ticket/
│       │       └── route.ts             # GET /api/user/ticket
│       ├── affiliate/
│       │   ├── stats/
│       │   │   └── route.ts             # GET /api/affiliate/stats
│       │   └── track/
│       │       └── route.ts             # POST /api/affiliate/track — click tracking
│       ├── payment/
│       │   ├── initiate/
│       │   │   └── route.ts             # POST /api/payment/initiate
│       │   └── verify/
│       │       └── route.ts             # POST /api/payment/verify
│       ├── webhooks/
│       │   ├── paystack/
│       │   │   └── route.ts             # POST /api/webhooks/paystack
│       │   └── stripe/
│       │       └── route.ts             # POST /api/webhooks/stripe
│       ├── admin/
│       │   ├── users/
│       │   │   └── route.ts             # GET+PATCH /api/admin/users
│       │   ├── metrics/
│       │   │   └── route.ts             # GET /api/admin/metrics
│       │   ├── ban/
│       │   │   └── route.ts             # POST /api/admin/ban
│       │   └── org/
│       │       └── approve/
│       │           └── route.ts         # POST /api/admin/org/approve
│       ├── checkin/
│       │   └── route.ts                 # POST /api/checkin — event check-in
│       └── whop/
│           └── provision/
│               └── route.ts             # POST /api/whop/provision (internal)
│
├── components/
│   ├── ui/                               # shadcn/ui base components (generate all used)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   └── accordion.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx                   # Public nav
│   │   ├── Footer.tsx
│   │   ├── DashboardNav.tsx             # Member dashboard sidebar
│   │   ├── AdminNav.tsx                 # Admin sidebar
│   │   └── OrgNav.tsx                  # Org sidebar
│   │
│   ├── landing/
│   │   ├── HeroSection.tsx             # Full-viewport hero
│   │   ├── MetricsBar.tsx              # Animated counters
│   │   ├── BenefitsGrid.tsx            # 5-item feature grid
│   │   ├── PricingSection.tsx          # Tier cards + currency toggle
│   │   ├── PartnerLogos.tsx            # Scrolling logo strip
│   │   ├── FAQSection.tsx              # Accordion FAQ
│   │   └── CountdownTimer.tsx          # Launch countdown
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── OTPInput.tsx
│   │   ├── GoogleSignInBtn.tsx
│   │   └── PhoneVerifyForm.tsx
│   │
│   ├── payment/
│   │   ├── PricingCard.tsx
│   │   ├── CheckoutForm.tsx
│   │   ├── CurrencyToggle.tsx
│   │   ├── PaystackButton.tsx          # Paystack inline SDK wrapper
│   │   └── StripeCheckoutBtn.tsx       # Stripe session redirect
│   │
│   ├── dashboard/
│   │   ├── WalletCard.tsx
│   │   ├── TransactionRow.tsx
│   │   ├── AchievementBadge.tsx
│   │   ├── ReferralWidget.tsx
│   │   ├── QRTicket.tsx
│   │   ├── CommunityAccess.tsx
│   │   └── ReputationBar.tsx
│   │
│   └── admin/
│       ├── MetricCard.tsx
│       ├── DataTable.tsx               # Generic sortable/filterable table
│       ├── UserEditModal.tsx
│       ├── CSVExportBtn.tsx
│       └── QRScanner.tsx              # html5-qrcode wrapper
│
├── lib/
│   ├── db/
│   │   ├── index.ts                    # Neon client + Drizzle instance
│   │   └── queries/
│   │       ├── users.ts
│   │       ├── wallets.ts
│   │       ├── payments.ts
│   │       ├── affiliates.ts
│   │       ├── events.ts
│   │       └── admin.ts
│   ├── auth/
│   │   ├── config.ts                   # NextAuth.js config (providers, callbacks)
│   │   └── helpers.ts                  # getServerSession wrapper, role checks
│   ├── paystack/
│   │   ├── client.ts                   # Paystack API wrapper
│   │   └── verify.ts                   # HMAC webhook verification
│   ├── stripe/
│   │   ├── client.ts                   # Stripe SDK instance
│   │   └── verify.ts                   # Stripe webhook sig verification
│   ├── whop/
│   │   ├── client.ts                   # Whop API v2 wrapper
│   │   └── retry.ts                    # Retry queue logic
│   ├── resend/
│   │   ├── client.ts                   # Resend client
│   │   └── templates/
│   │       ├── welcome.tsx             # React Email template
│   │       ├── referral-paid.tsx
│   │       ├── event-reminder.tsx
│   │       └── verify-email.tsx
│   ├── r2/
│   │   └── client.ts                   # R2 S3-compatible client
│   ├── whatsapp/
│   │   └── client.ts                   # WhatsApp Business API via Twilio
│   ├── posthog/
│   │   ├── client.ts                   # Server-side PostHog
│   │   └── provider.tsx                # Client-side provider
│   ├── qr/
│   │   └── generate.ts                 # QR PNG generation + R2 upload
│   ├── ratelimit/
│   │   └── index.ts                    # Upstash Redis rate limiter
│   └── utils.ts                        # nanoid, formatCurrency, cn(), etc.
│
├── schema/
│   ├── users.ts                        # Drizzle schema: users table
│   ├── wallets.ts                      # wallets + wallet_transactions
│   ├── payments.ts                     # payments table
│   ├── organizations.ts                # organizations table
│   ├── affiliates.ts                   # affiliates + affiliate_clicks
│   ├── achievements.ts                 # achievements table
│   ├── events.ts                       # events + event_tickets
│   ├── content.ts                      # partner_logos + faqs
│   ├── whop-pending.ts                 # whop_pending retry queue table
│   └── index.ts                        # re-exports all schemas
│
├── migrations/                         # drizzle-kit generated SQL migrations
│   └── 0000_initial_schema.sql
│
├── middleware.ts                        # Next.js middleware (auth + role guards)
│
├── types/
│   ├── index.ts                        # All shared TypeScript types
│   ├── next-auth.d.ts                  # NextAuth session type extensions
│   └── api.ts                          # API request/response types
│
├── hooks/
│   ├── useSession.ts                   # Thin wrapper around useSession
│   ├── useWallet.ts                    # SWR hook for wallet data
│   ├── useAffiliate.ts
│   └── useAdmin.ts
│
├── constants/
│   └── index.ts                        # TIER_CREDITS, TIER_PRICES, WHOP_PLAN_IDS, etc.
│
├── tests/
│   ├── unit/
│   │   ├── affiliate.test.ts
│   │   ├── payment-pipeline.test.ts
│   │   ├── checkin.test.ts
│   │   └── wallet.test.ts
│   ├── integration/
│   │   ├── paystack-webhook.test.ts
│   │   ├── stripe-webhook.test.ts
│   │   └── auth-flow.test.ts
│   └── e2e/
│       ├── checkout.spec.ts
│       ├── dashboard.spec.ts
│       └── admin.spec.ts
│
├── docs/
│   ├── README.md                       # Project overview, setup guide
│   ├── DEPLOYMENT.md                   # Step-by-step Vercel + Neon deployment
│   ├── API.md                          # All endpoints documented
│   ├── TESTING.md                      # How to run all test suites
│   ├── RUNBOOK.md                      # Launch day ops runbook
│   └── ENV.md                          # Every env var with description and source
│
├── public/
│   └── og-image.png                    # OG image placeholder
│
├── .env.example                        # Template for all env vars (no real values)
├── .env.local                          # Git-ignored local secrets
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## ▸ SECTION 4: DATABASE SCHEMA (Neon + Drizzle)

Use Drizzle ORM with `@neondatabase/serverless`. Define every table in `schema/`. Use Neon's pooled connection for API routes and direct connection for migrations.

### Connection setup (`lib/db/index.ts`):
```typescript
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/schema';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export type DB = typeof db;
```

### All 13 tables to implement:

**1. users** — core member profile
```typescript
// schema/users.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  authId: text('auth_id').unique(),          // NextAuth user ID
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone').unique(),
  country: text('country'),
  state: text('state'),
  school: text('school'),
  organizationId: uuid('organization_id').references(() => organizations.id),
  tier: text('tier').notNull().$type<'starter'|'vip'|'pioneer'|'corporate'|'hub_partner'>(),
  referralCode: text('referral_code').unique().notNull(),   // 8-char alphanumeric, nanoid
  referredBy: text('referred_by').references(() => users.referralCode),
  walletId: uuid('wallet_id'),              // set after wallet creation
  whopId: text('whop_id'),
  whopEmail: text('whop_email'),
  builderScore: integer('builder_score').default(0),
  avatarUrl: text('avatar_url'),
  role: text('role').$type<'member'|'org_admin'|'ops'|'admin'|'super_admin'>().default('member'),
  onboarded: boolean('onboarded').default(false),
  phoneVerified: boolean('phone_verified').default(false),
  emailVerified: boolean('email_verified').default(false),
  bannedUntil: timestamp('banned_until'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**2. wallets**
```typescript
export const wallets = pgTable('wallets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  creditBalance: numeric('credit_balance', { precision: 15, scale: 2 }).default('0'),
  rewardBalance: numeric('reward_balance', { precision: 15, scale: 2 }).default('0'),
  reputationScore: integer('reputation_score').default(0),
  lifetimeCredits: numeric('lifetime_credits', { precision: 15, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**3. wallet_transactions**
```typescript
export const walletTransactions = pgTable('wallet_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  walletId: uuid('wallet_id').notNull().references(() => wallets.id),
  type: text('type').$type<'credit'|'debit'|'reward'|'adjustment'>().notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  description: text('description'),
  reference: text('reference'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**4. payments**
```typescript
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  email: text('email').notNull(),
  phone: text('phone'),
  tier: text('tier').notNull(),
  currency: text('currency').$type<'NGN'|'USD'|'GBP'|'EUR'>().notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  provider: text('provider').$type<'paystack'|'stripe'>().notNull(),
  providerRef: text('provider_ref').unique().notNull(),
  status: text('status').$type<'pending'|'success'|'failed'|'refunded'>().notNull(),
  affiliateCode: text('affiliate_code'),
  metadata: jsonb('metadata').default({}),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**5. organizations**
```typescript
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  contactEmail: text('contact_email'),
  country: text('country'),
  logoUrl: text('logo_url'),
  referralCode: text('referral_code').unique().notNull(),
  revenueTotal: numeric('revenue_total', { precision: 15, scale: 2 }).default('0'),
  status: text('status').$type<'active'|'suspended'|'pending'>().default('pending'),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**6. affiliates**
```typescript
export const affiliates = pgTable('affiliates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').unique().notNull().references(() => users.id, { onDelete: 'cascade' }),
  referralCode: text('referral_code').unique().notNull(),
  totalClicks: integer('total_clicks').default(0),
  totalSignups: integer('total_signups').default(0),
  totalPaid: integer('total_paid').default(0),
  totalRevenue: numeric('total_revenue', { precision: 15, scale: 2 }).default('0'),
  commissionRate: numeric('commission_rate', { precision: 5, scale: 2 }).default('10.00'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**7. affiliate_clicks**
```typescript
export const affiliateClicks = pgTable('affiliate_clicks', {
  id: uuid('id').primaryKey().defaultRandom(),
  referralCode: text('referral_code').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  deviceHash: text('device_hash'),
  converted: boolean('converted').default(false),
  paymentId: uuid('payment_id').references(() => payments.id),
  clickedAt: timestamp('clicked_at').defaultNow(),
});
```

**8. achievements**
```typescript
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  label: text('label').notNull(),
  icon: text('icon'),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
});
```

**9. events**
```typescript
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  venue: text('venue').notNull(),
  startsAt: timestamp('starts_at').notNull(),
  endsAt: timestamp('ends_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});
```

**10. event_tickets**
```typescript
export const eventTickets = pgTable('event_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().references(() => events.id),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  paymentId: uuid('payment_id').references(() => payments.id),
  qrCode: text('qr_code').notNull(),      // "DOT-" + 8-char nanoid token
  qrUrl: text('qr_url'),                  // R2 URL of rendered QR PNG
  checkedIn: boolean('checked_in').default(false),
  checkedInAt: timestamp('checked_in_at'),
  checkedInBy: uuid('checked_in_by').references(() => users.id),
  badgeIssued: boolean('badge_issued').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({ uniq: unique().on(t.eventId, t.userId) }));
```

**11. partner_logos**
```typescript
export const partnerLogos = pgTable('partner_logos', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  logoUrl: text('logo_url').notNull(),
  url: text('url'),
  order: integer('order').default(0),
  active: boolean('active').default(true),
});
```

**12. faqs**
```typescript
export const faqs = pgTable('faqs', {
  id: uuid('id').primaryKey().defaultRandom(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  order: integer('order').default(0),
  active: boolean('active').default(true),
});
```

**13. whop_pending** (retry queue)
```typescript
export const whopPending = pgTable('whop_pending', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  tier: text('tier').notNull(),
  email: text('email').notNull(),
  attempts: integer('attempts').default(0),
  lastError: text('last_error'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### drizzle.config.ts:
```typescript
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

---

## ▸ SECTION 5: AUTHENTICATION (NextAuth.js v5)

### Config (`lib/auth/config.ts`):
- **Provider 1: Google OAuth** — primary recommended method
- **Provider 2: Resend Email** — magic link / email OTP for non-Google users
- **Custom phone OTP flow** — separate form using Twilio; after phone verification set `users.phoneVerified = true`
- **Session strategy:** JWT (not database sessions — keep it stateless)
- **Callbacks:**
  - `jwt` callback: attach `role`, `userId` (from our users table), `tier` to token
  - `session` callback: expose role and userId to client session
  - `signIn` callback: check if user is banned (`bannedUntil > now()`), return false if so
- **Custom pages:** login at `/login`, error at `/auth/error`

### NextAuth type extension (`types/next-auth.d.ts`):
Extend `Session` and `JWT` to include:
```typescript
interface Session {
  user: {
    id: string;           // our users.id (UUID)
    email: string;
    name: string;
    image?: string;
    role: 'member'|'org_admin'|'ops'|'admin'|'super_admin';
    tier?: string;
    onboarded: boolean;
  }
}
```

### Middleware (`middleware.ts`):
```typescript
// Protect ALL /dashboard/* /admin/* /org/* /onboarding routes
// Redirect to /login if no session
// Redirect to /onboarding if session exists but user.onboarded === false
// For /admin/* check role === 'admin' | 'super_admin', else 403
// For /org/* check role === 'org_admin', else 403
// For /admin/events also allow role === 'ops'
```

### Post-payment auth flow:
After payment success webhook fires:
1. Store email + payment in payments table (no auth yet)
2. Redirect user to `/auth/setup?payment_ref=XXX`
3. On `/auth/setup` page, show "Sign in with Google" and "Set Password" options
4. After sign-in, edge function links `payments.user_id` to the new `users.authId`
5. Create/update the `users` row with tier, referral_code, etc.
6. Redirect to `/onboarding`

---

## ▸ SECTION 6: CONSTANTS

Create `constants/index.ts` with all hard-coded values:

```typescript
export const TIER_CREDITS = {
  starter: 2000,
  vip: 5000,
  pioneer: 10000,
  corporate: 50000,
  hub_partner: 200000,
} as const;

export const TIER_PRICES_NGN = {
  starter: 30_000,
  vip: 1_000_000,
  pioneer: 3_000_000,
  corporate: 30_000_000,
  hub_partner: 300_000_000,
} as const;

export const TIER_PRICES_USD = {
  starter: 20,
  vip: 650,
  pioneer: 2000,
  corporate: 20000,
  hub_partner: 200000,
} as const;

export const WHOP_PLAN_IDS = {
  starter: process.env.WHOP_PLAN_STARTER!,
  vip: process.env.WHOP_PLAN_VIP!,
  pioneer: process.env.WHOP_PLAN_PIONEER!,
  corporate: process.env.WHOP_PLAN_CORPORATE!,
  hub_partner: process.env.WHOP_PLAN_HUB!,
} as const;

export const REPUTATION_EVENTS = {
  account_created: 100,
  onboarding_completed: 50,
  first_referral_click: 10,
  referral_converts: 200,
  attended_launch_event: 150,
  every_5_paid_referrals: 500,
} as const;

export const MAY_29_EVENT_DATE = new Date('2026-05-29T09:00:00.000+01:00'); // Lagos time
export const MAY_29_EVENT_VENUE = 'Family Hall';

export const COMMISSION_RATE_DEFAULT = 10; // percent

export const REFERRAL_COOKIE_NAME = 'dot_ref';
export const REFERRAL_COOKIE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds
```

---

## ▸ SECTION 7: PAYMENT SYSTEM

### Paystack Flow (`api/payment/initiate/route.ts`):
1. Receive: `{ tier, email, phone, affiliateCode, currency: 'NGN' }`
2. Validate inputs with Zod
3. Apply rate limit: max 5 requests/min per IP (Upstash)
4. Create pending `payments` row in DB
5. Call Paystack `POST /transaction/initialize` with amount, email, reference = payment.id, callback_url = `/auth/setup?payment_ref={payment.id}`
6. Return `{ authorization_url, reference }` to frontend

### Paystack Webhook (`api/webhooks/paystack/route.ts`):
```
1. Read raw body as string (CRITICAL: before any JSON parsing)
2. Verify HMAC-SHA512: hash body with PAYSTACK_SECRET_KEY, compare to x-paystack-signature header — return 401 if mismatch
3. Parse JSON body
4. Check event === 'charge.success'
5. Extract reference, check payments table for idempotency (if already 'success', return 200 immediately)
6. Call runPostPaymentPipeline(paymentData)
7. Return 200
```
Run on Vercel Edge Runtime. Export `const runtime = 'edge'`.

### Stripe Flow (`api/payment/initiate/route.ts` — when currency !== 'NGN'):
1. Receive: `{ tier, email, affiliateCode, currency: 'USD' }`
2. Create pending `payments` row
3. Call `stripe.checkout.sessions.create({ ... success_url: '/auth/setup?payment_ref={id}', line_items: [{ price_data: { ... } }] })`
4. Return `{ url: session.url }`

### Stripe Webhook (`api/webhooks/stripe/route.ts`):
```
1. Read raw body as Buffer
2. Verify with stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET) — 400 if fails
3. Check event.type === 'checkout.session.completed'
4. Idempotency check
5. Call runPostPaymentPipeline()
6. Return 200
```
Run on Vercel Edge Runtime. **Set `export const config = { api: { bodyParser: false } }` equivalent for raw body access.**

### Post-Payment Pipeline (`lib/payment/pipeline.ts`):
This is the most critical function. Implement it with a database transaction wrapper. If any step fails (except Whop provisioning), roll back and log error.

```typescript
export async function runPostPaymentPipeline(paymentData: {
  paymentId: string;
  email: string;
  phone?: string;
  tier: TierType;
  amount: number;
  currency: string;
  affiliateCode?: string;
  provider: 'paystack' | 'stripe';
}) {
  // All DB ops wrapped in a transaction
  await db.transaction(async (tx) => {
    // Step 1: Mark payment as success
    await tx.update(payments).set({ status: 'success', paidAt: new Date() }).where(eq(payments.id, paymentData.paymentId));

    // Step 2: Upsert user profile
    const referralCode = nanoid(8).toUpperCase();
    const [user] = await tx.insert(users).values({
      email: paymentData.email,
      phone: paymentData.phone,
      tier: paymentData.tier,
      referralCode,
      name: paymentData.email.split('@')[0], // temporary, updated at onboarding
      referredBy: paymentData.affiliateCode || null,
    }).onConflictDoUpdate({ target: users.email, set: { tier: paymentData.tier } }).returning();

    // Step 3: Link payment to user
    await tx.update(payments).set({ userId: user.id }).where(eq(payments.id, paymentData.paymentId));

    // Step 4: Create wallet
    const [wallet] = await tx.insert(wallets).values({ userId: user.id }).returning();

    // Step 5: Link wallet to user
    await tx.update(users).set({ walletId: wallet.id }).where(eq(users.id, user.id));

    // Step 6: Credit builder credits
    const credits = TIER_CREDITS[paymentData.tier];
    await tx.insert(walletTransactions).values({ walletId: wallet.id, type: 'credit', amount: credits.toString(), description: `Welcome credits — ${paymentData.tier} tier` });
    await tx.update(wallets).set({ creditBalance: credits.toString(), lifetimeCredits: credits.toString() }).where(eq(wallets.id, wallet.id));

    // Step 7: Create affiliate record
    await tx.insert(affiliates).values({ userId: user.id, referralCode }).onConflictDoNothing();

    // Step 8: Process affiliate commission (outside main tx if referredBy exists)
    if (paymentData.affiliateCode) {
      await processAffiliateCommission(paymentData.affiliateCode, paymentData.amount, paymentData.paymentId, tx);
    }

    // Step 9: Reputation +100 for account creation
    await tx.update(wallets).set({ reputationScore: sql`reputation_score + 100` }).where(eq(wallets.userId, user.id));
    await tx.insert(achievements).values({ userId: user.id, type: 'account_created', label: 'Welcome to DOT', icon: '🎉' });
  });

  // Steps below run after DB transaction commits — failures are logged but do not rollback payment

  // Step 10: Provision Whop (with retry on failure)
  try {
    await provisionWhop(user, paymentData.tier);
  } catch (err) {
    console.error('[Whop] Provisioning failed, queuing retry:', err);
    await db.insert(whopPending).values({ userId: user.id, tier: paymentData.tier, email: paymentData.email });
  }

  // Step 11: Generate event ticket QR
  try {
    const event = await getActiveMay29Event();
    if (event) await generateEventTicket(user.id, event.id, paymentData.paymentId);
  } catch (err) {
    console.error('[QR] Ticket generation failed:', err);
  }

  // Step 12: Send email confirmation
  try {
    await sendWelcomeEmail({ email: paymentData.email, user, tier: paymentData.tier });
  } catch (err) {
    console.error('[Email] Welcome email failed:', err);
  }

  // Step 13: Send WhatsApp confirmation
  if (paymentData.phone) {
    try {
      await sendWhatsAppWelcome(paymentData.phone, user.name, paymentData.tier);
    } catch (err) {
      console.error('[WhatsApp] Failed:', err);
    }
  }

  // Step 14: PostHog event
  posthog.capture({ distinctId: user.id, event: 'payment_success', properties: { tier: paymentData.tier, amount: paymentData.amount, currency: paymentData.currency, referred_by: paymentData.affiliateCode } });
}
```

---

## ▸ SECTION 8: AFFILIATE SYSTEM

### Click tracking (`/api/affiliate/track/route.ts`):
- Called from `/r/[code]` server-side
- Input: referralCode, request IP, user-agent
- Create device hash: `sha256(ip + userAgent)`
- Check for duplicate hash in last 24h — if exists, still set cookie but do NOT insert new click row
- Insert affiliate_clicks row
- Increment affiliates.totalClicks
- Set cookie: `dot_ref=CODE; Max-Age=604800; HttpOnly; SameSite=Lax`
- Redirect to `/join?ref=CODE`

### Commission processing (`lib/affiliate/commission.ts`):
```typescript
export async function processAffiliateCommission(referralCode: string, paymentAmount: number, paymentId: string, tx: Transaction) {
  // Self-referral check is done before calling this function (compare emails)
  const [affiliate] = await tx.select().from(affiliates).where(and(eq(affiliates.referralCode, referralCode), eq(affiliates.isActive, true)));
  if (!affiliate) return;

  const commission = (paymentAmount * Number(affiliate.commissionRate)) / 100;

  // Credit reward_balance
  await tx.update(wallets).set({ rewardBalance: sql`reward_balance + ${commission}` }).where(eq(wallets.userId, affiliate.userId));
  await tx.insert(walletTransactions).values({ walletId: affiliateWalletId, type: 'reward', amount: commission.toString(), description: `Referral commission`, reference: referralCode });

  // Update affiliate stats
  await tx.update(affiliates).set({ totalPaid: sql`total_paid + 1`, totalRevenue: sql`total_revenue + ${paymentAmount}` }).where(eq(affiliates.referralCode, referralCode));

  // Mark click as converted
  await tx.update(affiliateClicks).set({ converted: true, paymentId }).where(and(eq(affiliateClicks.referralCode, referralCode), eq(affiliateClicks.converted, false)));

  // Reputation +200 for affiliate
  await tx.update(wallets).set({ reputationScore: sql`reputation_score + 200` }).where(eq(wallets.userId, affiliate.userId));

  // Check achievements
  await checkAffiliateAchievements(affiliate.userId, affiliate.totalPaid + 1, tx);
}
```

### Anti-abuse rules — implement all of these:
1. **Self-referral:** Before calling `processAffiliateCommission`, check if affiliate.userId === newUser.id OR affiliate user email === payment.email. If so, skip commission (do not throw, just skip silently and log).
2. **Duplicate device:** In click tracking, check `device_hash` in `affiliate_clicks` within last 24h. Flag duplicates but still redirect.
3. **Phone verification gate:** Affiliate stats page (`/dashboard/referrals`) shows "Verify your phone to unlock stats" overlay if `users.phoneVerified === false`.
4. **Email verification gate:** Commission only credited if referred user's email is verified (`emailVerified === true` in our users table, set after NextAuth email confirmation).
5. **Commission hold:** Display reward_balance in UI but show "Withdrawals available in Phase 2" tooltip. Do not build withdrawal flow.
6. **Admin freeze:** Admin can set `affiliates.isActive = false` via admin dashboard. Commission processing checks this flag.

---

## ▸ SECTION 9: WHOP INTEGRATION

### Client (`lib/whop/client.ts`):
```typescript
const WHOP_BASE = 'https://api.whop.com/api/v2';

export async function createWhopMembership(email: string, planId: string, userId: string) {
  const res = await fetch(`${WHOP_BASE}/memberships`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.WHOP_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId, email, metadata: { dot_user_id: userId } }),
  });
  if (!res.ok) throw new Error(`Whop API error: ${res.status} ${await res.text()}`);
  return res.json();
}
```

### Retry worker (`/api/whop/provision/route.ts`):
- This route is called by a Vercel Cron Job every 5 minutes
- Query `whop_pending` where `resolvedAt IS NULL` and `attempts < 5`
- For each: try `createWhopMembership()`, on success set `resolvedAt = now()`, on failure increment `attempts`, set `lastError`
- After 5 failed attempts, send alert email to admin

### Vercel cron config in `vercel.json`:
```json
{
  "crons": [{ "path": "/api/whop/provision", "schedule": "*/5 * * * *" }]
}
```

---

## ▸ SECTION 10: QR CODE & EVENT TICKET

### QR generation (`lib/qr/generate.ts`):
```typescript
import QRCode from 'qrcode';
import { uploadToR2 } from '@/lib/r2/client';
import { nanoid } from 'nanoid';

export async function generateEventTicket(userId: string, eventId: string, paymentId: string) {
  const token = `DOT-${nanoid(8).toUpperCase()}`;
  const checkinUrl = `https://joindot.africa/checkin?token=${token}`;

  // Generate QR PNG as buffer
  const pngBuffer = await QRCode.toBuffer(checkinUrl, { type: 'png', width: 400, margin: 2, color: { dark: '#0d0d0d', light: '#ffffff' } });

  // Upload to R2
  const r2Key = `tickets/${userId}/${eventId}.png`;
  const qrUrl = await uploadToR2(r2Key, pngBuffer, 'image/png');

  // Insert ticket record
  await db.insert(eventTickets).values({ eventId, userId, paymentId, qrCode: token, qrUrl });

  return { token, qrUrl };
}
```

### Check-in endpoint (`/api/checkin/route.ts`):
```typescript
// Requires ops or admin role
// Input: { token: string }
// 1. Find ticket by qrCode = token
// 2. If not found: { error: 'INVALID_TOKEN' }
// 3. If ticket.checkedIn: { error: 'ALREADY_CHECKED_IN', checkedInAt, userName }
// 4. Update: checkedIn = true, checkedInAt = now(), checkedInBy = current user id
// 5. Award +150 reputation
// 6. Grant 'launch_event_attendee' achievement
// 7. Return: { success: true, user: { name, tier, avatarUrl } }
```

---

## ▸ SECTION 11: NOTIFICATION SYSTEM

### Email templates (React Email components in `lib/resend/templates/`):

**welcome.tsx:** DOT-branded dark theme email. Include: member name, tier badge, dashboard URL button, QR code image attached, referral link, builder credits amount. No marketing fluff.

**referral-paid.tsx:** "Your referral [Name] just joined DOT! Your commission of [amount] has been added to your reward balance."

**event-reminder.tsx:** Sent 24h before May 29. Include: member name, event date/time, venue, QR code image, "How to find us" section.

**verify-email.tsx:** Email verification link. Clean, minimal. "Click to verify your DOT account."

### Resend client (`lib/resend/client.ts`):
```typescript
import { Resend } from 'resend';
export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWelcomeEmail({ email, user, tier }: WelcomeEmailParams) {
  await resend.emails.send({
    from: `DOT <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Welcome to DOT — Your ${tier} membership is confirmed`,
    react: WelcomeTemplate({ user, tier }),
  });
}
```

### WhatsApp (`lib/whatsapp/client.ts`):
```typescript
// Using Twilio's WhatsApp Business API as proxy
const TWILIO_API = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

export async function sendWhatsAppTemplate(phone: string, templateName: string, variables: Record<string, string>) {
  const body = new URLSearchParams({
    From: `whatsapp:${process.env.WHATSAPP_FROM_NUMBER}`,
    To: `whatsapp:${phone}`,
    ContentSid: TEMPLATE_SIDS[templateName],
    ContentVariables: JSON.stringify(variables),
  });
  // ... fetch with Basic Auth
}

// Templates: dot_welcome (name, tier, dashboard_url), dot_event_reminder (name, event_date, venue)
// Note: Templates must be pre-approved by Meta. Document this prominently in DEPLOYMENT.md.
```

---

## ▸ SECTION 12: FRONTEND PAGES — DETAILED SPECS

Build every page pixel-perfect with full functionality. Use Tailwind CSS. The platform's visual design should feel premium, African-forward, modern but not generic. Use deep greens, warm ambers, and bold typography (suggest: Space Grotesk or Plus Jakarta Sans for headings, Inter for body — but make it distinctive). Mobile-first responsive.

### `/` — Landing Page
Seven sections in order (from blueprint Section 5). Implement with full interactivity:

**HeroSection:** Full-viewport. Animated text gradient. Three CTA buttons (Join DOT → `/join`, Become Partner → `/become-partner`, Become Affiliate → `/become-affiliate`). Background: subtle geometric pattern or video-placeholder with overlay. Headline: "Africa's Largest Builder Ecosystem". Subheadline: "Join 1M founders, creators and entrepreneurs building the future."

**MetricsBar:** Counter animation that triggers on viewport entry. Fetch from `/api/stats` on load. Display: Members / Organizations / Cities / Hubs. Use `IntersectionObserver` for animation trigger.

**BenefitsGrid:** 5 cards: 90-Day Builder Program, $2,000 Builder Credits, Founder Access, Community Access, Funding Pathways. Each with icon, title, short description.

**PricingSection:** All 5 tier cards. Currency toggle (NGN/USD) — client-side switch, no API call needed. VIP card has "Recommended" badge. Each card: tier name, price, features list, CTA button → `/checkout/[tier]`. Starter CTA = "Get Started", others = "Join [Tier]".

**PartnerLogos:** CSS scroll animation. Logos from DB via server fetch or hardcoded placeholder array. Duplicate logos for seamless loop.

**FAQSection:** Accordion. Server-fetch from DB. At least 8 placeholder FAQ items seeded in DB migration.

**CountdownTimer:** `setInterval` every 1 second. Show days/hours/minutes/seconds. After May 29 2026, show: "Event is LIVE — Join Now 🔥" with CTA.

### `/join` — Plan Selection
Show all 5 pricing cards (same as landing page pricing section). Currency toggle. Prominent CTA per tier. On CTA click → `/checkout/[tier]?currency=NGN|USD`. Read `?ref=` param from URL, store in sessionStorage as fallback if cookie not set.

### `/checkout/[tier]` — Checkout
- On mount: detect country via `X-Forwarded-For` → call `ip-api.com/json/{ip}?fields=countryCode` → if NG, show Paystack flow; else show Stripe flow. Allow manual override dropdown.
- Pre-fill affiliate code from: 1) URL `?ref=` param, 2) `dot_ref` cookie, 3) sessionStorage
- Form fields: Full Name, Email, Phone (optional for Stripe flow, required for Paystack)
- Paystack: use `@paystack/inline-js` package. Call `/api/payment/initiate` to get reference, then `PaystackPop.setup({ key, email, amount, reference, callback: (resp) => handleSuccess(resp) })`.
- Stripe: Call `/api/payment/initiate`, receive `{ url }`, redirect to `url`.
- Show loading states. Handle errors gracefully with toast notifications.

### `/auth/setup` — Post-Payment Account Setup
- Read `?payment_ref=` from URL
- Verify payment exists in DB (server-side fetch)
- If already linked to user, redirect to `/dashboard`
- Show: "Your payment was confirmed ✓". Two options: "Continue with Google" | "Set your password"
- Google: redirect to NextAuth Google signin with payment_ref in state
- Password: email + password form, create NextAuth account, then link to payment record

### `/onboarding` — 5-Step Onboarding
Step 1: Complete profile (name, country, state, school, phone)
Step 2: Phone OTP verification (Twilio SMS)
Step 3: Connect Whop community (show link to Whop with tier access info, button to open)
Step 4: View your wallet (show credits, referral link)
Step 5: View your event ticket (show QR code)
On complete: set `users.onboarded = true`, reputation +50, redirect to `/dashboard`

### `/dashboard` — Member Home
- Server Component with Suspense
- Greeting with name and tier badge
- WalletCard (credit + reward balances)
- ReferralWidget (link + copy button + stats teaser)
- Upcoming event card (if May 29 event is in future, show countdown + QR preview)
- Recent transaction row (last 3)
- Quick links: Wallet / Referrals / Ticket / Community

### `/dashboard/wallet` — Full Wallet
- Balance cards: Credit Balance / Reward Balance / Reputation Score
- Reputation progress bar (toward next milestone)
- Achievement badges grid (unlocked only)
- Transaction history table (paginated, 20/page) with type badge, amount, date
- Referral commission pending banner: "Withdrawals available in Phase 2"

### `/dashboard/referrals` — Affiliate Stats
- If `!user.phoneVerified` → show verification gate overlay
- Stats bar: Total Clicks / Total Signups / Paid Conversions / Total Revenue Generated
- Referral link with one-click copy and QR code of link
- Social share: Twitter/X share button, WhatsApp share button
- Commission earned (reward_balance)
- Recent activity table: last 20 affiliate_clicks rows

### `/dashboard/ticket` — Event Ticket
- Full QR code image (from qr_url)
- Download PNG button (opens in new tab)
- Event name: "DOT Cohort I Launch"
- Date: Friday, May 29, 2026
- Venue: Family Hall
- Member name + tier badge
- Token display (under QR): `DOT-XXXXXXXX`
- Note: "Present this QR at the venue entrance"

### `/dashboard/community` — Whop Access
- Tier description of what they have access to
- Large CTA button → opens Whop in new tab (use `NEXT_PUBLIC_WHOP_PRODUCT_ID`)
- Their Whop email if different from DOT email
- Access level breakdown table (what's included in their tier vs above)

### `/org/[slug]` — Organization Dashboard
- Fetch org by slug (check that current user's organizationId matches, else 403)
- Org name + logo
- Stats: Members Onboarded / Revenue Generated / Leaderboard Position
- Org referral link with copy button
- Members table: name, tier, joined date (no sensitive data)
- "Contact DOT Admin" CTA

### `/admin` — Admin Overview
Six metric cards matching blueprint Section 11:
- Total Users, Total Revenue, NGN Revenue, USD Revenue, Active Organizations, Event Check-ins
- All fetched from `/api/admin/metrics`
- Auto-refresh every 30s via SWR

### `/admin/users` — User Management
- Full DataTable with: ID, Name, Email, Phone, Tier, Role, Joined, Status
- Search: real-time filter on name/email/phone/referral_code
- Filter by tier (dropdown) and role
- Actions column: Edit (modal) / Ban / View Wallet
- UserEditModal: edit name, tier, org assignment, role. Calls PATCH `/api/admin/users`
- Ban button: confirm dialog → POST `/api/admin/ban` → sets `users.bannedUntil = 'infinity'`
- CSVExportBtn: exports current filtered view as CSV (client-side)

### `/admin/payments` — Payment Log
- DataTable: ID, Email, Tier, Currency, Amount, Provider, Status, Date
- Filter by: status, provider, tier, date range
- No editing — payments are immutable

### `/admin/affiliates` — Affiliate Leaderboard
- Top 20 affiliates ordered by total_revenue DESC
- Table: Rank, Name, Email, Clicks, Signups, Paid, Revenue, Commission Rate, Status
- Freeze/Unfreeze toggle (sets affiliates.isActive)
- Abuse flags: highlight rows where device-hash duplicates are high

### `/admin/organizations` — Org Management
- List all orgs with status badges
- Approve button (pending → active) → POST `/api/admin/org/approve`
- Suspend button → PATCH status
- Click row → expand org members list

### `/admin/events` — Check-in Scanner
- Full-page QR scanner using `html5-qrcode`
- Camera permission request on load
- On successful scan: POST token to `/api/checkin`
- Success state: green flash, show member name + tier badge, play success beep
- Error states: "Invalid Token" (red flash), "Already Checked In: [time]" (amber flash)
- Text input fallback for manual token entry
- Live counter: X checked in / Y total registered
- Only accessible to `admin` and `ops` roles

### `/admin/content` — Content Management
- Two sections: Partner Logos + FAQs
- Partner Logos: grid with reorder (drag to reorder), upload new (R2), toggle active, delete
- FAQs: list with inline edit, reorder, add new, toggle active

### `/become-partner` — Partner Application
- Form: Org name, contact email, country, description, website
- Submit → insert to organizations with status='pending'
- Confirm message: "Application received. We'll contact you within 48 hours."

### `/become-affiliate` — Affiliate Info
- Static informational page (no form needed — affiliate status is automatic on membership)
- Explain: Every member gets a referral link. 10% commission. How it works flow diagram.
- CTA → `/join` if not logged in, → `/dashboard/referrals` if logged in

---

## ▸ SECTION 13: API ROUTES — COMPLETE SPEC

### `GET /api/stats`
- Cache: `next: { revalidate: 60 }`
- Query: `SELECT COUNT(*) FROM users` (member_count), `SELECT COUNT(*) FROM organizations WHERE status='active'` (org_count)
- Return: `{ member_count, org_count, city_count: hardcoded_or_computed, hub_count }`

### `GET /api/user/me`
- Auth required
- Return: full user row + wallet row (joined query)

### `GET /api/user/transactions`
- Auth required
- Params: `?page=1&limit=20`
- Return: paginated wallet_transactions for current user's wallet

### `GET /api/user/ticket`
- Auth required
- Return: current user's event_ticket for the active event (join with events table)

### `GET /api/affiliate/stats`
- Auth required
- Phone verified required (return 403 with `{ error: 'PHONE_VERIFICATION_REQUIRED' }` if not)
- Return: affiliates row + last 20 affiliate_clicks + recent converted payments

### `GET /api/admin/users`
- Admin role required
- Params: `?search=&tier=&page=1&limit=50`
- Return: paginated users with wallet summary

### `GET /api/admin/metrics`
- Admin role required
- Return: all 6 overview metrics

### `PATCH /api/admin/users`
- Admin role required
- Body: `{ userId, name?, tier?, role?, organizationId? }`
- Validate with Zod. Run update.

### `POST /api/admin/ban`
- Admin role required
- Body: `{ userId }`
- Set `users.bannedUntil = new Date('2099-12-31')` (effectively permanent)
- Return 200

### `POST /api/admin/org/approve`
- Admin role required
- Body: `{ orgId, contactUserId }`
- Set org status = 'active', approvedBy = current admin user, approvedAt = now()
- Set contactUser.role = 'org_admin', set contactUser.organizationId = orgId
- Return 200

### `POST /api/checkin`
- Ops/Admin role required
- Body: `{ token: string }`
- Full check-in logic as described in Section 10
- Return success or error object

### Role enforcement pattern (use in every protected route):
```typescript
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export async function GET(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (!['admin', 'super_admin'].includes(session.user.role)) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  // ... handler logic
}
```

---

## ▸ SECTION 14: SECURITY

### Middleware (`middleware.ts`) — full implementation:
```typescript
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const PROTECTED = ['/dashboard', '/onboarding', '/org', '/admin'];
const ADMIN_ONLY = ['/admin'];
const OPS_ALLOWED = ['/admin/events'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if route needs protection
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // No session → redirect to login
  if (!token) return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));

  // Banned user check
  if (token.bannedUntil && new Date(token.bannedUntil) > new Date()) {
    return NextResponse.redirect(new URL('/banned', request.url));
  }

  // Not onboarded → force to onboarding (except the onboarding route itself)
  if (!token.onboarded && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    const isOpsRoute = OPS_ALLOWED.some(p => pathname.startsWith(p));
    const allowedRoles = isOpsRoute ? ['admin', 'super_admin', 'ops'] : ['admin', 'super_admin'];
    if (!allowedRoles.includes(token.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Org routes
  if (pathname.startsWith('/org')) {
    if (!['org_admin', 'admin', 'super_admin'].includes(token.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|api|public|favicon).*)'] };
```

### Additional security:
- Rate limiting on `/api/payment/initiate`: 5 req/min per IP using `@upstash/ratelimit`
- All form inputs validated with Zod before DB write
- HTTPS enforced (Vercel + Cloudflare)
- No PII in PostHog events
- R2 QR URLs are UUID-based (non-guessable)
- Paystack webhook: HMAC-SHA512 verification
- Stripe webhook: Stripe-Signature verification
- Admin endpoints: role check on every request (don't rely on middleware alone)

---

## ▸ SECTION 15: CLOUDFLARE R2

### R2 Client (`lib/r2/client.ts`):
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
});

export async function uploadToR2(key: string, body: Buffer, contentType: string): Promise<string> {
  await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key: key, Body: body, ContentType: contentType }));
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
```

---

## ▸ SECTION 16: POSTHOG ANALYTICS

### Server-side client (`lib/posthog/client.ts`):
```typescript
import { PostHog } from 'posthog-node';
export const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, { host: process.env.NEXT_PUBLIC_POSTHOG_HOST });
```

### Client-side provider (`lib/posthog/provider.tsx`):
Wrap `PostHogProvider` around app in root layout. Capture page views automatically.

### Required events to capture (all via server-side PostHog to avoid PII leaks):
- `signup_started` — when user hits /checkout
- `payment_initiated` — when initiate API called
- `payment_success` — in post-payment pipeline
- `referral_click` — in affiliate track endpoint
- `onboarding_completed` — when onboarded flag set
- `checkin_success` — on event check-in

**CRITICAL:** Never include email, phone, or full name in PostHog event properties. Use only userId (UUID) as distinct_id.

---

## ▸ SECTION 17: ENVIRONMENT VARIABLES

### `.env.example` (template — no real values):
```bash
# ── DATABASE ──────────────────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
# ^ Get from Neon dashboard → Connection String (pooled mode)

# ── AUTH ──────────────────────────────────────────────────────────────────────
NEXTAUTH_SECRET=             # Generate: openssl rand -base64 32
NEXTAUTH_URL=https://joindot.africa

GOOGLE_CLIENT_ID=            # Google Cloud Console → OAuth 2.0 credentials
GOOGLE_CLIENT_SECRET=        # Same

# ── SUPABASE (if used for auth only, else remove) ─────────────────────────────
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ── PAYSTACK ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...

# ── STRIPE ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── WHOP ──────────────────────────────────────────────────────────────────────
WHOP_API_KEY=
NEXT_PUBLIC_WHOP_PRODUCT_ID=
WHOP_PLAN_STARTER=
WHOP_PLAN_VIP=
WHOP_PLAN_PIONEER=
WHOP_PLAN_CORPORATE=
WHOP_PLAN_HUB=

# ── CLOUDFLARE R2 ─────────────────────────────────────────────────────────────
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=dot-assets
R2_PUBLIC_URL=https://assets.joindot.africa

# ── RESEND (EMAIL) ────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...
EMAIL_FROM=hello@joindot.africa

# ── WHATSAPP / TWILIO ─────────────────────────────────────────────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
WHATSAPP_FROM_NUMBER=+1415...
WHATSAPP_TEMPLATE_SID_WELCOME=
WHATSAPP_TEMPLATE_SID_EVENT_REMINDER=

# ── POSTHOG ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# ── UPSTASH (RATE LIMITING) ───────────────────────────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── APP ───────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://joindot.africa
MAY_29_EVENT_ID=             # UUID of the May 29 event row (set after first DB seed)

# ── VERCEL CRON (internal auth) ────────────────────────────────────────────────
CRON_SECRET=                 # Generate: openssl rand -hex 32
```

---

## ▸ SECTION 18: DATABASE SEED

Create `scripts/seed.ts` that seeds:

1. May 29 launch event:
```sql
INSERT INTO events (title, description, venue, starts_at, ends_at, is_active)
VALUES ('DOT Cohort I Launch', 'Africa''s Largest Builder Ecosystem — Cohort I Launch Event', 'Family Hall', '2026-05-29 09:00:00+01', '2026-05-29 20:00:00+01', true);
```

2. 8 sample FAQs covering: What is DOT, how membership works, Paystack vs Stripe, refund policy, Whop access, Builder Credits, affiliate program, how to attend the event

3. 5 placeholder partner logos (use placeholder.com URLs until real logos are provided)

Run with: `npx tsx scripts/seed.ts`

---

## ▸ SECTION 19: TESTING

### Vitest unit tests (`tests/unit/`):

**payment-pipeline.test.ts:**
- Mock DB, mock Whop API, mock Resend
- Test: pipeline creates user, wallet, credits, affiliate record, ticket
- Test: idempotency — calling pipeline twice with same providerRef is a no-op
- Test: affiliate commission calculated correctly at 10%
- Test: self-referral is silently skipped

**affiliate.test.ts:**
- Test: commission = amount * rate / 100
- Test: isActive = false → no commission
- Test: duplicate device hash → click still logged, stats NOT incremented

**checkin.test.ts:**
- Test: valid token → success response + checkedIn = true
- Test: invalid token → INVALID_TOKEN error
- Test: already checked in → ALREADY_CHECKED_IN error with timestamp

**wallet.test.ts:**
- Test: creditBalance never goes below 0
- Test: reputationScore increments correctly for each event type

### Integration tests (`tests/integration/`):

**paystack-webhook.test.ts:**
- Send real HMAC-signed payload to the route handler
- Verify payment row updated, user created, wallet funded
- Verify invalid signature returns 401

**stripe-webhook.test.ts:**
- Same pattern with Stripe signature

**auth-flow.test.ts:**
- Test middleware redirects unauthenticated user
- Test middleware redirects non-onboarded user
- Test admin route blocks member role

### E2E tests with Playwright (`tests/e2e/`):

**checkout.spec.ts:**
- Visit /join → select Starter → fill checkout form → mock payment success → verify redirect to /auth/setup

**dashboard.spec.ts:**
- Mock authenticated session → visit /dashboard → verify wallet card renders
- Visit /dashboard/ticket → verify QR code image loads

**admin.spec.ts:**
- Mock admin session → visit /admin → verify metrics load
- Visit /admin/events → verify QR scanner component mounts

### Test setup:
- `vitest.config.ts`: use `@vitejs/plugin-react`, mock node modules
- `playwright.config.ts`: baseURL = `http://localhost:3000`, chromium browser
- Test DB: use a separate Neon branch for integration tests

---

## ▸ SECTION 20: DOCUMENTATION FILES

### `docs/README.md`:
- Project overview
- Local development setup (step-by-step)
- Prerequisites list
- Available npm scripts (`dev`, `build`, `migrate`, `seed`, `test`, `test:e2e`)
- Architecture overview diagram (ASCII)
- Contributing guidelines

### `docs/DEPLOYMENT.md`:
Complete step-by-step deployment guide covering:
1. **Neon setup:** Create project → get DATABASE_URL → run migrations (`npx drizzle-kit push`)
2. **Vercel setup:** Import repo → set env vars → configure domains
3. **Cloudflare setup:** DNS records (A record for joindot.africa → Vercel IPs, CNAME for www), R2 bucket creation, public domain setup, CORS rules
4. **Google OAuth:** Create project in console → OAuth credentials → add authorized origins/redirects
5. **Paystack setup:** Get keys → configure webhook URL → test in test mode first
6. **Stripe setup:** Get keys → configure webhook → test in test mode
7. **Whop setup:** Create product → create plans for each tier → get API key → map plan IDs to env vars
8. **Resend setup:** Verify domain `joindot.africa` → get API key → configure MX/DKIM/SPF records
9. **WhatsApp Business API:** Create Meta Business account → apply for WhatsApp Business API → submit templates for pre-approval (5 business days!) → get phone number ID and access token
10. **PostHog:** Create project → get API key
11. **Upstash:** Create Redis database → get REST URL and token
12. **Final checklist:** 20-item pre-launch checklist

### `docs/API.md`:
Full API reference with:
- Endpoint URL, method
- Request body/params (with types)
- Response format (with types)
- Error codes and messages
- Auth requirements
- Rate limits where applicable
- cURL example for every endpoint

### `docs/TESTING.md`:
- How to run unit tests: `npm run test`
- How to run integration tests: `npm run test:integration` (requires test DB env var)
- How to run E2E tests: `npm run test:e2e` (requires dev server running)
- How to add new tests (patterns and conventions)
- Test data seeding for local testing

### `docs/RUNBOOK.md` — Launch Day Operations Guide:
1. **Day-of checklist (May 29):** 6 AM → check all services up, verify Vercel deployment, check Neon connection, test one payment in live mode, brief ops team
2. **Check-in setup:** Open `/admin/events` on 2 devices (tablet + phone), test QR scanner, confirm backup manual token entry works
3. **Monitoring stack:** Vercel function logs tab open, Neon query logs, PostHog live feed
4. **Incident response:** Payment fails → check Paystack/Stripe dashboard, check webhook logs. Whop provisioning fails → check whop_pending table, manually retry. QR scanner down → use manual token entry. DB slow → check Neon metrics, scale compute.
5. **Emergency contacts:** Add placeholders for Paystack support, Stripe support, Vercel support, Whop support
6. **Post-event:** Export attendee list from admin, send event reminder emails, check affiliate commission totals

### `docs/ENV.md`:
Every single env var from `.env.example` with:
- Description of what it does
- Where to get it (link to service dashboard)
- Whether it's public or secret
- Required for which features
- Example format (never real values)

---

## ▸ SECTION 21: PACKAGE.JSON

```json
{
  "name": "dot-platform",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "migrate": "drizzle-kit push",
    "migrate:generate": "drizzle-kit generate",
    "studio": "drizzle-kit studio",
    "seed": "npx tsx scripts/seed.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.2.x",
    "react": "18.x",
    "react-dom": "18.x",
    "next-auth": "5.0.0-beta.x",
    "@neondatabase/serverless": "latest",
    "drizzle-orm": "latest",
    "drizzle-kit": "latest",
    "tailwindcss": "3.x",
    "zod": "latest",
    "nanoid": "latest",
    "qrcode": "latest",
    "@types/qrcode": "latest",
    "resend": "latest",
    "@react-email/components": "latest",
    "stripe": "latest",
    "posthog-node": "latest",
    "posthog-js": "latest",
    "@aws-sdk/client-s3": "latest",
    "@upstash/ratelimit": "latest",
    "@upstash/redis": "latest",
    "crypto-js": "latest",
    "html5-qrcode": "latest",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "@radix-ui/react-accordion": "latest",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-toast": "latest",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-separator": "latest",
    "@radix-ui/react-progress": "latest",
    "swr": "latest"
  },
  "devDependencies": {
    "typescript": "5.x",
    "@types/node": "latest",
    "@types/react": "18.x",
    "vitest": "latest",
    "@vitejs/plugin-react": "latest",
    "playwright": "latest",
    "@playwright/test": "latest",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

---

## ▸ SECTION 22: NEXT.JS CONFIG

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { serverComponentsExternalPackages: ['@neondatabase/serverless'] },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'assets.joindot.africa' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google avatars
    ],
  },
};

export default nextConfig;
```

```json
// vercel.json
{
  "crons": [
    { "path": "/api/whop/provision", "schedule": "*/5 * * * *" }
  ]
}
```

---

## ▸ SECTION 23: OUTPUT REQUIREMENTS & FORMAT

### How to structure your output:
Output every file completely. Use clear file path headers like:

```
═══════════════════════════════════════════
FILE: app/(public)/page.tsx
═══════════════════════════════════════════
[complete file code here]
```

### Order of output:
1. `package.json`
2. `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `drizzle.config.ts`
3. All `schema/` files
4. `migrations/0000_initial_schema.sql`
5. `lib/db/index.ts` + all query files
6. `lib/auth/config.ts` + helpers
7. All other `lib/` files
8. `constants/index.ts`
9. `types/` files
10. `middleware.ts`
11. All `app/api/` route files
12. All `components/` files
13. All `app/` page files
14. `scripts/seed.ts`
15. All test files
16. All `docs/` files
17. `.env.example`

---

## ▸ SECTION 24: CRITICAL DO-NOTS

- **DO NOT** build: token trading, P2P marketplace, external withdrawals, lending, AI assistant — not even as stubs or hidden components
- **DO NOT** leave TODO comments in production code paths (API routes, webhooks, pipeline)
- **DO NOT** use `any` TypeScript type — use proper types everywhere
- **DO NOT** log secrets or payment data to console (only log IDs, not amounts or personal data)
- **DO NOT** allow client-side writes to wallets, payments, or user.tier — all through API routes
- **DO NOT** expose STRIPE_SECRET_KEY, PAYSTACK_SECRET_KEY, or SUPABASE_SERVICE_ROLE_KEY to the browser
- **DO NOT** import server-only modules in Client Components
- **DO NOT** use Builder Credits as real money in any UI copy — always clarify "platform credits, not withdrawable"

---

## ▸ SECTION 25: COMPLETION CHECKLIST

Your output is complete when EVERY item below is done:

**Database:**
- [ ] All 13 Drizzle schema files created
- [ ] `migrations/0000_initial_schema.sql` generated
- [ ] Seed script created and working
- [ ] `drizzle.config.ts` configured

**Authentication:**
- [ ] NextAuth.js v5 configured with Google + Email providers
- [ ] JWT callbacks populate role, userId, tier, onboarded
- [ ] Middleware protects all routes correctly
- [ ] Post-payment auth flow fully implemented
- [ ] Phone OTP verification flow implemented

**Payments:**
- [ ] Paystack initiate endpoint
- [ ] Paystack webhook with HMAC verification
- [ ] Stripe initiate endpoint
- [ ] Stripe webhook with signature verification
- [ ] Post-payment pipeline (all 14 steps)
- [ ] Idempotency check working

**Frontend:**
- [ ] All 20 pages/routes built
- [ ] Landing page all 7 sections
- [ ] Countdown timer functional
- [ ] Checkout with currency detection + both payment flows
- [ ] 5-step onboarding flow
- [ ] Full member dashboard
- [ ] Admin dashboard with all 6 sub-pages
- [ ] QR scanner fully functional
- [ ] Mobile responsive

**Integrations:**
- [ ] Whop API provisioning + retry queue + cron job
- [ ] QR code generation + R2 upload
- [ ] Resend email (4 templates)
- [ ] WhatsApp (2 templates)
- [ ] PostHog (7 events)
- [ ] Cloudflare R2 upload client

**Security:**
- [ ] Middleware role guards
- [ ] Rate limiting on payment initiation
- [ ] Zod validation on all API inputs
- [ ] Webhook signature verification (both providers)
- [ ] No secrets exposed to browser

**Testing:**
- [ ] 4 unit test files
- [ ] 3 integration test files
- [ ] 3 E2E test files
- [ ] All tests can run with `npm test`

**Documentation:**
- [ ] `docs/README.md` — setup guide
- [ ] `docs/DEPLOYMENT.md` — step-by-step deployment
- [ ] `docs/API.md` — full API reference
- [ ] `docs/TESTING.md` — testing guide
- [ ] `docs/RUNBOOK.md` — launch day ops guide
- [ ] `docs/ENV.md` — env var reference
- [ ] `.env.example` — all vars, no real values

---

*Attached: dot-engineering-blueprint.html — the full platform specification. Everything in that document is authoritative. Where this prompt adds or adjusts (e.g., Neon instead of Supabase, NextAuth instead of Supabase Auth), this prompt takes precedence. Where the blueprint has detail not in this prompt, implement it per the blueprint.*

*Build the full platform. Zero gaps. Production ready.*
