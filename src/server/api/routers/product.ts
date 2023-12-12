import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { type Prisma } from "@prisma/client";

export const productRouter = createTRPCRouter({
  getProducts: publicProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),
  createProduct: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        description: z.string().min(1).max(200),
        stock: z.number().nullish(),
        active: z.boolean(),
        productSizeIds: z.array( z.number() ),
        priceId: z.number(),
        capsuleId: z.number().nullish(),
        categoryId: z.number().nullish(),
        mainImageId: z.number().nullish(),
        imageIds: z.array(z.number()),
        cartId: z.number().optional(),
        stripeId: z.string().min(1).max(20).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Creating product with:", {
        priceId: input.priceId,
        capsuleId: input.capsuleId,
        categoryId: input.categoryId,
        mainImageId: input.mainImageId,
        imageIds: input.imageIds,
      });
      try {
        const product = await ctx.db.$transaction(async (prisma) => {
          // Use the transactional prisma instance for all queries within this block
  
          // First, handle the creation of the mainImage and additional images if they exist
          let mainImageCreate;
          if (input.mainImageId) {
            mainImageCreate = await prisma.productImage.create({
              data: {
                image: {
                  connect: { id: input.mainImageId },
                },
                // other fields of ProductImage if needed
              },
            });
          }
          console.log("mainImageCreate", mainImageCreate)
  
          let additionalImagesIds;
          let sizes; 
          if (input.imageIds && input.imageIds.length > 0) {
            const images = await Promise.all(
              input.imageIds.map( async (imageId) =>{
                return await prisma.productImage.create({
                  data: {
                    imageId: imageId,
                    // image: {
                    //   connect: {id: imageId}
                    // }
                  }
                })
                
              })
            )
            console.log("additionalImagesCreate: \n\n", images)
            additionalImagesIds = images.map(img => ({ id: img.id }));
          }
          if(input.productSizeIds && input.productSizeIds.length > 0) {

            sizes = await Promise.all(
              input.productSizeIds.map( async (sizeId) =>{
                return await prisma.productSize.create({
                  data: {
                    size: {
                      connect: {id: sizeId}
                    }
                  }
                })
                
              })
            )
          }
          // Then create the Product, connecting it to the images
          return prisma.product.create({
            // name: string
            // description: string
            // stock?: number | null
            // createdAt?: Date | string
            // updatedAt?: Date | string
            // active?: boolean
            // productSizeIds?: ProductCreateproductSizeIdsInput | number[]
            // purchaseOrders?: PurchaseOrderCreateNestedManyWithoutProductsInput
            // sizes?: ProductSizeCreateNestedManyWithoutProductsInput
            // price: PriceCreateNestedOneWithoutProductsInput
            // capsule: CapsuleCreateNestedOneWithoutProductsInput
            // category: CategoryCreateNestedOneWithoutProductsInput
            // mainImage: ProductImageCreateNestedOneWithoutProductAsMainInput
            // images?: ProductImageCreateNestedManyWithoutProductInput
            // carts?: CartCreateNestedManyWithoutProductsInput
            data: {
              name: input.name,
              description: input.description,
              stock: input.stock ? input.stock : null,
              active: input.active ? input.active : false,
              sizes: sizes ? {
                connect: sizes.map(size => ({ id: size.id })),
              } : undefined,
              // priceId: input.priceId,
              price: {
                connect: { id: input.priceId },
              },
              // capsuleId: input.capsuleId ?? undefined,
              capsule: {
                connect: { id: input.capsuleId ? input.capsuleId : 1 },
              },
              // categoryId: input.categoryId ?? undefined,
              category: {
                connect: { id: input.categoryId ? input.categoryId : 1 },
              } ,
              // productSizeIds: input.productSizeIds ?? [1],
              // sizes: {
              //   connect: input.productSizeIds.map(id => ({ id })),
              // },
              // mainImageId: input.mainImageId ?? undefined,
              mainImage: {
                connect: { id: mainImageCreate !== undefined ? mainImageCreate.id : 1},
              },
              images: (additionalImagesIds && additionalImagesIds.length > 0) ? {
                connect: additionalImagesIds.map(img => ({ id: img.id })),
              } : undefined,
              // ... other conditional fields ...
            },
            include: {
              // ... include fields ...
              capsule: true,
              category: true,
              price: true,
              sizes: true,
              mainImage: true,
              images: true,

            },
          });
        });
  
        return product;
      } catch (error) {
        console.error("Error creating product:", error);
        throw error;
      }
      
      
  }),
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
      if (input.stripeId !== undefined) updateData.price = { connect: { id: input.priceId }};

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
