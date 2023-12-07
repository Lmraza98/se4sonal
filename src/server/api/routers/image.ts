import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
    getAllImages:  publicProcedure
        .query(async ({ ctx }) => {
            const images = await ctx.db.image.findMany();
            if (!images) {
                throw new Error("Images not found");
            }
            return images;
        }),
    getImages:  publicProcedure
        .input(
            z.object({
                ids: z.array(z.number().min(1).max(100)),
            })
        )
        .query(async ({ ctx, input }) => {
            const images = await ctx.db.image.findMany(
                {
                    where: {
                        id: {
                            in: input.ids,
                        },
                    },
                },
            );
            if (!images) {
                throw new Error("Images not found");
            }
            return images;
        }),
    createImage: publicProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
                url: z.string().min(1).max(50),
                fileName: z.string().min(1).max(50),
                fileSize: z.number().min(1).max(1000000000),
                fileKey: z.string().min(1).max(50)
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const newImage = await ctx.db.image.create({
                data: {
                    fileKey: input.fileKey,
                    fileName: input.fileName,
                    fileSize: input.fileSize,
                    url: input.url,
                    name: input.name,
                }
            });

            return newImage;
        }),
    deleteImage: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            }),
        )
        .mutation(async ({ ctx, input }) => {
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
    updateImage: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
                url: z.string().min(1).max(50),
                fileName: z.string().min(1).max(50),
                fileSize: z.number().min(1).max(1000000000),
                fileKey: z.string().min(1).max(50),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const image = await ctx.db.image.update({
                where: {
                    id: input.id,
                },
                data: {
                    url: input.url,
                    fileName: input.fileName,
                    fileSize: input.fileSize,
                    fileKey: input.fileKey,
                },
            });
            if (!image) {
                throw new Error("Image not found");
            }
            return image;
        }),
});
