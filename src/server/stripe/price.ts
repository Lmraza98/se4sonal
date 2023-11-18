import { stripe, type StripePrice, type StripePriceCreateParams } from './client'

export const createStripePrice = async(
    params: StripePriceCreateParams
):Promise<StripePrice> => {
    const { unit_amount, currency, product_data } = params

    return await stripe.prices.create({
        unit_amount: unit_amount,
        currency: currency,
        product_data: product_data,
    })
}
