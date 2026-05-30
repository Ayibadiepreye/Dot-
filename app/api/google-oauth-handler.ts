import type { Context } from "hono";
import { exchangeGoogleCode, getGoogleUserInfo, createSession } from "./kimi/auth";
import { findUserByEmail, upsertUser } from "./queries/users";
import { sendWelcomeEmail } from "./lib/email";

export function createGoogleOAuthCallbackHandler() {
  return async (c: Context) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    const error = c.req.query("error");

    if (error) {
      console.error("[Google OAuth] Error:", error);
      return c.redirect("/?error=oauth_failed", 302);
    }

    if (!code) {
      return c.json({ error: "Authorization code is required" }, 400);
    }

    try {
      // Exchange code for tokens
      const redirectUri = state ? atob(state) : `${c.req.url.split("?")[0]}`;
      const tokens = await exchangeGoogleCode(code, redirectUri);

      // Get user info from Google
      const googleUser = await getGoogleUserInfo(tokens.access_token);

      // Find or create user
      let user = await findUserByEmail(googleUser.email);
      let isNewUser = false;

      if (!user) {
        isNewUser = true;
        // Create new user
        await upsertUser({
          name: googleUser.name,
          email: googleUser.email,
          avatar: googleUser.picture,
          emailVerified: googleUser.verified_email,
          hasPaid: false,
          referralCode: "", // Auto-generated
          lastSignInAt: new Date(),
        } as any);

        user = await findUserByEmail(googleUser.email);
        if (!user) {
          throw new Error("Failed to create user");
        }

        // Send welcome email for new users (don't await)
        sendWelcomeEmail(user.email, user.name || "Member").catch((err) => {
          console.error("[Google OAuth] Failed to send welcome email:", err);
        });
      } else {
        // Update existing user
        await upsertUser({
          ...user,
          avatar: googleUser.picture,
          lastSignInAt: new Date(),
        } as any);
      }

      // Create session
      await createSession(c, user.id, user.email);

      // Redirect to dashboard
      return c.redirect("/dashboard", 302);
    } catch (err) {
      console.error("[Google OAuth] Callback failed:", err);
      return c.redirect("/?error=oauth_failed", 302);
    }
  };
}
