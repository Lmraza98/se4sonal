import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type Prisma } from "@prisma/client";

export const cartRouter = createTRPCRouter({
  getCart: publicProcedure
    .input(
        z.object({
            id: z.number().min(1).max(100),
        }),
    )
    .query( async ({ ctx, input }) => {
        const { id } = input
        if(!id) throw new Error("No user id provided")
        return await ctx.db.cart.findUnique({
            where: {
                userId: id
            },
            include: {
                products: true
            }
        })
    }),

  // createProduct: publicProcedure
  //   .input(
  //     z.object({
  //       active: z.boolean(),
  //       name: z.string().min(1).max(50),
  //       description: z.string().min(1).max(50),
  //       mainImageId: z.number(),
  //       imageIds: z.array(z.number()),
  //       categoryId: z.number(),
  //       stock: z.number(),
  //       capsuleId: z.number(),
  //       priceId: z.number(),
  //       sizeIds: z.array(
  //        z.number(),
  //       ),
  //       stripeId: z.string().min(1).max(50),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const productData = {
  //       category: input.categoryId,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       name: input.name,
  //       description: input.description,
  //       stock: input.stock,
  //       mainImageId: input.mainImageId,
  //       priceId: input.priceId,
  //       categoryId: input.categoryId,
  //       capsuleId: input.capsuleId,
  //       stripeId: input.stripeId,
  //       active: input.active,
  //       imageIds: input.imageIds,
  //       mainImage: {
  //         connect: { id: input.mainImageId },
  //       },
  //       images: {
  //         connect: input.imageIds.map((id) => ({ id })),
  //       },
  //       sizes: input.sizeIds
  //         ? {
  //           create: input.sizeIds.map(({ productId, sizeId }) => ({
  //             productId,
  //             size: {
  //               connect: { id: sizeId },
  //             },
  //           })),
  //         }
  //         : undefined,
  //       capsule: input.capsuleId
  //         ? {
  //           connect: { id: input.capsuleId },
  //         }
  //         : undefined,
  //       price: input.priceId
  //         ? {
  //           connect: { id: input.priceId },
  //         }
  //         : undefined,
  //       // other fields...
  //     } as Prisma.ProductCreateInput;

  //     const product = ctx.db.product.create({
  //       data: productData,
  //       include: {
  //         images: true,
  //         sizes: true,
  //         capsule: true,
  //         price: true,
  //       },
  //     });
  //     return product;
  //   }),
  getProduct: publicProcedure
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
          sizes: true,
          capsule: true,
          price: true,
          
        },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    }),
  deleteProduct: publicProcedure
    .input(
      z.object({
        id: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.delete({
        where: {
          id: input.id,
        },
      });
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    }),
  updateProduct: publicProcedure
    .input(
      z.object({
        id: z.number().min(1).max(100),
        active: z.boolean().optional(),
        name: z.string().min(1).max(50).optional(),
        description: z.string().min(1).max(50).optional(),
        price: z.number().min(1).max(1000000000).optional(),
        mainImageId: z.number().optional(),
        imageIds: z.array(z.number()).optional(),
        categoryId: z.number().optional(),
        stock: z.number().optional(),
        capsuleId: z.number().optional(),
        priceId: z.number().optional(),
        sizeIds: z
          .array(
            z.object({
              productId: z.number(),
              sizeId: z.number(),
            }),
          )
          .optional(),
        stripeId: z.string().min(1).max(50).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Prisma.ProductUpdateInput = {};

      // Scalar fields
      if (input.active !== undefined) updateData.active = input.active;
      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.stock !== undefined) updateData.stock = input.stock;
      if (input.price !== undefined)
        updateData.price = { connect: { id: input.price } };
      if (input.mainImageId !== undefined)
        updateData.mainImage = { connect: { id: input.mainImageId } };
      if (input.categoryId !== undefined)
        updateData.category = { connect: { id: input.categoryId } };
      if (input.capsuleId !== undefined)
        updateData.capsule = { connect: { id: input.capsuleId } };
      if (input.priceId !== undefined)
        updateData.price = { connect: { id: input.priceId } };
      if (input.stripeId !== undefined) updateData.stripeId = input.stripeId;

      // Relational fields
      if (input.imageIds) {
        updateData.images = { connect: input.imageIds.map((id) => ({ id })) };
      }
      if (input.sizeIds) {
        updateData.sizes = {
          create: input.sizeIds.map(({ productId, sizeId }) => ({
            productId,
            size: { connect: { id: sizeId } },
          })),
        };
      }
      if (input.capsuleId) {
        updateData.capsule = { connect: { id: input.capsuleId } };
      }
      if (input.priceId) {
        updateData.price = { connect: { id: input.priceId } };
      }
      // Check if updateData is empty (no meaningful fields provided for update)
      if (
        Object.keys(updateData).length === 0 &&
        updateData.constructor === Object
      ) {
        throw new Error("No update data provided");
      }
      // Update product
      const product = ctx.db.product.update({
        where: { id: input.id },
        data: updateData,
      });

      return product;
    }),
});
