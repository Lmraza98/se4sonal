import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type Prisma } from "@prisma/client";

export const sizeRouter = createTRPCRouter({
    getSizes: publicProcedure.query(({ ctx }) => {
        console.log("GET SIZES HIT")
        return ctx.db.size.findMany({
        orderBy: {
            id: "desc"
        },
        });
    }),
    createSize: publicProcedure
        .input(
        z.object({
            productId: z.number(),
            sizeId: z.number(),
        }),
        )
        .mutation(async ({ ctx, input }) => {
        const sizeData = {
            productId: input.productId,
            sizeId: input.sizeId,
        };
        const newSize = await ctx.db.size.create({
            data: sizeData,
        });
        return newSize;
        }),
    deleteSize: publicProcedure
        .input(
        z.object({
            id: z.number(),
        }),
        )
        .mutation(async ({ ctx, input }) => {
        const size = await ctx.db.size.delete({
            where: {
            id: input.id,
            },
        });
        return size;
        }),
    });