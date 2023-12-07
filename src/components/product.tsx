"use client";
import React from 'react';
import Image from 'next/image';
import { api } from "~/trpc/react";

import type { Size } from '@prisma/client';

interface ImageType {
    id: number,
    url: string,
}

interface ProductProps {
    product: {
        name: string, 
        description: string,
        mainImageId: number,
        imageIds: number[],
        sizes: Omit<Size, 'description'>[]
        price: number,
        capsule: {
            id: number,
            name: string,
        }
    },
    setSize: (size: Omit<Size, 'description'>) => void
}

const Product: React.FC<ProductProps> = ({ product, setSize }) => {



    const {
        name,
        description,
        mainImageId,
        imageIds,
        sizes,
        price,
        capsule
    } = product;

    if(!product) return <div>No Product</div>;
    const capsuleQuery = api.capsuleRouter.getCapsule.useQuery({id: capsule?.id})

    console.log("ProductPreview imageIds: ", imageIds)

    const { data: mainImage, isLoading: mainImageLoading } = api.imageRouter.getImage.useQuery({id: mainImageId});
    const { data: images, isLoading: imagesLoading } = api.imageRouter.getImages.useQuery({ids: imageIds});

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = sizes.find(size => size.id.toString() === event.target.value);
        if (selectedSize) {
            setSize(selectedSize);
        }
    };

    return (
        <div className='w-full flex flex-row p-5 gap-5'>
            <div className='h-full flex flex-col w-2/5 gap-5'>
                <h1 className='text-[21px] font-sans'>{name}</h1>
                <section className='flex flex-col gap-3'>
                    <span >{capsuleQuery.data?.name ?? "didnt work"}</span>
                    <p className='text-xs'>{description}</p>
                </section>
                <section>
                    <div className='flex flex-row gap-5'>
                        {
                            imagesLoading ? <div>Loading...</div> :
                            images ?
                            (
                                images.map(image => (
                                    <Image key={image.id} src={image.url} width={40} height={40}  />
                                )) 
                            )
                            : <div>No Main Image</div>
                        }
                    </div>
                </section>
                <section className='flex flex-col gap-3'>
                    <h2>
                        <span className=''>{ 
                            new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(price) 
                        }
                        </span>
                    </h2>
                </section>
                <section className='flex flex-col gap-3'>
                    <div className='flex flex-row gap-5'>
                        <select
                            id="size-select"
                            
                            className="mt-1 block p-1 w-20 border-half border-black shadow-sm focus:border-black focus:ring-black sm:text-sm"
                            onChange={handleSizeChange}
                        >
                            {sizes.map(size => (
                                <option key={size.id} value={size.id}>{size.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-row gap-5'>
                        <button className='w-20 bg-black text-white p-1 text-sm'>Add to Cart</button>
                        <button className='w-20 bg-black text-white p-1 text-sm'>Buy Now</button>
                    </div>
                </section>
                {/* <section className='flex flex-col gap-3'>
                        <select
                            id="size-select"
                            
                            className="mt-1 block p-1 w-full border-half border-black shadow-sm focus:border-black focus:ring-black sm:text-sm"
                            onChange={handleSizeChange}
                        >
                            {sizes.map(size => (
                                <option key={size.id} value={size.id}>{size.name}</option>
                            ))}
                        </select>
                </section> */}
            </div>
            <div className='h-full flex flex-col w-3/5'>
                {mainImage ?
                    <Image src={mainImage.url} width={500} height={500} />
                    : <div>No Main Image</div>
                }
            </div>
        </div>
    );
};

export { Product };
