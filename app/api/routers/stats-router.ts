import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { count } from "drizzle-orm";
import * as schema from "@db/schema";
import { sql } from "drizzle-orm";

export const statsRouter = createRouter({
  public: publicQuery.query(async () => {
    const db = getDb();
    const [memberCount, orgCount] = await Promise.all([
      db.select({ count: count() }).from(schema.users),
      db
        .select({ count: count() })
        .from(schema.organizations)
        .where(sql`${schema.organizations.status} = 'active'`),
    ]);

    return {
      member_count: memberCount[0].count,
      org_count: orgCount[0].count,
      city_count: 12, // Hardcoded for now
      hub_count: 8,   // Hardcoded for now
    };
  }),
});
