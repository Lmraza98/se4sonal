import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@app/server/api/trpc";

export const stripeRouter = createTRPCRouter({
    // getStripe: publicProcedure
    //     .query(async ({ ctx }) => {
    //         return {
    //             stripeKey: process.env.STRIPE_KEY
    //         }
    //     }),
    // createStripe: publicProcedure
    //     .input(
    //         z.object({
    //             stripeKey: z.string().min(1).max(50),
    //         })
    //     )
    //     .query(async ({ ctx, input }) => {
    //         return {
    //             stripeKey: input.stripeKey
    //         }
    //     }),
    // deleteStripe: publicProcedure
    //     .input(
    //         z.object({
    //             id: z.number().min(1).max(100),
    //         })
    //     )
    //     .query(async ({ ctx, input }) => {
    //         return {
    //             stripeKey: ""
    //         }
    //     })

});