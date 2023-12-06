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
    priceId: number;
    capsuleId: number;
    categoryId: number;
    mainImageId: number;
    imageIds: never[];
}, unknown>
}

export const CreateProductForm: React.FC<CreateProductFormProps> = ({
  form,
  sizes,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [editSize, setEditSize] = useState<Size>();
  const productData = useProductData()

  useEffect(() => {
    console.log("editSize", editSize);
    if (editSize) {
      setModalOpen(true);
    }
  },[editSize])
  

  if(!productData) {
    return null
  }

  const { 
    deleteSize, 
    refreshSizes,
    updateSize,
  } = productData

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
                      onEditItem={(item:Size)=> {
                        console.log("Edit Item: ", item)
                        // const changeSize = api.sizeRouter.updateSize.useMutation()
                        setEditSize(item);
                  
                        // changeSize.mutate(size)
                      }}
                    />
                    <CreateSizeAction 
                      size={editSize ?? { id: -1, name: "", description: "" }} 
                     // id={editSize?.id} 
                      // name={editSize?.name} 
                      // description={editSize?.description} 
                      isModalOpen={isModalOpen} 
                      setModalOpen={setModalOpen} 
                      handleSizeChange={async (updatedSize:Size) => {
                        const updatedSizes = sizes?.map(size => 
                          size.id === updatedSize.id ? updatedSize : size
                        );
                        // Update form state here
                        field.handleChange(updatedSizes as unknown as never[]  ?? [] as unknown as never[]);
                        await refreshSizes()
                      }
                    } // Pass the callback to CreateSizeAction
                      deleteItem={deleteSize}
                      setEditSize={setEditSize}
                    />
                  </div>
                  
                  {field.state.value !== undefined ? (
                    <SelectedSizeDisplay
                      selectedItems={field.state.value}
                      onRemoveItem={(id) => {
                        const newSelectedItems = field.state.value.filter(
                          (size: Size) => size.id !== id,
                        );
                        field.handleChange(
                          newSelectedItems as unknown as never[],
                        );
                      }}
                    />
                  ) : null}
                 
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
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                </div>
              )}
            />
            <form.Field
              name="categoryId"
              // eslint-disable-next-line react/no-children-prop
              children={(field) => (
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Category
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
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
                  <input
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
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
}

interface SelectedItemDisplayProps<T extends Item> {
  selectedItems: T[];
  onRemoveItem: (id: number) => void;
}

const SelectedSizeDisplay: React.FC<SelectedItemDisplayProps<Size>> = ({
  selectedItems,
  onRemoveItem,
}) => {
  // console.log("selectedItems", selectedItems)
  React.useEffect(() => {
    console.log("selectedItems", selectedItems);
  }, [selectedItems]);
  // const [ selected, setSelected ] = React.useState<Size[] | undefined>(selectedItems ?? [])
  return (
    <div className="mt-2 flex flex-wrap">
      {selectedItems.map((item: Size) => (
        <div
          key={item.id}
          className="m-1 flex items-center rounded bg-blue-100 p-1"
        >
          <span className="text-sm text-gray-700">{item.name}</span>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="ml-2 text-blue-500 hover:text-blue-700"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
};
interface SizeFormValues {
  size: Size;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSizeChange: (updatedSize:Size) => void; // New callback prop
  deleteItem: (id: number) => void;
  setEditSize: React.Dispatch<React.SetStateAction<Size | undefined>>;
}
// const [isModalOpen, setModalOpen] = useState<boolean>(false);


const CreateSizeAction: React.FC<SizeFormValues> = ({ size, isModalOpen, setModalOpen, handleSizeChange, deleteItem, setEditSize }) => {
  // const router = useRouter()

  const { updateSize, refreshSizes } = useProductData()
  
  const createSize = api.sizeRouter.createSize.useMutation();
  // const updateSize = api.sizeRouter.updateSize.useMutation()

  const [form, setForm] = useState<{
    id: number;
    name: string;
    description: string | null;
  }>(size);

  console.log("form", form)
  useEffect(() => {
    setForm(size ?? { id: -1, name: "", description: "" });
  }, [size]);

  // useEffect(() => {
  //   setForm({ 
  //     id: id ?? -1, 
  //     name: name ?? "",  // Ensuring name is always a string
  //     description: description ?? ""
  //   });
  // }, [id, name, description]);

  const handleSubmit = async () => {
    if (form.id !== undefined && form.id !== -1) {
      if (form.name) {
        // Updating an existing size
        updateSize(form.id, form.name, form.description ?? "");
        await refreshSizes()
        handleSizeChange(form)
        setModalOpen(false)
      } else {
        // Error handling for missing name field
        console.error("Name is required for updating a size");
      }
    } else {
      // Creating a new size
      if (form.name) {
        const newSize = createSize.mutate({ name: form.name, description: form.description });
        await refreshSizes()
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
     <CreateItemModal
        <Size>
        name='Size'
        formData={
          {
            id: form?.id ?? -1,
            name: form?.name ?? "",
            description: form?.description ?? ""
          }
        }
        setFormData={setForm}
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        handleSubmit={handleSubmit}
        closeModal={() => {
          setModalOpen(false)
          setEditSize(undefined)
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
            {form?.id && form?.id !== -1 ? "Update Size" : "Create Size"}
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
        </CreateItemModal>
    </div>
  );
};

interface FormData { 
  id: number | undefined;
  name: string;
  description: string | null | undefined;
}

interface CreateOrUpdateProps<T extends FormData> {
  name: string
  formData: T;
  setFormData: (data: T) => void;
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
  handleSubmit: () => void;
  children: ReactNode;
  closeModal: () => void;
}

function CreateItemModal<T extends FormData>({ name, formData, setFormData, isModalOpen, setModalOpen, handleSubmit, children, closeModal }: CreateOrUpdateProps<T>) {
  console.log("formData", formData)
  return (
    <div>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      >
        {`Create ${name}`}
      </button>
      <Modal
        title={formData.id !== -1 ? "Edit Item" : "Create Item"}
        isOpen={isModalOpen}
        onClose={() => {
          setFormData({ ...formData, id: -1, name: "", description: "" } as T);
          closeModal()
        }}
      >
        {children}
      </Modal>
    </div>
  );
};
interface SizeFormValues {
  id?: number;
  name?: string | undefined; 
  description?: string | null | undefined;
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
// const [isModalOpen, setModalOpen] = useState<boolean>(false);
