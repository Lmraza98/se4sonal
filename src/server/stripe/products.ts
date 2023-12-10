import { stripe, type StripeProduct, type StripeProductCreateParams, type StripeProductUpdateParams } from './client'


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

export const updateStripeProduct = async(
    params: StripeProductUpdateParams,
    id: string
):Promise<StripeProduct> => {
   const {active, name} = params

   return await stripe.products.update(id, {
        active: active,
        name: name,
   });
}