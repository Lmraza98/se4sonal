"use client"
import React, { createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import { api } from "~/trpc/react";
import type { Size, Price, Capsule, Category, Image } from "@prisma/client";

interface ProductDataContextProps {
    updateSize: (size: Size) => void;
    updatePrice: (price: Price) => void;
    updateCapsule: (capsule: Omit<Capsule, 'createdAt'|'updatedAt'>) => void;
    updateCategory: (category: Category) => void;
    updateImage: (id: number, url: string, fileName: string, fileSize: number, fileKey: string) => void;
    deleteSize: (id: number) =>  void;
    deletePrice: (id: number) =>  void;
    deleteCapsule: (id: number) =>  void;
    deleteCategory: (id: number) =>  void;
    deleteImage: (id: number) =>  void;
    refreshSizes: () => Promise<void> | void | null;
    refreshPrices: () => Promise<void> | void | null;
    refreshCapsules: () => Promise<void> | void | null;
    refreshCategories: () => Promise<void> | void | null;
    refreshImages: () => Promise<void> | void | null;
}


const ProductDataContext = createContext<ProductDataContextProps>({
    updateSize: () => {
        console.log('updateSize not implemented')
    },
    updatePrice: () => {
        console.log('updateSize not implemented')
    },
    updateCapsule: () => {
        console.log('updateSize not implemented')
    },
    updateCategory: () => {
        console.log('updateSize not implemented')
    },
    updateImage: () => {
 console.log('updateSize not implemented')
},
    deleteSize: () => {
 console.log('updateSize not implemented')
},
    deletePrice: () => {
 console.log('updateSize not implemented')
},
    deleteCapsule: () => {
 console.log('updateSize not implemented')
},
    deleteCategory: () => {
 console.log('updateSize not implemented')
},
    deleteImage: () => {
 console.log('updateSize not implemented')
},
    refreshSizes: () => {
 console.log('updateSize not implemented')
},
    refreshPrices: () => {
 console.log('updateSize not implemented')
},
    refreshCapsules: () => {
 console.log('updateSize not implemented')
},
    refreshCategories: () => {
 console.log('updateSize not implemented')
},
    refreshImages: () => {
 console.log('updateSize not implemented')
},
});

export const useProductData = () => useContext(ProductDataContext);
interface ProductDataProviderProps {
    children: React.ReactNode;
}
export const ProductDataProvider: React.FC<ProductDataProviderProps> = ({ children }) => {
    const {
        sizeRouter,
        capsuleRouter,
        categoryRouter,
        priceRouter,
        imageRouter,
    } = api.useUtils();
    const refreshSizes = useCallback(async (): Promise<void> => {
        await sizeRouter.getAllSizes.invalidate();
        await sizeRouter.getAllSizes.refetch()
    }, []);
    // Implement similar functions for deleteSize, deleteCapsule, deleteCategory, deleteImage
    const refreshPrices = useCallback(async (): Promise<void> => {
        await priceRouter.getAllPrices.invalidate();
        await priceRouter.getAllPrices.refetch()
    }, []);
    const refreshCapsules = useCallback(async (): Promise<void> => {
        await capsuleRouter.getCapsules.invalidate();
        await capsuleRouter.getCapsules.refetch()
    }, []);
    const refreshCategories = useCallback(async (): Promise<void> => {
        await categoryRouter.getCategories.invalidate();
        await categoryRouter.getCategories.refetch()
    }, []);
    const refreshImages = useCallback(async (): Promise<void> => {
        await imageRouter.getImages.invalidate();
        await imageRouter.getImages.refetch()
    }, []);

    // const deleteSize = async (id: number): Promise<void> => {
    //     api.sizeRouter.deleteSize.useMutation().mutate({ id });
    //     await refreshSizes()
    // }
    const { mutate: deleteSizeMutate } = api.sizeRouter.deleteSize.useMutation();
    const deleteSize = useCallback(async (id: number) => {
        deleteSizeMutate({ id });
        await refreshSizes()
        // Additional logic if needed
    }, [deleteSizeMutate]);

    const { mutate: deletePriceMutate } = api.priceRouter.deletePrice.useMutation();
    const deletePrice = useCallback((id: number) => {
        deletePriceMutate({ id });
        // Additional logic if needed
    }, [deletePriceMutate]);

    const { mutate: deleteCapsuleMutate } = api.capsuleRouter.deleteCapsule.useMutation();
    const deleteCapsule = useCallback((id: number) => {
        deleteCapsuleMutate({ id });
        // Additional logic if needed
    }, [deleteCapsuleMutate]);

    const { mutate: deleteCategoryMutate } = api.categoryRouter.deleteCategory.useMutation();
    const deleteCategory = useCallback((id: number) => {
        deleteCategoryMutate({ id });
        // Additional logic if needed
    }, [deleteCategoryMutate]);

    const { mutate: deleteImageMutate } = api.imageRouter.deleteImage.useMutation();
    const deleteImage = useCallback((id: number) => {
        deleteImageMutate({ id });
        // Additional logic if needed
    }, [deleteImageMutate]);

    const { mutate: updateSizeMutate } = api.sizeRouter.updateSize.useMutation();
    const updateSize = useCallback((size:Size) => {
        updateSizeMutate({ ...size });
        // Additional logic if needed
    }, [updateSizeMutate]);

    const { mutate: updatePriceMutate } = api.priceRouter.updatePrice.useMutation();
    const updatePrice = useCallback((price:Price) => {
        updatePriceMutate({ ...price });
        // Additional logic if needed
    }, [updatePriceMutate]);

    const { mutate: updateCapsuleMutate } = api.capsuleRouter.updateCapsule.useMutation();
    const updateCapsule = useCallback((capsule: Omit<Capsule, 'createdAt'|'updatedAt'>) => {
        updateCapsuleMutate({ ...capsule });
        // Additional logic if needed
    }, [updateCapsuleMutate]);

    const { mutate: updateCategoryMutate } = api.categoryRouter.updateCategory.useMutation();
    const updateCategory = useCallback((category: Category) => {
        updateCategoryMutate({ ...category });
        // Additional logic if needed
    }, [updateCategoryMutate]);

    const { mutate: updateImageMutate } = api.imageRouter.updateImage.useMutation();
    const updateImage = useCallback((id: number, url: string, fileName: string, fileSize: number, fileKey: string) => {
        updateImageMutate({ id, url, fileName, fileSize, fileKey });
        // Additional logic if needed
    }, [updateImageMutate]);
    
    const productData = useMemo(() => ({
        updateSize, updatePrice, updateCapsule, updateCategory, updateImage,
        deleteSize, deletePrice, deleteCapsule, deleteCategory, deleteImage,
        refreshSizes, refreshPrices, refreshCapsules, refreshCategories, refreshImages,
    }), [
        updateSize, updatePrice, updateCapsule, updateCategory, updateImage,
        deleteSize, deletePrice, deleteCapsule, deleteCategory, deleteImage,
        refreshSizes, refreshPrices, refreshCapsules, refreshCategories, refreshImages,
    ]);

    return (
        <ProductDataContext.Provider value={
        {
            ...productData
        }
        }>
            {children}
        </ProductDataContext.Provider>
    );
};
