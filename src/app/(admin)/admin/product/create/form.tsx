"use client"
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { api } from "~/trpc/react";
import { SelectOrCreateDropdown } from "~/components/dropdown"
import { Product } from '~/components/product'
import { createProduct, type CreateProductFormState } from './actions'
import type { Price, Capsule, Category, Size, Image, Sizes, ProductImage } from "@prisma/client"
import type { RouterOutputs } from "~/trpc/shared"


export type ProductType = RouterOutputs['product']['getProduct']

interface CreateProductProps {
    prices: Price[];
    capsules: Capsule[];
    categories: Category[];
    sizes: Size[];
    images: Image[];
}

const initialState: CreateProductFormState = {
    active: true,
    stripeId: "",
    name: "",
    description: "",
    priceId: 0,
    stock: 0,
    categoryId: 0,
    capsuleId: 0,
    sizeIds: [],
    imageIds: [],
    mainImageId: 0,
    price: undefined,
    capsule: undefined,
    category: undefined,
    size: undefined,
    cartId: undefined,
    sizes: [],
    images: [],
    createdAt: undefined,
    updatedAt: undefined,
    sizeId: undefined
}
function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <button type="submit" aria-disabled={pending}>
        Add
      </button>
    )
  }

export type PriceMutation = typeof api.priceRouter.createPrice.useMutation;

export const CreateProductForm:React.FC<CreateProductProps> = ({ capsules, categories, images, prices, sizes }) => {
    const [ formState, formActionFunction ] = useFormState<CreateProductFormState, unknown>(createProduct, initialState)
    const [formFields, setFormFields] = React.useState<CreateProductFormState>(initialState);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formActionFunction(formFields);
    };

    React.useEffect(() => {
        console.log(formFields)
    },[formFields])  

    // console.log(formState)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormFields(prev => ({ ...prev, [name]: value }));
    };
    const handleActivateChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { checked } = e.target;
        setFormFields(prev => ({ ...prev, active: checked }));
    }

    // Custom handler for price change
    const handlePriceChange = (price:Price) => {
        setFormFields(prev => ({ ...prev, priceId: price.id }))
    }
    const handleSizeChange = (size:Size) => {
        setFormFields(prev => ({ ...prev, sizes: [...prev.sizes, size] }))
    }

    // // Other custom handlers as needed...

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     // Handle form submission
    // };



    // Creation functions for each type

    type CreatePrice = typeof createPrice


    // const createImage = (name) => { /* logic to create an image */ };
    // const createCategory = (name) => { /* logic to create a category */ };

    interface Item {
        id: number;
        name: string;
    }

    const itemToString = (item:Required<Item>) => item.name;
    // const handlePriceChange = (price:Price) => {
    //     // formAction({ ...state, priceId: price.id }); 
    // };
    
    const initCapsule = () => {
        return {
            name: "",
            description: "",
        } as Capsule
    }
    // const createCapsule = (capsule:Capsule) => {
    //     return 
    // }

    const CapusuleSelectOrCreate = () =>  
        <SelectOrCreateDropdown<Capsule>
            createNew={api.capsuleRouter.createCapsule.useMutation()}
            data={capsules}
            itemToString={itemToString}
            label='Capsule'
            valueKey='id'
            initItem={initCapsule}
            onItemSelect={(item:Capsule | undefined) => {
                if(!item) return
                setFormFields(prev => ({ ...prev, capsuleId: item.id ?? item.id }))
            }}
        />

    const initPrice = () => {
        return {
            price: 0,
            description: "",
            stripeId: "",
            name: "",
        } as Price
    }
    
    const createPrice = ( ) => {
        return api.priceRouter.createPrice.useMutation()
    }
    
    const PriceSelectOrCreate = () => 
        <SelectOrCreateDropdown<Price>
            createNew={createPrice}
            data={prices}
            itemToString={itemToString}
            label='Price'
            valueKey='id'
            initItem={initPrice}
            onItemSelect={(item:Price | undefined) => {
                if(!item) return
                setFormFields(prev => ({ ...prev, priceId: item.id ?? item.id }))
            }}
        />
    const initSize = () => {
        return {
            name: "",
            description: "",
        } as Size
        }
    
    const createSize = (size:Size) => { 
        return api.sizeRouter.createSize.useQuery(size)
     };
    const SizeSelectOrCreate = () =>
        <SelectOrCreateDropdown<Size>
            createNew={createSize}
            data={sizes}
            itemToString={itemToString}
            label='Size'
            valueKey='id'
            initItem={initSize}
            onItemSelect={(size:Size | undefined ) => {
                if(!size) return
                setFormFields(prev => ({ ...prev, sizeId: size.id ?? size.id}))
            }}
        />

    // const ImageSelectOrCreate = () =>
    //     <SelectOrCreateDropdown<Image>
    //         createNew={createImage}
    //         data={images}
    //         itemToString={itemToString}
    //         label='Image'
    //         valueKey='id'
    //     />

    // const CategorySelectOrCreate = () =>
    //     <SelectOrCreateDropdown<Category>
    //         createNew={createCategory}
    //         data={categories}
    //         itemToString={itemToString}
    //         label='Category'
    //         valueKey='id'
    //     />

    return (
        <form>
            <div className='flex flex-row'>
                <div className="flex flex-col justify-start gap-5 w-full">
                    <h2>Create Product</h2>
                    <label className="block">
                        <span className="text-gray-700">Active</span>
                        <input 
                            type="checkbox" 
                            className="mt-1 block" 
                            name="active" 
                            id="active"
                            checked={formFields.active}
                            onChange={handleActivateChange}
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Name</span>
                        <input onChange={handleInputChange} name='productName' type="text" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder="Product Name" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Description</span>
                        <textarea name='description' className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" rows={3} placeholder="Product Description"></textarea>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Price</span>
                        {/* <input type="text" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder="Product Price" /> */}
                        <PriceSelectOrCreate onPriceChange={handlePriceChange} />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Main Image</span>
                        <input type="file" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" />
                    </label>     
                    
                    <label className="block">
                        <span className="text-gray-700">Product Alternate Images</span>
                        <input type="file" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Sizes</span>
                        <SizeSelectOrCreate
                             
                        
                        
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Stock Ammount</span>
                        <input type="file" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Capsule</span>
                        <select className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0">
                            <option>Category 1</option>
                            <option>Category 2</option>
                            <option>Category 3</option>
                        </select>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Product Tags</span>
                        <input type="text" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder="Product Tags" />
                    </label>
                    <div className="flex justify-end mt-4">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border">
                        Cancel
                    </button>
                    </div>
                </div>
                <div className='w-full flex flex-col'>
                <Product {...formState} />
                </div>
            </div>
            
            
        </form>
    )
}