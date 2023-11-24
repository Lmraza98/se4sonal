import { productRouter } from "~/server/api/routers/product";
import { imageRouter } from "~/server/api/routers/image";
import { capsuleRouter } from "~/server/api/routers/capsule";
import { categoryRouter } from "~/server/api/routers/category";
import { priceRouter } from "~/server/api/routers/price";
import { sizeRouter } from "~/server/api/routers/size";
import { stripeRouter } from "~/server/api/routers/stripe";
import { createTRPCRouter } from "~/server/api/trpc";

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
