"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { Pagination } from './Pagination';
import { type Image as ImageType } from "@prisma/client";



interface Props {
  images: ImageType[];
  multipleSelect?: boolean; // Optional prop to enable multiple selection
}

export const ImagesWithPagination: React.FC<Props> = ({ images, multipleSelect = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentImages = images.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleImageSelect = (id: number) => {
    if (multipleSelect) {
      setSelectedImages(prev => 
        prev.includes(id) ? prev.filter(imageId => imageId !== id) : [...prev, id]
      );
    } else {
      setSelectedImages([id]);
    }
  };

  return (
    <div>
      <div className='grid grid-cols-5 gap-3'>
        {currentImages.map(image => (
          <div key={image.fileName} className='relative'>
            <Image 
              src={image.url} 
              alt={image.fileName} 
              width={50} 
              height={50}
              objectFit="cover"
              className={`${selectedImages.includes(image.id) ? 'border-2 border-blue-500' : ''}`}
              onClick={() => handleImageSelect(image.id)}
            />
            {/* <button
              type='button'
              onClick={() => {
                // Your delete image logic here
              }}
              className='absolute top-0 right-0 p-1 text-sm text-white bg-red-500 rounded-full'
            >
              &times;
            </button> */}
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

