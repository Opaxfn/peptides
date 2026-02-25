import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  // Read shipping protection cookie server-side (default to true if not set)
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get("shipping_protection")?.value
  const shippingProtectionEnabled = cookieValue === undefined || cookieValue === "true"

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} shippingProtectionEnabled={shippingProtectionEnabled} />
    </div>
  )
}
