"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { api } from "~/trpc/react";
import { CheckboxDropdown } from "~/components/CheckboxDropdown";
import { Modal } from "~/components/Modal";
import type { Size, Price, Capsule, Category, Image } from "@prisma/client";
import { type FormApi } from "@tanstack/react-form";
import { useProductData } from './context'

interface CreateProductFormProps {
  sizes: Size[] | undefined;
  prices: Price[] | undefined;
  capsules: Capsule[] | undefined;
  categories: Category[] | undefined;
  images: Image[] | undefined;
  form: FormApi<{
    stripeId: string;
    name: string;
    description: string;
    stock: number;
    active: boolean;
    productSizeIds: never[];
    priceIds: never[];
    capsuleId: Omit<Capsule, 'updatedAt'|'createdAt'>[];
    categoryId: Category[];
    mainImageId: number;
    imageIds: never[];
  }, unknown>
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  form,
  sizes,
  prices,
  categories,
  capsules
}) => {
  const [isSizeModalOpen, setSizeModalOpen] = useState<boolean>(false);
  const [isPriceModalOpen, setPriceModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);
  const [isCapsuleModalOpen, setCapsuleModalOpen] = useState<boolean>(false);

  const [editSize, setEditSize] = useState<Size>();
  const [editPrice, setEditPrice] = useState<Price>();
  const [editCategory, setEditCategory] = useState<Category>();
  const [editCapsule, setEditCapsule] = useState<Omit<Capsule, 'updatedAt'|'createdAt'>>();
  const productData = useProductData()

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
    <div className="h-full">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="flex h-full flex-col gap-5">
            <form.Field
              name="name"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Product Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
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
                    className="h-32 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
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
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
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
              name="productSizeIds"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Sizes
                  </label>
                  <div className='flex flex-row gap-3'>
                    <CheckboxDropdown<Size>
                      name='Sizes'
                      items={sizes ?? []} // Pass your size items here
                      value={field.state.value} // Pass the current value from the form field
                      onChange={(selectedItems) =>
                        field.handleChange(selectedItems as unknown as never[])
                      } // Pass the onChange handler from the form field
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
                      refreshItem={refreshSizes}
                      isModalOpen={isSizeModalOpen}
                      setModalOpen={setSizeModalOpen}
                      updateItem={(size: Size) => updateSize(size)}
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
                      selectedItems={field.state.value}
                      updateItems={(updatedItems) => field.handleChange(updatedItems as unknown as never[])}
                    />
                    // <SelectedSizeDisplay

                    // />
                  ) : <div>no sizes</div>}

                </div>
              )}
            />
            <form.Field
              name="priceIds"
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
                        const updatedPrices = prices?.map(price =>
                          price.id === updatedPrice.id ? updatedPrice : price
                        );
                        // Update form state here
                        field.handleChange(updatedPrices as unknown as never[] ?? [] as unknown as never[]);
                        await refreshPrices()
                      }
                      } // Pass the callback to CreateItem
                      setEditItem={setEditPrice}
                    />
                  </div>
                  {field.state.value !== undefined ? (
                    <DisplaySelectedItems<Size>
                      selectedItems={field.state.value}
                      updateItems={(updatedItems) => field.handleChange(updatedItems as unknown as never[])}
                    />
                    // <SelectedSizeDisplay

                    // />
                  ) : null}

                </div>
              )}
            />
            <form.Field
              name="categoryId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Categories
                  </label>
                  <div className='flex flex-row gap-3'>
                    <CheckboxDropdown<Category>
                      name='Categories'
                      items={categories ?? []} // Pass your size items here
                      value={field.state.value ?? []} // Pass the current value from the form field
                      onChange={(selectedItems) =>
                        field.handleChange(selectedItems)
                      } // Pass the onChange handler from the form field
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

                  {field.state.value && field.state.value.length > 0 ? (
                    <DisplaySelectedItems<Category>
                      selectedItems={field.state.value}
                      updateItems={(updatedItems) => field.handleChange(updatedItems as unknown as never[])}
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
                  <CheckboxDropdown<Omit<Capsule, 'updatedAt'|'createdAt'>>
                    name='Capsules'
                    items={capsules ?? []} // Pass your size items here
                    value={field.state.value ?? []} // Pass the current value from the form field
                    onChange={(selectedItems) =>
                      field.handleChange(selectedItems)
                    } // Pass the onChange handler from the form field
                    onEditItem={(item: Omit<Capsule, 'updatedAt'|'createdAt'>) => {
                      console.log("Edit Capsule: ", item)
                      // const changeSize = api.sizeRouter.updateSize.useMutation()
                      setEditCapsule(item);
                    }}
                  />
                  <CreateItem
                    <Omit<Capsule,'updatedAt'|'createdAt'>>
                    name='Capsules'
                    item={editCapsule ?? { id: -1, name: "", description: "" }}
                    createItem={({ name, description }) => createCapsule.mutate({ name, description })}
                    deleteItem={deleteCapsule}
                    refreshItem={refreshCapsules}
                    isModalOpen={isCapsuleModalOpen}
                    setModalOpen={setCapsuleModalOpen}
                    updateItem={(capsule: Omit<Capsule, 'createdAt'|'updatedAt'>) => updateCapsule(capsule)}
                    handleChange={async (updatedCapsule: Omit<Capsule, 'updatedAt'|'createdAt'>) => {
                      const updatedCapsules = capsules?.map(capsule =>
                        capsule.id === updatedCapsule.id ? updatedCapsule : capsule
                      );
                      // Update form state here
                      field.handleChange(updatedCapsules as unknown as never[] ?? [] as unknown as never[]);
                      await refreshCapsules()
                    }
                    } // Pass the callback to CreateItem

                    setEditItem={setEditCapsule}
                  />
                </div>

                {field.state.value && field.state.value.length > 0 ? (
                  <DisplaySelectedItems<Omit<Capsule, 'updatedAt'|'createdAt'>>
                    selectedItems={field.state.value}
                    updateItems={(updatedItems) => field.handleChange(updatedItems as unknown as never[])}
                  />
                  // <SelectedSizeDisplay

                  // />
                ) : <div>no categories selected </div>}

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
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </div>
              )}
            />
            <form.Field
              name="imageIds"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Other Images
                  </label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value as unknown as never[])
                    }
                  />
                </div>
              )}
            />
          </div>
          <button type="submit">Submit</button>
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
      {selectedItems.map((item) => (
        <div
          key={item.id}
          className="m-1 flex items-center rounded bg-blue-100 p-1"
        >
          <span className="text-sm text-gray-700">{item.name}</span>
          <button
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
    console.log("item", item);
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
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
        >
          {`Create ${name}`}
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
                className="h-32 w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
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