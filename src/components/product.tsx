import React from 'react'
import type { RouterOutputs } from "~/trpc/shared"
import Image from 'next/image'
import { api } from '~/trpc/server'


export type ProductWithImage = RouterOutputs['product']['getProduct']

const Product: React.FC<{ product: ProductWithImage }> = async ({ product }) => {
    const { 
        id, 
        active, 
        capsuleId, 
        categoryId, 
        description, 
        images, 
        mainImageId, 
        name, 
        priceId, 
        capsule,
        price, 
        sizes, 
        stock, 
        stripeId 
        } = product

    const mainImage  = await api.imageRouter.getImage.query({
        id: mainImageId
    })
    const otherImages = await api.imageRouter.getImages.query({
        imageIds: images.map((image) => image.imageId)
    })

    // const prices = await api.price.getAllPrices.query()
    // const categories = await api.category.getAllCategories.query()
    // const capsules = await api.capsule.getAllCapsules.query()
    // const sizes = await api.size.getAllSizes.query()

    return (
        <div className='w-full flex flex-row'>
            <div className='flex flex-col'>
                <h1>{ name }</h1>
                <section>
                    <p>
                        { description }
                    </p>
                </section>
                <section>
                    <div>
                        { 
                            images.length > 0 ?
                            
                            otherImages.map((image) => {
                                return (
                                    <Image key={image.id} src={image.url} width={100} height={100} alt={image.fileName} />
                                )
                            }) 
                            :
                            <div>
                                No Images
                            </div>
                        }
                    </div>
                </section>
                <section>
                    <h2>
                        { 
                            product.priceId
                        }
                    </h2>
                </section>
            </div>
            <div className='flex flex-col'>
                {
                    mainImage ?
                    <Image src={mainImage.url} width={500} height={500} alt={ mainImage.fileName ?? "NO name for image" } />
                    : <div>No Main Image</div>
                }
            </div>
        </div>
    )
}
export { Product }