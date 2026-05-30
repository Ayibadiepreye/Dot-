import { getDb } from "../api/queries/connection";
import { sql } from "drizzle-orm";

async function reset() {
  const db = getDb();
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  const tables = [
    "affiliate_clicks", "affiliates", "achievements", "event_tickets",
    "events", "wallet_transactions", "wallets", "payments",
    "organizations", "whop_pending", "partner_logos", "faqs", "users",
  ];
  for (const t of tables) {
    try {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS \`${t}\``));
      console.log("Dropped", t);
    } catch (e: any) {
      console.log("Skip", t, e.message);
    }
  }
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
  console.log("All tables dropped");
}

reset().catch(console.error);
