import Stripe from 'stripe';
import { env } from '~/env.mjs'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export type StripePrice = Stripe.Response<Stripe.Price>
export type StripePriceCreateParams = Stripe.PriceCreateParams

export type StripeProductCreateParams = Stripe.ProductCreateParams
