import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import QuickAddToCartButton from "./quick-add-to-cart"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const quickAddVariant =
    product.variants
      ?.filter((variant: any) => !!variant?.calculated_price?.calculated_amount)
      .sort(
        (a: any, b: any) =>
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
      )?.[0] || product.variants?.[0]

  return (
    <article className="group flex h-full w-full flex-col" data-testid="product-wrapper">
      <LocalizedClientLink href={`/products/${product.handle}`}>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
      </LocalizedClientLink>

      <div className="mt-2 flex flex-col gap-1">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <Text
            className="txt-xsmall text-ui-fg-base leading-4 line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </Text>
        </LocalizedClientLink>

        <div className="flex w-full flex-col items-start gap-1">
          <div className="text-ui-fg-base txt-xsmall font-semibold" data-testid="product-price">
            {cheapestPrice ? <PreviewPrice price={cheapestPrice} /> : "Price unavailable"}
          </div>
          <QuickAddToCartButton
            variantId={quickAddVariant?.id}
            productTitle={product.title}
          />
        </div>
      </div>
    </article>
  )
}
