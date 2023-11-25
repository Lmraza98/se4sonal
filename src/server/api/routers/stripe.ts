import { z } from "zod";
import { createStripeProduct } from '../../stripe/products'
import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";

export const stripeRouter = createTRPCRouter({
    getStripe: publicProcedure
        .query(async ({ ctx }) => {
            return {
                stripeKey: process.env.STRIPE_KEY
            }
        }),
    createStripe: publicProcedure
        .input(
            z.object({
                name: z.string().min(1).max(50),
            })
        )
        .query(async ({ ctx, input }) => {
            const product = await createStripeProduct ({
                name: name
            });
            return {
                
            }
        }),
    deleteStripe: publicProcedure
        .input(
            z.object({
                id: z.number().min(1).max(100),
            })
        )
        .query(async ({ ctx, input }) => {
            return {
                stripeKey: ""
            }
        })

});