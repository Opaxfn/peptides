import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { z } from "zod"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(10),
  variant_id: z.string().optional(),
  images: z.array(z.string()).max(5).optional(),
})

async function getDbManager(req: MedusaRequest): Promise<any> {
  return req.scope.resolve("manager")
}

async function ensureTableExists(manager: any): Promise<void> {
  // First check if the table exists
  const tableCheck = await manager.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'reviews'
    );
  `)
  
  const tableExists = tableCheck[0]?.exists
  
  if (!tableExists) {
    // Create table with images column
    const query = `
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id TEXT NOT NULL,
        variant_id TEXT,
        customer_id TEXT NOT NULL,
        order_id TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title TEXT,
        comment TEXT NOT NULL,
        verified_purchase BOOLEAN DEFAULT false,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        images TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);
    `
    await manager.query(query)
  } else {
    // Table exists, check if images column exists
    const columnCheck = await manager.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews'
        AND column_name = 'images'
      );
    `)
    
    const columnExists = columnCheck[0]?.exists
    
    if (!columnExists) {
      // Add images column safely
      await manager.query(`
        ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
      `)
    }
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { product_id } = req.params
  const manager = await getDbManager(req)

  if (!product_id) {
    res.status(400).json({ error: "Product ID is required" })
    return
  }

  await ensureTableExists(manager)

  const reviews = await manager.query(
    `SELECT * FROM reviews WHERE product_id = $1 AND status = 'approved' ORDER BY created_at DESC`,
    [product_id]
  )

  const allReviews = await manager.query(
    `SELECT * FROM reviews WHERE product_id = $1`,
    [product_id]
  )

  const totalReviews = allReviews.length
  const averageRating =
    totalReviews > 0
      ? Math.round(
          (allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            totalReviews) *
            10
        ) / 10
      : 0

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  allReviews
    .filter((r: any) => r.status === "approved")
    .forEach((r: any) => {
      distribution[r.rating]++
    })

  res.json({
    reviews,
    stats: {
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
    },
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const { product_id } = req.params
  const customerId = (req as any).auth?.actorId

  if (!customerId) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  if (!product_id) {
    res.status(400).json({ error: "Product ID is required" })
    return
  }

  const validation = reviewSchema.safeParse(req.body)

  if (!validation.success) {
    res.status(400).json({ error: validation.error.errors })
    return
  }

  const { rating, title, comment, variant_id, images } = validation.data
  const manager = await getDbManager(req)

  await ensureTableExists(manager)

  const orders = await manager.query(
    `SELECT id FROM orders WHERE customer_id = $1 AND status = 'completed'`,
    [customerId]
  )

  let verifiedOrderId: string | null = null

  for (const order of orders) {
    const lineItems = await manager.query(
      `SELECT product_id FROM line_items WHERE order_id = $1`,
      [order.id]
    )

    for (const item of lineItems) {
      if (item.product_id === product_id) {
        verifiedOrderId = order.id
        break
      }
    }
    if (verifiedOrderId) break
  }

  if (!verifiedOrderId) {
    res.status(403).json({
      error: "You must purchase this product before leaving a review",
    })
    return
  }

  const review = await manager.query(
    `INSERT INTO reviews (product_id, variant_id, customer_id, order_id, rating, title, comment, verified_purchase, status, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7, true, 'approved', $8)
     RETURNING *`,
    [
      product_id,
      variant_id || null,
      customerId,
      verifiedOrderId,
      rating,
      title || null,
      comment,
      images || [],
    ]
  )

  res.status(201).json({ review: review[0] })
}
