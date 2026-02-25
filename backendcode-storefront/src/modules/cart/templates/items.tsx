import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table, clx } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import Divider from "@modules/common/components/divider"
import LineItemPrice from "@modules/common/components/line-item-price"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  
  const regularItems = items?.filter(
    (item) => item.variant?.product?.handle !== "shipping-protection"
  )
  
  const shippingProtectionItem = items?.find(
    (item) => item.variant?.product?.handle === "shipping-protection"
  )

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {regularItems?.length
            ? regularItems
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>

      {shippingProtectionItem && (
        <div className="mt-6">
          <Divider />
          <div className="py-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-900">
                {shippingProtectionItem.product_title}
              </span>
              <span className="text-xs text-neutral-500">
                Protects against seizure, loss, and damage
              </span>
            </div>
            <LineItemPrice
              item={shippingProtectionItem}
              currencyCode={cart?.currency_code}
              region={cart?.region}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemsTemplate
