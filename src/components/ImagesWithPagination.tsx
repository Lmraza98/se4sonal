"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Pagination } from './Pagination';
import { type Image as ImageType } from "@prisma/client";

interface Props {
  images: ImageType[];
  onSelect: (mainImage: number | null, otherImages: number[]) => void; // Function to handle selection
}

export const ImagesWithPagination: React.FC<Props> = ({ images, onSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [mainImage, setMainImage] = useState<number | null>(null);
  const [otherImages, setOtherImages] = useState<number[]>([]);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = images.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleImageSelect = (id: number, isMain: boolean) => {
    if (isMain) {
      const newMainImage = id === mainImage ? null : id;
      setMainImage(newMainImage);
  
      // Call onSelect only if there's a change
      if (newMainImage !== mainImage) {
        onSelect(newMainImage, otherImages);
      }
      console.log("mainImage: ", newMainImage)
      
    } else {
      setOtherImages(prev => {
        let updatedImages;
        if (prev.includes(id)) {
          updatedImages = prev.filter(imageId => imageId !== id);
        } else if (prev.length < 3) {
          updatedImages = [...prev, id];
        } else {
          return prev; // If already 3 images are selected, no changes are made
        }
  
        // Call onSelect only if there's a change
        if (updatedImages.length !== prev.length) {
          onSelect(mainImage, updatedImages);
        }
        console.log("otherImages: ", updatedImages)
        return updatedImages;
      });
      
    }

  };
  
  
  // Use useEffect to synchronize onSelect call with the state updates

  return (
    <div className="p-4">
    <div className='grid grid-cols-3 md:grid-cols-5 gap-4 pb-4'>
      {currentImages.map(image => (
        <div key={image.fileName} className='relative group'>
          <Image 
            src={image.url} 
            alt={image.fileName} 
            width={50} 
            height={50}
            objectFit="cover"
            className={`cursor-pointer rounded transition ease-in-out ${image.id === mainImage ? 'ring-4 ring-green-500' : otherImages.includes(image.id) ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-300'}`}
            onClick={() => handleImageSelect(image.id, false)}
          />
          <button
            type='button'
            onClick={() => handleImageSelect(image.id, true)}
            className={`absolute top-1 right-1 p-1 text-sm text-white bg-gray-500 rounded-full hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 group-hover:visible ${image.id === mainImage ? 'bg-green-500' : ''}`}
            aria-label="Select as main image"
          >
            Main
          </button>
        </div>
      ))}
    </div>
    <Pagination
      itemsPerPage={itemsPerPage}
      totalItems={images.length}
      paginate={paginate}
      currentPage={currentPage}
    />
  </div>
);
};
