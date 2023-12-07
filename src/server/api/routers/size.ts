import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type Prisma } from "@prisma/client";

export const sizeRouter = createTRPCRouter({
    getAllSizes: publicProcedure.query(async ({ ctx }) => {
        const sizes = await ctx.db.size.findMany();
    
        return sizes;
    }),
    createSize: publicProcedure
        .input(
        z.object({
            name: z.string().min(1).max(50),
            description: z.string().min(1).max(50).nullish(),
        }),
        )
        .mutation(async ({ ctx, input }) => {
        const size = await ctx.db.size.create({ 
            data: {
                name: input.name,
                description: input.description,
            },
        });
        return size;
        }),
    updateSize: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
                name: z.string().min(1).max(50),
                description: z.string().min(1).max(50).nullish(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const size = await ctx.db.size.update({
                where: {
                id: input.id,
                },
                data: {
                name: input.name,
                description: input.description,
                },
            });
            if (!size) {
                throw new Error("Size not found");
            }
            return size;
        }),
    deleteSize: publicProcedure
        .input(
        z.object({
            id: z.number().min(1).max(100),
        }),
        )
        .mutation(async ({ ctx, input }) => {
        const size = await ctx.db.size.delete({
            where: {
                id: input.id,
            },
        });
        if (!size) {
            throw new Error("Size not found");
        }
        return size;
        }),
    });