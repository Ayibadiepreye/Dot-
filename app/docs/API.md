# API Reference

All API endpoints are tRPC procedures accessible at `/api/trpc/{router}.{procedure}`

## Authentication

All protected endpoints require a valid session cookie (`dot_sid`).

### `auth.me`
- **Type**: Query
- **Auth**: Required
- **Returns**: Current user profile + wallet data

### `auth.logout`
- **Type**: Mutation
- **Auth**: Required
- **Returns**: `{ success: true }`

---

## User

### `user.me`
- **Type**: Query
- **Auth**: Required
- **Returns**: Full user row from database

### `user.wallet`
- **Type**: Query
- **Auth**: Required
- **Returns**: Wallet data for current user

### `user.transactions`
- **Type**: Query
- **Auth**: Required
- **Input**: `{ page: number, limit: number }`
- **Returns**: Paginated wallet transactions

### `user.achievements`
- **Type**: Query
- **Auth**: Required
- **Returns**: List of user achievements

### `user.ticket`
- **Type**: Query
- **Auth**: Required
- **Returns**: Event ticket for current user (or null)

### `user.affiliate`
- **Type**: Query
- **Auth**: Required
- **Returns**: Affiliate data for current user

### `user.updateProfile`
- **Type**: Mutation
- **Auth**: Required
- **Input**: `{ name?, country?, state?, school?, phone? }`

### `user.completeOnboarding`
- **Type**: Mutation
- **Auth**: Required
- **Returns**: `{ success: true }`

---

## Payment

### `payment.initiate`
- **Type**: Mutation
- **Auth**: Public
- **Input**: `{ tier, email, phone?, currency, affiliateCode? }`
- **Returns**: `{ paymentId, providerRef, authorizationUrl, amount, currency }`

### `payment.verify`
- **Type**: Query
- **Auth**: Public
- **Input**: `{ providerRef: string }`
- **Returns**: `{ status, paymentId }`

### `payment.mockSuccess`
- **Type**: Mutation
- **Auth**: Public
- **Input**: `{ providerRef: string }`
- **Returns**: `{ success: true, paymentId, email, tier }`

---

## Stats

### `stats.public`
- **Type**: Query
- **Auth**: Public
- **Returns**: `{ member_count, org_count, city_count, hub_count }`

---

## Affiliate

### `affiliate.stats`
- **Type**: Query
- **Auth**: Required + phone verified
- **Returns**: Affiliate row + recent clicks

### `affiliate.trackClick`
- **Type**: Mutation
- **Auth**: Public
- **Input**: `{ referralCode, ipAddress?, userAgent?, deviceHash? }`

---

## Admin (requires admin role)

### `admin.users`
- **Type**: Query
- **Input**: `{ search?, tier?, role?, page, limit }`
- **Returns**: `{ rows: User[], total: number }`

### `admin.updateUser`
- **Type**: Mutation
- **Input**: `{ userId, name?, tier?, role? }`

### `admin.banUser`
- **Type**: Mutation
- **Input**: `{ userId }`

### `admin.metrics`
- **Type**: Query
- **Returns**: `{ totalUsers, totalRevenue, ngnRevenue, usdRevenue, activeOrgs, eventCheckins }`

### `admin.payments`
- **Type**: Query
- **Input**: `{ status?, provider?, tier?, page, limit }`
- **Returns**: Payment[]

### `admin.affiliates`
- **Type**: Query
- **Returns**: Affiliate[] (top 50)

### `admin.toggleAffiliate`
- **Type**: Mutation
- **Input**: `{ referralCode, isActive }`

---

## Checkin (requires ops or admin role)

### `checkin.scan`
- **Type**: Mutation
- **Input**: `{ token: string }`
- **Returns**: `{ success: true, user: { name, tier, avatar } }` or error

---

## Content

### `content.faqs`
- **Type**: Query
- **Auth**: Public
- **Returns**: FAQ[] (active only)

### `content.partnerLogos`
- **Type**: Query
- **Auth**: Public
- **Returns**: PartnerLogo[] (active only)

### `content.allFaqs` / `content.allPartnerLogos`
- **Type**: Query
- **Auth**: Admin
- **Returns**: All records

### `content.updateFaq` / `content.updatePartnerLogo`
- **Type**: Mutation
- **Auth**: Admin
- **Input**: `{ id, ...fields }`

---

## Webhook Routes (Hono, not tRPC)

### `POST /api/webhooks/paystack`
- Verifies HMAC-SHA512 signature
- Processes payment success

### `POST /api/webhooks/stripe`
- Verifies Stripe-Signature header
- Processes checkout.session.completed

### `POST /api/whop/provision`
- Cron job endpoint for retrying failed Whop provisions
- Requires `secret` query param matching `CRON_SECRET`
