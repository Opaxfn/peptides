import { retrieveCart } from "@lib/data/cart"
import { getCategoryByHandle } from "@lib/data/categories"
import { retrieveCustomer } from "@lib/data/customer"
import { listProducts } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [cart, customer] = await Promise.all([
    retrieveCart().catch((error) => {
      console.error(error)
      return notFound()
    }),
    retrieveCustomer(),
  ])

  // Derive countryCode from cart region or param
  let resolvedCountryCode = countryCode
  if (!resolvedCountryCode) {
    try {
      const regions = await listRegions()
      resolvedCountryCode =
        regions?.find((r) => r.id === cart?.region_id)?.countries?.[0]
          ?.iso_2 ??
        regions?.[0]?.countries?.[0]?.iso_2 ??
        "us"
    } catch {
      resolvedCountryCode = "us"
    }
  }

  let upsellProducts: any[] = []
  try {
    const upsellCategory = await getCategoryByHandle(["upsell"])
    if (upsellCategory?.id) {
      const { response } = await listProducts({
        countryCode: resolvedCountryCode,
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
    <CartTemplate
      cart={cart}
      customer={customer}
      upsellProducts={upsellProducts}
      countryCode={resolvedCountryCode}
    />
  )
}
