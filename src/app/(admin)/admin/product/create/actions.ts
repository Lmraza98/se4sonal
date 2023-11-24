// 'use server'
// import { api } from '~/trpc/server'
// import { Product } from '@prisma/client'
// import { revalidatePath } from 'next/cache'
// import type { Price, Capsule, Category, Sizes, Image } from "@prisma/client"

// export interface CreateProductFormState {
//     active: boolean;
//     name: string;
//     description: string;
//     priceId: number;
//     stock: number | null;
//     mainImageId: number;
//     imageIds: number[];
//     categoryId: number;
//     capsuleId: number;
//     sizeIds: number[];
//     stripeId: string;
// }
// export const createProduct = async (state:CreateProductFormState):Promise<CreateProductFormState> => {
//     if(typeof state !== "object") throw new Error("not an object")
//     return await api.product.createProduct.mutate({
//         active: state.active,
//         name: state.name,
//         description: state.description,
//         priceId: state.priceId,
//         stock: state.stock ?? 0,
//         mainImageId: state.mainImageId,
//         imageIds: state.imageIds,
//         categoryId: state.categoryId,
//         capsuleId: state.capsuleId,
//         sizeIds: state.sizeIds,
//         stripeId: state.stripeId,
//     })
// }

// export const createCategory = async (name: string) => {
//     if(typeof name !== "string") throw new Error("not a string")
//     console.log("NAME: ", name)
//     return await api.categoryRouter.createCategory.mutate({
//         name: name,
        
//     })
// }
// export const fetchCategories = async () => {
//     return await api.categoryRouter.getCategories.query()
// }
// interface Item {
//     name: string
//     id: number
// }

// export const itemToString = <T extends Item>(item: T): string => {
//     return item.name;
// }
