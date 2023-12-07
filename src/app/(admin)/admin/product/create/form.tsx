"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import { api } from "~/trpc/react";
import { CheckboxDropdown, Modal, Dropzone, ImagesWithPagination } from '~/components'
// import { CheckboxDropdown } from "~/components/CheckboxDropdown";
// import { Modal } from "~/components/Modal";
import type { Size, Price, Capsule, Category, Image as ImageType } from "@prisma/client";
import { FieldApi, type FormApi } from "@tanstack/react-form";
import { useProductData } from './context'


interface CreateProductFormProps {
  setSelectedMainImage: (mainImage: number) => void;
  setSelectedOtherImages: (otherImages: number[]) => void;
  sizes: Size[] | undefined;
  prices: Price[] | undefined;
  capsules: Capsule[] | undefined;
  categories: Category[] | undefined;
  images: ImageType[] | undefined;
  form: FormApi<{
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
  }, unknown>
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  form,
  sizes,
  prices,
  categories,
  capsules,
  images,
  setSelectedMainImage,
  setSelectedOtherImages
}) => {
  const [isSizeModalOpen, setSizeModalOpen] = useState<boolean>(false);
  const [isPriceModalOpen, setPriceModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [isCapsuleModalOpen, setCapsuleModalOpen] = useState<boolean>(false);

  const [editSize, setEditSize] = useState<Size>();
  const [editPrice, setEditPrice] = useState<Price>();
  const [editCategory, setEditCategory] = useState<Category>();
  const [editCapsule, setEditCapsule] = useState<Omit<Capsule, 'updatedAt' | 'createdAt'>>();
  const productData = useProductData()

  const [selectedSizes, setSelectedSizes] = useState<Size[]>([])
  const [selectedPrice, setSelectedPrice] = useState<Price>()
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedCapsule, setSelectedCapsule] = useState<Omit<Capsule, 'updatedAt' | 'createdAt'>>()

  const [selectedImages, setSelectedImages] = useState<ImageType[]>([])

  const [mainImage, setMainImage] = useState<ImageType>()
  const [mainImageId, setMainImageId] = useState<number>(-1)



  const handleSelection = (mainImage: number, otherImages: number[]) => {
    setSelectedMainImage(mainImage);
    setSelectedOtherImages(otherImages);
     // Update the form fields using the form instance
     
     form.setFieldValue('mainImageId', mainImage);
     form.setFieldValue('imageIds', otherImages);
    //  form.update('mainImageid')
    //  form.update('imageIds')

  };
 
  useEffect(() => {
    console.log("editSize", editSize);
    if (editSize) {
      setSizeModalOpen(true);
    }
  }, [editSize])
  useEffect(() => {
    if (editPrice) {
      setPriceModalOpen(true);
    }
  }, [editPrice])

  useEffect(() => {
    if (editCategory) {
      setCategoryModalOpen(true);
    }
  }, [editCategory])

  useEffect(() => {
    if (editCapsule) {
      setCapsuleModalOpen(true);
    }
  }, [editCapsule])

  useEffect(() => {
    console.log("form: ",form.state.values)
  },[form])

  // useEffect(() => {
  //   api.imageRouter.getImage.useQuery({ id: mainImageId })
  // },[mainImageId])

  if (!productData) {
    return null
  }

  const {
    deleteSize,
    refreshSizes,
    updateSize,
    deletePrice,
    refreshPrices,
    updatePrice,
    deleteCategory,
    refreshCategories,
    updateCategory,
    deleteCapsule,
    refreshCapsules,
    updateCapsule,
  } = productData

  const createSize = api.sizeRouter.createSize.useMutation();
  const createPrice = api.priceRouter.createPrice.useMutation();
  const createCategory = api.categoryRouter.createCategory.useMutation();
  const createCapsule = api.capsuleRouter.createCapsule.useMutation()

  return (
    <div className="w-full">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="flex h-full  w-full flex-col lg:flex-row gap-5">
            <div className="flex w-full h-full flex-col">
              <form.Field
                name="name"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <div>
                    <label className="block text-sm font-bold text-gray-700">
                      Product Name
                    </label>
                    <input
                      className="text-[14px] px-2 w-full rounded-lg border bg-transparent border-gray-300 focus:outline-none"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
              <form.Field
                name="description"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Product Description
                    </label>
                    <textarea
                      className="h-20 resize-none text-[14px] px-2 w-full rounded-lg border bg-transparent border-gray-300 focus:outline-none"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                )}
              />
              <form.Field
                name="stock"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Stock Amount
                    </label>
                    <input
                      type="number"
                      className="text-[14px] px-2 w-full rounded-lg border bg-transparent border-gray-300 focus:outline-none"
                      name={field.name}
                      value={field.state.value ?? ""} // Coalesce to an empty string if null
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      min="0"
                      placeholder="Enter stock amount"
                    />
                  </div>
                )}
              />
              
              <form.Field
                name="active"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Stock Amount
                    </label>
                    <input
                      type="checkbox"
                      className="form-checkbox h-6 w-6 rounded-full border-gray-300 text-blue-600 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      name={field.name}
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.checked)}
                    />
                  </div>
                )}
              />
              <form.Field
                name="mainImageId"
                // eslint-disable-next-line react/no-children-prop
                children={(field) => (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Main Image
                    </label>
                    <Dropzone setUploadedImageId={(id) => setMainImageId(id)} />
                    {
                      images && images.length > 0 ? (
                        <ImagesWithPagination images={images} onSelect={(mainImage, otherImages) => handleSelection(mainImage, otherImages)} />
                        // images.map(image => {
                        //   return (
                        //     <div key={image?.fileName}  className='flex flex-row gap-3'>
                        //     <Image src={image?.url} alt={image.fileName} height={250} width={250}/>
                        //     <button
                        //       type='button'
                        //       onClick={() => {
                        //         api.imageRouter.deleteImage.useMutation({ id: image.id })
                        //       }}
                        //     >
                        //       Delete
                        //     </button>
                        //   </div>
                        //   )

                        // })

                      ) : <div>no images</div>
                    }
                  </div>
                )}
              />
              <div className='flex flex-col justify-center gap-1'>
                <div className='flex flex-row gap-10'>
                  <form.Field
                    name="productSizeIds"
                    // eslint-disable-next-line react/no-children-prop
                    children={(field) => (
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                          Sizes
                        </label>
                        <div className='flex flex-row gap-3'>
                          <CheckboxDropdown<Size>
                            multiple={true}
                            name='Sizes'
                            items={sizes ?? []} // Pass your size items here
                            value={selectedSizes} // Pass the current value from the form field
                            onChange={(selectedItems) => {
                              setSelectedSizes(selectedItems)
                              field.handleChange(selectedItems as unknown as never[])
                            }} // Pass the onChange handler from the form field
                            onEditItem={(item: Size) => {
                              console.log("Edit Item: ", item)
                              // const changeSize = api.sizeRouter.updateSize.useMutation()
                              setEditSize(item);
                            }}
                          />
                          <CreateItem
                            <Size>
                            name='Size'
                            item={editSize ?? { id: -1, name: "", description: "" }}
                            createItem={({ name, description }) => createSize.mutate({ name, description })}
                            deleteItem={deleteSize}
                            updateItem={(size: Size) => updateSize(size)}
                            refreshItem={refreshSizes}
                            isModalOpen={isSizeModalOpen}
                            setModalOpen={setSizeModalOpen}
                            handleChange={async (updatedSize: Size) => {
                              const updatedSizes = sizes?.map(size =>
                                size.id === updatedSize.id ? updatedSize : size
                              );
                              // Update form state here
                              field.handleChange(updatedSizes as unknown as never[] ?? [] as unknown as never[]);
                              await refreshSizes()
                            }
                            } // Pass the callback to CreateItem

                            setEditItem={setEditSize}
                          />
                        </div>

                        {field.state.value !== undefined ? (
                          <DisplaySelectedItems<Size>
                            selectedItems={selectedSizes ?? []}
                            updateItems={(updatedItems) => setSelectedSizes(updatedItems)}
                          />
                          // <SelectedSizeDisplay

                          // />
                        ) : <div>no sizes</div>}

                      </div>
                    )}
                  />
                  <form.Field
                    name="priceId"
                    // eslint-disable-next-line react/no-children-prop
                    children={(field) => (
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                          Price
                        </label>
                        <div className='flex flex-row gap-3'>
                          <CreateItem
                            <Price>
                            name='Price'
                            item={editPrice ?? { id: -1, name: "", description: "", price: 0, stripeId: "" }}
                            createItem={({ name, description, stripeId, price }) => createPrice.mutate({ name, description, stripeId, price })}
                            deleteItem={deletePrice}
                            refreshItem={refreshPrices}
                            isModalOpen={isPriceModalOpen}
                            setModalOpen={setPriceModalOpen}
                            updateItem={(price: Price) => updatePrice(price)}
                            handleChange={async (updatedPrice: Price) => {
                              setSelectedPrice(updatedPrice)
                              // const updatedPrices = prices?.map(price =>
                              //   price.id === updatedPrice.id ? updatedPrice : price
                              // );
                              // Update form state here
                              field.handleChange(selectedPrice?.id ?? -1);
                              await refreshPrices()
                            }
                            } // Pass the callback to CreateItem
                            setEditItem={setEditPrice}
                          />
                        </div>
                        {field.state.value !== undefined ? (
                          <DisplaySelectedItems<Price>
                            selectedItems={selectedPrice ? [selectedPrice] : []}
                            updateItems={(updatedItems) => {
                              setSelectedPrice(
                                updatedItems[0]
                              )
                              field.handleChange(updatedItems[0]?.id ?? -1)
                            }}
                          />
                          // <SelectedSizeDisplay

                          // />
                        ) : null}

                      </div>
                    )}
                  />
                </div>
                <div className='flex flex-row  gap-10'>
                  <form.Field
                    name="categoryIds"
                    // eslint-disable-next-line react/no-children-prop
                    children={(field) => (
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                          Categories
                        </label>
                        <div className='flex flex-row gap-3'>
                          <CheckboxDropdown<Category>
                            multiple={true}
                            name='Categories'
                            items={categories ?? []} // Pass your size items here
                            value={selectedCategories} // Pass the current value from the form field
                            onChange={(selectedItems) => {
                              setSelectedCategories(selectedItems)
                              field.handleChange(selectedItems.map(item => item.id) as unknown as never[])
                            }} // Pass the onChange handler from the form field
                            onEditItem={(item: Category) => {
                              console.log("Edit Item: ", item)
                              // const changeSize = api.sizeRouter.updateSize.useMutation()
                              setEditCategory(item);
                            }}
                          />
                          <CreateItem
                            <Category>
                            name='Categories'
                            item={editCategory ?? { id: -1, name: "", description: "" }}
                            createItem={({ name, description }) => createCategory.mutate({ name, description })}
                            deleteItem={deleteCategory}
                            refreshItem={refreshCategories}
                            isModalOpen={isCategoryModalOpen}
                            setModalOpen={setCategoryModalOpen}
                            updateItem={(category: Category) => updateCategory(category)}
                            handleChange={async (updatedCategory: Category) => {
                              const updatedCategories = categories?.map(category =>
                                category.id === updatedCategory.id ? updatedCategory : category
                              );
                              // Update form state here
                              field.handleChange(updatedCategories as unknown as never[] ?? [] as unknown as never[]);
                              await refreshCategories()
                            }
                            } // Pass the callback to CreateItem

                            setEditItem={setEditCategory}
                          />
                        </div>

                        {selectedCategories && selectedCategories.length > 0 ? (
                          <DisplaySelectedItems<Category>
                            selectedItems={selectedCategories}
                            updateItems={(updatedItems) => {
                              field.handleChange(updatedItems.map(item => item.id) as unknown as never[])
                              setSelectedCategories(updatedItems)
                            }}
                          />
                          // <SelectedSizeDisplay

                          // />
                        ) : <div>no categories selected </div>}

                      </div>
                    )}
                  />
                  <form.Field
                    name="capsuleId"
                    // eslint-disable-next-line react/no-children-prop
                    children={(field) => (
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700">
                          Capsule
                        </label>
                        <div className='flex flex-row gap-3'>
                          <CheckboxDropdown<Omit<Capsule, 'updatedAt' | 'createdAt'>>
                            name='Capsules'
                            items={capsules ?? []} // Pass your size items here
                            value={selectedCapsule ? [selectedCapsule] : []} // Pass the current value from the form field
                            onChange={(selectedItems) => {
                              console.log("Selected Items: ", selectedItems)
                              console.log("Selected Capsule: ", selectedCapsule)
                              setSelectedCapsule(selectedItems[0])

                              field.handleChange(selectedItems[0]?.id ?? -1)
                            }
                            } // Pass the onChange handler from the form field
                            onEditItem={(item: Omit<Capsule, 'updatedAt' | 'createdAt'>) => {
                              console.log("Edit Capsule: ", item)
                              // const changeSize = api.sizeRouter.updateSize.useMutation()
                              setEditCapsule(item);
                            }}
                          />
                          <CreateItem
                            <Omit<Capsule, 'updatedAt' | 'createdAt'>>
                            name='Capsules'
                            item={editCapsule ?? { id: -1, name: "", description: "" }}
                            createItem={({ name, description }) => createCapsule.mutate({ name, description })}
                            deleteItem={deleteCapsule}
                            refreshItem={refreshCapsules}
                            isModalOpen={isCapsuleModalOpen}
                            setModalOpen={setCapsuleModalOpen}
                            updateItem={(capsule: Omit<Capsule, 'createdAt' | 'updatedAt'>) => updateCapsule(capsule)}
                            handleChange={async (updatedCapsule: Omit<Capsule, 'updatedAt' | 'createdAt'>) => {
                              // const updatedCapsules = capsules?.map(capsule =>
                              //   capsule.id === updatedCapsule.id ? updatedCapsule : capsule
                              // );
                              // Update form state here
                              field.handleChange(updatedCapsule.id);
                              await refreshCapsules()
                            }
                            } // Pass the callback to CreateItem

                            setEditItem={setEditCapsule}
                          />
                        </div>

                        {selectedCapsule ? (
                          <DisplaySelectedItems<Omit<Capsule, 'updatedAt' | 'createdAt'>>
                            selectedItems={[selectedCapsule]}
                            updateItems={(updatedItems) => {
                              setSelectedCapsule(updatedItems[0])
                              field.handleChange(updatedItems[0]?.id ?? -1)
                            }}
                          />
                        ) : (<div>no categories selected </div>)
                        }
                      </div>
                    )}
                  />
                  
                </div>
              </div>

            </div>



          </div>
          <button className='mt-5 w-28 bg-black text-white p-2 text-md' type="submit">Create Product</button>
          
        </form>
      </form.Provider>
    </div>
  );
};

interface Item {
  id: number;
  name: string;
  description: string | null;
}

interface DisplaySelectedItemsProps<T extends Item> {
  selectedItems: T[];
  updateItems: (updatedItems: T[]) => void; // Generic function to update items
}

const DisplaySelectedItems = <T extends Item>({
  selectedItems,
  updateItems,
}: DisplaySelectedItemsProps<T>) => {
  const handleRemoveItem = (id: number) => {
    const newSelectedItems = selectedItems.filter((item) => item.id !== id);
    updateItems(newSelectedItems);
  };

  return (
    <div className="mt-2 flex flex-wrap">
      {
        selectedItems.map((item) => (
          <div
            key={item.id}
            className="m-1 flex items-center rounded bg-blue-100 p-1"
          >
            <span className="text-sm text-gray-700">{item.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(item.id)}
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              x
            </button>
          </div>
        ))}
    </div>
  );
};


interface CreateItemProps<T extends Item> {
  name: string;
  item: T;
  createItem: (item: Omit<T, 'id'>) => void;
  updateItem: (item: T) => void;
  deleteItem: (id: number) => void;
  refreshItem: () => Promise<void> | void | null;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (update: T) => void; // New callback prop
  setEditItem: React.Dispatch<React.SetStateAction<T | undefined>>;
}
// const [isModalOpen, setModalOpen] = useState<boolean>(false);


function CreateItem<T extends Item>({
  name, item, createItem, updateItem, deleteItem, refreshItem, isModalOpen, setModalOpen, handleChange, setEditItem
}: CreateItemProps<T>) {

  const [form, setForm] = useState<T>(item);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleSubmit = async () => {
    if (form.id !== undefined && form.id !== -1) {
      if (form.name) {
        // Updating an existing size
        updateItem(form);
        await refreshItem()
        handleChange(form)
        setModalOpen(false)
      } else {
        // Error handling for missing name field
        console.error("Name is required for updating a size");
      }
    } else {
      // Creating a new size
      if (form.name) {
        const newSize = createItem(form);
        await refreshItem()
        setModalOpen(false)
      } else {
        // Error handling for missing name field
        console.error("Name is required for creating a size");
      }
    }
    // Additional actions like closing modal or revalidation can go here
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="w-20 bg-black text-white p-1 text-sm"
        >
          {`Create`}
        </button>
        <Modal
          id={name}
          title={form.id !== -1 ? "Edit Item" : "Create Item"}
          isOpen={isModalOpen}
          onClose={() => {
            setForm({ ...form, id: -1, name: "", description: "" } as T);
            setModalOpen(false)
          }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Name
              </label>
              <input
                name={form?.name ? form.name : ''}
                value={form?.name ? form.name : ''}
                // onBlur={field.handleBlur}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea
                className="h-32 w-full resize-none rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none"
                name={"description"}
                value={form?.description ? form?.description : ''}
                // onBlur={field.handleBlur}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <button
                type='button'
                onClick={handleSubmit}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
              >
                {form?.id && form?.id !== -1 ? `Update ${name}` : `Create ${name}`}
              </button>
              <button
                type='button'
                onClick={() => {
                  deleteItem(form.id)
                  setModalOpen(false)
                }}
                className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
              >
                Delete Size
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}