"use client"
import React, { useState, useEffect } from "react";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { TRPCClientError } from "@trpc/client";
import { AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { type TRPCClientErrorLike } from "@trpc/client"; 
import { type UseTRPCMutationResult } from "@trpc/react-query/shared";
import type { BuildProcedure, ProcedureParams, AnyRootConfig } from "@trpc/server";
import { api } from "~/trpc/react";
import {
  type Router,
  type AnyRouter
} from '@trpc/server';

type CreateNew =  typeof api.imageRouter.createImage.useQuery
| typeof api.categoryRouter.createCategory.useMutation
| typeof api.capsuleRouter.createCapsule.useMutation
| typeof api.sizeRouter.createSize.useQuery
| typeof api.priceRouter.createPrice.useMutation


interface Item {
  id: number;
  name: string;
}

type SelectOrCreateDropdownProps<T extends Item> = {
    label: string;
    data: T[];
    createNew: CreateNew;
    itemToString: (item: T) => string;
    valueKey: keyof T;
    initItem: () => T;
    onItemSelect: (item: T | undefined) => void; // Add this line

};

export const SelectOrCreateDropdown = <T extends Item>({
  data,
  createNew,
  label,
  itemToString,
  valueKey,
  initItem,
  onItemSelect
}: SelectOrCreateDropdownProps<T>) => {


  const [createNewItem, setCreateNewItem] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined);

  return (
    <div>
      {createNewItem ? (
        <div>
          <button onClick={(e) => {
            e.preventDefault()
            setCreateNewItem(false)
          }}>
            Cancel
          </button>
        <CreateNewItem
        <T>
        label={label}
        onCreate={createNew}
        initItem={initItem}
        onItemSelect={onItemSelect}
        /> 
      </div> )  : (
          <div className='flex flex-col'>
             <SelectDropdown<T>
              items={data}
              label={label}
              onChange={setSelectedItem}
              itemToString={itemToString}
              valueKey={valueKey}
              onItemSelect={onItemSelect}
              />
             
              <button onClick={(e) => {
                e.preventDefault()
                setCreateNewItem(true)
              }}>
                Create New {label}
              </button>
          </div>
        )
      }
    </div>
  );
}

type SelectDropdownProps<T extends Item> = {
    items: T[];
    label: string;
    onChange: (item: T | undefined) => void;
    itemToString: (item: T) => string;
    valueKey: keyof T;
    onItemSelect: (item: T | undefined) => void; // Add this line

  };
  
  const SelectDropdown = <T extends Item>({
    items,
    label,
    onChange,
    itemToString,
    valueKey,
    onItemSelect
  }: SelectDropdownProps<T>) => {
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      const selectedItem = items.find(item => String(item[valueKey]) === selectedValue);
      onChange(selectedItem);
      onItemSelect(selectedItem);
    };
  
    return (
      <select
        className="rounded-md border border-gray-300 p-2"
        onChange={handleSelectionChange}
      >
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {itemToString(item)}
          </option>
        ))}
      </select>
    );
  };
  type CreateNewItemProps<T extends Item> = {
    label: string;
    onCreate: CreateNew
    initItem: () => T;
    onItemSelect: (item: T | undefined) => void; // Add this line

  };
  
  const CreateNewItem = <T extends Item>({ label, onCreate, initItem, onItemSelect }: CreateNewItemProps<T>) => {
    const item = initItem()
    const [newItem, setNewItem] = useState<T>(item);

    const handleChange = (key: keyof T, value: string) => {
      setNewItem(prev => ({ ...prev, [key]: value }));
    };
    // const mutation = onCreate();
    // const handleCreateNew = () => {
    //   console.log("CREATING:", newItem)
    //   mutation.mutate(
    //     newItem,
    //     {
    //       onSuccess: (data) => {
    //         console.log("DATA:", data)
    //         onItemSelect(data)
    //       },
    //       onError: (error) => {
    //         console.log("ERROR:", error)
    //       }
    //     }
    //   );
    //   // setNewItem({});
    // };
  
    return (
      <div className="flex flex-col space-y-2">
        {Object.keys(newItem).map((key) => (
          <input
            key={key}
            type="text"
            className="rounded-md border border-gray-300 p-2"
            value={(newItem[key as keyof T] ?? '') as string}
            onChange={(e) => handleChange(key as keyof T, e.target.value)}
            placeholder={`${label} ${key}`}
          />
        ))}
        <button
          type="button"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => onCreate}
        >
          Create New {label}
        </button>
      </div>
    );
  };
  