import { PrismaClient } from "@prisma/client";

import { env } from "@app/env.mjs";


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
type Image = {
  id: number; 
  url: string; 
  fileName: string; 
  fileSize: number; 
  fileKey: string; 
  createdAt: Date; 
  updatedAt: Date; 
}

const testImage = async () => {

  const images:Image[] = await db.image.findMany()
  console.log(images)

}

