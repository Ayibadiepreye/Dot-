import { eq, desc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createAchievement(userId: number, type: string, label: string, icon?: string) {
  await getDb()
    .insert(schema.achievements)
    .values({ userId, type, label, icon });
  const rows = await getDb()
    .select()
    .from(schema.achievements)
    .where(eq(schema.achievements.userId, userId))
    .orderBy(desc(schema.achievements.id))
    .limit(1);
  return rows[0];
}

export async function getUserAchievements(userId: number) {
  return getDb()
    .select()
    .from(schema.achievements)
    .where(eq(schema.achievements.userId, userId))
    .orderBy(desc(schema.achievements.unlockedAt));
}

export async function hasAchievement(userId: number, type: string) {
  const rows = await getDb()
    .select()
    .from(schema.achievements)
    .where(eq(schema.achievements.userId, userId));
  return rows.some(a => a.type === type);
}

// Unlock achievement helper
export async function unlockAchievement(userId: number, type: string) {
  const exists = await hasAchievement(userId, type);
  if (!exists) {
    const labels: Record<string, string> = {
      first_payment: "First Payment",
      early_bird: "Early Bird",
      referral_master: "Referral Master",
    };
    await createAchievement(userId, type, labels[type] || type);
  }
}
