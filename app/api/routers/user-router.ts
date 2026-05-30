import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { findUserById, updateUser } from "../queries/users";
import { findWalletByUserId, getWalletTransactions } from "../queries/wallets";
import { findTicketByUserAndEvent, getActiveEvents } from "../queries/events";
import { getUserAchievements } from "../queries/achievements";
import { findAffiliateByUserId } from "../queries/affiliates";
import { TRPCError } from "@trpc/server";

export const userRouter = createRouter({
  me: authedQuery.query(async ({ ctx }) => {
    const user = await findUserById(ctx.user.id);
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    return user;
  }),

  wallet: authedQuery.query(async ({ ctx }) => {
    const wallet = await findWalletByUserId(ctx.user.id);
    if (!wallet) throw new TRPCError({ code: "NOT_FOUND", message: "Wallet not found" });
    return wallet;
  }),

  transactions: authedQuery
    .input(z.object({ page: z.number().min(1).default(1), limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const wallet = await findWalletByUserId(ctx.user.id);
      if (!wallet) return { rows: [], total: 0 };
      const rows = await getWalletTransactions(wallet.id, input.page, input.limit);
      return { rows, total: rows.length };
    }),

  achievements: authedQuery.query(async ({ ctx }) => {
    return getUserAchievements(ctx.user.id);
  }),

  ticket: authedQuery.query(async ({ ctx }) => {
    const events = await getActiveEvents();
    if (events.length === 0) return null;
    const ticket = await findTicketByUserAndEvent(ctx.user.id, events[0].id);
    return ticket ?? null;
  }),

  affiliate: authedQuery.query(async ({ ctx }) => {
    const affiliate = await findAffiliateByUserId(ctx.user.id);
    return affiliate ?? null;
  }),

  updateProfile: authedQuery
    .input(
      z.object({
        name: z.string().min(1).optional(),
        country: z.string().optional(),
        state: z.string().optional(),
        school: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateUser(ctx.user.id, input);
      return { success: true };
    }),

  completeOnboarding: authedQuery.mutation(async ({ ctx }) => {
    await updateUser(ctx.user.id, { onboarded: true });
    return { success: true };
  }),
});
