import { eq, asc } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function getActiveFaqs() {
  return getDb()
    .select()
    .from(schema.faqs)
    .where(eq(schema.faqs.active, true))
    .orderBy(asc(schema.faqs.displayOrder));
}

export async function getAllFaqs() {
  return getDb()
    .select()
    .from(schema.faqs)
    .orderBy(asc(schema.faqs.displayOrder));
}

export async function createFaq(data: { question: string; answer: string; displayOrder?: number }) {
  await getDb()
    .insert(schema.faqs)
    .values(data);
  const rows = await getDb()
    .select()
    .from(schema.faqs)
    .where(eq(schema.faqs.question, data.question))
    .orderBy(asc(schema.faqs.id))
    .limit(1);
  return rows[0];
}

export async function updateFaq(id: number, data: Partial<{ question: string; answer: string; displayOrder: number; active: boolean }>) {
  await getDb()
    .update(schema.faqs)
    .set(data)
    .where(eq(schema.faqs.id, id));
}

export async function deleteFaq(id: number) {
  await getDb()
    .delete(schema.faqs)
    .where(eq(schema.faqs.id, id));
}

export async function getActivePartnerLogos() {
  return getDb()
    .select()
    .from(schema.partnerLogos)
    .where(eq(schema.partnerLogos.active, true))
    .orderBy(asc(schema.partnerLogos.displayOrder));
}

export async function getAllPartnerLogos() {
  return getDb()
    .select()
    .from(schema.partnerLogos)
    .orderBy(asc(schema.partnerLogos.displayOrder));
}

export async function createPartnerLogo(data: { name: string; logoUrl: string; url?: string; displayOrder?: number }) {
  await getDb()
    .insert(schema.partnerLogos)
    .values(data);
  const rows = await getDb()
    .select()
    .from(schema.partnerLogos)
    .where(eq(schema.partnerLogos.name, data.name))
    .orderBy(asc(schema.partnerLogos.id))
    .limit(1);
  return rows[0];
}

export async function updatePartnerLogo(id: number, data: Partial<{ name: string; logoUrl: string; url: string; displayOrder: number; active: boolean }>) {
  await getDb()
    .update(schema.partnerLogos)
    .set(data)
    .where(eq(schema.partnerLogos.id, id));
}

export async function deletePartnerLogo(id: number) {
  await getDb()
    .delete(schema.partnerLogos)
    .where(eq(schema.partnerLogos.id, id));
}
