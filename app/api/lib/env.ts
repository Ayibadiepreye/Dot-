import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

function optional(name: string): string | undefined {
  return process.env[name] || undefined;
}

export const env = {
  // ── App ──
  isProduction: process.env.NODE_ENV === "production",
  appUrl: required("APP_URL"),

  // ── Database ──
  databaseUrl: required("DATABASE_URL"),

  // ── Better Auth ──
  betterAuthSecret: required("BETTER_AUTH_SECRET"),
  betterAuthUrl: optional("BETTER_AUTH_URL") ?? required("APP_URL"),

  // ── Google OAuth ──
  googleClientId: required("GOOGLE_CLIENT_ID"),
  googleClientSecret: required("GOOGLE_CLIENT_SECRET"),

  // ── Legacy (for migration) ──
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",

  // ── Paystack ──
  paystackPublicKey: optional("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"),
  paystackSecretKey: required("PAYSTACK_SECRET_KEY"),

  // ── Stripe ──
  stripePublishableKey: optional("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),
  stripeSecretKey: required("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: required("STRIPE_WEBHOOK_SECRET"),

  // ── Whop ──
  whopApiKey: required("WHOP_API_KEY"),
  whopPlanStarter: required("WHOP_PLAN_STARTER"),
  whopPlanVip: required("WHOP_PLAN_VIP"),
  whopPlanPioneer: required("WHOP_PLAN_PIONEER"),
  whopPlanCorporate: required("WHOP_PLAN_CORPORATE"),
  whopPlanHub: required("WHOP_PLAN_HUB"),

  // ── Cloudflare R2 ──
  r2AccountId: required("R2_ACCOUNT_ID"),
  r2AccessKeyId: required("R2_ACCESS_KEY_ID"),
  r2SecretAccessKey: required("R2_SECRET_ACCESS_KEY"),
  r2BucketName: required("R2_BUCKET_NAME"),
  r2PublicUrl: required("R2_PUBLIC_URL"),

  // ── Resend (Email) ──
  resendApiKey: required("RESEND_API_KEY"),
  emailFrom: required("EMAIL_FROM"),

  // ── Twilio / WhatsApp ──
  twilioAccountSid: optional("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: optional("TWILIO_AUTH_TOKEN"),
  whatsappFromNumber: optional("WHATSAPP_FROM_NUMBER"),

  // ── PostHog ──
  posthogKey: optional("NEXT_PUBLIC_POSTHOG_KEY"),
  posthogHost: optional("NEXT_PUBLIC_POSTHOG_HOST") ?? "https://app.posthog.com",

  // ── Upstash (Rate Limiting) ──
  upstashRedisRestUrl: required("UPSTASH_REDIS_REST_URL"),
  upstashRedisRestToken: required("UPSTASH_REDIS_REST_TOKEN"),

  // ── Event ──
  may29EventId: optional("MAY_29_EVENT_ID"),

  // ── Cron ──
  cronSecret: required("CRON_SECRET"),
};
