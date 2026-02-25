import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"
import { ReviewStats } from "@lib/data/reviews"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  reviewStats,
}: {
  id: string
  region: HttpTypes.StoreRegion
  reviewStats?: ReviewStats | null
}) {
  const product = await listProducts({
    queryParams: { id: [id] },
    regionId: region.id,
  }).then(({ response }) => response.products[0])

  if (!product) {
    return null
  }

  return <ProductActions product={product} region={region} reviewStats={reviewStats} />
}
