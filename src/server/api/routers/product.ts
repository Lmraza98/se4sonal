import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";
import { db } from "@app/server/db";

export const productRouter = createTRPCRouter({
    getInfiniteProducts: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.number().nullish()
            })
        )
        .query( async ({ ctx, input }) => {
            const limit = input.limit ?? 50
            const { cursor } = input
            const items = await ctx.db.product.findMany({
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: {
                    createdAt: 'asc'
                }
            })
            let nextCursor: typeof cursor | undefined = undefined
            if ( items.length > limit ) {
                const nextItem = items.pop()
                nextCursor = nextItem!.myCursor
            }

            return {
                items, 
                nextCursor
            }
        }),
  getAllProducts: publicProcedure
    .query( async ({ ctx }) => {
        const products = await ctx.db.product.findMany() 

        return products
    }),
createProduct: publicProcedure
    .input(
        z.object({
            id: z.number(),
            categoryId: z.number(),
            stock: z.number(),
            name: z.string().min(1).max(50),
            description: z.string().min(1).max(50),
            price: z.number().min(1).max(1000000000),
            imageId: z.number(),
            images: z.string().min(1).max(50),
            rating: z.number().min(1).max(5),
            numReviews: z.number().min(1).max(1000000000),
            countInStock: z.number().min(1).max(1000000000)
        })
    )
    .query( async({ ctx, input }) => {
        const product = await ctx.db.product.create({
            data: {
                name: input.name,
                description: input.description,
                price: input.price,
                imageId: input.imageId,
                categoryId: input.categoryId,
                stock: input.stock,
                images: input.images,
                id: input.id,
            }
        })

        ctx.db.productImage.create({

        })

        return {
            product,
        }
    }))
});
