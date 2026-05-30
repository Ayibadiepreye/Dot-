import { findUserByEmail, updateUser, upsertUser } from "../queries/users";
import { findWalletByUserId, createWallet, addWalletCredits } from "../queries/wallets";
import { findPaymentById, updatePayment } from "../queries/payments";
import { createEventTicket, getActiveEvents } from "../queries/events";
import { findAffiliateByCode, trackAffiliateConversion } from "../queries/affiliates";
import { unlockAchievement } from "../queries/achievements";
import { sendPaymentSuccessEmail } from "./email";

// Tier credit mapping
const TIER_CREDITS: Record<string, number> = {
  starter: 2000,
  vip: 5000,
  pioneer: 500000,
  corporate: 1000000,
  hub_partner: 2000000,
};

/**
 * Main post-payment pipeline
 * Runs after payment is confirmed successful
 */
export async function runPostPaymentPipeline(paymentId: number) {
  console.log(`[Pipeline] Starting for payment ${paymentId}`);
  
  try {
    // 1. Get payment details
    const payment = await findPaymentById(paymentId);
    if (!payment) {
      throw new Error(`Payment ${paymentId} not found`);
    }

    // 2. Find or create user
    let user = await findUserByEmail(payment.email);
    
    if (!user) {
      console.log(`[Pipeline] Creating new user for ${payment.email}`);
      // Create user from payment
      await upsertUser({
        email: payment.email,
        name: payment.email.split("@")[0], // Use email prefix as name
        phone: payment.phone,
        tier: payment.tier,
        hasPaid: true,
        emailVerified: false,
        referralCode: "", // Auto-generated
        lastSignInAt: new Date(),
      } as any);
      
      user = await findUserByEmail(payment.email);
      if (!user) {
        throw new Error("Failed to create user");
      }
    } else {
      console.log(`[Pipeline] User exists, updating ${user.id}`);
      // Update existing user
      await updateUser(user.id, {
        hasPaid: true,
        tier: payment.tier,
        phone: payment.phone || user.phone,
      });
    }

    // 3. Link payment to user
    await updatePayment(payment.id, { userId: user.id });

    // 4. Create or get wallet
    let wallet = await findWalletByUserId(user.id);
    if (!wallet) {
      console.log(`[Pipeline] Creating wallet for user ${user.id}`);
      wallet = await createWallet(user.id);
    }

    // 5. Add credits based on tier
    const credits = TIER_CREDITS[payment.tier] || 0;
    if (credits > 0) {
      console.log(`[Pipeline] Adding ${credits} credits to wallet ${wallet.id}`);
      await addWalletCredits(wallet.id, credits, `${payment.tier} tier purchase`);
    }

    // 6. Generate event ticket
    const events = await getActiveEvents();
    if (events.length > 0) {
      console.log(`[Pipeline] Creating ticket for event ${events[0].id}`);
      const qrCode = `DOT-${user.id}-${events[0].id}-${Date.now()}`;
      await createEventTicket({
        userId: user.id,
        eventId: events[0].id,
        paymentId: payment.id,
        qrCode,
      });
    }

    // 7. Track affiliate conversion
    if (payment.affiliateCode) {
      console.log(`[Pipeline] Tracking affiliate conversion for ${payment.affiliateCode}`);
      const affiliate = await findAffiliateByCode(payment.affiliateCode);
      if (affiliate) {
        await trackAffiliateConversion(affiliate.id, payment.id, payment.amount);
      }
    }

    // 8. Unlock achievement
    console.log(`[Pipeline] Unlocking first_payment achievement`);
    await unlockAchievement(user.id, "first_payment").catch(() => {
      // Achievement might not exist yet, ignore error
    });

    // 9. Send payment success email
    console.log(`[Pipeline] Sending payment success email`);
    await sendPaymentSuccessEmail(
      user.email,
      user.name || "Member",
      payment.tier,
      credits,
      qrCode || "N/A"
    );

    console.log(`[Pipeline] Completed successfully for payment ${paymentId}`);
    
    return { success: true, userId: user.id };
  } catch (error) {
    console.error(`[Pipeline] Error for payment ${paymentId}:`, error);
    throw error;
  }
}
