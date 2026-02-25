import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function addShippingProtection({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  logger.info("Checking for existing shipping protection product...")

  const { data: existingProducts } = await query.graph({
    entity: "product",
    filters: {
      handle: "shipping-protection",
    },
    fields: ["id"],
  })

  if (existingProducts.length > 0) {
    logger.info("Shipping protection product already exists. Skipping.")
    return
  }

  logger.info("Adding shipping protection product...")

  const salesChannels = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })

  const defaultSalesChannel = salesChannels[0]

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Shipping Protection",
          handle: "shipping-protection",
          description: "Protect your order against seizure, loss, and damage during shipping.",
          status: ProductStatus.PUBLISHED,
          options: [
            {
              title: "Type",
              values: ["Protection"],
            },
          ],
          variants: [
            {
              title: "Protection",
              sku: "SHIPPING-PROTECTION",
              options: {
                Type: "Protection",
              },
              prices: [
                {
                  amount: 15,
                  currency_code: "usd",
                },
                {
                  amount: 15,
                  currency_code: "eur",
                },
              ],
              allow_backorder: true,
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel.id,
            },
          ],
        },
      ],
    },
  })

  logger.info("Shipping protection product created successfully!")
}
