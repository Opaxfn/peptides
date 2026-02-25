"use client"

import { useState, useTransition } from "react"
import { Button, Heading, Text } from "@medusajs/ui"
import { addToCart } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type UpsellSectionProps = {
  products: any[]
  countryCode: string
  currencyCode: string
}

const UpsellSection = ({ products, countryCode, currencyCode }: UpsellSectionProps) => {
  const [addingId, setAddingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handleAdd = (variantId: string, productId: string) => {
    setAddingId(productId)
    startTransition(async () => {
      try {
        await addToCart({ variantId, quantity: 1, countryCode })
      } finally {
        setAddingId(null)
      }
    })
  }

  return (
    <div className="w-full">
      <div className="pb-4">
        <Heading className="text-xl small:text-2xl font-semibold">Add-on Products</Heading>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-3 gap-3 small:gap-4">
        {products.map((product) => {
          const variant = product.variants?.[0]
          const price = variant?.calculated_price?.calculated_amount
          const priceCurrency =
            variant?.calculated_price?.currency_code ?? currencyCode

          return (
            <div 
              key={product.id} 
              className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg"
              data-testid="upsell-product-row"
            >
              <LocalizedClientLink
                href={`/products/${product.handle}`}
                className="w-full"
              >
                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-100">
                  <Thumbnail
                    thumbnail={product.thumbnail}
                    images={[]}
                    size="square"
                    className="w-full h-full object-cover"
                  />
                </div>
              </LocalizedClientLink>

              <div className="flex flex-col gap-1 mt-1">
                <Text
                  className="text-sm font-medium text-ui-fg-base line-clamp-2"
                  data-testid="upsell-product-title"
                >
                  <LocalizedClientLink href={`/products/${product.handle}`}>
                    {product.title}
                  </LocalizedClientLink>
                </Text>

                {price != null && (
                  <span className="text-sm font-semibold text-ui-fg-subtle">
                    {convertToLocale({ amount: price, currency_code: priceCurrency })}
                  </span>
                )}

                <Button
                  variant="secondary"
                  size="small"
                  className="w-full mt-1"
                  disabled={addingId === product.id || !variant?.id}
                  onClick={() => variant?.id && handleAdd(variant.id, product.id)}
                >
                  {addingId === product.id ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UpsellSection
