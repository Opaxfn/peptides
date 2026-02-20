"use client"

import { addToCart } from "@lib/data/cart"
import { Button } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import { useMemo, useState, useTransition } from "react"

type QuickAddToCartButtonProps = {
  variantId?: string
  productTitle: string
}

export default function QuickAddToCartButton({
  variantId,
  productTitle,
}: QuickAddToCartButtonProps) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const countryCode = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean)
    return pathSegments[0] || ""
  }, [pathname])

  const handleQuickAdd = () => {
    setError(null)

    if (!variantId) {
      setError("This item is currently unavailable")
      return
    }

    if (!countryCode) {
      setError("Could not detect your region")
      return
    }

    startTransition(async () => {
      try {
        await addToCart({
          variantId,
          quantity: 1,
          countryCode,
        })
      } catch (err: any) {
        setError(err?.message || `Could not add ${productTitle} to cart`)
      }
    })
  }

  return (
    <div className="flex w-full flex-col items-start gap-1">
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={handleQuickAdd}
        isLoading={isPending}
        disabled={!variantId}
        className="h-8 w-full px-2 text-xs"
        data-testid="product-quick-add"
      >
        Add to cart
      </Button>
      {error && <span className="text-ui-fg-error txt-xsmall">{error}</span>}
    </div>
  )
}
