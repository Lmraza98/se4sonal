import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({
    getCategories: publicProcedure
        .query(async ({ ctx }) => {
            const categories = await ctx.db.category.findMany({})
            if (!categories) {
                throw new Error("Categories not found")
            }
            return categories
        }),
    createCategory: publicProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50)
            })
        )
        .mutation(async ({ ctx, input }) => {
            console.log("Creating category: ", input.name)
            const category = await ctx.db.category.create({
                data: {
                    name: input.name,
                    description: ''
                }
            })
            return category
        }),
    deleteCategory: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const category = await ctx.db.category.delete({
                where: {
                    id: input.id
                }
            })
            if (!category) {
                throw new Error("Category not found")
            }
            return category
        }),
    updateCategory: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
                name: z.string().min(1).max(50),
                description: z.string().min(1).max(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const category = await ctx.db.category.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    description: input.description,
                },
            });
            if (!category) {
                throw new Error("Category not found");
            }
            return category;
        }),

    

});
