"use client";
import { api } from "~/trpc/react";
import { useForm } from "@tanstack/react-form";
import { useState, useEffect } from "react";
import { Size } from "@prisma/client";
import { CreateProductForm } from "./form";
import { ProductDataProvider } from './context'
// import { Product } from '~/components/product'

const usePrice = () => {
  const {
    data: prices,
    isLoading,
    error,
  } = api.priceRouter.getAllPrices.useQuery();

  return { prices, isLoading, error};
}

const useImage = () => {
  const {
    data: images,
    isLoading,
    error,
  } = api.imageRouter.getImages.useQuery();

  return { images, isLoading, error };
}

const useCategory = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = api.categoryRouter.getCategories.useQuery();

  return { categories, isLoading, error };
}

const useCapsule = () => {
  const {
    data: capsules,
    isLoading,
    error,
  } = api.capsuleRouter.getCapsules.useQuery();


  return { capsules, isLoading, error };
}

const useSize = () => {
  const {
    data: sizes,
    isLoading,
    error,
  } = api.sizeRouter.getAllSizes.useQuery();

  return { sizes, isLoading, error };
};

export default function CreateProductPage() {
  
  const createProduct = api.product.createProduct.useMutation();
  const form = useForm({
    defaultValues: {
      stripeId: "",
      name: "",
      description: "",
      stock: 0,
      active: false,
      productSizeIds: [],
      priceId: -1,
      capsuleId: -1,
      categoryId: -1,
      mainImageId: -1,
      imageIds: [],
    },
    onSubmit: (values) => {
      createProduct.mutate(values);
    },
  });

  const { sizes } = useSize()
  const { prices } = usePrice();
  const { capsules } = useCapsule();
  const { categories } = useCategory();
  const { images } = useImage();

  return (
    <ProductDataProvider>
    <div className="flex h-full flex-row">
      <CreateProductForm
        form={form}
        sizes={sizes}
        capsules={capsules}
        prices={prices}
        categories={categories}
        images={images}
      />
      <div>
        {/* <Product product={form} /> */}
      </div>
    </div>
    </ProductDataProvider>
  );
}
