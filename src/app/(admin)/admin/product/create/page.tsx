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
      productSizeIds: [],
      priceId: -1,
      capsuleId: -1,
      categoryIds: [],
      mainImageId: -1,
      imageIds: [],
    },
    onChange: (values):ValidationError => {
      console.log("Form Values: ", values);
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
    console.log("setSelectMainImage: ", id)
    setSelectedMainImage(id)
  }
  const setSelectOtherImages = (id: number[]) => {setSelectedOtherImages(id)}
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

  useEffect(() => {
    console.log("selectedMainImage", selectedMainImage)
    console.log("selectedOtherImages", selectedOtherImages)
   
      setViewProduct({
        name: formState?.name ?? "",
        description: formState?.description ?? "",
        price: formState?.priceId ?? -1,
        capsule: {
          id: formState?.capsuleId ?? -1,
          name: capsules?.find(capsule => capsule.id === formState?.capsuleId)?.name ?? "",
        },
        mainImageId: selectedMainImage ?? -1,
        imageIds: selectedOtherImages,
        sizes: formState?.productSizeIds !== undefined ?? formState?.productSizeIds.map(id => {
          return {
            id: id,
            name: sizes?.find(size => size.id === id)?.name ?? "",
          }
        }
        ) ?? [],
      });
    
   },[formState, selectedMainImage, selectedOtherImages])

   console.log("TYPE", setViewProduct)

  return (
    <ProductDataProvider>
    <div className="flex flex-row">
      <div className='h-full w-full flex flex-col justify-center align-middle p-20'>
        <CreateProductForm
          form={form}
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
      <div className='w-full h-full flex flex-col justify-center align-middle'>
        <Product product={viewProduct} setSize={setSize} />
      </div>
     
      
    </div>
    </ProductDataProvider>
  );
}
