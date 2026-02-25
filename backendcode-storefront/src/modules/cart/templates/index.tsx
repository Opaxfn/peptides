import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import QuickAddSection from "../components/quick-add"
import { HttpTypes, StoreCartShippingOption } from "@medusajs/types"

type ShippingProtectionData = {
  variantId: string
  price: number
  currencyCode: string
} | null

const CartTemplate = ({
  cart,
  customer,
  countryCode,
  shippingOptions = [],
  shippingProtection = null,
  shippingProtectionEnabled = false,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  countryCode?: string
  shippingOptions?: StoreCartShippingOption[]
  shippingProtection?: ShippingProtectionData
  shippingProtectionEnabled?: boolean
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              {countryCode && (
                <>
                  <QuickAddSection countryCode={countryCode} />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6">
                      <Summary 
                        cart={cart as any} 
                        shippingOptions={shippingOptions} 
                        shippingProtection={shippingProtection}
                        shippingProtectionEnabled={shippingProtectionEnabled}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
