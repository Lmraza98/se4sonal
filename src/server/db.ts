import { PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasourceUrl: env.DATABASE_URL
  });
const cart = await db.cart.findUnique({ 
  where: { id: 0 } 
})
console.log()
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

