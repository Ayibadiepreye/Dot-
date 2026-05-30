import { Hono } from "hono";
import Stripe from "stripe";
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";
import { findPaymentByProviderRef } from "../queries/payments";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
});

const app = new Hono();

/**
 * Stripe Webhook Handler
 * Handles payment notifications from Stripe
 */
app.post("/", async (c) => {
  try {
    // 1. Get raw body and signature
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");

    if (!signature) {
      console.error("[Stripe Webhook] No signature provided");
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
    } catch (err: any) {
      console.error("[Stripe Webhook] Signature verification failed:", err.message);
      return c.json({ error: "Invalid signature" }, 401);
    }

    console.log("[Stripe Webhook] Event received:", event.type);

    // 3. Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const reference = paymentIntent.id;

      console.log("[Stripe Webhook] Processing payment:", reference);

      // Find payment by provider reference
      const payment = await findPaymentByProviderRef("stripe", reference);

      if (!payment) {
        console.error("[Stripe Webhook] Payment not found:", reference);
        return c.json({ error: "Payment not found" }, 404);
      }

      if (payment.status === "success") {
        console.log("[Stripe Webhook] Payment already processed:", payment.id);
        return c.json({ success: true, message: "Already processed" });
      }

      // Run post-payment pipeline
      console.log("[Stripe Webhook] Running pipeline for payment:", payment.id);
      await runPostPaymentPipeline(payment.id);

      return c.json({ success: true, message: "Payment processed" });
    }

    // Handle payment_intent.payment_failed event
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("[Stripe Webhook] Payment failed:", paymentIntent.id);
      // Could update payment status to failed here
    }

    // Acknowledge other events
    return c.json({ success: true, message: "Event received" });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

export default app;
