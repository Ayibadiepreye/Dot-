# 🚀 Complete Implementation Plan

**Last Updated**: May 30, 2026  
**Status**: Roadmap for Remaining Features

---

## 📋 TABLE OF CONTENTS

1. [Organization System (Q&A)](#organization-system-qa)
2. [Production Webhooks](#1-production-webhooks-high-priority)
3. [Email Notifications](#2-email-notifications-medium-priority)
4. [SMS/WhatsApp Notifications](#3-smswhatsapp-notifications-medium-priority)
5. [Whop Integration](#4-whop-integration-medium-priority)
6. [Organization Features](#5-organization-features-optional)
7. [Implementation Order](#implementation-order)
8. [Environment Variables](#environment-variables-needed)

---

## 🏢 ORGANIZATION SYSTEM (Q&A)

### Q: How does one login as an org?

**A: Organizations don't login directly. Here's how it works:**

1. **Individual users login** (email/password or Google OAuth)
2. **Users can be linked to an organization** via `organizationId` field
3. **Users can have `org_admin` role** to manage their organization

### Q: What makes org users different?

**A: Here's the difference:**

| Feature | Regular Member | Org Admin | Admin/Super Admin |
|---------|---------------|-----------|-------------------|
| Login | ✅ Yes | ✅ Yes | ✅ Yes |
| Dashboard Access | ✅ Yes | ✅ Yes | ✅ Yes |
| Payment Gate | ✅ Shows if unpaid | ✅ Shows if unpaid | ❌ Bypassed |
| Manage Own Profile | ✅ Yes | ✅ Yes | ✅ Yes |
| Manage Organization | ❌ No | ✅ Yes | ✅ Yes |
| View Org Members | ❌ No | ✅ Yes | ✅ Yes |
| Invite Org Members | ❌ No | ✅ Yes | ✅ Yes |
| Org Revenue Tracking | ❌ No | ✅ Yes | ✅ Yes |
| Admin Panel Access | ❌ No | ❌ No | ✅ Yes |

### Current Organization Schema:

```typescript
organizations {
  id: number
  name: string                    // "Acme University"
  slug: string                    // "acme-university"
  contactEmail: string            // "admin@acme.edu"
  country: string                 // "Nigeria"
  logoUrl: string                 // "https://..."
  referralCode: string            // Unique code for org
  revenueTotal: decimal           // Total revenue generated
  status: "active" | "suspended" | "pending"
  approvedBy: number              // Admin who approved
  approvedAt: timestamp
  createdAt: timestamp
}

users {
  ...
  organizationId: number          // Links user to org
  role: "member" | "org_admin" | "ops" | "admin" | "super_admin"
  ...
}
```

### How Organizations Work:

1. **Organization is created** (by admin or through application)
2. **Status is "pending"** until approved by super admin
3. **Users join organization** (invited or self-join with code)
4. **Org admin manages members** (view, invite, remove)
5. **Revenue is tracked** (all payments from org members)
6. **Org gets referral code** (for tracking signups)

### What's NOT Implemented Yet:

- ❌ Organization signup/application flow
- ❌ Organization dashboard for org_admin
- ❌ Invite members to organization
- ❌ Organization revenue dashboard
- ❌ Organization member management

**This is optional and can be added later if needed.**

---

## 1. PRODUCTION WEBHOOKS (HIGH PRIORITY)

**Why Needed**: Real Paystack/Stripe payments need webhooks to trigger the post-payment pipeline.

**Time**: 3-4 hours  
**Difficulty**: Medium

### Step 1: Install Dependencies

```bash
npm install stripe @paystack/inline-js
```

### Step 2: Create Paystack Webhook Handler

**File**: `api/webhooks/paystack.ts`

```typescript
import { Hono } from "hono";
import crypto from "crypto";
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";
import { findPaymentByProviderRef } from "../queries/payments";

const app = new Hono();

// Paystack webhook endpoint
app.post("/", async (c) => {
  try {
    // 1. Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(c.req.raw.body))
      .digest("hex");

    const signature = c.req.header("x-paystack-signature");

    if (hash !== signature) {
      console.error("[Paystack Webhook] Invalid signature");
      return c.json({ error: "Invalid signature" }, 401);
    }

    // 2. Parse webhook data
    const event = await c.req.json();

    console.log("[Paystack Webhook] Event:", event.event);

    // 3. Handle charge.success event
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      // Find payment by provider reference
      const payment = await findPaymentByProviderRef("paystack", reference);

      if (!payment) {
        console.error("[Paystack Webhook] Payment not found:", reference);
        return c.json({ error: "Payment not found" }, 404);
      }

      // Run post-payment pipeline
      console.log("[Paystack Webhook] Running pipeline for payment:", payment.id);
      await runPostPaymentPipeline(payment.id);

      return c.json({ success: true });
    }

    // Other events (charge.failed, etc.)
    return c.json({ success: true, message: "Event ignored" });
  } catch (error) {
    console.error("[Paystack Webhook] Error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

export default app;
```

### Step 3: Create Stripe Webhook Handler

**File**: `api/webhooks/stripe.ts`

```typescript
import { Hono } from "hono";
import Stripe from "stripe";
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";
import { findPaymentByProviderRef } from "../queries/payments";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const app = new Hono();

// Stripe webhook endpoint
app.post("/", async (c) => {
  try {
    // 1. Get raw body and signature
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");

    if (!signature) {
      return c.json({ error: "No signature" }, 400);
    }

    // 2. Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("[Stripe Webhook] Signature verification failed:", err);
      return c.json({ error: "Invalid signature" }, 401);
    }

    console.log("[Stripe Webhook] Event:", event.type);

    // 3. Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const reference = paymentIntent.id;

      // Find payment by provider reference
      const payment = await findPaymentByProviderRef("stripe", reference);

      if (!payment) {
        console.error("[Stripe Webhook] Payment not found:", reference);
        return c.json({ error: "Payment not found" }, 404);
      }

      // Run post-payment pipeline
      console.log("[Stripe Webhook] Running pipeline for payment:", payment.id);
      await runPostPaymentPipeline(payment.id);

      return c.json({ success: true });
    }

    // Other events
    return c.json({ success: true, message: "Event ignored" });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

export default app;
```

### Step 4: Add Webhook Routes

**File**: `api/boot.ts` (add these routes)

```typescript
import paystackWebhook from "./webhooks/paystack";
import stripeWebhook from "./webhooks/stripe";

// Add to your Hono app
app.route("/api/webhooks/paystack", paystackWebhook);
app.route("/api/webhooks/stripe", stripeWebhook);
```

### Step 5: Add Helper Function

**File**: `api/queries/payments.ts` (add this function)

```typescript
export async function findPaymentByProviderRef(
  provider: "paystack" | "stripe",
  providerRef: string
) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.provider, provider),
        eq(payments.providerRef, providerRef)
      )
    )
    .limit(1);

  return payment;
}
```

### Step 6: Configure Webhooks

**Paystack:**
1. Go to Paystack Dashboard → Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/paystack`
3. Copy secret key to `.env` as `PAYSTACK_SECRET_KEY`

**Stripe:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`
4. Copy webhook secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Step 7: Test Webhooks

```bash
# Test Paystack webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/paystack

# Test Stripe webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 2. EMAIL NOTIFICATIONS (MEDIUM PRIORITY)

**Why Needed**: Send payment confirmations, welcome emails, password resets.

**Time**: 1-2 hours  
**Difficulty**: Easy

### Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Sign up for free account
3. Verify your domain (or use resend.dev for testing)
4. Get API key

### Step 2: Install Resend

```bash
npm install resend
```

### Step 3: Create Email Service

**File**: `api/lib/email.ts`

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentSuccessEmail(
  email: string,
  name: string,
  tier: string,
  credits: number,
  qrCode: string
) {
  try {
    await resend.emails.send({
      from: "DOT Platform <noreply@yourdomain.com>",
      to: email,
      subject: "🎉 Payment Successful - Welcome to DOT!",
      html: `
        <h1>Welcome to DOT, ${name}!</h1>
        <p>Your payment was successful. Here are your details:</p>
        <ul>
          <li><strong>Tier:</strong> ${tier.toUpperCase()}</li>
          <li><strong>Credits:</strong> ${credits.toLocaleString()}</li>
          <li><strong>Event Ticket:</strong> ${qrCode}</li>
        </ul>
        <p>You now have full access to the platform!</p>
        <p><a href="https://yourdomain.com/dashboard">Go to Dashboard</a></p>
      `,
    });

    console.log("[Email] Payment success email sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send payment success email:", error);
    // Don't throw - email failure shouldn't break pipeline
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "DOT Platform <noreply@yourdomain.com>",
      to: email,
      subject: "Welcome to DOT Platform!",
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thanks for signing up for DOT Platform.</p>
        <p>Complete your payment to unlock full access to all features.</p>
        <p><a href="https://yourdomain.com/join">Complete Payment</a></p>
      `,
    });

    console.log("[Email] Welcome email sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  try {
    await resend.emails.send({
      from: "DOT Platform <noreply@yourdomain.com>",
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <p><a href="https://yourdomain.com/reset-password?token=${resetToken}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
      `,
    });

    console.log("[Email] Password reset email sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
  }
}
```

### Step 4: Add to Post-Payment Pipeline

**File**: `api/lib/post-payment-pipeline.ts` (add after step 8)

```typescript
import { sendPaymentSuccessEmail } from "./email";

// After step 8 (unlock achievement)
await sendPaymentSuccessEmail(
  user.email,
  user.name || "Member",
  payment.tier,
  credits,
  qrCode
);
```

### Step 5: Add to Signup

**File**: `api/auth-router.ts` (add after user creation)

```typescript
import { sendWelcomeEmail } from "../lib/email";

// After creating user
await sendWelcomeEmail(user.email, user.name || "Member");
```

---

## 3. SMS/WHATSAPP NOTIFICATIONS (MEDIUM PRIORITY)

**Why Needed**: Send payment confirmations via SMS/WhatsApp.

**Time**: 1-2 hours  
**Difficulty**: Easy

### Step 1: Sign Up for Twilio

1. Go to https://twilio.com
2. Sign up for account
3. Get phone number (for SMS)
4. Enable WhatsApp (for WhatsApp messages)
5. Get Account SID and Auth Token

### Step 2: Install Twilio

```bash
npm install twilio
```

### Step 3: Create SMS/WhatsApp Service

**File**: `api/lib/notifications.ts`

```typescript
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(phone: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log("[SMS] Message sent to:", phone);
  } catch (error) {
    console.error("[SMS] Failed to send message:", error);
  }
}

export async function sendWhatsApp(phone: string, message: string) {
  try {
    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
    });

    console.log("[WhatsApp] Message sent to:", phone);
  } catch (error) {
    console.error("[WhatsApp] Failed to send message:", error);
  }
}

export async function sendPaymentNotification(
  phone: string,
  name: string,
  tier: string,
  credits: number
) {
  const message = `🎉 Hi ${name}! Your payment was successful. You now have ${credits.toLocaleString()} credits. Welcome to DOT Platform!`;

  // Send both SMS and WhatsApp
  await Promise.all([
    sendSMS(phone, message),
    sendWhatsApp(phone, message),
  ]);
}
```

### Step 4: Add to Post-Payment Pipeline

**File**: `api/lib/post-payment-pipeline.ts` (add after email)

```typescript
import { sendPaymentNotification } from "./notifications";

// After sending email
if (payment.phone) {
  await sendPaymentNotification(
    payment.phone,
    user.name || "Member",
    payment.tier,
    credits
  );
}
```

---

## 4. WHOP INTEGRATION (MEDIUM PRIORITY)

**Why Needed**: Auto-grant community access after payment.

**Time**: 2-3 hours  
**Difficulty**: Medium

### Step 1: Get Whop API Credentials

1. Go to Whop Dashboard
2. Get API key
3. Get Company ID
4. Get Product IDs for each tier

### Step 2: Create Whop Service

**File**: `api/lib/whop.ts`

```typescript
const WHOP_API_URL = "https://api.whop.com/v1";
const WHOP_API_KEY = process.env.WHOP_API_KEY;

// Tier to Whop Product ID mapping
const TIER_PRODUCT_IDS: Record<string, string> = {
  starter: process.env.WHOP_STARTER_PRODUCT_ID!,
  vip: process.env.WHOP_VIP_PRODUCT_ID!,
  pioneer: process.env.WHOP_PIONEER_PRODUCT_ID!,
  corporate: process.env.WHOP_CORPORATE_PRODUCT_ID!,
  hub_partner: process.env.WHOP_HUB_PARTNER_PRODUCT_ID!,
};

export async function provisionWhopAccess(
  userId: number,
  tier: string,
  email: string,
  whopEmail?: string
) {
  try {
    const productId = TIER_PRODUCT_IDS[tier];

    if (!productId) {
      console.error("[Whop] No product ID for tier:", tier);
      return { success: false, error: "Invalid tier" };
    }

    // Create membership
    const response = await fetch(`${WHOP_API_URL}/memberships`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHOP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        email: whopEmail || email,
        metadata: {
          dot_user_id: userId,
          tier: tier,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[Whop] Failed to create membership:", error);
      return { success: false, error };
    }

    const data = await response.json();
    console.log("[Whop] Membership created:", data.id);

    return { success: true, membershipId: data.id };
  } catch (error) {
    console.error("[Whop] Error provisioning access:", error);
    return { success: false, error: String(error) };
  }
}

export async function revokeWhopAccess(membershipId: string) {
  try {
    const response = await fetch(
      `${WHOP_API_URL}/memberships/${membershipId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${WHOP_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Whop] Failed to revoke membership:", error);
      return { success: false, error };
    }

    console.log("[Whop] Membership revoked:", membershipId);
    return { success: true };
  } catch (error) {
    console.error("[Whop] Error revoking access:", error);
    return { success: false, error: String(error) };
  }
}
```

### Step 3: Add to Post-Payment Pipeline

**File**: `api/lib/post-payment-pipeline.ts` (add after step 6)

```typescript
import { provisionWhopAccess } from "./whop";
import { addToWhopPendingQueue } from "../queries/whop";

// After generating ticket
const whopResult = await provisionWhopAccess(
  user.id,
  payment.tier,
  user.email,
  user.whopEmail
);

if (!whopResult.success) {
  // Add to retry queue if failed
  console.log("[Pipeline] Whop provisioning failed, adding to queue");
  await addToWhopPendingQueue(user.id, payment.tier, user.email);
}
```

### Step 4: Create Retry Queue Handler

**File**: `api/queries/whop.ts`

```typescript
import { db } from "./connection";
import { whopPending } from "../../db/schema";
import { eq, isNull } from "drizzle-orm";

export async function addToWhopPendingQueue(
  userId: number,
  tier: string,
  email: string
) {
  await db.insert(whopPending).values({
    userId,
    tier,
    email,
    attempts: 0,
    lastError: null,
  });
}

export async function getPendingWhopProvisions() {
  return db
    .select()
    .from(whopPending)
    .where(isNull(whopPending.resolvedAt))
    .limit(10);
}

export async function markWhopResolved(id: number) {
  await db
    .update(whopPending)
    .set({ resolvedAt: new Date() })
    .where(eq(whopPending.id, id));
}

export async function incrementWhopAttempts(id: number, error: string) {
  await db
    .update(whopPending)
    .set({
      attempts: sql`attempts + 1`,
      lastError: error,
    })
    .where(eq(whopPending.id, id));
}
```

### Step 5: Create Cron Job for Retries

**File**: `api/cron/whop-retry.ts`

```typescript
import { getPendingWhopProvisions, markWhopResolved, incrementWhopAttempts } from "../queries/whop";
import { provisionWhopAccess } from "../lib/whop";

export async function retryWhopProvisions() {
  console.log("[Cron] Starting Whop retry job");

  const pending = await getPendingWhopProvisions();

  for (const item of pending) {
    if (item.attempts >= 5) {
      console.log("[Cron] Max attempts reached for:", item.id);
      continue;
    }

    const result = await provisionWhopAccess(
      item.userId,
      item.tier,
      item.email
    );

    if (result.success) {
      await markWhopResolved(item.id);
      console.log("[Cron] Whop provisioning successful:", item.id);
    } else {
      await incrementWhopAttempts(item.id, result.error || "Unknown error");
      console.log("[Cron] Whop provisioning failed:", item.id);
    }
  }

  console.log("[Cron] Whop retry job complete");
}

// Run every 5 minutes
setInterval(retryWhopProvisions, 5 * 60 * 1000);
```

---

## 5. ORGANIZATION FEATURES (OPTIONAL)

**Why Needed**: Allow organizations to manage members and track revenue.

**Time**: 4-6 hours  
**Difficulty**: Medium-High

### Features to Implement:

1. **Organization Application Flow**
   - Application form
   - Admin approval process
   - Status tracking

2. **Organization Dashboard** (for org_admin)
   - View organization details
   - View members list
   - Invite new members
   - Track organization revenue
   - View organization referral stats

3. **Member Invitation System**
   - Generate invite links
   - Email invitations
   - Accept/decline invitations
   - Auto-link to organization

4. **Organization Revenue Tracking**
   - Track all payments from org members
   - Calculate total revenue
   - Show revenue breakdown by tier
   - Export revenue reports

**This is optional and can be implemented later if needed.**

---

## IMPLEMENTATION ORDER

### Week 1: Critical Features
1. ✅ **Day 1-2**: Production Webhooks (Paystack + Stripe)
2. ✅ **Day 3**: Email Notifications (Resend)
3. ✅ **Day 4**: Test webhooks and emails end-to-end

### Week 2: Nice-to-Have Features
4. ✅ **Day 1-2**: Whop Integration
5. ✅ **Day 3**: SMS/WhatsApp Notifications (Twilio)
6. ✅ **Day 4**: Test all integrations

### Week 3: Optional Features
7. ⏳ **Day 1-3**: Organization Features (if needed)
8. ⏳ **Day 4-5**: Error Monitoring (Sentry)

---

## ENVIRONMENT VARIABLES NEEDED

Add these to your `.env` file:

```env
# Existing
DATABASE_URL=mysql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Paystack
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (Email)
RESEND_API_KEY=re_...

# Twilio (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# Whop
WHOP_API_KEY=...
WHOP_COMPANY_ID=...
WHOP_STARTER_PRODUCT_ID=...
WHOP_VIP_PRODUCT_ID=...
WHOP_PIONEER_PRODUCT_ID=...
WHOP_CORPORATE_PRODUCT_ID=...
WHOP_HUB_PARTNER_PRODUCT_ID=...

# Sentry (Optional)
SENTRY_DSN=...
```

---

## 🎯 SUMMARY

### Must Implement (Week 1):
1. ✅ Production Webhooks (Paystack + Stripe)
2. ✅ Email Notifications (Resend)

### Should Implement (Week 2):
3. ✅ Whop Integration
4. ✅ SMS/WhatsApp Notifications (Twilio)

### Can Implement Later:
5. ⏳ Organization Features
6. ⏳ Error Monitoring (Sentry)
7. ⏳ Email Verification
8. ⏳ Phone Verification
9. ⏳ Analytics

---

## 📞 QUESTIONS?

**For implementation help:**
- Follow the code examples above
- Test in staging before production
- Use sandbox/test modes first

**Ready to start? Begin with Production Webhooks! 🚀**
