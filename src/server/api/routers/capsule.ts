import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const capsuleRouter = createTRPCRouter({
    getCapsules: publicProcedure
        .query(async ({ ctx }) => {
            const capsules = await ctx.db.capsule.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            })
            if (!capsules) {
                throw new Error("Categories not found")
            }
            return capsules
        }),
    createCapsule: publicProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                description: z.string().min(1).max(50)
            })
        )
        .mutation(async ({ ctx, input }) => {
            const capsule = await ctx.db.capsule.create({
                data: {
                    name: input.name,
                    description: input.description,
                    updatedAt: new Date(),
                }
            })
            return capsule
        }),
    deleteCapsule: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            })
        )
        .query(async ({ ctx, input }) => {
            const capsule = await ctx.db.capsule.delete({
                where: {
                    id: input.id
                }
            })
            if (!capsule) {
                throw new Error("Capsule not found")
            }
            return capsule
        })

});
