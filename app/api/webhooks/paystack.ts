import { Hono } from "hono";
import crypto from "crypto";
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";
import { findPaymentByProviderRef } from "../queries/payments";

const app = new Hono();

/**
 * Paystack Webhook Handler
 * Handles payment notifications from Paystack
 */
app.post("/", async (c) => {
  try {
    // 1. Get request body as text for signature verification
    const body = await c.req.text();
    const signature = c.req.header("x-paystack-signature");

    if (!signature) {
      console.error("[Paystack Webhook] No signature provided");
      return c.json({ error: "No signature" }, 401);
    }

    // 2. Verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("[Paystack Webhook] Invalid signature");
      return c.json({ error: "Invalid signature" }, 401);
    }

    // 3. Parse webhook data
    const event = JSON.parse(body);

    console.log("[Paystack Webhook] Event received:", event.event);

    // 4. Handle charge.success event
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      console.log("[Paystack Webhook] Processing payment:", reference);

      // Find payment by provider reference
      const payment = await findPaymentByProviderRef("paystack", reference);

      if (!payment) {
        console.error("[Paystack Webhook] Payment not found:", reference);
        return c.json({ error: "Payment not found" }, 404);
      }

      if (payment.status === "success") {
        console.log("[Paystack Webhook] Payment already processed:", payment.id);
        return c.json({ success: true, message: "Already processed" });
      }

      // Run post-payment pipeline
      console.log("[Paystack Webhook] Running pipeline for payment:", payment.id);
      await runPostPaymentPipeline(payment.id);

      return c.json({ success: true, message: "Payment processed" });
    }

    // Handle other events
    if (event.event === "charge.failed") {
      console.log("[Paystack Webhook] Payment failed:", event.data.reference);
      // Could update payment status to failed here
    }

    // Acknowledge other events
    return c.json({ success: true, message: "Event received" });
  } catch (error) {
    console.error("[Paystack Webhook] Error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

export default app;
