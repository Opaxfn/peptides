import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  productLimit = 24,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  productLimit?: number
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail
        collection={collection}
        region={region}
        productLimit={productLimit}
      />
    </li>
  ))
}
