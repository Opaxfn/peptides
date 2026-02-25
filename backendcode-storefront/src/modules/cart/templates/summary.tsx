"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import ShippingProtection from "@modules/cart/components/shipping-protection"
import { HttpTypes, StoreCartShippingOption } from "@medusajs/types"

type ShippingProtectionData = {
  price: number
  currencyCode: string
} | null

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
  shippingOptions?: StoreCartShippingOption[]
  shippingProtection?: ShippingProtectionData
  shippingProtectionEnabled?: boolean
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, shippingOptions = [], shippingProtection, shippingProtectionEnabled = false }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      {cart && (
        <FreeShippingPriceNudge
          variant="inline"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {cart && shippingProtection && (
        <>
          <Divider />
          <ShippingProtection
            cart={cart}
            price={shippingProtection.price}
            isEnabled={shippingProtectionEnabled}
          />
        </>
      )}
      <Divider />
      <CartTotals 
        totals={cart} 
        shippingProtectionPrice={shippingProtection?.price} 
        shippingProtectionEnabled={shippingProtectionEnabled}
      />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
