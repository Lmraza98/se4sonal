import React, { useState, useEffect } from "react";

type ItemType = {
  id: number;
  name: string;
  // Add other fields as needed
};

type SelectOrCreateDropdownProps = {
    fetchData: () => Promise<ItemType[]>;
    createNew: (name: string) => Promise<ItemType>;
    label: string;
    onChange: (selectedItemId: number) => void; // Adding onChange prop
};

export const SelectOrCreateDropdown: React.FC<SelectOrCreateDropdownProps> = ({ fetchData, createNew, label, onChange }) => {

  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<number | string>("");
  const [newItem, setNewItem] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await fetchData();
        setItems(fetchedItems);
      } catch (error) {
        console.error(`Error fetching ${label}:`, error);
      }
    };

    fetchItems().catch((error) => {
      console.error(`Failed to fetch items: ${error}`);
    });
  }, [fetchData, label]);

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedItem(selectedValue);
    onChange(selectedValue); // Calling the passed onChange handler
  };

  const handleCreateNew = () => {
    if (!newItem.trim()) {
      alert(`Please enter a ${label}`);
      return;
    }

    createNew(newItem)
      .then((createdItem) => {
        setItems([...items, createdItem]);
        setSelectedItem(createdItem.id); // Assuming the item has an id
        setNewItem("");
      })
      .catch((error) => {
        console.error(`Error creating new ${label}:`, error);
        alert(`Failed to create new ${label}`);
      });
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-lg font-semibold">{label}</label>
      <select 
        className="border border-gray-300 rounded-md p-2"
        value={selectedItem} 
        onChange={handleSelectionChange} // Using the new handler
      >
        {items.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow rounded-md border border-gray-300 p-2"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={`New ${label}`}
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleCreateNew}
        >
          Create New
        </button>
      </div>
    </div>
  );
};
