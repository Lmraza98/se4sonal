"use client";
import { api } from "~/trpc/react";
import { ValidationError, useForm } from "@tanstack/react-form";
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
  } = api.imageRouter.getAllImages.useQuery();

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
  const [formState, setFormState ] = useState<{
    stripeId: string;
    name: string;
    description: string;
    stock: number;
    active: boolean;
    productSizeIds: number[];
    priceId: number;
    capsuleId: number;
    categoryIds: number[];
    mainImageId: number;
    imageIds: number[];
  }>()

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
    onChange: (values):ValidationError => {
      setFormState(values)
      return null as unknown as ValidationError
    },
    onSubmit: (values) => {
      createProduct.mutate(values);
    },
  });
  const [viewProduct, setViewProduct] = useState<{
    name: string;
    description: string;
    price: number;
    categories: {
      id: number;
      name: string;
    }[];
    capsule: {
      id: number;
      name: string;
    };
    mainImageId: number;
    imageIds: number[];
    sizes: {
      id: number;
      name: string;
    }[];
  }>({
    name: "",
    description: "",
    price: -1,
    categories: [{
      id: -1,
      name: "",
    }],
    capsule: {
      id: -1,
      name: "",
    },
    mainImageId: -1,
    // images: [],
    imageIds: [-1],
    sizes: [{
      id: -1,
      name: "",
    }],
  });

  const { sizes } = useSize()
  const { prices } = usePrice();
  const { capsules } = useCapsule();
  const { categories } = useCategory();
  const { images } = useImage();
  const [selectedMainImage, setSelectedMainImage] = useState<number | null>(null);
  const [selectedOtherImages, setSelectedOtherImages] = useState<number[]>([]);

  const setSelectMainImage = (id: number) => {
    setSelectedMainImage(id)
  }
  const setSelectOtherImages = (id: number[]) => {setSelectedOtherImages(id)}

  const [size, setSize] = useState<Omit<Size, 'description'> | null>(null);

  useEffect(() => {
    setViewProduct((product) => {
      return {
        ...product,
        name: formState?.name ?? "",
        description: formState?.description ?? "",
        mainImageId: selectedMainImage ?? -1,
        imageIds: selectedOtherImages,
      }
    });
    
    
   },[formState, selectedMainImage, selectedOtherImages])


  return (
    <ProductDataProvider>
    <div className="flex flex-row">
      <div className='h-full w-full flex flex-col justify-center align-middle px-20 pt-5'>
        <CreateProductForm
          form={form}
          viewProduct={viewProduct}
          setViewProduct={setViewProduct}
          sizes={sizes}
          capsules={capsules}
          prices={prices}
          categories={categories}
          images={images}
          setSelectedMainImage={setSelectMainImage}
          setSelectedOtherImages={setSelectOtherImages}
        />
      </div>
      <div className='w-full h-screen flex flex-col justify-center align-middle'>
        <Product product={viewProduct} setSize={setSize} />
      </div>
    </div>
    </ProductDataProvider>
  );
}
