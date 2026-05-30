import { eq, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createWallet(userId: number) {
  await getDb()
    .insert(schema.wallets)
    .values({ userId });
  // Fetch the created wallet
  const rows = await getDb()
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.userId, userId))
    .limit(1);
  return rows[0];
}

export async function findWalletByUserId(userId: number) {
  const rows = await getDb()
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.userId, userId))
    .limit(1);
  return rows.at(0);
}

export async function findWalletById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.wallets)
    .where(eq(schema.wallets.id, id))
    .limit(1);
  return rows.at(0);
}

export async function creditWallet(walletId: number, amount: number, description: string, reference?: string) {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx
      .insert(schema.walletTransactions)
      .values({ walletId, type: "credit", amount: amount.toString(), description, reference });
    await tx
      .update(schema.wallets)
      .set({
        creditBalance: sql`credit_balance + ${amount}`,
        lifetimeCredits: sql`lifetime_credits + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.wallets.id, walletId));
  });
}

// Alias for pipeline compatibility
export const addWalletCredits = creditWallet;

export async function rewardWallet(walletId: number, amount: number, description: string, reference?: string) {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx
      .insert(schema.walletTransactions)
      .values({ walletId, type: "reward", amount: amount.toString(), description, reference });
    await tx
      .update(schema.wallets)
      .set({
        rewardBalance: sql`reward_balance + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(schema.wallets.id, walletId));
  });
}

export async function incrementReputation(walletId: number, points: number) {
  await getDb()
    .update(schema.wallets)
    .set({
      reputationScore: sql`reputation_score + ${points}`,
      updatedAt: new Date(),
    })
    .where(eq(schema.wallets.id, walletId));
}

export async function getWalletTransactions(walletId: number, page: number, limit: number) {
  return getDb()
    .select()
    .from(schema.walletTransactions)
    .where(eq(schema.walletTransactions.walletId, walletId))
    .orderBy(desc(schema.walletTransactions.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}
