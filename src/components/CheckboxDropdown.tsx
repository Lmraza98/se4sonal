import React, { useState, useEffect, useRef } from 'react';

interface BaseDropdownItem {
  id: number;
  name: string;
  description: string | null;
}

interface CheckboxDropdownProps<T extends BaseDropdownItem> {
  name: string;
  items: T[] | undefined;
  value: T[]; // The array of selected items
  onChange: (items: T[]) => void; // Callback to update the form state
  onEditItem: (item: T) => void;
}

export const CheckboxDropdown = <T extends BaseDropdownItem>({
  name,
  items,
  value = [],
  onChange,
  onEditItem,
}: CheckboxDropdownProps<T>) => {
  console.log("Value: ", value)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const checkboxRef = useRef<HTMLUListElement>(null);

  const onClose = () => setIsOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, item: T) => {
    const isChecked = event.target.checked;
    const updatedSelectedItems = isChecked
      ? [...value, item] // Add item
      : value.filter((selectedItem) => selectedItem.id !== item.id); // Remove item
    console.log("Updated Selected Items: ", updatedSelectedItems)
    onChange(updatedSelectedItems);
  };


  // Close the modal on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (checkboxRef.current && !checkboxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close the modal on pressing Escape key
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
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      >
        Select {name}
      </button>
      {isOpen && (
        <ul ref={checkboxRef} className="absolute z-10 w-52 bg-white border border-gray-200 mt-1 rounded shadow-lg">
          {(items?.length === 0 || items === undefined) ? (
            <li className="p-2 text-center text-gray-500">No {name} available</li>
          ) : (
            items.map((item: T) => (
              <li key={item.id} className="flex items-center p-2 hover:bg-gray-100">
                <input
                  type="checkbox"
                  id={item.id.toString()}
                  name={item.name}
                  checked={
                    value.length > 0 ? value.some(v => v.id === item.id) : false
                  }
                  onChange={(e) => handleChange(e, item)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{item.name}</span>
                <button 
                  className="ml-auto text-blue-500 hover:text-blue-700"
                  type='button' 
                  onClick={() => onEditItem(item)}
                >
                  Edit
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default CheckboxDropdown;
