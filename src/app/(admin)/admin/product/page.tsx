"use server"
import Link from "next/link"
import { api } from "~/trpc/server";

// import { Dropzone } from '~/components/dropzone'

export default async function Product() {

  const products = await api.product.getProducts.query()
  // if(!products) return <div>loading...</div>
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b text-black">
      <div>
        <h2>Create Category</h2>
        <input type="text" placeholder="Category Name" />
      </div>
     
      <div className='flex flex-col'>
      {
        products ? products.map( (product) => {
          return (
            <div key={product.id}>
              <h2>{product.name}</h2>
              <h2>{product.description}</h2>
              <h2>{product.priceId}</h2>
              <h2>{product.stock}</h2>
              <h2>{product.categoryId}</h2>
              <h2>{product.createdAt.toString()}</h2>
              <h2>{product.updatedAt.toString()}</h2>
              <h2>{product.capsuleId}</h2>
              <h2>{product.mainImageId}</h2>
            </div>
          )
        }) : <div>loading...</div>
      }
      </div>
    </main>
  );
}
