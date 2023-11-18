import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";

export const capsuleRouter = createTRPCRouter({
    getCapsules: publicProcedure
        .query( async ({ ctx }) => {
            const capsules = await ctx.db.capsule.findMany({})
            if ( !capsules ) {
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
        .query( async ({ ctx, input }) => {
            const capsule = await ctx.db.capsule.create({
                data: {
                    name: input.name,
                    description: input.description,
                    updatedAt: new Date(),
                }
            })
            return capsule
        }),
    deleteCategory: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            })
        )
        .query( async ({ ctx, input }) => {
            const category = await ctx.db.category.delete({
                where: {
                    id: input.id
                }
            })
            if( !category ) {
                throw new Error("Category not found")
            }
            return category
        })

});
