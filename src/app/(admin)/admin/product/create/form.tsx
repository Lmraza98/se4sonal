'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { api } from "~/trpc/react";
import { SelectOrCreateDropdown } from "~/components/dropdown"
import { createProduct, type CreateProductFormState } from './actions'
import type { Price, Capsule, Category, Size, Image } from "@prisma/client"

interface CreateProductProps {
    prices: Price[],
    capsules: Capsule[],
    categories: Category[],
    sizes: Size[],
    images: Image[],
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
    mainImageId: 0
}
function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <button type="submit" aria-disabled={pending}>
        Add
      </button>
    )
  }
  
export const CreateProductForm:React.FC<CreateProductProps> = () => {
    const [state, formAction] = useFormState<CreateProductFormState>(createProduct, initialState)

   
    const categories = api.categoryRouter.getCategories.useQuery()
    return (
        <form>
            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <label className="block">
                    <span className="text-gray-700">Active</span>
                    <input type="file" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" />
                </label>
                <label className="block">
                    <span className="text-gray-700">Product Name</span>
                    <input type="text" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder="Product Name" />
                </label>
                <label className="block">
                    <span className="text-gray-700">Product Description</span>
                    <textarea className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" rows={3} placeholder="Product Description"></textarea>
                </label>
                <label className="block">
                    <span className="text-gray-700">Product Price</span>
                    <input type="text" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" placeholder="Product Price" />
                    {/* <SelectOrCreateDropdown createNew={} /> */}
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
                    <input type="file" className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0" />
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
            </div>
            <div className="flex justify-end mt-4">
                <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border">
                    Cancel
                </button>
            </div>
        </form>
    )
}