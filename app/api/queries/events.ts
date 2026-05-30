import { eq, and, desc, sql } from "drizzle-orm";
import * as schema from "@db/schema";
import { getDb } from "./connection";

export async function getActiveEvents() {
  return getDb()
    .select()
    .from(schema.events)
    .where(eq(schema.events.isActive, true))
    .orderBy(desc(schema.events.startsAt));
}

export async function findEventById(id: number) {
  const rows = await getDb()
    .select()
    .from(schema.events)
    .where(eq(schema.events.id, id))
    .limit(1);
  return rows.at(0);
}

export async function createEventTicket(data: {
  eventId: number;
  userId: number;
  paymentId?: number;
  qrCode: string;
  qrUrl?: string;
}) {
  await getDb()
    .insert(schema.eventTickets)
    .values(data);
  const rows = await getDb()
    .select()
    .from(schema.eventTickets)
    .where(
      and(
        eq(schema.eventTickets.eventId, data.eventId),
        eq(schema.eventTickets.userId, data.userId)
      )
    )
    .limit(1);
  return rows[0];
}

export async function findTicketByQrCode(qrCode: string) {
  const rows = await getDb()
    .select()
    .from(schema.eventTickets)
    .where(eq(schema.eventTickets.qrCode, qrCode))
    .limit(1);
  return rows.at(0);
}

export async function findTicketByUserAndEvent(userId: number, eventId: number) {
  const rows = await getDb()
    .select()
    .from(schema.eventTickets)
    .where(
      and(
        eq(schema.eventTickets.userId, userId),
        eq(schema.eventTickets.eventId, eventId)
      )
    )
    .limit(1);
  return rows.at(0);
}

export async function markTicketCheckedIn(qrCode: string, checkedInBy: number) {
  await getDb()
    .update(schema.eventTickets)
    .set({
      checkedIn: true,
      checkedInAt: new Date(),
      checkedInBy,
    })
    .where(eq(schema.eventTickets.qrCode, qrCode));
}

export async function getCheckinCount() {
  const result = await getDb()
    .select({ count: sql<number>`count(*)` })
    .from(schema.eventTickets)
    .where(eq(schema.eventTickets.checkedIn, true));
  return Number(result[0].count);
}
