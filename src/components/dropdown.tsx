import React, { useState, useEffect } from "react";

// Define the interface for the item, assuming each item has an 'id' and a 'name'.
// You can add more fields based on your actual data structure.
interface Item {
    id: number;
    name?: string;
    description?: string;
    price?: number;
    stripeId?: string;
}   

type SelectOrCreateDropdownProps<T> = {
    fetchData: () => Promise<T[]>; // T can be any type
    createNew: (args: T) => Promise<T>;
    label: string;
    onChange: (selectedItem: T) => void;
    itemToString: (item: T) => string; // Function to convert item to string representation
    valueKey: keyof T; // Key to use as the value in the select options
};

export const SelectOrCreateDropdown = <T extends Item>({ // Ensure T extends Item
    fetchData,
    createNew,
    label,
    onChange,
    itemToString,
}: SelectOrCreateDropdownProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [selectedItem, setSelectedItem] = useState<T | undefined>();
    const [newItemValue, setNewItemValue] = useState<string>(""); // Use a string state for input

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
        const selectedValue = event.target.value;
        const selectedItem = items.find(item => item.name === selectedValue);
        setSelectedItem(selectedItem);
        if (selectedItem) onChange(selectedItem);
    };

    const handleCreateNew = () => {
        if (!newItemValue) {
            alert(`Please enter a new ${label}`);
            return;
        }
    
        createNew(newItemValue as unknown as T) // Assume createNew can handle string input
            .then(newItem => {
                setItems(prevItems => [...prevItems, newItem]);
                setSelectedItem(newItem);
                setNewItemValue("");
            })
            .catch(error => {
                console.error(`Error creating new ${label}:`, error);
                alert(`Failed to create new ${label}`);
            });
        // Notice we are not returning anything here, so it's implicitly returning void
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-lg font-semibold">{label}</label>
            <select
                className="rounded-md border border-gray-300 p-2"
                value={selectedItem?.id}
                onChange={handleSelectionChange}
            >
                {items.map((item) => (
                    <option key={item.id} value={item.id}>
                        {itemToString(item)}
                    </option>
                ))}
            </select>
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
        </div>
    );
};
