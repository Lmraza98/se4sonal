"use client"
import React, { useState, useEffect } from "react";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";

interface Item {
  id: number;
  name: string;
}

type SelectOrCreateDropdownProps<T extends Item> = {
    label: string;
    data: UseTRPCQueryResult<T[], Error>;
    createNew: (name: string) => T | undefined;
    itemToString: (item: T) => string;
    valueKey: keyof T;
};

export const SelectOrCreateDropdown = <T extends Item>({
  data,
  createNew,
  label,
  itemToString,
  valueKey
}: SelectOrCreateDropdownProps<T>) => {
   
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();

  return (
    <div>
        {
            data.isLoading ?? (
                <div>loading...</div>
            )
        }
        {
            data.error ?? (
                <div>error...</div>
            )
        }
      <SelectDropdown<T>
        items={items}
        label={label}
        onChange={setSelectedItem}
        itemToString={itemToString}
        valueKey={valueKey}
      />
      <CreateNewItem
        label={label}
        onCreate={createNew}
      />
    </div>
  );
};
type SelectDropdownProps<T extends Item> = {
    items: T[];
    label: string;
    onChange: (item: T | undefined) => void;
    itemToString: (item: T) => string;
    valueKey: keyof T;
  };
  
  const SelectDropdown = <T extends Item>({
    items,
    label,
    onChange,
    itemToString,
    valueKey
  }: SelectDropdownProps<T>) => {
    const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      const selectedItem = items.find(item => String(item[valueKey]) === selectedValue);
      onChange(selectedItem);
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
    onCreate: (name: string) => T | undefined;
  };
  
  const CreateNewItem = ({ label, onCreate }: CreateNewItemProps<Item>) => {
    const [newItemValue, setNewItemValue] = useState("");
  
    const handleCreateNew = () => {
        function createNewItem() {
            onCreate(newItemValue);
            setNewItemValue("");
        }
      createNewItem()
    }
  
    return (
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow rounded-md border border-gray-300 p-2"
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          placeholder={`New ${label}`}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>
    );
  };
  