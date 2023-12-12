"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { CheckboxDropdown, Modal, Dropzone, ImagesWithPagination } from '~/components'
import type { Size, Price, Capsule, Category, Image as ImageType } from "@prisma/client";
import { type FormApi } from "@tanstack/react-form";
import { useProductData } from './context'

interface CreateProductFormProps {
  viewProduct: {
    name: string;
    description: string;
    price: number;
    categories: {
      id: number;
      name: string;
    }[]
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
  }
  setViewProduct: React.Dispatch<React.SetStateAction<{
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
  }>>;
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
  categories,
  capsules,
  images,
  prices,
  viewProduct,
  setSelectedMainImage,
  setSelectedOtherImages,
  setViewProduct
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
    setViewProduct(product => ({
      ...product,
      mainImageId: mainImage,
      imageIds: otherImages
    }))
    form.setFieldValue('mainImageId', mainImage);
    form.setFieldValue('imageIds', otherImages);
  };

  useEffect(() => {
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

  const CreateSizeModal = () => {
    const field = form.useField({ name: 'productSizeIds' })
    return (
      <CreateItemModal
        name='Size'
        isModalOpen={isSizeModalOpen}
        setModalOpen={setSizeModalOpen}
      >
        <BasicItemForm
          name="Size"
          setModalOpen={setSizeModalOpen}
          item={editSize ?? { id: -1, name: "", description: "" }}
          createItem={({ name, description }) => createSize.mutate({ name, description })}
          deleteItem={(id: number) => {
            setEditSize({
              id: -1,
              name: "",
              description: ""
            })
            deleteSize(id)
          }
          }
          updateItem={(size: Size) => updateSize(size)}
          refreshItem={refreshSizes}
          handleChange={async (updatedSize: Size) => {
            const updatedSizes = sizes?.map(size =>
              size.id === updatedSize.id ? updatedSize : size
            );
            // Update form state here
            field.handleChange(updatedSizes as unknown as never[] ?? [] as unknown as never[]);
            await refreshSizes()
          }} // Pass the callback to CreateItem
        />
      </CreateItemModal>
    )
  }
  const CreatePriceModal = () => {
    const field = form.useField({ name: 'priceId' })

    return (
      <CreateItemModal
        name='Price'
        isModalOpen={isPriceModalOpen}
        setModalOpen={setPriceModalOpen}
      >
        <PriceForm
          name="Price"
          setModalOpen={setPriceModalOpen}
          item={editPrice ?? { id: -1, name: "", currency: "", stripeId: "", unitAmmount: 0 }}
          createItem={
            ({ name, currency, unitAmmount, stripeId }) => {
              const curr = typeof currency === 'string' ? currency : "USD";
              const ua = typeof unitAmmount === 'number' ? unitAmmount : 0
              createPrice.mutate({
                currency: currency ?? "USD",
                unitAmmount: ua,
              })
            }
          }
          deleteItem={deletePrice}
          refreshItem={refreshPrices}
          updateItem={(price: Price) => updatePrice(price)}
          handleChange={async (updatedPrice: Price) => {
            setSelectedPrice(updatedPrice)
            field.handleChange(selectedPrice?.id ?? -1);
            await refreshPrices()
          }}
        />
      </CreateItemModal>
    )
  }

  const CreateCategoryModal = () => {
    const field = form.useField({ name: 'categoryIds' })

    return (
      <CreateItemModal
      name='Category'
      isModalOpen={isCategoryModalOpen}
      setModalOpen={setCategoryModalOpen}
    >
      <BasicItemForm
        <Category>
        name="Category"
        setModalOpen={setCategoryModalOpen}
        item={editCategory ?? { id: -1, name: "", description: "" }}
        createItem={({ name, description }) => createCategory.mutate({ name, description })}
        deleteItem={deleteCategory}
        refreshItem={refreshCategories}
        updateItem={(category: Category) => setEditCategory(category)}
        handleChange={async (updatedCategory: Category) => {
          const updatedCategories = categories?.map(category =>
            category.id === updatedCategory.id ? updatedCategory : category
          );
          // Update form state here
          field.handleChange(updatedCategories as unknown as never[] ?? [] as unknown as never[]);
          await refreshCategories()
        }
        } // Pass the callback to CreateItem
      />
      </CreateItemModal>
    )
  }

  const CreateCapsuleModal = () => {
    const field = form.useField({ name: 'capsuleId' })

    return (
      <CreateItemModal
      name='Capsules'
      isModalOpen={isCapsuleModalOpen}
      setModalOpen={setCapsuleModalOpen}
    >
      <BasicItemForm<Omit<Capsule, 'updatedAt' | 'createdAt'>>
        name="Capsule"
        setModalOpen={setCapsuleModalOpen}
        item={editCapsule ?? { id: -1, name: "", description: "" }}
        createItem={({ name, description }) => createCapsule.mutate({ name, description })}
        deleteItem={deleteCapsule}
        refreshItem={refreshCapsules}
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
      />
    </CreateItemModal>
    )
  }
  const createProduct = api.product.createProduct.useMutation()
  return (
    <div className="w-full">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("CATEGORY IDS: ", viewProduct.categories.map(category => category.id))
            const categoryId = viewProduct.categories[0]?.id ?? -1
            createProduct.mutate({
              name: viewProduct.name,
              description: viewProduct.description,
              stock: 0,
              active: false,
              productSizeIds: viewProduct.sizes.map(size => size.id),
              priceId: viewProduct.price,
              capsuleId: viewProduct.capsule.id,
              mainImageId: viewProduct.mainImageId,
              imageIds: viewProduct.imageIds,
              categoryId: categoryId
            })
            // api.product.createProduct.mutate(viewProduct)
            // api.productRouter.createProduct.mutate({
            // void form.handleSubmit();
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
                        <ImagesWithPagination images={images} onSelect={(mainImage, otherImages) => handleSelection(mainImage ?? -1, otherImages)} />
                      ) : <div>no images</div>
                    }
                  </div>
                )}
              />
              <div className='flex flex-col justify-center gap-1'>
                <div className='flex flex-row gap-10'>
                  <FormField<Size>
                    form={form}
                    name="productSizeIds"
                    label="Sizes"
                    type="multi-dropdown"
                    items={sizes}
                    onEditItem={(item) => {
                      setEditSize(item)
                      setSizeModalOpen(true)
                    }}
                    selectedItems={selectedSizes ? selectedSizes : []}
                    setSelectedItems={(item) => {
                      setSelectedSizes(item)
                      setViewProduct(product=> ({
                          ...product,
                          sizes: item.map(size => {
                            return {
                              id: size.id,
                              name: size.name
                            }
                          })
                        })
                      )
                      // form.useField({name: 'productSizeIds'}).handleChange(item.map(size => size.id))
                    }}
                    createItemModal={
                      <CreateSizeModal />
                    }
                    renderSelectedItems={(selectedItems) =>
                      selectedItems && selectedItems.length > 0 ? (
                        <DisplaySelectedItems<Size>
                          selectedItems={selectedItems ?? []}
                          updateItems={(updatedItems) => setSelectedSizes(updatedItems)}
                        />
                      ) : <div>no sizes</div>
                    }
                  />
                  <FormField<Price>
                    form={form}
                    name="priceId"
                    label="Price"
                    type="multi-dropdown"
                    items={prices}
                    onEditItem={(item) => {
                      setEditPrice(item)
                      setPriceModalOpen(true)
                    }}
                    selectedItems={selectedPrice ? [selectedPrice] : []}
                    setSelectedItems={(item) => {
                      setViewProduct((selected)=> {
                        return {
                          ...selected,
                          price: item.length > 0 ? item[0]?.id ?? 0 : selected.price
                        }
                      })
                      setSelectedPrice(item[0])
                    }}
                    createItemModal={
                      <CreatePriceModal />
                    }
                    renderSelectedItems={(selectedItems) =>
                      selectedItems && selectedItems.length > 0 ? (
                        <DisplaySelectedItems<Price>
                          selectedItems={selectedItems ?? []}
                          updateItems={(updatedItems) => setSelectedPrice(updatedItems[0])}
                        />
                      ) : <div>no price</div>
                    }
                  />
                </div>
                <div className='flex flex-row  gap-10'>
                  <FormField<Category>
                    form={form}
                    name="categoryIds"
                    label="Categories"
                    type="multi-dropdown"
                    items={categories}
                    onEditItem={(item) => {
                      setEditCategory(item)
                      setCategoryModalOpen(true)
                    }}
                    selectedItems={selectedCategories ? selectedCategories : []}
                    setSelectedItems={(item) => {
                      setViewProduct(product=> ({
                          ...product,
                          categories: item.map(category => {
                            return {
                              id: category.id,
                              name: category.name
                            }
                          })
                        })
                      )
                      setSelectedCategories(item)
                    }}
                    createItemModal={
                      <CreateCategoryModal />
                    }
                    renderSelectedItems={(selectedItems) =>
                      selectedItems && selectedItems.length > 0 ? (
                        <DisplaySelectedItems<Category>
                          selectedItems={selectedItems ?? []}
                          updateItems={(updatedItems) => setSelectedCategories(updatedItems)}
                        />
                      ) : <div>no categories</div>
                    }
                  />
                  <FormField<Omit<Capsule, 'updatedAt' | 'createdAt'>>
                    form={form}
                    name="capsuleId"
                    label="Capsule"
                    type="multi-dropdown"
                    items={capsules}
                    onEditItem={(item) => {
                      setEditCapsule(item)
                      setCapsuleModalOpen(true)
                    }}
                    selectedItems={selectedCapsule ? [selectedCapsule] : []}
                    setSelectedItems={(item) => {
                      setSelectedCapsule({
                        id: item[0]?.id ?? selectedCapsule?.id ?? -1,
                        name: item[0]?.name ?? selectedCapsule?.name ?? "",
                        description: ''
                      })
                      setViewProduct(product=> ({
                          ...product,
                          capsule: {
                            id: item[0]?.id ?? product.capsule.id,
                            name: item[0]?.name ?? product.capsule.name
                          }
                        })
                      )
                      
                    }}
                    createItemModal={
                      <CreateCapsuleModal />
                    }
                    renderSelectedItems={(selectedItems) =>
                      selectedItems && selectedItems.length > 0 ? (
                        <DisplaySelectedItems<Omit<Capsule, 'updatedAt' | 'createdAt'>>
                          selectedItems={selectedItems ?? []}
                          updateItems={(updatedItems) => setSelectedCapsule(updatedItems[0])}
                        />
                      ) : <div>no categories</div>
                    }
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

interface DisplayItem {
  id: number;
  name: string | null;
  // description: string | null;
}

interface DisplaySelectedItemsProps<T extends DisplayItem> {
  selectedItems: T[];
  updateItems: (updatedItems: T[]) => void; // Generic function to update items
}

const DisplaySelectedItems = <T extends DisplayItem>({
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


interface CreateItemModalProps {
  name: string;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

function CreateItemModal({
  name, isModalOpen, setModalOpen, children
}: CreateItemModalProps) {

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
          // title={form.id !== -1 ? "Edit Item" : "Create Item"}
          isOpen={isModalOpen}
          onClose={() => {
            // setForm({ ...form, id: -1, name: "", description: "" } as T);
            setModalOpen(false)
          }}
        >{
            children
          }
        </Modal>
      </div>
    </div>
  );
}

interface Item {
  id: number;
  name: string | null;
  description?: string | null;
}

interface BasicItemFormProps<T extends Item> {
  item: T;
  name: string;
  handleChange: (update: T) => void; // New callback prop
  deleteItem: (id: number) => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createItem: (item: Omit<T, 'id'>) => void;
  updateItem: (item: T) => void;
  refreshItem: () => Promise<void> | void | null;
}

function BasicItemForm<T extends Item>({ item, name, handleChange, deleteItem, setModalOpen, createItem, updateItem, refreshItem }: BasicItemFormProps<T>) {
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
  )
}

interface PriceFormProps {
  item: Price;
  name: string;
  handleChange: (update: Price) => void; // New callback prop
  deleteItem: (id: number) => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createItem: (item: Omit<Price, 'id'>) => void;
  updateItem: (item: Price) => void;
  refreshItem: () => Promise<void> | void | null;
}

const PriceForm = ({ item, name, handleChange, deleteItem, setModalOpen, createItem, updateItem, refreshItem }: PriceFormProps) => {
  const [form, setForm] = useState<Price>(item);

  useEffect(() => {
    setForm(item);
  }, [item]);

  const handleSubmit = async () => {
    // updateItem(form);
    // await refreshItem()
    // handleChange(form)
    // setModalOpen(false)

    if (form.id !== undefined && form.id !== -1) {
      if (form.name) {
        // Updating an existing size
        updateItem(form);
        await refreshItem()
        handleChange(form)
        setModalOpen(false)
      } else {
        // Error handling for missing name field
        console.error("Name is required for updating a price");
      }
    } else {
        createItem(form);
        await refreshItem()
        setModalOpen(false)
    
    }
    // Additional actions like closing modal or revalidation can go here
  };
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
  
    // Keep only digits
    value = value.replace(/\D/g, '');
  
    // Pad with zeros if necessary (to ensure at least 3 digits)
    value = value.padStart(3, '0');
  
    // Insert a decimal point before the last two digits
    value = value.slice(0, -2) + '.' + value.slice(-2);
  
    // Update your form state with the value converted to a whole number
    setForm({ ...form, unitAmmount: Math.round(parseFloat(value) * 100) });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Currency
        </label>
        <input
          name={'CURRENCY'}
          value={form?.currency ? form.currency : ''}
          // onBlur={field.handleBlur}
          onChange={(e) => {
            setForm(value => {
              return {
                ...value,
                currency: e.target.value
              }
            })
          }}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Price
        </label>
        <input
          name="PRICE"
          type="text"
          value={form?.unitAmmount ? (form.unitAmmount / 100).toFixed(2) : ''}
          onChange={handleCurrencyChange}
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
          Delete Price
        </button>
      </div>
    </div>
  )
}

interface FormFieldProps<T extends DisplayItem> {
  name: 'name' | 'description' | 'stock' | 'active' | 'productSizeIds' | 'priceId' | 'capsuleId' | 'categoryIds' | 'mainImageId' | 'imageIds';
  label: string;
  type: 'input' | 'textarea' | 'dropdown' | 'multi-dropdown';
  items?: T[];
  onEditItem: (item: T) => void;
  createItemModal?: React.ReactNode;
  renderSelectedItems?: (selectedItems: T[]) => React.ReactNode;
  selectedItems: T[];
  setSelectedItems: (selectedItems: T[]) => void;
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
  }, unknown>;
}

function FormField<T extends Item>({
  name,
  label,
  type,
  items,
  onEditItem,
  createItemModal,
  renderSelectedItems,
  form,
  selectedItems,
  setSelectedItems
}: FormFieldProps<T>) {
  const field = form.useField({ name: name });

  if (type === 'textarea') {
    return (
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          {label}
        </label>
        <textarea
          className="h-20 resize-none text-[14px] px-2 w-full rounded-lg border bg-transparent border-gray-300 focus:outline-none"
          name={field.name}
          value={field.state.value as string}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </div>
    );
  }

  if (type === 'dropdown' || type === 'multi-dropdown') {
    return (
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-700">
          {label}
        </label>
        <div className='flex flex-row gap-3'>
          <CheckboxDropdown<T>
            multiple={type === 'multi-dropdown'}
            name={label}
            items={items ?? []}
            value={selectedItems}
            onChange={(selected:T[]) => {
              setSelectedItems(selected)
              // field.pushValue(selected.map(item => item.id))
              // field.handleChange(selected.map(item => item.id))
            }}
            onEditItem={onEditItem}
          />
          {createItemModal}
        </div>

        {renderSelectedItems ? renderSelectedItems(selectedItems) : null}
      </div>
    );
  }

  // Default to input type
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700">
        {label}
      </label>
      <input
        type={type === 'input' ? 'text' : ''}
        className="text-[14px] px-2 w-full rounded-lg border bg-transparent border-gray-300 focus:outline-none"
        name={field.name}
        value={field.state.value as unknown as string}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  );
}
