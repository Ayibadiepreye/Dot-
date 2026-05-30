# ✅ Production Webhooks Implemented

**Date**: May 30, 2026  
**Status**: COMPLETE - Ready for Configuration

---

## 🎉 WHAT WAS IMPLEMENTED

### 1. Paystack Webhook Handler ✅
**File**: `api/webhooks/paystack.ts`

**Features:**
- ✅ Signature verification (HMAC SHA512)
- ✅ Handles `charge.success` event
- ✅ Finds payment by provider reference
- ✅ Runs post-payment pipeline
- ✅ Prevents duplicate processing
- ✅ Logs all events
- ✅ Error handling

### 2. Stripe Webhook Handler ✅
**File**: `api/webhooks/stripe.ts`

**Features:**
- ✅ Signature verification (Stripe SDK)
- ✅ Handles `payment_intent.succeeded` event
- ✅ Finds payment by provider reference
- ✅ Runs post-payment pipeline
- ✅ Prevents duplicate processing
- ✅ Logs all events
- ✅ Error handling

### 3. Helper Function Updated ✅
**File**: `api/queries/payments.ts`

**Updated:**
- ✅ `findPaymentByProviderRef(provider, reference)` - Now accepts provider parameter

### 4. Routes Added ✅
**File**: `api/boot.ts`

**Added:**
- ✅ `/api/webhooks/paystack` - Paystack webhook endpoint
- ✅ `/api/webhooks/stripe` - Stripe webhook endpoint

### 5. Dependencies Installed ✅
- ✅ `stripe` package installed

---

## 🔧 CONFIGURATION NEEDED

### Step 1: Add Environment Variables

Add these to your `.env` file (already in `.env.example`):

```env
# Paystack
PAYSTACK_SECRET_KEY=sk_live_...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 2: Configure Paystack Webhook

1. Go to **Paystack Dashboard**: https://dashboard.paystack.com
2. Navigate to **Settings → Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/webhooks/paystack`
4. Copy your **Secret Key** to `.env` as `PAYSTACK_SECRET_KEY`

### Step 3: Configure Stripe Webhook

1. Go to **Stripe Dashboard**: https://dashboard.stripe.com
2. Navigate to **Developers → Webhooks**
3. Click **Add endpoint**
4. Add endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
5. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed` (optional)
6. Copy **Signing secret** to `.env` as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 TESTING WEBHOOKS

### Test Locally with Stripe CLI

1. **Install Stripe CLI**: https://stripe.com/docs/stripe-cli

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Trigger test payment**:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

### Test Locally with Paystack

Paystack doesn't have a CLI, so you'll need to:

1. **Use ngrok** to expose local server:
   ```bash
   ngrok http 3000
   ```

2. **Add ngrok URL** to Paystack webhook settings:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/paystack
   ```

3. **Make test payment** through Paystack

---

## 🔄 HOW IT WORKS

### Payment Flow with Webhooks:

```
1. User completes payment on Paystack/Stripe
   ↓
2. Paystack/Stripe sends webhook to your server
   ↓
3. Webhook handler verifies signature
   ↓
4. Finds payment in database by provider reference
   ↓
5. Checks if already processed (prevents duplicates)
   ↓
6. Runs post-payment pipeline:
   - Sets hasPaid: true
   - Creates wallet with credits
   - Generates ticket with QR code
   - Tracks affiliate commission
   - Unlocks achievement
   ↓
7. Returns success response to Paystack/Stripe
```

---

## 📊 WEBHOOK ENDPOINTS

### Paystack Webhook
- **URL**: `POST /api/webhooks/paystack`
- **Headers**: `x-paystack-signature`
- **Events**: `charge.success`, `charge.failed`
- **Verification**: HMAC SHA512

### Stripe Webhook
- **URL**: `POST /api/webhooks/stripe`
- **Headers**: `stripe-signature`
- **Events**: `payment_intent.succeeded`, `payment_intent.payment_failed`
- **Verification**: Stripe SDK

---

## 🔒 SECURITY

### Signature Verification:

**Paystack:**
```typescript
const hash = crypto
  .createHmac("sha512", PAYSTACK_SECRET_KEY)
  .update(body)
  .digest("hex");

if (hash !== signature) {
  return error("Invalid signature");
}
```

**Stripe:**
```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  STRIPE_WEBHOOK_SECRET
);
// Throws error if signature invalid
```

### Duplicate Prevention:

```typescript
if (payment.status === "success") {
  return { success: true, message: "Already processed" };
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: Webhook signature verification fails

**Paystack:**
- Check `PAYSTACK_SECRET_KEY` is correct
- Ensure you're using the raw body (not parsed JSON)
- Check the secret key matches the one in Paystack dashboard

**Stripe:**
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Ensure you're using the raw body (not parsed JSON)
- Check the webhook secret matches the endpoint in Stripe dashboard

### Issue: Payment not found

**Solution:**
- Ensure payment was created in database before webhook fires
- Check `providerRef` matches between payment record and webhook
- Verify provider is correct ("paystack" or "stripe")

### Issue: Pipeline runs but payment gate still shows

**Solution:**
- Check console logs for pipeline errors
- Verify `hasPaid` was set to `true` in database
- Try full page reload (not just navigation)

### Issue: Webhook times out

**Solution:**
- Pipeline should complete in < 5 seconds
- Check database connection is fast
- Consider moving slow operations (email, Whop) to background queue

---

## 📝 LOGS TO MONITOR

### Successful Webhook:
```
[Paystack Webhook] Event received: charge.success
[Paystack Webhook] Processing payment: ref_abc123
[Paystack Webhook] Running pipeline for payment: 42
[Pipeline] Starting for payment 42
[Pipeline] User exists, updating 15
[Pipeline] Adding 2000 credits to wallet 8
[Pipeline] Creating ticket for event 1
[Pipeline] Completed successfully for payment 42
```

### Failed Webhook:
```
[Paystack Webhook] Event received: charge.success
[Paystack Webhook] Processing payment: ref_abc123
[Paystack Webhook] Payment not found: ref_abc123
```

---

## ✅ NEXT STEPS

1. **Add environment variables** to `.env`
2. **Configure webhooks** in Paystack and Stripe dashboards
3. **Test with Stripe CLI** locally
4. **Deploy to production**
5. **Test with real payments** (sandbox mode first)
6. **Monitor logs** for any issues

---

## 🎯 WHAT'S NEXT

Now that webhooks are implemented, you can:

1. ✅ **Test with real payments** (sandbox mode)
2. ✅ **Deploy to production**
3. ⏳ **Implement email notifications** (next priority)
4. ⏳ **Implement Whop integration**
5. ⏳ **Implement SMS/WhatsApp notifications**

---

## 📞 NEED HELP?

**For webhook issues:**
- Check console logs for errors
- Verify signature verification
- Test with Stripe CLI
- Check payment exists in database

**For pipeline issues:**
- Check `[Pipeline]` logs in console
- Verify database updates
- Check user's `hasPaid` field

---

## 🎉 WEBHOOKS ARE READY!

**Production webhooks are now implemented and ready for configuration.**

**Next**: Add environment variables and configure webhook URLs in Paystack/Stripe dashboards.

**Then**: Test with real payments! 🚀
