import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery, publicMutation, authedQuery } from "./middleware";
import { findWalletByUserId } from "./queries/wallets";
import { findUserByEmail, upsertUser } from "./queries/users";
import { hashPassword, verifyPassword } from "./lib/password";
import { createSession, clearSession } from "./kimi/auth";
import { sendWelcomeEmail } from "./lib/email";
import * as cookie from "cookie";

export const authRouter = createRouter({
  // Get current user
  me: authedQuery.query(async (opts) => {
    const user = opts.ctx.user;
    const wallet = await findWalletByUserId(user.id);
    return { ...user, wallet: wallet ?? null };
  }),

  // Sign up with email/password
  signup: publicMutation
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        phone: z.string().optional(),
        country: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already exists
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      await upsertUser({
        name: input.name,
        email: input.email,
        passwordHash,
        phone: input.phone,
        country: input.country,
        referralCode: "", // Auto-generated in upsertUser
        emailVerified: false,
        hasPaid: false,
        lastSignInAt: new Date(),
      } as any);

      // Get the created user
      const user = await findUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      // Create session
      await createSession(ctx as any, user.id, user.email);

      // Send welcome email (don't await - don't block signup)
      sendWelcomeEmail(user.email, user.name || "Member").catch((err) => {
        console.error("[Signup] Failed to send welcome email:", err);
      });

      return { success: true, user: { id: user.id, email: user.email, name: user.name } };
    }),

  // Sign in with email/password
  signin: publicMutation
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Find user
      const user = await findUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Verify password
      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      // Create session
      await createSession(ctx as any, user.id, user.email);

      return { success: true, user: { id: user.id, email: user.email, name: user.name } };
    }),

  // Logout
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),

  // Set password (for Google OAuth users who want to add password login)
  setPassword: authedQuery
    .input(
      z.object({
        newPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(ctx.user.email);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if user already has a password
      if (user.passwordHash) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Password already set. Use change password instead.",
        });
      }

      // Hash new password
      const passwordHash = await hashPassword(input.newPassword);

      // Update user with password
      await upsertUser({
        ...user,
        passwordHash,
      } as any);

      return { success: true };
    }),

  // Change password (for users who already have a password)
  changePassword: authedQuery
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(ctx.user.email);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if user has a password
      if (!user.passwordHash) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No password set. Use set password instead.",
        });
      }

      // Verify current password
      const valid = await verifyPassword(input.currentPassword, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const passwordHash = await hashPassword(input.newPassword);

      // Update user with new password
      await upsertUser({
        ...user,
        passwordHash,
      } as any);

      return { success: true };
    }),
});
