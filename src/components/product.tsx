import React from 'react'
import type { RouterOutputs } from "@app/trpc/shared"
import Image from 'next/image'
import { api } from '@app/trpc/server'

export type ProductWithImage = RouterOutputs['product']['getProductById']

const Product: React.FC<{ product: ProductWithImage }> = async ({ product }) => {
    const { name, description, priceId, stock, categoryId, createdAt, updatedAt, capsuleId, mainImageId, images } = product
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
                            
                            images.map((image) => {
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
                    images.length > 0 ? 
                    <Image src={images[0]?.url} width={500} height={500} alt={images[0]?.fileName ?? "no name"} />
                    : <div>No Images</div>
                        
                }
                
            </div>
        </div>
    )
}
export { Product }