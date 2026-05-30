import { relations } from "drizzle-orm";
import {
  users,
  wallets,
  walletTransactions,
  payments,
  organizations,
  affiliates,
  affiliateClicks,
  achievements,
  events,
  eventTickets,
  whopPending,
} from "./schema";

export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, { fields: [users.id], references: [wallets.userId] }),
  organization: one(organizations, { fields: [users.organizationId], references: [organizations.id] }),
  affiliate: one(affiliates, { fields: [users.id], references: [affiliates.userId] }),
  achievements: many(achievements),
  eventTickets: many(eventTickets),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(users, { fields: [wallets.userId], references: [users.id] }),
  transactions: many(walletTransactions),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  wallet: one(wallets, { fields: [walletTransactions.walletId], references: [wallets.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(users),
}));

export const affiliatesRelations = relations(affiliates, ({ one }) => ({
  user: one(users, { fields: [affiliates.userId], references: [users.id] }),
}));

export const affiliateClicksRelations = relations(affiliateClicks, ({ one }) => ({
  payment: one(payments, { fields: [affiliateClicks.paymentId], references: [payments.id] }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, { fields: [achievements.userId], references: [users.id] }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  tickets: many(eventTickets),
}));

export const eventTicketsRelations = relations(eventTickets, ({ one }) => ({
  event: one(events, { fields: [eventTickets.eventId], references: [events.id] }),
  user: one(users, { fields: [eventTickets.userId], references: [users.id] }),
}));

export const whopPendingRelations = relations(whopPending, ({ one }) => ({
  user: one(users, { fields: [whopPending.userId], references: [users.id] }),
}));
