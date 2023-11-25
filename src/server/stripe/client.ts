import Stripe from 'stripe';
import { env } from '@app/env.mjs'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export type StripePrice = Stripe.Response<Stripe.Price>
export type StripePriceCreateParams = Stripe.PriceCreateParams

export type StripeProduct = Stripe.Response<Stripe.Product>
export type StripeProductCreateParams = Stripe.ProductCreateParams