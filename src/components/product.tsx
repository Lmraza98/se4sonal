"use client"
import React from 'react'
import type { RouterOutputs } from "~/trpc/shared"
import Image from 'next/image'
import { api } from '~/trpc/server'

// export type ProductType = RouterOutputs['product'][ 'getProduct']
// import type { Product as ProductType } from '@prisma/client'
import type { Product as ProductType, Price, Capsule, Category, Sizes, ProductImage } from '@prisma/client'

type ExtractedProductType = Exclude<ProductType, null>;
export interface CreateProductFormState extends Partial<ExtractedProductType> {
    active: boolean;
    stripeId: string;
    name: string;
    description: string;
    priceId: number;
    stock: number | null;
    categoryId: number;
    capsuleId: number;
    sizeIds: number[];
    imageIds: number[];
    mainImageId: number;
    sizes: Sizes[];
    images: ProductImage[];
    price: Price | undefined;
    capsule: Capsule | undefined;
    category: Category | undefined;
    // prices?: Price[];
    // capsules?: Capsule[];
    // categories?: Category[];
}
const Product: React.FC<CreateProductFormState> = ( product ) => {

    if(!product) return (
        <div>
            No Product
        </div>
    )
    
    const { 
        id,
        active,
        capsuleId,
        categoryId,
        description,
        images,
        mainImageId,
        name,
        price,
        capsule,
        category,
        imageIds,
        sizeIds,
        cartId,
        createdAt,
        updatedAt,
        sizes,
        stock,
        stripeId
    } = product
   

   

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
                        {/* { 
                            resolvedImages.length > 0 ?
                            
                            resolvedImages.map( (image) => {
                                return (
                                    <Image key={image.id} src={image.url} width={100} height={100} alt={image.fileName} />
                                )
                            }) 
                            :
                            <div>
                                No Images
                            </div>
                        } */}
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
                {/* {
                    mainImage ?
                    <Image src={mainImage.url} width={500} height={500} alt={ mainImage.fileName ?? "NO name for image" } />
                    : <div>No Main Image</div>
                } */}
            </div>
        </div>
    )
}
export { Product }