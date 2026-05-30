import { eq, like, or, and, desc, count } from "drizzle-orm";
import * as schema from "@db/schema";
import type { InsertUser } from "@db/schema";
import { getDb } from "./connection";
import { env } from "../lib/env";

export async function findUserByUnionId(unionId: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.unionId, unionId))
    .limit(1);
  return rows.at(0);
}

export async function findUserById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1);
  return rows.at(0);
}

export async function findUserByEmail(email: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return rows.at(0);
}

export async function findUserByReferralCode(code: string) {
  const rows = await getDb()
    .select()
    .from(schema.users)
    .where(eq(schema.users.referralCode, code))
    .limit(1);
  return rows.at(0);
}

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function upsertUser(data: InsertUser) {
  const values = { ...data };
  const updateSet: Partial<InsertUser> = {
    lastSignInAt: new Date(),
    ...data,
  };

  // Auto-generate referral code if not provided
  if (!values.referralCode) {
    values.referralCode = generateReferralCode();
  }

  // unionId is now optional (only for legacy Kimi users)
  if (values.unionId && values.role === undefined && values.unionId === env.ownerUnionId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  await getDb()
    .insert(schema.users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  await getDb()
    .update(schema.users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.users.id, id));
}

export async function updateUserWallet(userId: number, walletId: number) {
  await getDb()
    .update(schema.users)
    .set({ walletId, updatedAt: new Date() })
    .where(eq(schema.users.id, userId));
}

export async function searchUsers(opts: {
  search?: string;
  tier?: string;
  role?: string;
  page: number;
  limit: number;
}) {
  const { search, tier, role, page, limit } = opts;
  const db = getDb();
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(schema.users.name, `%${search}%`),
        like(schema.users.email, `%${search}%`),
        like(schema.users.phone, `%${search}%`),
        like(schema.users.referralCode, `%${search}%`)
      )
    );
  }
  if (tier) conditions.push(eq(schema.users.tier, tier as any));
  if (role) conditions.push(eq(schema.users.role, role as any));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(schema.users)
      .where(where)
      .orderBy(desc(schema.users.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    db.select({ count: count() }).from(schema.users).where(where),
  ]);

  return { rows, total: totalResult[0].count };
}
