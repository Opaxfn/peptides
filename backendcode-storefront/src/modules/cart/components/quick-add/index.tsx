"use client"

import { useState, useTransition } from "react"
import { Button, Heading, Text } from "@medusajs/ui"
import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const QUICK_ADD_PRODUCT = {
  handle: "bacteriostatic-water",
  title: "Bacteriostatic Water",
  price: 25,
  currency: "cad",
}

const QuickAddSection = ({ countryCode }: { countryCode: string }) => {
  const [adding, setAdding] = useState(false)
  const [, startTransition] = useTransition()

  const handleAdd = () => {
    setAdding(true)
    startTransition(async () => {
      try {
        await addToCart({ 
          variantId: "temp", 
          quantity: 1, 
          countryCode 
        })
      } finally {
        setAdding(false)
      }
    })
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 small:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 small:w-20 small:h-20 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-xs text-gray-500">Img</span>
          </div>
          <div>
            <Heading className="text-base small:text-lg font-medium">
              {QUICK_ADD_PRODUCT.title}
            </Heading>
            <Text className="text-sm text-ui-fg-subtle">
              ${QUICK_ADD_PRODUCT.price} {QUICK_ADD_PRODUCT.currency.toUpperCase()}
            </Text>
          </div>
        </div>
        <Button
          variant="secondary"
          size="small"
          onClick={handleAdd}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add"}
        </Button>
      </div>
      <Text className="text-xs text-ui-fg-subtle mt-2">
        Add to your order
      </Text>
    </div>
  )
}

export default QuickAddSection
