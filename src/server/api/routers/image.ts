import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";

export const imageRouter = createTRPCRouter({
    getImage: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            }),
        )
        .query(async ({ ctx, input }) => {
            const image = await ctx.db.image.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!image) {
                throw new Error("Image not found");
            }
            return image;
        }),
    getImages:  publicProcedure
        .input(
            z.object({
                imageIds: z.array(z.number().min(1).max(100)),
            }),
        )
        .query(async ({ ctx, input }) => {
            const images = await ctx.db.image.findMany({
                where: {
                    id: {
                        in: input.imageIds,
                    },
                },
            });
            if (!images) {
                throw new Error("Images not found");
            }
            return images;
        }),
    createImage: publicProcedure
        .input(
            z.object({
                url: z.string().min(1).max(50),
                fileName: z.string().min(1).max(50),
                fileSize: z.number().min(1).max(1000000000),
                fileKey: z.string().min(1).max(50),
                productId: z.number().min(1).max(100),
            }),
        )
        .query(async ({ ctx, input }) => {
            const newImage = await ctx.db.image.create({
                data: {
                    url: input.url,
                    fileName: input.fileName,
                    fileSize: input.fileSize,
                    fileKey: input.fileKey,
                },
            });

            return newImage;
        }),
    deleteImage: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            }),
        )
        .query(async ({ ctx, input }) => {
            const image = await ctx.db.image.delete({
                where: {
                    id: input.id,
                },
            });
            if (!image) {
                throw new Error("Image not found");
            }
            return image;
        }),
    getAllProducts: publicProcedure.query(async ({ ctx }) => {
        const products = await ctx.db.product.findMany();

        return products;
    }),
});
