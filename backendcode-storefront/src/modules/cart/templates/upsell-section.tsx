"use client"

import { useState, useTransition } from "react"
import { Button, Heading, Table, Text } from "@medusajs/ui"
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
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">You might also like</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">Price</Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right"></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {products.map((product) => {
            const variant = product.variants?.[0]
            const price = variant?.calculated_price?.calculated_amount
            const priceCurrency =
              variant?.calculated_price?.currency_code ?? currencyCode

            return (
              <Table.Row key={product.id} className="w-full" data-testid="upsell-product-row">
                <Table.Cell className="!pl-0 p-4 w-24">
                  <LocalizedClientLink
                    href={`/products/${product.handle}`}
                    className="flex small:w-24 w-12"
                  >
                    <Thumbnail
                      thumbnail={product.thumbnail}
                      images={[]}
                      size="square"
                    />
                  </LocalizedClientLink>
                </Table.Cell>

                <Table.Cell className="text-left">
                  <Text
                    className="txt-medium-plus text-ui-fg-base"
                    data-testid="upsell-product-title"
                  >
                    <LocalizedClientLink href={`/products/${product.handle}`}>
                      {product.title}
                    </LocalizedClientLink>
                  </Text>
                </Table.Cell>

                <Table.Cell className="hidden small:table-cell">
                  {price != null && (
                    <span className="txt-medium text-ui-fg-subtle">
                      {convertToLocale({ amount: price, currency_code: priceCurrency })}
                    </span>
                  )}
                </Table.Cell>

                <Table.Cell className="!pr-0 text-right">
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={addingId === product.id || !variant?.id}
                    onClick={() => variant?.id && handleAdd(variant.id, product.id)}
                  >
                    {addingId === product.id ? "Adding..." : "Add to cart"}
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default UpsellSection
