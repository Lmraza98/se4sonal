import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";

import { type Prisma } from "@prisma/client";
interface ProductInput {
  id: number;
  active?: boolean | undefined;
  name: string | undefined;
  description: string | undefined;
  price?: number | undefined;
  mainImageId?: number | undefined;
  imageIds?: number[] | undefined;
  categoryId?: number;
  stock?: number;
  capsuleId?: number;
  priceId?: number;
  sizeIds?: { productId: number; sizeId: number; }[];
  stripeId?: string | undefined;
}

export const productRouter = createTRPCRouter({
 
  getAllProducts: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany();

    return products;
  }),
  createProduct: publicProcedure
    .input(
      z.object({
        id: z.number(),
        active: z.boolean(),
        name: z.string().min(1).max(50),
        description: z.string().min(1).max(50),
        price: z.number().min(1).max(1000000000),
        mainImageId: z.number(),
        imageIds: z.array(z.number()),
        categoryId: z.number(),
        stock: z.number(),
        capsuleId: z.number(),
        priceId: z.number(),
        sizeIds: z.array(
          z.object({
            productId: z.number(),
            sizeId: z.number(),
          }),
        ),
        stripeId: z.string().min(1).max(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const productData = {
        category: input.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: input.name,
        description: input.description,
        stock: input.stock,
        mainImageId: input.mainImageId,
        priceId: input.priceId,
        categoryId: input.categoryId,
        capsuleId: input.capsuleId,
        stripeId: input.stripeId,
        active: input.active,
        mainImage: {
          connect: { id: input.mainImageId },
        },
        images: {
          connect: input.imageIds.map((id) => ({ id })),
        },
        sizes: input.sizeIds
          ? {
              create: input.sizeIds.map(({ productId, sizeId }) => ({
                productId,
                size: {
                  connect: { id: sizeId },
                },
              })),
            }
          : undefined,
        capsule: input.capsuleId
          ? {
              connect: { id: input.capsuleId },
            }
          : undefined,
        price: input.priceId
          ? {
              connect: { id: input.priceId },
            }
          : undefined,
        // other fields...
      } as Prisma.ProductCreateInput;

      const product = await ctx.db.product.create({
        data: productData,
      });
      return {
        product,
      };
    }),
    getProduct: publicProcedure
    .input(
        z.object({
            id: z.number().min(1).max(100),
        })
    )
    .query( async ({ ctx, input }) => {
        const product = await ctx.db.product.findUnique({
            where: {
                id: input.id
            },
            include: {
                images: true,
                sizes: true,
                capsule: true,
                price: true,
            },
        })
        if ( !product ) {
            throw new Error("Product not found")
        }
        return product
    }),
    deleteProduct: publicProcedure
    .input(
        z.object({
            id: z.number().min(1).max(100),
        })
    )
    .query( async ({ ctx, input }) => {
        const product = await ctx.db.product.delete({
            where: {
                id: input.id
            }
        })
        if( !product ) {
            throw new Error("Product not found")
        }
        return product
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
          sizeIds: z.array(
              z.object({
                  productId: z.number(),
                  sizeId: z.number(),
              }),
          ).optional(),
          stripeId: z.string().min(1).max(50).optional(),
      })
  )
  .mutation(async ({ ctx, input }) => {
    // Initialize an empty object to hold the update data
    type UpdateProductData = Omit<ProductInput, 'id'>;
    function assignProperty<K extends keyof ProductInput & keyof UpdateProductData>(
      key: K,
      source: ProductInput,
      target: UpdateProductData
  ): void {
      if (source[key] !== undefined) {
          target[key] = source[key];
      }
  }
  
    let updateData: UpdateProductData;

    // Iterate over the keys of the input object
    const validKeys: Array<keyof ProductInput> = ['active', 'name', 'description', 'price', 'mainImageId', 'imageIds', 'categoryId', 'stock', 'capsuleId', 'priceId', 'sizeIds', 'stripeId'];

    Object.keys(input).forEach(key => {
      if (key !== 'id') {
          assignProperty(key as keyof ProductInput, input, updateData);
      }
  });
    // Handle relational data for images
    if (input.imageIds) {
        updateData.images = {
            connect: input.imageIds.map(id => ({ id }))
        };
    }

    // Handle relational data for sizes
    if (input.sizeIds) {
        updateData.sizes = {
            create: input.sizeIds.map(({ productId, sizeId }) => ({
                productId,
                size: { connect: { id: sizeId } }
            }))
        };
    }

    // Handle relational data for capsule
    if (input.capsuleId) {
        updateData.capsule = {
            connect: { id: input.capsuleId }
        };
    }

    // Handle relational data for price
    if (input.priceId) {
        updateData.price = {
            connect: { id: input.priceId }
        };
    }

    // Perform the update operation on the product
    const product = await ctx.db.product.update({
        where: { id: input.id },
        data: updateData
    });

    // Return the updated product
    return product;
});

















  // attachImageToProduct: publicProcedure
  //     .input(
  //         z.object({
  //             imageId: z.number(),
  //             productId: z.number(),
  //         })
  //     )
  //     .query( async ({ ctx, input }) => {
  //         const product = await ctx.db.product.findUnique({
  //             where: {
  //                 id: input.productId
  //             }
  //         })
  //         if ( !product ) {
  //             throw new Error("Product not found")
  //         }
  //         const image = await ctx.db.productImage.findUnique({
  //             where: {
  //                 id: input.imageId
  //             }
  //         })
  //         if ( !image ) {
  //             throw new Error("Image not found")
  //         }
  //         const updatedProduct = await ctx.db.product.update({
  //             where: {
  //                 id: input.productId
  //             },
  //             data: {
  //                 ProductImage: {
  //                     connect: {
  //                         id: input.imageId
  //                     }
  //                 }
  //             }
  //         })
  //         return updatedProduct
  //     })
});
