import { z } from "zod";
import { createRouter, adminQuery } from "../middleware";
import { findTicketByQrCode, markTicketCheckedIn } from "../queries/events";
import { findUserById } from "../queries/users";
import { findWalletByUserId, incrementReputation } from "../queries/wallets";
import { createAchievement } from "../queries/achievements";
import { TRPCError } from "@trpc/server";

export const checkinRouter = createRouter({
  scan: adminQuery
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await findTicketByQrCode(input.token);
      if (!ticket) {
        throw new TRPCError({ code: "NOT_FOUND", message: "INVALID_TOKEN" });
      }
      if (ticket.checkedIn) {
        return {
          error: "ALREADY_CHECKED_IN",
          checkedInAt: ticket.checkedInAt,
        };
      }

      await markTicketCheckedIn(input.token, ctx.user.id);

      // Award reputation +150
      const wallet = await findWalletByUserId(ticket.userId);
      if (wallet) {
        await incrementReputation(wallet.id, 150);
      }

      // Grant achievement
      await createAchievement(ticket.userId, "launch_event_attendee", "Launch Event Attendee", "🎟️");

      const user = await findUserById(ticket.userId);
      return {
        success: true,
        user: {
          name: user?.name ?? "Unknown",
          tier: user?.tier ?? "starter",
          avatar: user?.avatar,
        },
      };
    }),
});
