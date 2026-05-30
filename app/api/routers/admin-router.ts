import { z } from "zod";
import { createRouter, adminQuery } from "../middleware";
import { searchUsers, updateUser } from "../queries/users";
import { getPayments, getPaymentStats } from "../queries/payments";
import { getAffiliateLeaderboard, toggleAffiliateStatus } from "../queries/affiliates";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import { count, sql } from "drizzle-orm";

export const adminRouter = createRouter({
  users: adminQuery
    .input(
      z.object({
        search: z.string().optional(),
        tier: z.string().optional(),
        role: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      return searchUsers(input);
    }),

  updateUser: adminQuery
    .input(
      z.object({
        userId: z.number(),
        name: z.string().optional(),
        tier: z.enum(["starter", "vip", "pioneer", "corporate", "hub_partner"]).optional(),
        role: z.enum(["member", "org_admin", "ops", "admin", "super_admin"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, ...data } = input;
      await updateUser(userId, data);
      return { success: true };
    }),

  banUser: adminQuery
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input }) => {
      await updateUser(input.userId, {
        bannedUntil: new Date("2099-12-31"),
        role: "member",
      });
      return { success: true };
    }),

  metrics: adminQuery.query(async () => {
    const db = getDb();
    const [userCount, paymentStats, orgCount, checkinCount] = await Promise.all([
      db.select({ count: count() }).from(schema.users),
      getPaymentStats(),
      db
        .select({ count: count() })
        .from(schema.organizations)
        .where(sql`${schema.organizations.status} = 'active'`),
      db
        .select({ count: sql<number>`count(*)` })
        .from(schema.eventTickets)
        .where(sql`${schema.eventTickets.checkedIn} = 1`),
    ]);

    return {
      totalUsers: userCount[0].count,
      totalRevenue: paymentStats.totalRevenue,
      ngnRevenue: paymentStats.ngnRevenue,
      usdRevenue: paymentStats.usdRevenue,
      activeOrgs: orgCount[0].count,
      eventCheckins: Number(checkinCount[0].count),
    };
  }),

  payments: adminQuery
    .input(
      z.object({
        status: z.string().optional(),
        provider: z.string().optional(),
        tier: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      return getPayments(input);
    }),

  affiliates: adminQuery.query(async () => {
    return getAffiliateLeaderboard(50);
  }),

  toggleAffiliate: adminQuery
    .input(z.object({ referralCode: z.string(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      await toggleAffiliateStatus(input.referralCode, input.isActive);
      return { success: true };
    }),
});
