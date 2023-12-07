"use client";
import { api } from "~/trpc/react";
import { useForm } from "@tanstack/react-form";
import { useState, useEffect } from "react";
import { Size } from "@prisma/client";
import { CreateProductForm } from "./form";
import { ProductDataProvider } from './context'
import { Product } from '~/components'

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
      productSizeIds: [-1],
      priceId: -1,
      capsuleId: -1,
      categoryIds: [-1],
      mainImageId: -1,
      imageIds: [-1],
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

  const product = {
    name: "Alyx Icon Flower",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum quis elit euismod, fermentum est vel, pulvinar lectus. In hac habitasse platea dictumst. Sed consequat libero quis mi malesuada, ut feugiat massa feugiat. Duis feugiat tincidunt dolor ut pretium.",
    price: 100,
    capsule: {
      id: 1,
      name: "Fall Launch 2024",
    },
    mainImage: {
      id: 1,
      url: "/logo/black.png",
      fileName: "test",
    },
    images: [
      {
        id: 1,
        url: "/logo/black.png",
        fileName: "test",
      },
    ],
    sizes: [
      {
        id: 1,
        name: "Small",
      },
      {
        id: 2,
        name: "Medium",
      },
      {
        id: 3,
        name: "Large",
      },
    ],
  };

  const [size, setSize] = useState<Omit<Size, 'description'> | null>(null);
  

  return (
    <ProductDataProvider>
    <div className="flex h-screen flex-row">
      <div className='w-1/2 py-5'>
        <CreateProductForm
          form={form}
          sizes={sizes}
          capsules={capsules}
          prices={prices}
          categories={categories}
          images={images}
        />
      </div>
      <div className='w-1/2 flex flex-col justify-center align-middle'>
        <Product product={product} setSize={setSize} />
      </div>
     
      
    </div>
    </ProductDataProvider>
  );
}
