# 💳 Payment Flow Explained

## Question: What happens when users click payment from the landing page?

---

## 🔍 CURRENT PAYMENT FLOW (As Implemented)

### Scenario 1: User Pays BEFORE Signing Up (From Landing Page)

**Step-by-step flow:**

1. **User visits landing page** (`/`)
   - Sees pricing section with 5 tiers
   - Clicks "Get Started" or "Join [Tier]" button

2. **Redirects to Checkout page** (`/checkout/starter?currency=NGN`)
   - User enters email and phone
   - Clicks "Pay" button
   - `trpc.payment.initiate` is called

3. **Payment record created** (in `payments` table)
   - `userId: NULL` (user doesn't exist yet!)
   - `email: user@example.com`
   - `tier: starter`
   - `status: pending`
   - `providerRef: dot_1234567890_abc123`

4. **Redirects to Demo Payment page** (`/demo-payment?ref=dot_1234567890_abc123`)
   - User clicks "Simulate Successful Payment"
   - `trpc.payment.mockSuccess` is called
   - Payment status updated to `success`

5. **Redirects to Auth Setup page** (`/auth/setup?ref=dot_1234567890_abc123&tier=starter&email=user@example.com`)
   - User sees: "Create your account to access your membership"
   - User can sign up with email/password OR Google OAuth
   - **IMPORTANT**: This is where the account is created!

6. **User signs up**
   - Account created with `hasPaid: false` ❌ (This is the problem!)
   - User logs in
   - Goes to dashboard
   - **Sees payment gate** even though they already paid! ❌

---

## ❌ THE PROBLEM

**Current behavior:**
```
Pay → Payment succeeds → Sign up → hasPaid: false → Payment gate shows
```

**Expected behavior:**
```
Pay → Payment succeeds → Sign up → hasPaid: true → Full access
```

**Why this happens:**
- Payment is created with `userId: NULL` (no user exists yet)
- User signs up AFTER payment
- Signup sets `hasPaid: false` by default
- No connection between payment and user account!

---

## ✅ THE SOLUTION (Phase 2)

Phase 2 will implement the **Post-Payment Pipeline** to fix this:

### Option A: Link Payment to User After Signup

**In `api/auth-router.ts` signup mutation:**
```typescript
// After creating user
const user = await findUserByEmail(input.email);

// Check if there's a successful payment for this email
const payment = await findSuccessfulPaymentByEmail(input.email);

if (payment) {
  // Run post-payment pipeline
  await runPostPaymentPipeline(payment.id);
  // This will:
  // 1. Set hasPaid: true
  // 2. Link payment to user (update userId)
  // 3. Create wallet with credits
  // 4. Upgrade tier
  // 5. Generate ticket
}
```

### Option B: Pass Payment Info to Signup

**In `/auth/setup` page:**
```typescript
// Get payment ref from URL
const ref = searchParams.get("ref");

// Pass to signup
await signup({
  email,
  password,
  paymentRef: ref, // ← Pass payment reference
});
```

**In signup mutation:**
```typescript
if (input.paymentRef) {
  const payment = await findPaymentByProviderRef(input.paymentRef);
  if (payment && payment.status === "success") {
    // Set hasPaid: true immediately
    await upsertUser({
      ...userData,
      hasPaid: true, // ← Set to true!
    });
    
    // Run post-payment pipeline
    await runPostPaymentPipeline(payment.id);
  }
}
```

---

## 🎯 RECOMMENDED APPROACH (For Phase 2)

**Option B is better** because:
1. ✅ Immediate - User gets access right away
2. ✅ Cleaner - Payment ref is already in the URL
3. ✅ Safer - Explicit connection between payment and signup
4. ✅ Simpler - No need to search for payments by email

---

## 📋 WHAT NEEDS TO BE UPDATED (Phase 2)

### 1. Update AuthSetup Page
**File**: `src/pages/AuthSetup.tsx`

Add payment ref to signup form:
```typescript
const ref = searchParams.get("ref");

// Pass to signup mutation
await signupMutation.mutateAsync({
  name,
  email,
  password,
  paymentRef: ref, // ← Add this
});
```

### 2. Update Signup Mutation
**File**: `api/auth-router.ts`

```typescript
signup: publicMutation
  .input(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      phone: z.string().optional(),
      country: z.string().optional(),
      paymentRef: z.string().optional(), // ← Add this
    }),
  )
  .mutation(async ({ input, ctx }) => {
    // ... existing code ...

    // Check if payment exists
    let hasPaid = false;
    if (input.paymentRef) {
      const payment = await findPaymentByProviderRef(input.paymentRef);
      if (payment && payment.status === "success") {
        hasPaid = true;
      }
    }

    // Create user with correct hasPaid value
    await upsertUser({
      name: input.name,
      email: input.email,
      passwordHash,
      phone: input.phone,
      country: input.country,
      referralCode: "",
      emailVerified: false,
      hasPaid, // ← Use calculated value
      lastSignInAt: new Date(),
    } as any);

    const user = await findUserByEmail(input.email);

    // If payment exists, run post-payment pipeline
    if (hasPaid && input.paymentRef) {
      const payment = await findPaymentByProviderRef(input.paymentRef);
      if (payment) {
        await runPostPaymentPipeline(payment.id);
      }
    }

    // ... rest of code ...
  });
```

### 3. Update Google OAuth Handler
**File**: `api/google-oauth-handler.ts`

Same logic - check for payment ref in the URL and set `hasPaid` accordingly.

---

## 🔄 COMPLETE FLOW (After Phase 2)

### Scenario 1: Pay First, Then Sign Up
```
1. Landing page → Click "Get Started"
2. Checkout page → Enter email, pay
3. Payment succeeds → Payment record created (userId: NULL, status: success)
4. Auth Setup page → Sign up with email/password or Google
5. Signup checks for payment → Finds payment by email
6. Sets hasPaid: true ✅
7. Runs post-payment pipeline ✅
8. User logs in → Full access! ✅
```

### Scenario 2: Sign Up First, Then Pay
```
1. Landing page → Click "Sign Up"
2. Create account → hasPaid: false
3. Login → Dashboard shows payment gate
4. Click "Complete Payment" → Checkout page
5. Pay → Payment succeeds
6. Post-payment pipeline runs ✅
7. Sets hasPaid: true ✅
8. Dashboard refreshes → Full access! ✅
```

### Scenario 3: Already Have Account, Want to Pay
```
1. Login → Dashboard shows payment gate
2. Click "Complete Payment" → Checkout page
3. Pay → Payment succeeds
4. Post-payment pipeline runs ✅
5. Links payment to user (updates userId) ✅
6. Sets hasPaid: true ✅
7. Dashboard refreshes → Full access! ✅
```

---

## ✅ FILES VERIFIED

I've verified that ALL related files were updated in Phase 1:

### Database Schema ✅
- `db/schema.ts` - Added `hasPaid` field

### Backend ✅
- `api/auth-router.ts` - Sets `hasPaid: false` on signup
- `api/google-oauth-handler.ts` - Sets `hasPaid: false` on OAuth
- `api/middleware.ts` - Added `paidQuery` middleware

### Frontend ✅
- `src/components/PaymentRequired.tsx` - Payment gate banner
- `src/pages/DashboardHome.tsx` - Payment gate check
- `src/pages/DashboardWallet.tsx` - Payment gate check
- `src/pages/DashboardReferrals.tsx` - Payment gate check
- `src/pages/DashboardTicket.tsx` - Payment gate check
- `src/pages/DashboardCommunity.tsx` - Payment gate check

### Payment Flow (Existing) ✅
- `src/components/landing/PricingSection.tsx` - Links to checkout
- `src/pages/Checkout.tsx` - Payment initiation
- `src/pages/DemoPayment.tsx` - Demo payment page
- `src/pages/AuthSetup.tsx` - Account creation after payment

---

## 🎯 SUMMARY

**Current State (Phase 1):**
- ✅ Payment gate works for users who sign up first
- ❌ Payment gate shows even if user paid first (before signup)
- ❌ No connection between payment and user account

**After Phase 2:**
- ✅ Payment gate works for all scenarios
- ✅ Users who pay first get immediate access
- ✅ Users who sign up first see payment gate until they pay
- ✅ Post-payment pipeline connects payment to user

**Next Steps:**
1. Test Phase 1 (payment gate for signup-first users)
2. Implement Phase 2 (post-payment pipeline)
3. Test all 3 scenarios above

---

**All files are updated correctly! Phase 1 is complete.** ✅
