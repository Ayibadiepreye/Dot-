export const Session = {
  cookieName: "dot_sid",
  maxAgeMs: 365 * 24 * 60 * 60 * 1000,
} as const;

export const ErrorMessages = {
  unauthenticated: "Authentication required",
  insufficientRole: "Insufficient permissions",
  phoneVerificationRequired: "Please verify your phone number to access this feature",
  paymentFailed: "Payment processing failed",
  invalidToken: "Invalid or expired token",
} as const;

export const Paths = {
  login: "/login",
  oauthCallback: "/api/oauth/callback",
} as const;

// ── DOT Platform Constants ──────────────────────────────────────────────────

export const TIER_CREDITS = {
  starter: 2000,
  vip: 5000,
  pioneer: 10000,
  corporate: 50000,
  hub_partner: 200000,
} as const;

export const TIER_PRICES_NGN = {
  starter: 30000,
  vip: 1000000,
  pioneer: 3000000,
  corporate: 30000000,
  hub_partner: 300000000,
} as const;

export const TIER_PRICES_USD = {
  starter: 20,
  vip: 650,
  pioneer: 2000,
  corporate: 20000,
  hub_partner: 200000,
} as const;

export const TIER_LABELS: Record<string, string> = {
  starter: "Starter",
  vip: "VIP",
  pioneer: "Pioneer",
  corporate: "Corporate",
  hub_partner: "Hub Partner",
} as const;

export const REPUTATION_EVENTS = {
  account_created: 100,
  onboarding_completed: 50,
  first_referral_click: 10,
  referral_converts: 200,
  attended_launch_event: 150,
  every_5_paid_referrals: 500,
} as const;

export const COMMISSION_RATE_DEFAULT = 10; // percent

export const REFERRAL_COOKIE_NAME = "dot_ref";
export const REFERRAL_COOKIE_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

export const MAY_29_EVENT_DATE = new Date("2026-05-29T09:00:00.000+01:00");
export const MAY_29_EVENT_VENUE = "Family Hall";

// ── Rate Limits ──
export const RATE_LIMIT_PAYMENT_INITIATE = 5; // per minute per IP

// ── Affiliate ──
export const AFFILIATE_ACHIEVEMENT_THRESHOLDS = [1, 5, 10, 25, 50, 100];
