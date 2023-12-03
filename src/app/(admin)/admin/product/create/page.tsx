import { api } from "~/trpc/server";
// import { CreateProduct } from '~/components/create'
// import { SelectOrCreateDropdown } from '~/components/dropdown'
// import { createCategory, fetchCategories, itemToString } from './actions'
import { CreateProductForm } from './form'

export default async function CreateProductPage() {
  const capsules = await api.capsuleRouter.getCapsules.query()
  const categories = await api.categoryRouter.getCategories.query()
  const images = await api.imageRouter.getImages.query()
  const prices = await api.priceRouter.getAllPrices.query()
  const sizes = await api.sizeRouter.getAllSizes.query()

  return (
    <div>
      <CreateProductForm 
        capsules={capsules} 
        categories={categories}
        images={images}
        prices={prices}
        sizes={sizes}
      />
    </div>
  )
}