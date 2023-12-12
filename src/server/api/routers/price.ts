import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { stripe } from "~/server/stripe/client";
import { createStripePrice } from "~/server/stripe/price";

export const priceRouter = createTRPCRouter({
    getAllPrices: publicProcedure.query(async ({ ctx }) => {
        const prices = await ctx.db.price.findMany()
        if (!prices) {
            throw new Error("Prices not found");
        }
        return prices;
    }),
    createPrice: publicProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50).optional(),
                currency: z.string().min(1).max(50),
                unitAmmount: z.number().min(1).max(1000000000),
                stripeId: z.string().min(1).max(50).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                if(!input.name) {
                    input.name = input.currency + " " + input.unitAmmount
                }
                const price = await ctx.db.price.create({
                   data: {
                    unitAmmount: input.unitAmmount,
                    stripeId: input.stripeId,
                    currency: input.currency,
                    name: input.name
                   }
                });
                return price;
            } catch (err) {
                // Improved error handling
                if (err instanceof Error) {
                    console.error("Error in createPrice: ", err.message);
                    throw new Error(`Error creating price: ${err.message}`);
                } else {
                    // If it's not an Error instance, handle accordingly
                    console.error("Error in createPrice: ", err);
                    throw new Error("Error creating price");
                }
            }
        }),

    deletePrice: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const price = await ctx.db.price.delete({
                where: {
                    id: input.id,
                },
            });
            if (!price) {
                throw new Error("Price not found");
            }
            return price;
        }),
    updatePrice: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
                // price: z.number().min(1).max(1000000000),
                description: z.string().min(1).max(50).optional(),
                name: z.string().min(1).max(50).optional(),
                stripeId: z.string().min(1).max(50).optional(),
                currency: z.string().min(1).max(50).optional(),
                unitAmmount: z.number().min(1).max(1000000000).optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const price = await ctx.db.price.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        // description: input.description,
                        stripeId: input.stripeId,
                        // price: input.price,
                        name: input.name,
                        currency: input.currency,
                        unitAmmount: input.unitAmmount
                    },
                });
                if (!price) {
                    throw new Error("Price not found");
                }
                return price;
            } catch (err) {
                // Improved error handling
                if (err instanceof Error) {
                    console.error("Error in updatePrice: ", err.message);
                    throw new Error(`Error updating price: ${err.message}`);
                } else {
                    // If it's not an Error instance, handle accordingly
                    console.error("Error in updatePrice: ", err);
                    throw new Error("Error updating price");
                }
            }
        })
});
