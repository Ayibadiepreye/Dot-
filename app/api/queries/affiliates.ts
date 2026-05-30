import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createAffiliate(userId: number, referralCode: string) {
  await getDb()
    .insert(schema.affiliates)
    .values({ userId, referralCode })
    .onDuplicateKeyUpdate({ set: { referralCode } });
}

export async function findAffiliateByUserId(userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.affiliates)
    .where(eq(schema.affiliates.userId, userId))
    .limit(1);
  return rows.at(0);
}

export async function findAffiliateByCode(code: string) {
  const rows = await getDb()
    .select()
    .from(schema.affiliates)
    .where(eq(schema.affiliates.referralCode, code))
    .limit(1);
  return rows.at(0);
}

export async function trackAffiliateClick(data: {
  referralCode: string;
  ipAddress?: string;
  userAgent?: string;
  deviceHash?: string;
}) {
  await getDb()
    .insert(schema.affiliateClicks)
    .values({
      referralCode: data.referralCode,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      deviceHash: data.deviceHash,
    });
}

export async function incrementAffiliateClicks(referralCode: string) {
  await getDb()
    .update(schema.affiliates)
    .set({ totalClicks: sql`total_clicks + 1` })
    .where(eq(schema.affiliates.referralCode, referralCode));
}

export async function getAffiliateClicks(referralCode: string, limit = 20) {
  return getDb()
    .select()
    .from(schema.affiliateClicks)
    .where(eq(schema.affiliateClicks.referralCode, referralCode))
    .orderBy(desc(schema.affiliateClicks.clickedAt))
    .limit(limit);
}

export async function processAffiliateCommission(
  referralCode: string,
  paymentAmount: number,
  paymentId: number
) {
  const db = getDb();
  const [affiliate] = await db
    .select()
    .from(schema.affiliates)
    .where(and(eq(schema.affiliates.referralCode, referralCode), eq(schema.affiliates.isActive, true)));

  if (!affiliate) return null;

  const commission = (paymentAmount * Number(affiliate.commissionRate)) / 100;

  await db.transaction(async (tx) => {
    // Credit reward balance
    const [wallet] = await tx
      .select()
      .from(schema.wallets)
      .where(eq(schema.wallets.userId, affiliate.userId));

    if (wallet) {
      await tx
        .update(schema.wallets)
        .set({ rewardBalance: sql`reward_balance + ${commission}` })
        .where(eq(schema.wallets.id, wallet.id));
      await tx
        .insert(schema.walletTransactions)
        .values({
          walletId: wallet.id,
          type: "reward",
          amount: commission.toString(),
          description: "Referral commission",
          reference: referralCode,
        });
    }

    // Update affiliate stats
    await tx
      .update(schema.affiliates)
      .set({
        totalPaid: sql`total_paid + 1`,
        totalRevenue: sql`total_revenue + ${paymentAmount}`,
      })
      .where(eq(schema.affiliates.referralCode, referralCode));

    // Mark click as converted
    await tx
      .update(schema.affiliateClicks)
      .set({ converted: true, paymentId })
      .where(
        and(
          eq(schema.affiliateClicks.referralCode, referralCode),
          eq(schema.affiliateClicks.converted, false)
        )
      );
  });

  return { commission, affiliateId: affiliate.id };
}

export async function getAffiliateLeaderboard(limit = 20) {
  return getDb()
    .select()
    .from(schema.affiliates)
    .orderBy(desc(schema.affiliates.totalRevenue))
    .limit(limit);
}

export async function toggleAffiliateStatus(referralCode: string, isActive: boolean) {
  await getDb()
    .update(schema.affiliates)
    .set({ isActive })
    .where(eq(schema.affiliates.referralCode, referralCode));
}

// Alias for pipeline compatibility
export async function trackAffiliateConversion(affiliateId: number, paymentId: number, amount: number) {
  const affiliate = await getDb()
    .select()
    .from(schema.affiliates)
    .where(eq(schema.affiliates.id, affiliateId))
    .limit(1);
  
  if (affiliate[0]) {
    await processAffiliateCommission(affiliate[0].referralCode, amount, paymentId);
  }
}
