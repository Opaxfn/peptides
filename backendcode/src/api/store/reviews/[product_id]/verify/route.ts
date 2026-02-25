import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

async function getDbManager(req: MedusaRequest): Promise<any> {
  return req.scope.resolve("manager")
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { product_id } = req.params
  const customerId = (req as any).auth?.actorId

  if (!customerId) {
    res.json({ can_review: false, has_purchased: false })
    return
  }

  if (!product_id) {
    res.status(400).json({ error: "Product ID is required" })
    return
  }

  const manager = await getDbManager(req)

  const orders = await manager.query(
    `SELECT id FROM orders WHERE customer_id = $1 AND status = 'completed'`,
    [customerId]
  )

  let hasPurchased = false

  for (const order of orders) {
    const lineItems = await manager.query(
      `SELECT product_id FROM line_items WHERE order_id = $1`,
      [order.id]
    )

    for (const item of lineItems) {
      if (item.product_id === product_id) {
        hasPurchased = true
        break
      }
    }
    if (hasPurchased) break
  }

  res.json({
    can_review: hasPurchased,
    has_purchased: hasPurchased,
  })
}
