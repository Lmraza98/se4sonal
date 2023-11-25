import { stripe, type StripeProduct, type StripeProductCreateParams } from './client'

export const createStripeProduct = async(
    params: StripeProductCreateParams
):Promise<StripeProduct> => {
   const {name, id, active, tax_code} = params

   return await stripe.products.create({
        name: name,
        id: id,
        active: active,
        tax_code: tax_code,
   });
}