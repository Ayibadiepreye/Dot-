import {
  mysqlTable,
  mysqlEnum,
  varchar,
  text,
  timestamp,
  bigint,
  decimal,
  json,
  boolean,
  int,
  unique,
} from "drizzle-orm/mysql-core";

// Helper for auto-increment PK
const id = () => bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey();

// ── 1. users — core member profile ──────────────────────────────────────────
export const users = mysqlTable("users", {
  id: id(),
  unionId: varchar("unionId", { length: 255 }).unique(), // Now optional (for legacy Kimi users)
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }), // For email/password login
  phone: varchar("phone", { length: 30 }).unique(),
  country: varchar("country", { length: 100 }),
  state: varchar("state", { length: 100 }),
  school: varchar("school", { length: 255 }),
  organizationId: bigint("organization_id", { mode: "number", unsigned: true }),
  tier: mysqlEnum("tier", ["starter", "vip", "pioneer", "corporate", "hub_partner"]).notNull().default("starter"),
  referralCode: varchar("referral_code", { length: 16 }).notNull().unique(),
  referredBy: varchar("referred_by", { length: 16 }),
  walletId: bigint("wallet_id", { mode: "number", unsigned: true }),
  whopId: varchar("whop_id", { length: 255 }),
  whopEmail: varchar("whop_email", { length: 320 }),
  builderScore: int("builder_score").default(0),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["member", "org_admin", "ops", "admin", "super_admin"]).default("member").notNull(),
  onboarded: boolean("onboarded").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  emailVerified: boolean("email_verified").default(false),
  hasPaid: boolean("has_paid").default(false),
  bannedUntil: timestamp("banned_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Auth sessions ─────────────────────────────────────────────────────────────
export const authSessions = mysqlTable("auth_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── OAuth connections (Google, etc.) ──────────────────────────────────────────
export const oauthConnections = mysqlTable("oauth_connections", {
  id: id(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(), // 'google'
  providerUserId: varchar("provider_user_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.provider, t.providerUserId)]);

// ── 2. wallets — one per user ─────────────────────────────────────────────
export const wallets = mysqlTable("wallets", {
  id: id(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().unique(),
  creditBalance: decimal("credit_balance", { precision: 15, scale: 2 }).default("0"),
  rewardBalance: decimal("reward_balance", { precision: 15, scale: 2 }).default("0"),
  reputationScore: int("reputation_score").default(0),
  lifetimeCredits: decimal("lifetime_credits", { precision: 15, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Wallet = typeof wallets.$inferSelect;

// ── 3. wallet_transactions — immutable log ────────────────────────────────
export const walletTransactions = mysqlTable("wallet_transactions", {
  id: id(),
  walletId: bigint("wallet_id", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["credit", "debit", "reward", "adjustment"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  reference: varchar("reference", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── 4. payments — payment records ─────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: id(),
  userId: bigint("user_id", { mode: "number", unsigned: true }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  tier: mysqlEnum("tier", ["starter", "vip", "pioneer", "corporate", "hub_partner"]).notNull(),
  currency: mysqlEnum("currency", ["NGN", "USD", "GBP", "EUR"]).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  provider: mysqlEnum("provider", ["paystack", "stripe"]).notNull(),
  providerRef: varchar("provider_ref", { length: 255 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "success", "failed", "refunded"]).notNull().default("pending"),
  affiliateCode: varchar("affiliate_code", { length: 16 }),
  metadata: json("metadata"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── 5. organizations ──────────────────────────────────────────────────────
export const organizations = mysqlTable("organizations", {
  id: id(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  contactEmail: varchar("contact_email", { length: 320 }),
  country: varchar("country", { length: 100 }),
  logoUrl: text("logo_url"),
  referralCode: varchar("referral_code", { length: 16 }).notNull().unique(),
  revenueTotal: decimal("revenue_total", { precision: 15, scale: 2 }).default("0"),
  status: mysqlEnum("status", ["active", "suspended", "pending"]).default("pending").notNull(),
  approvedBy: bigint("approved_by", { mode: "number", unsigned: true }),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── 6. affiliates ─────────────────────────────────────────────────────────
export const affiliates = mysqlTable("affiliates", {
  id: id(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull().unique(),
  referralCode: varchar("referral_code", { length: 16 }).notNull().unique(),
  totalClicks: int("total_clicks").default(0),
  totalSignups: int("total_signups").default(0),
  totalPaid: int("total_paid").default(0),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default("0"),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("10.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── 7. affiliate_clicks ───────────────────────────────────────────────────
export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: id(),
  referralCode: varchar("referral_code", { length: 16 }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  deviceHash: varchar("device_hash", { length: 64 }),
  converted: boolean("converted").default(false),
  paymentId: bigint("payment_id", { mode: "number", unsigned: true }),
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
});

// ── 8. achievements ───────────────────────────────────────────────────────
export const achievements = mysqlTable("achievements", {
  id: id(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 50 }),
  unlockedAt: timestamp("unlocked_at").defaultNow().notNull(),
});

// ── 9. events ─────────────────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: id(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  venue: varchar("venue", { length: 255 }).notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── 10. event_tickets ─────────────────────────────────────────────────────
export const eventTickets = mysqlTable("event_tickets", {
  id: id(),
  eventId: bigint("event_id", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  paymentId: bigint("payment_id", { mode: "number", unsigned: true }),
  qrCode: varchar("qr_code", { length: 20 }).notNull(),
  qrUrl: text("qr_url"),
  checkedIn: boolean("checked_in").default(false),
  checkedInAt: timestamp("checked_in_at"),
  checkedInBy: bigint("checked_in_by", { mode: "number", unsigned: true }),
  badgeIssued: boolean("badge_issued").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [unique().on(t.eventId, t.userId)]);

// ── 11. partner_logos ─────────────────────────────────────────────────────
export const partnerLogos = mysqlTable("partner_logos", {
  id: id(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url").notNull(),
  url: text("url"),
  displayOrder: int("display_order").default(0),
  active: boolean("active").default(true),
});

// ── 12. faqs ──────────────────────────────────────────────────────────────
export const faqs = mysqlTable("faqs", {
  id: id(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  displayOrder: int("display_order").default(0),
  active: boolean("active").default(true),
});

// ── 13. whop_pending — retry queue ────────────────────────────────────────
export const whopPending = mysqlTable("whop_pending", {
  id: id(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).notNull(),
  tier: mysqlEnum("tier", ["starter", "vip", "pioneer", "corporate", "hub_partner"]).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  attempts: int("attempts").default(0),
  lastError: text("last_error"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
