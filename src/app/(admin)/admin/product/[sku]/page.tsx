"use client";
import React, { useState } from "react";
import { Product, type ProductWithImage } from "@app/components/product";
import { SelectOrCreateDropdown } from '@app/components/dropdown'
export default function CreateProduct() {
  const initialProductWithImage: ProductWithImage = {
    id: 0,
    name: "",
    description: "",
    priceId: 0,
    stock: 0,
    categoryId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    capsuleId: 0,
    mainImageId: 0,
    images: [],
  };

  const handleCategoryChange = (categoryId: number) => setCategoryId(categoryId);
  const handleCapsuleChange = (capsuleId: number) => setCapsuleId(capsuleId);
  const handlePriceChange = (priceId: number) => setPriceId(priceId);

  const [productWithImage, setProductWithImage] = useState(initialProductWithImage);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [stock, setStock] = useState(0);
  const [capsuleId, setCapsuleId] = useState(0);
  const [priceId, setPriceId] = useState(0);
  const [sizeIds, setSizeIds] = useState<number[]>([]);
  // Assuming mainImageId and imageIds are obtained through a separate process
  const [mainImageId, setMainImageId] = useState(0);
  const [imageIds, setImageIds] = useState<number[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Basic validation, can be enhanced
    if (!name || !description || categoryId === 0 || price <= 0 || stock <= 0) {
      alert("Please fill all the required fields.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('categoryId', categoryId.toString());
    formData.append('stock', stock.toString());
    formData.append('capsuleId', capsuleId.toString());
    formData.append('priceId', priceId.toString());
    sizeIds.forEach(sizeId => formData.append('sizeIds[]', sizeId.toString()));
    formData.append('mainImageId', mainImageId.toString());
    imageIds.forEach(imageId => formData.append('imageIds[]', imageId.toString()));

    try {
      // Replace with your API call
      // const response = await api.createProduct(formData);
      // Update the product state based on the response
      // setProductWithImage(response.data);

      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b text-black">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <h2>Create Product</h2>
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
       <SelectOrCreateDropdown
          fetchData={fetchCategories}
          createNew={createCategory}
          label="Category"
          onChange={handleCategoryChange}
        />

        {/* Select or Create Dropdown for Capsules */}
        <SelectOrCreateDropdown
          fetchData={fetchCapsules}
          createNew={createCapsule}
          label="Capsule"
          onChange={handleCapsuleChange}
        />

        {/* Select or Create Dropdown for Prices */}
        <SelectOrCreateDropdown
          fetchData={fetchPrices}
          createNew={createPrice}
          label="Price"
          onChange={handlePriceChange}
        />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} />

        {/* Inputs for sizeIds, mainImageId, imageIds */}
        <button type="submit">Create Product</button>
      </form>
      <div className="flex flex-col">
        {/* <Product product={productWithImage} /> */}
      </div>
    </main>
  );
}
