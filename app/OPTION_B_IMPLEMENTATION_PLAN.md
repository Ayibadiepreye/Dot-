# 🎯 Option B: Payment-Gated Signup - Implementation Plan

## Overview

**Goal:** Allow users to sign up, but lock all features until they pay.

**User Experience:**
1. User signs up (free) → Account created
2. User sees "Payment Required" banner
3. User pays → Full access unlocked
4. User can use all features

---

## 📋 Implementation Checklist

### Phase 1: Quick Setup (4-6 hours)
- [ ] Add `hasPaid` field to database
- [ ] Update signup to set `hasPaid: false`
- [ ] Create payment check middleware
- [ ] Create `PaymentRequired` component
- [ ] Update dashboard pages to check payment
- [ ] Add "Complete Payment" button

### Phase 2: Post-Payment Pipeline (20-30 hours)
- [ ] Create `runPostPaymentPipeline()` function
- [ ] Implement webhook handlers (Paystack + Stripe)
- [ ] Create wallet after payment
- [ ] Add credits based on tier
- [ ] Upgrade user tier
- [ ] Set `hasPaid: true`
- [ ] Provision Whop access
- [ ] Generate event ticket
- [ ] Send welcome email
- [ ] Track affiliate commission

---

## 🔧 Phase 1: Quick Setup (Do This First)

### Step 1: Database Changes (30 min)

**File:** `db/schema.ts`

Add `hasPaid` field to users table:
```typescript
export const users = mysqlTable("users", {
  id: id(),
  // ... existing fields ...
  hasPaid: boolean("has_paid").default(false).notNull(), // ← ADD THIS
  // ... rest of fields ...
});
```

**Run migration:**
```bash
npm run db:push
```

---

### Step 2: Update Signup (30 min)

**File:** `api/auth-router.ts`

Update signup mutation:
```typescript
signup: publicMutation
  .input(/* ... */)
  .mutation(async ({ input, ctx }) => {
    // ... existing code ...
    
    await upsertUser({
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      country: input.country,
      referralCode: "",
      emailVerified: false,
      hasPaid: false, // ← ADD THIS
      lastSignInAt: new Date(),
    } as any);
    
    // ... rest of code ...
  }),
```

**File:** `api/google-oauth-handler.ts`

Update Google OAuth:
```typescript
await upsertUser({
  name: googleUser.name,
  email: googleUser.email,
  avatar: googleUser.picture,
  emailVerified: googleUser.verified_email,
  referralCode: "",
  hasPaid: false, // ← ADD THIS
  lastSignInAt: new Date(),
} as any);
```

---

### Step 3: Create Payment Check Middleware (1 hour)

**File:** `api/middleware.ts`

Add payment check:
```typescript
const requirePayment = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  if (!ctx.user.hasPaid) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Payment required to access this feature",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

// Export new procedure
export const paidQuery = t.procedure.use(requireAuth).use(requirePayment);
```

---

### Step 4: Create PaymentRequired Component (30 min)

**File:** `src/components/PaymentRequired.tsx` (NEW)

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard } from "lucide-react";
import { Link } from "react-router";

export function PaymentRequired() {
  return (
    <div className="min-h-screen bg-[#f5f4f1] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-xl">Payment Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-neutral-600">
            Your account has been created successfully! Complete your payment to unlock all features and access your dashboard.
          </p>
          
          <div className="bg-neutral-50 rounded-lg p-4 text-left">
            <p className="text-xs font-medium text-neutral-500 mb-2">What you'll get:</p>
            <ul className="text-sm text-neutral-700 space-y-1">
              <li>✓ Builder credits</li>
              <li>✓ Community access via Whop</li>
              <li>✓ Event ticket (May 29)</li>
              <li>✓ Referral rewards</li>
              <li>✓ Full dashboard access</li>
            </ul>
          </div>

          <Link to="/join">
            <Button className="w-full bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Complete Payment
            </Button>
          </Link>

          <p className="text-xs text-neutral-400">
            Already paid? Contact support if you're seeing this message.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Step 5: Update Dashboard Pages (1 hour)

**Update ALL dashboard pages to check payment:**

**Example:** `src/pages/DashboardHome.tsx`

```typescript
import { PaymentRequired } from "@/components/PaymentRequired";

export default function DashboardHome() {
  const { user } = useAuth();
  
  // ADD THIS CHECK
  if (!user?.hasPaid) {
    return <PaymentRequired />;
  }
  
  // ... rest of existing code ...
}
```

**Apply to:**
- `src/pages/DashboardHome.tsx`
- `src/pages/DashboardWallet.tsx`
- `src/pages/DashboardReferrals.tsx`
- `src/pages/DashboardTicket.tsx`
- `src/pages/DashboardCommunity.tsx`

---

### Step 6: Update User Router (30 min)

**File:** `api/routers/user-router.ts`

Change from `authedQuery` to `paidQuery` for paid features:

```typescript
export const userRouter = createRouter({
  // Keep as authedQuery (no payment needed)
  me: authedQuery.query(/* ... */),
  
  // Change to paidQuery (payment required)
  wallet: paidQuery.query(/* ... */),
  transactions: paidQuery.query(/* ... */),
  ticket: paidQuery.query(/* ... */),
  affiliate: paidQuery.query(/* ... */),
  // ... etc
});
```

---

## 🚀 Phase 2: Post-Payment Pipeline (Do This Next)

### Step 1: Create Pipeline Function (4-6 hours)

**File:** `api/lib/post-payment-pipeline.ts` (NEW)

```typescript
import { findPaymentById } from "../queries/payments";
import { findUserByEmail, updateUser } from "../queries/users";
import { createWallet, creditWallet } from "../queries/wallets";
import { TIER_CREDITS } from "@contracts/constants";

export async function runPostPaymentPipeline(paymentId: number) {
  console.log(`[Pipeline] Starting for payment ${paymentId}`);
  
  const payment = await findPaymentById(paymentId);
  if (!payment) {
    throw new Error("Payment not found");
  }
  
  // 1. Find or create user
  let user = await findUserByEmail(payment.email);
  if (!user) {
    // User doesn't exist, create account
    await upsertUser({
      email: payment.email,
      name: payment.email.split("@")[0], // Use email prefix as name
      phone: payment.phone,
      tier: payment.tier,
      hasPaid: true,
      referralCode: "",
      lastSignInAt: new Date(),
    } as any);
    user = await findUserByEmail(payment.email);
  } else {
    // User exists, upgrade account
    await updateUser(user.id, {
      tier: payment.tier,
      hasPaid: true,
    });
  }
  
  if (!user) {
    throw new Error("Failed to create/find user");
  }
  
  // 2. Create wallet
  let wallet = await findWalletByUserId(user.id);
  if (!wallet) {
    wallet = await createWallet(user.id);
  }
  
  // 3. Add credits
  const credits = TIER_CREDITS[payment.tier];
  await creditWallet(
    wallet.id,
    credits,
    `Initial ${payment.tier} tier credits`,
    `payment_${payment.id}`
  );
  
  // 4. Update user with wallet ID
  await updateUser(user.id, { walletId: wallet.id });
  
  // 5. TODO: Provision Whop (implement later)
  // await provisionWhop(user.id, payment.tier);
  
  // 6. TODO: Generate ticket (implement later)
  // await generateTicket(user.id, payment.id);
  
  // 7. TODO: Send welcome email (implement later)
  // await sendWelcomeEmail(user.email, user.name);
  
  // 8. TODO: Track affiliate (implement later)
  // if (payment.affiliateCode) {
  //   await trackAffiliateConversion(payment.affiliateCode, payment.id);
  // }
  
  console.log(`[Pipeline] Completed for payment ${paymentId}`);
  
  return { success: true, userId: user.id };
}
```

---

### Step 2: Update Payment Router (1 hour)

**File:** `api/routers/payment-router.ts`

Update `mockSuccess` to call pipeline:

```typescript
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";

export const paymentRouter = createRouter({
  // ... existing code ...
  
  mockSuccess: publicQuery
    .input(z.object({ providerRef: z.string() }))
    .mutation(async ({ input }) => {
      const payment = await findPaymentByProviderRef(input.providerRef);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      if (payment.status === "success") return { alreadyProcessed: true };

      await markPaymentSuccess(payment.id);
      
      // ← ADD THIS: Run post-payment pipeline
      try {
        await runPostPaymentPipeline(payment.id);
      } catch (error) {
        console.error("[Payment] Pipeline failed:", error);
        // Don't throw - payment is still successful
      }
      
      return { success: true, paymentId: payment.id, email: payment.email, tier: payment.tier };
    }),
});
```

---

### Step 3: Create Webhook Handlers (6-8 hours)

**File:** `api/webhooks/paystack.ts` (NEW)

```typescript
import type { Context } from "hono";
import crypto from "crypto";
import { env } from "../lib/env";
import { findPaymentByProviderRef, markPaymentSuccess } from "../queries/payments";
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";

export async function handlePaystackWebhook(c: Context) {
  // Verify signature
  const signature = c.req.header("x-paystack-signature");
  const body = await c.req.text();
  
  const hash = crypto
    .createHmac("sha512", env.paystackSecretKey)
    .update(body)
    .digest("hex");
  
  if (hash !== signature) {
    return c.json({ error: "Invalid signature" }, 401);
  }
  
  const event = JSON.parse(body);
  
  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const payment = await findPaymentByProviderRef(reference);
    
    if (payment && payment.status !== "success") {
      await markPaymentSuccess(payment.id);
      await runPostPaymentPipeline(payment.id);
    }
  }
  
  return c.json({ success: true });
}
```

**File:** `api/webhooks/stripe.ts` (NEW)

```typescript
// Similar to Paystack but for Stripe
// Uses Stripe SDK to verify webhook signature
```

---

### Step 4: Add Webhook Routes (30 min)

**File:** `api/boot.ts`

```typescript
import { handlePaystackWebhook } from "./webhooks/paystack";
import { handleStripeWebhook } from "./webhooks/stripe";

// Add webhook routes
app.post("/api/webhooks/paystack", handlePaystackWebhook);
app.post("/api/webhooks/stripe", handleStripeWebhook);
```

---

## ✅ Testing Checklist

### Phase 1 Testing:
- [ ] Sign up with email/password
- [ ] See "Payment Required" screen
- [ ] Click "Complete Payment" → redirects to /join
- [ ] Try to access dashboard → blocked
- [ ] Try to access wallet → blocked

### Phase 2 Testing:
- [ ] Complete demo payment
- [ ] Check `hasPaid` set to `true` in database
- [ ] Check wallet created
- [ ] Check credits added
- [ ] Check tier upgraded
- [ ] Access dashboard → works!
- [ ] Access all features → works!

---

## 📊 Progress Tracking

### Phase 1: Quick Setup
- **Estimated:** 4-6 hours
- **Status:** Not started
- **Blocks:** None

### Phase 2: Post-Payment Pipeline
- **Estimated:** 20-30 hours
- **Status:** Not started
- **Blocks:** Phase 1 must be complete

### Total Effort:
- **25-35 hours** total
- **Can be done in stages**
- **Phase 1 can be tested independently**

---

## 🎯 Next Steps

1. **Fix database connection** (SSL issue) ✅ DONE
2. **Run `npm run db:push`** to test connection
3. **Implement Phase 1** (4-6 hours)
4. **Test Phase 1** (payment gating works)
5. **Implement Phase 2** (20-30 hours)
6. **Test Phase 2** (full flow works)
7. **Deploy to production**

---

## 💡 Quick Wins

You can implement Phase 1 in stages:

**Day 1 (2 hours):**
- Add `hasPaid` field
- Update signup
- Run migration

**Day 2 (2 hours):**
- Create PaymentRequired component
- Update 1-2 dashboard pages
- Test

**Day 3 (2 hours):**
- Update remaining dashboard pages
- Add middleware
- Test full flow

**Then tackle Phase 2 when ready!**
