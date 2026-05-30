import { authRouter } from "./auth-router";
import { userRouter } from "./routers/user-router";
import { paymentRouter } from "./routers/payment-router";
import { statsRouter } from "./routers/stats-router";
import { affiliateRouter } from "./routers/affiliate-router";
import { adminRouter } from "./routers/admin-router";
import { checkinRouter } from "./routers/checkin-router";
import { contentRouter } from "./routers/content-router";
import { whopRouter } from "./routers/whop-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  user: userRouter,
  payment: paymentRouter,
  stats: statsRouter,
  affiliate: affiliateRouter,
  admin: adminRouter,
  checkin: checkinRouter,
  content: contentRouter,
  whop: whopRouter,
});

export type AppRouter = typeof appRouter;
