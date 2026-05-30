import { ErrorMessages } from "@contracts/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const createRouter = t.router;
export const publicQuery = t.procedure;
export const publicMutation = t.procedure;

const requireAuth = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.unauthenticated,
    });
  }
  // Check if user is banned
  if (ctx.user.bannedUntil && new Date(ctx.user.bannedUntil) > new Date()) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Account banned" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

function requireRole(roles: string[]) {
  return t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || !roles.includes(ctx.user.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: ErrorMessages.insufficientRole,
      });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
  });
}

// ── Role-based procedures ──
export const authedQuery = t.procedure.use(requireAuth);

// Payment check middleware
const requirePayment = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user?.hasPaid) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Payment required to access this feature",
    });
  }
  return next({ ctx });
});

// Paid user procedure (requires authentication + payment)
export const paidQuery = authedQuery.use(requirePayment);

// Admin + super_admin
export const adminQuery = authedQuery.use(requireRole(["admin", "super_admin"]));

// Ops + admin + super_admin (for event check-in)
export const opsQuery = authedQuery.use(requireRole(["ops", "admin", "super_admin"]));

// Org admin + admin + super_admin
export const orgAdminQuery = authedQuery.use(requireRole(["org_admin", "admin", "super_admin"]));
