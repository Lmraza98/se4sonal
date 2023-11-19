import { productRouter } from "@app/server/api/routers/product";
import { imageRouter } from "@app/server/api/routers/image";
import { capsuleRouter } from "@app/server/api/routers/capsule";
import { categoryRouter } from "@app/server/api/routers/category";
import { priceRouter } from "@app/server/api/routers/price";
import { sizeRouter } from "@app/server/api/routers/size";
import { stripeRouter } from "@app/server/api/routers/stripe";
import { createTRPCRouter } from "@app/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  imageRouter: imageRouter,
  capsuleRouter: capsuleRouter,
  categoryRouter: categoryRouter,
  priceRouter: priceRouter,
  sizeRouter: sizeRouter,
  stripeRouter: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
