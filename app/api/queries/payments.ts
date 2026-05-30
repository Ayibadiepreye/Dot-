import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function createPayment(data: {
  userId?: number;
  email: string;
  phone?: string;
  tier: string;
  currency: string;
  amount: number;
  provider: string;
  providerRef: string;
  affiliateCode?: string;
  metadata?: any;
}) {
  await getDb()
    .insert(schema.payments)
    .values({
      userId: data.userId,
      email: data.email,
      phone: data.phone,
      tier: data.tier as any,
      currency: data.currency as any,
      amount: data.amount.toString(),
      provider: data.provider as any,
      providerRef: data.providerRef,
      affiliateCode: data.affiliateCode,
      metadata: data.metadata,
    });
  const rows = await getDb()
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.providerRef, data.providerRef))
    .limit(1);
  return rows[0];
}

export async function findPaymentByProviderRef(provider: string, providerRef: string) {
  const rows = await getDb()
    .select()
    .from(schema.payments)
    .where(
      and(
        eq(schema.payments.provider, provider as any),
        eq(schema.payments.providerRef, providerRef)
      )
    )
    .limit(1);
  return rows.at(0);
}

export async function findPaymentById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.payments)
    .where(eq(schema.payments.id, id))
    .limit(1);
  return rows.at(0);
}

export async function markPaymentSuccess(id: number, userId?: number) {
  await getDb()
    .update(schema.payments)
    .set({ status: "success" as any, userId, paidAt: new Date() })
    .where(eq(schema.payments.id, id));
}

export async function updatePayment(id: number, data: Partial<{ userId: number; status: string }>) {
  await getDb()
    .update(schema.payments)
    .set(data as any)
    .where(eq(schema.payments.id, id));
}

export async function getPayments(opts: {
  status?: string;
  provider?: string;
  tier?: string;
  page: number;
  limit: number;
}) {
  const { status, provider, tier, page, limit } = opts;
  const conditions = [];
  if (status) conditions.push(eq(schema.payments.status, status as any));
  if (provider) conditions.push(eq(schema.payments.provider, provider as any));
  if (tier) conditions.push(eq(schema.payments.tier, tier as any));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return getDb()
    .select()
    .from(schema.payments)
    .where(where)
    .orderBy(desc(schema.payments.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}

export async function getPaymentStats() {
  const db = getDb();
  const [totalRevenue, ngnRevenue, usdRevenue] = await Promise.all([
    db
      .select({ total: sql<number>`COALESCE(SUM(${schema.payments.amount}), 0)` })
      .from(schema.payments)
      .where(eq(schema.payments.status, "success")),
    db
      .select({ total: sql<number>`COALESCE(SUM(${schema.payments.amount}), 0)` })
      .from(schema.payments)
      .where(and(eq(schema.payments.status, "success"), eq(schema.payments.currency, "NGN"))),
    db
      .select({ total: sql<number>`COALESCE(SUM(${schema.payments.amount}), 0)` })
      .from(schema.payments)
      .where(and(eq(schema.payments.status, "success"), eq(schema.payments.currency, "USD"))),
  ]);
  return {
    totalRevenue: Number(totalRevenue[0].total),
    ngnRevenue: Number(ngnRevenue[0].total),
    usdRevenue: Number(usdRevenue[0].total),
  };
}
