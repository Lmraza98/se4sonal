import { productRouter } from "@app/server/api/routers/product";
import { imageRouter } from "@app/server/api/routers/image";
import { createTRPCRouter } from "@app/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  imageRouter: imageRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
