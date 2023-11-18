import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";

import { type  Prisma } from "@prisma/client";
export const productRouter = createTRPCRouter({
  getProductById: publicProcedure
  .input(
    z.object({
      id: z.number().min(1).max(100),
    }),
  )
  .query(async ({ ctx, input }) => {
    const product = await ctx.db.product.findUnique({
      where: {
        id: input.id,
      },
      include: {
        images: true,
      }
    });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }),
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany();

    return products;
  }),
  createProduct: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(50),
        description: z.string().min(1).max(50),
        price: z.number().min(1).max(1000000000),
        mainImageId: z.number(),
        imageIds: z.array(z.number()),
        categoryId: z.number(),
        stock: z.number(),
        capsuleId: z.number(),
        priceId: z.number(),
        sizeIds: z.array(z.number()),

      }),
    )
    .query(async ({ ctx, input }) => {

      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          stock: input.stock,
          mainImageId: input.mainImageId, // Always provided as per schema
          priceId: input.priceId,
          categoryId: input.categoryId,
          capsuleId: input.capsuleId,
          images: {
            connect: input.imageIds.map((id) => ({ id })),
          }
          // No need for optional checks on mainImageId
        },
      })
      
      return {
        product,
      };
    }),
    attachImageToProduct: publicProcedure
        .input(
            z.object({
                imageId: z.number(),
                productId: z.number(),
            })
        )
        .query( async ({ ctx, input }) => {
            const product = await ctx.db.product.findUnique({
                where: {
                    id: input.productId
                }
            })
            if ( !product ) {
                throw new Error("Product not found")
            }
            const image = await ctx.db.productImage.findUnique({
                where: {
                    id: input.imageId
                }
            })
            if ( !image ) {
                throw new Error("Image not found")
            }
            const updatedProduct = await ctx.db.product.update({
                where: {
                    id: input.productId
                },
                data: {
                    ProductImage: {
                        connect: {
                            id: input.imageId
                        }
                    }
                }
            })
            return updatedProduct
        })
});
