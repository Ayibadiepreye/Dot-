import { z } from "zod";
import { createRouter, authedQuery, publicQuery } from "../middleware";
import {
  findAffiliateByUserId,
  getAffiliateClicks,
  trackAffiliateClick,
  incrementAffiliateClicks,
} from "../queries/affiliates";
import { TRPCError } from "@trpc/server";

export const affiliateRouter = createRouter({
  stats: authedQuery.query(async ({ ctx }) => {
    if (!ctx.user.phoneVerified) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Please verify your phone number to access affiliate stats",
      });
    }
    const affiliate = await findAffiliateByUserId(ctx.user.id);
    if (!affiliate) return null;
    const recentClicks = await getAffiliateClicks(affiliate.referralCode, 20);
    return { ...affiliate, recentClicks };
  }),

  trackClick: publicQuery
    .input(
      z.object({
        referralCode: z.string(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
        deviceHash: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await trackAffiliateClick(input);
      await incrementAffiliateClicks(input.referralCode);
      return { success: true };
    }),
});
