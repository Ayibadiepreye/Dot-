import { getDb } from "../api/queries/connection";
import { events, faqs, partnerLogos } from "./schema";

async function seed() {
  const db = getDb();

  // ── Seed May 29 Launch Event ──
  await db.insert(events).values({
    title: "DOT Cohort I Launch",
    description: "Africa's Largest Builder Ecosystem — Cohort I Launch Event",
    venue: "Family Hall",
    startsAt: new Date("2026-05-29T09:00:00+01:00"),
    endsAt: new Date("2026-05-29T20:00:00+01:00"),
    isActive: true,
  });
  console.log("Seeded: May 29 event");

  // ── Seed FAQs ──
  await db.insert(faqs).values([
    {
      question: "What is DOT?",
      answer: "DOT (joindot.africa) is Africa's largest builder ecosystem — a membership platform connecting founders, creators, and entrepreneurs with resources, community, and funding pathways.",
      displayOrder: 1,
    },
    {
      question: "How does membership work?",
      answer: "Choose a tier that fits your goals — from Starter (₦30,000) to Hub Partner (₦300M). Each tier includes builder credits, community access via Whop, and exclusive benefits. Pay once and you're in for Cohort I.",
      displayOrder: 2,
    },
    {
      question: "What payment methods are accepted?",
      answer: "Nigerian members can pay via Paystack (bank transfer, card, USSD). International members can pay via Stripe with any major card. All transactions are secure and encrypted.",
      displayOrder: 3,
    },
    {
      question: "What is the refund policy?",
      answer: "Membership fees are non-refundable once paid, as they grant immediate access to digital credits and community resources. Contact support for exceptional circumstances.",
      displayOrder: 4,
    },
    {
      question: "How do I access the Whop community?",
      answer: "After payment, you'll receive an email with your Whop access link. Log in with your registered email and you'll see channels matching your tier — General, VIP, Founder, or Partner rooms.",
      displayOrder: 5,
    },
    {
      question: "What are Builder Credits?",
      answer: "Builder Credits are platform credits (not withdrawable cash) that you can use within the DOT ecosystem for programs, tools, and future features. Starter members get $2,000 credits; amounts increase by tier.",
      displayOrder: 6,
    },
    {
      question: "How does the affiliate program work?",
      answer: "Every member gets a unique referral link. When someone joins through your link, you earn a 10% commission credited to your reward balance. Commissions are paid out in Phase 2 of the platform rollout.",
      displayOrder: 7,
    },
    {
      question: "How do I attend the May 29 launch event?",
      answer: "All paid members receive a QR code ticket after payment. Show your QR code at the Family Hall entrance on May 29, 2026. The event runs from 9 AM to 8 PM WAT.",
      displayOrder: 8,
    },
  ]);
  console.log("Seeded: 8 FAQs");

  // ── Seed Partner Logos (placeholder) ──
  await db.insert(partnerLogos).values([
    { name: "Techstars", logoUrl: "https://via.placeholder.com/120x40/0d0d0d/ffffff?text=Techstars", url: "https://www.techstars.com", displayOrder: 1 },
    { name: "Y Combinator", logoUrl: "https://via.placeholder.com/120x40/0d0d0d/ffffff?text=Y+Combinator", url: "https://www.ycombinator.com", displayOrder: 2 },
    { name: "Google for Startups", logoUrl: "https://via.placeholder.com/120x40/0d0d0d/ffffff?text=Google", url: "https://startup.google.com", displayOrder: 3 },
    { name: "Paystack", logoUrl: "https://via.placeholder.com/120x40/0d0d0d/ffffff?text=Paystack", url: "https://paystack.com", displayOrder: 4 },
    { name: "Flutterwave", logoUrl: "https://via.placeholder.com/120x40/0d0d0d/ffffff?text=Flutterwave", url: "https://flutterwave.com", displayOrder: 5 },
  ]);
  console.log("Seeded: 5 partner logos");

  console.log("Seed complete!");
}

seed().catch(console.error);
