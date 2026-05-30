import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || "DOT Platform <noreply@joindot.africa>";

/**
 * Send payment success email with ticket details
 */
export async function sendPaymentSuccessEmail(
  email: string,
  name: string,
  tier: string,
  credits: number,
  qrCode: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "🎉 Payment Successful - Welcome to DOT Platform!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to DOT Platform!</h1>
              <p>Your payment was successful</p>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining DOT Platform! Your payment has been processed successfully, and you now have full access to all features.</p>
              
              <div class="details">
                <h3>Your Account Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Tier:</span>
                  <span>${tier.toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Credits:</span>
                  <span>${credits.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Event Ticket:</span>
                  <span>${qrCode}</span>
                </div>
              </div>

              <p>You can now:</p>
              <ul>
                <li>Access your dashboard and all features</li>
                <li>Use your ${credits.toLocaleString()} credits</li>
                <li>View your event ticket with QR code</li>
                <li>Refer friends and earn commissions</li>
              </ul>

              <center>
                <a href="${process.env.APP_URL || 'https://joindot.africa'}/dashboard" class="button">
                  Go to Dashboard
                </a>
              </center>

              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Welcome aboard! 🚀</p>
              <p>The DOT Platform Team</p>
            </div>
            <div class="footer">
              <p>© 2026 DOT Platform. All rights reserved.</p>
              <p>Africa's Largest Builder Ecosystem</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[Email] Payment success email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send payment success email:", error);
    // Don't throw - email failure shouldn't break pipeline
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to DOT Platform! 👋",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Welcome to DOT Platform!</h1>
              <p>Africa's Largest Builder Ecosystem</p>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Welcome to DOT Platform! We're excited to have you join our community of builders, creators, and innovators across Africa.</p>
              
              <p><strong>Next Steps:</strong></p>
              <ol>
                <li>Complete your payment to unlock full access</li>
                <li>Get your event ticket for May 29, 2026</li>
                <li>Start building with your credits</li>
                <li>Connect with other builders</li>
              </ol>

              <center>
                <a href="${process.env.APP_URL || 'https://joindot.africa'}/join" class="button">
                  Complete Payment
                </a>
              </center>

              <p>If you have any questions, our support team is here to help!</p>
              
              <p>Let's build together! 🚀</p>
              <p>The DOT Platform Team</p>
            </div>
            <div class="footer">
              <p>© 2026 DOT Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[Email] Welcome email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
    return { success: false, error };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
) {
  try {
    const resetUrl = `${process.env.APP_URL || 'https://joindot.africa'}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password - DOT Platform",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Reset Your Password</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>We received a request to reset your password for your DOT Platform account.</p>
              
              <center>
                <a href="${resetUrl}" class="button">
                  Reset Password
                </a>
              </center>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>

              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This link expires in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password won't change until you create a new one</li>
                </ul>
              </div>

              <p>If you have any questions, contact our support team.</p>
              
              <p>Stay secure! 🔒</p>
              <p>The DOT Platform Team</p>
            </div>
            <div class="footer">
              <p>© 2026 DOT Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[Email] Password reset email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
    return { success: false, error };
  }
}

/**
 * Send email verification email
 */
export async function sendEmailVerification(
  email: string,
  name: string,
  verificationToken: string
) {
  try {
    const verifyUrl = `${process.env.APP_URL || 'https://joindot.africa'}/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Verify Your Email - DOT Platform",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thanks for signing up for DOT Platform! Please verify your email address to complete your registration.</p>
              
              <center>
                <a href="${verifyUrl}" class="button">
                  Verify Email Address
                </a>
              </center>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verifyUrl}</p>

              <p>This link expires in 24 hours.</p>

              <p>If you didn't create an account, you can safely ignore this email.</p>
              
              <p>Welcome aboard! 🚀</p>
              <p>The DOT Platform Team</p>
            </div>
            <div class="footer">
              <p>© 2026 DOT Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("[Email] Verification email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send verification email:", error);
    return { success: false, error };
  }
}
