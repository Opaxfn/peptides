import { retrieveCart } from "@lib/data/cart"
import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import CartDropdown from "../cart-dropdown"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  // Derive countryCode: prefer cart region, fallback to first region's first country
  let countryCode = "us"
  try {
    const regions = await listRegions()
    const cartRegion = regions?.find((r) => r.id === cart?.region_id)
    const firstCountry =
      cartRegion?.countries?.[0]?.iso_2 ??
      regions?.[0]?.countries?.[0]?.iso_2 ??
      "us"
    countryCode = firstCountry
  } catch {
    // keep default
  }

  // Fetch upsell products by category handle
  let upsellProducts: any[] = []
  try {
    const upsellCategory = await getCategoryByHandle(["upsell"])
    if (upsellCategory?.id) {
      const { response } = await listProducts({
        countryCode,
        queryParams: {
          category_id: [upsellCategory.id],
          limit: 6,
          fields:
            "id,title,handle,thumbnail,*variants,*variants.calculated_price",
        },
      })
      upsellProducts = response.products
    }
  } catch {
    // no upsell products
  }

  return (
    <CartDropdown
      cart={cart}
      upsellProducts={upsellProducts}
      countryCode={countryCode}
    />
  )
}
