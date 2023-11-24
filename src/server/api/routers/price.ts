import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { stripe } from "~/server/stripe/client";
import { createStripePrice } from "~/server/stripe/price";

export const priceRouter = createTRPCRouter({
    getAllPrices: publicProcedure.query(async ({ ctx }) => {
        const prices = await ctx.db.price.findMany({});
        if (!prices) {
            throw new Error("Prices not found");
        }
        return prices;
    }),
    createPrice: publicProcedure
        .input(
            z.object({
                price: z.number().min(1).max(1000000000),
                description: z.string().min(1).max(50),
            }),
        )
        .query(async ({ ctx, input }) => {
            try {
                const stripePrice = await stripe.prices.create({
                    unit_amount: input.price,
                    currency: "usd",
                    product_data: {
                        name: input.description,
                    },
                });
                if (!stripePrice || !stripePrice.id) {
                    throw new Error("Failed to create price in Stripe.");
                }
                const price = await ctx.db.price.create({
                    data: {
                        price: input.price,
                        description: input.description,
                        stripeId: stripePrice.id,
                    },
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
});
