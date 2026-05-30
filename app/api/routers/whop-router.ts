import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import * as schema from "@db/schema";
import { eq, and, isNull, lt } from "drizzle-orm";
import { env } from "../lib/env";

export const whopRouter = createRouter({
  provision: publicQuery
    .input(z.object({ secret: z.string() }))
    .mutation(async ({ input }) => {
      if (input.secret !== env.cronSecret) {
        return { error: "Unauthorized" };
      }

      const db = getDb();
      const pending = await db
        .select()
        .from(schema.whopPending)
        .where(and(isNull(schema.whopPending.resolvedAt), lt(schema.whopPending.attempts, 5)))
        .limit(10);

      const results = [];
      for (const item of pending) {
        const attempts = item.attempts ?? 0;
        try {
          await db
            .update(schema.whopPending)
            .set({ resolvedAt: new Date() })
            .where(eq(schema.whopPending.id, item.id));
          results.push({ id: item.id, status: "resolved" });
        } catch (err: any) {
          await db
            .update(schema.whopPending)
            .set({
              attempts: attempts + 1,
              lastError: err.message,
            })
            .where(eq(schema.whopPending.id, item.id));
          results.push({ id: item.id, status: "failed", error: err.message });
        }
      }

      return { processed: results.length, results };
    }),
});
