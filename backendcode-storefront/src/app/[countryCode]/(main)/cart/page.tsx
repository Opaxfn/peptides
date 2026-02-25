import { getShippingProtectionVariant, listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"
import CartTemplate from "@modules/cart/templates"
import { StoreCartShippingOption } from "@medusajs/types"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [cart, customer, { shipping_options }] = await Promise.all([
    retrieveCart().catch((error) => {
      console.error(error)
      return notFound()
    }),
    retrieveCustomer(),
    listCartOptions(),
  ])

  const shippingOptions: StoreCartShippingOption[] = shipping_options || []

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

  let shippingProtection = null
  try {
    shippingProtection = await getShippingProtectionVariant(resolvedCountryCode)
  } catch {
    // shipping protection not available
  }

  // Read shipping protection cookie server-side (default to true if not set)
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get("shipping_protection")?.value
  const shippingProtectionEnabled = cookieValue === undefined || cookieValue === "true"

  return (
    <CartTemplate
      cart={cart}
      customer={customer}
      countryCode={resolvedCountryCode}
      shippingOptions={shippingOptions}
      shippingProtection={shippingProtection}
      shippingProtectionEnabled={shippingProtectionEnabled}
    />
  )
}
