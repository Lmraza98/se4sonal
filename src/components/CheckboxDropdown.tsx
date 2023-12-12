"use client"
import React, { useState, useEffect, useRef } from 'react';

interface BaseDropdownItem {
  id: number;
  // name: string;
  description?: string | null;
  name?: string | null;
}

interface CheckboxDropdownProps<T extends BaseDropdownItem> {
  name: string;
  items: T[] | undefined;
  value: T[]; // The array of selected items
  onChange: (items: T[]) => void; // Callback to update the form state
  onEditItem: (item: T) => void;
  multiple?: boolean; // Determines if multiple selections are allowed
}

export const CheckboxDropdown = <T extends BaseDropdownItem>({
  name,
  items,
  value = [],
  onChange,
  onEditItem,
  multiple = false,
}: CheckboxDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const checkboxRef = useRef<HTMLUListElement>(null);

  const onClose = () => setIsOpen(false);

  const handleSingleChange = (item: T) => {
    onChange([item]); // Update the value with the newly selected item
    setIsOpen(false); // Close dropdown after selection
  };

  const handleMultipleChange = (event: React.ChangeEvent<HTMLInputElement>, item: T) => {
    const isChecked = event.target.checked;
    const updatedSelectedItems = isChecked
      ? [...value, item] // Add item
      : value.filter((selectedItem) => selectedItem.id !== item.id); // Remove item

    onChange(updatedSelectedItems);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (checkboxRef.current && !checkboxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-20 bg-black text-white p-1 text-sm"
      >
        Select
      </button>
      {isOpen && (
        <ul ref={checkboxRef} className="absolute z-10 w-52 bg-white border border-gray-200 mt-1 rounded shadow-lg">
          {(items?.length === 0 || items === undefined) ? (
            <li className="p-2 text-center text-gray-500">No {name} available</li>
          ) : (
            items.map((item: T) => (
              <li key={item.id} className="flex items-center p-2 hover:bg-gray-100">
                {multiple ? (
                  <>
                    <input
                      type="checkbox"
                      id={item.id.toString()}
                      name={item.name ?? ''}
                      checked={value.some(v => v.id === item.id)}
                      onChange={(e) => handleMultipleChange(e, item)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{item.name}</span>
                  </>
                ) : (
                  <button 
                    type="button"
                    className="w-20 bg-black text-white p-1 text-sm"
                    onClick={() => handleSingleChange(item)}
                  >
                    {item.name}
                  </button>
                )}
                {(
                  <button 
                    className="ml-auto w-20 bg-black text-white p-1 text-sm"
                    type='button' 
                    onClick={() => onEditItem(item)}
                  >
                    Edit
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CheckboxDropdown;
