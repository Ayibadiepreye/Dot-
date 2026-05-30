import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "../middleware";
import { createPayment, findPaymentByProviderRef, markPaymentSuccess } from "../queries/payments";
import { findAffiliateByCode } from "../queries/affiliates";
import { TIER_PRICES_NGN, TIER_PRICES_USD } from "@contracts/constants";
import { TRPCError } from "@trpc/server";
import { runPostPaymentPipeline } from "../lib/post-payment-pipeline";

function getPrice(tier: string, currency: string): number {
  if (currency === "NGN") return TIER_PRICES_NGN[tier as keyof typeof TIER_PRICES_NGN] ?? 0;
  return TIER_PRICES_USD[tier as keyof typeof TIER_PRICES_USD] ?? 0;
}

export const paymentRouter = createRouter({
  initiate: authedQuery
    .input(
      z.object({
        tier: z.enum(["starter", "vip", "pioneer", "corporate", "hub_partner"]),
        currency: z.enum(["NGN", "USD"]).default("NGN"),
        affiliateCode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      const amount = getPrice(input.tier, input.currency);
      if (amount === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid tier or currency" });

      // Validate affiliate code if provided
      if (input.affiliateCode) {
        const affiliate = await findAffiliateByCode(input.affiliateCode);
        if (!affiliate) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid referral code" });
      }

      const providerRef = `dot_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      const payment = await createPayment({
        userId: user.id, // Link to logged-in user
        email: user.email,
        phone: user.phone,
        tier: input.tier,
        currency: input.currency,
        amount,
        provider: input.currency === "NGN" ? "paystack" : "stripe",
        providerRef,
        affiliateCode: input.affiliateCode,
      });

      return {
        paymentId: payment.id,
        providerRef: payment.providerRef,
        authorizationUrl: `/demo-payment?ref=${providerRef}&amount=${amount}&currency=${input.currency}`,
        amount,
        currency: input.currency,
      };
    }),

  verify: publicQuery
    .input(z.object({ providerRef: z.string() }))
    .query(async ({ input }) => {
      const payment = await findPaymentByProviderRef(input.providerRef);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      return { status: payment.status, paymentId: payment.id };
    }),

  mockSuccess: publicQuery
    .input(z.object({ providerRef: z.string() }))
    .mutation(async ({ input }) => {
      const payment = await findPaymentByProviderRef(input.providerRef);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment not found" });
      if (payment.status === "success") return { alreadyProcessed: true };

      // Mark payment as successful
      await markPaymentSuccess(payment.id);
      
      // Run post-payment pipeline
      try {
        await runPostPaymentPipeline(payment.id);
      } catch (error) {
        console.error("[Payment] Pipeline error:", error);
        // Don't fail the payment if pipeline has issues
      }

      return { success: true, paymentId: payment.id, email: payment.email, tier: payment.tier };
    }),
});
