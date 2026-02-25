import { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const limit = parseInt(req.query.limit as string) || 10
  const offset = parseInt(req.query.offset as string) || 0

  // Sample reviews for demo purposes - replace with real data from database
  const sampleReviews = [
    {
      id: "sample-1",
      product_id: "sample-product-1",
      variant_id: null,
      customer_id: "sample-customer-1",
      order_id: "sample-order-1",
      rating: 5,
      title: "Great product!",
      comment: "This product exceeded my expectations. The quality is amazing and shipping was fast. Will definitely order again!",
      verified_purchase: true,
      status: "approved" as const,
      images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"],
      created_at: new Date().toISOString(),
      customer: {
        first_name: "John",
        last_name: "D.",
        email: undefined
      }
    },
    {
      id: "sample-2",
      product_id: "sample-product-2",
      variant_id: null,
      customer_id: "sample-customer-2",
      order_id: "sample-order-2",
      rating: 5,
      title: "Highly recommend",
      comment: "Been using this for a month now and I've seen great results. Customer service was also very helpful.",
      verified_purchase: true,
      status: "approved" as const,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop"],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      customer: {
        first_name: "Sarah",
        last_name: "M.",
        email: undefined
      }
    },
    {
      id: "sample-3",
      product_id: "sample-product-3",
      variant_id: null,
      customer_id: "sample-customer-3",
      order_id: "sample-order-3",
      rating: 5,
      title: "Fast shipping",
      comment: "Ordered on Monday and received by Wednesday! Product works exactly as described. Very satisfied.",
      verified_purchase: true,
      status: "approved" as const,
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"],
      created_at: new Date(Date.now() - 172800000).toISOString(),
      customer: {
        first_name: "Mike",
        last_name: "T.",
        email: undefined
      }
    },
    {
      id: "sample-4",
      product_id: "sample-product-4",
      variant_id: null,
      customer_id: "sample-customer-4",
      order_id: "sample-order-4",
      rating: 5,
      title: "Best in market",
      comment: "After researching multiple suppliers, I chose this one and I'm glad I did. Premium quality products.",
      verified_purchase: true,
      status: "approved" as const,
      images: ["https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop"],
      created_at: new Date(Date.now() - 259200000).toISOString(),
      customer: {
        first_name: "Alex",
        last_name: "R.",
        email: undefined
      }
    },
    {
      id: "sample-5",
      product_id: "sample-product-5",
      variant_id: null,
      customer_id: "sample-customer-5",
      order_id: "sample-order-5",
      rating: 5,
      title: "Excellent experience",
      comment: "From ordering to delivery, everything was smooth. The packaging was discrete and professional.",
      verified_purchase: true,
      status: "approved" as const,
      images: ["https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop"],
      created_at: new Date(Date.now() - 345600000).toISOString(),
      customer: {
        first_name: "Chris",
        last_name: "L.",
        email: undefined
      }
    }
  ]

  // Return sample reviews
  const reviews = sampleReviews.slice(offset, offset + limit)

  res.json({
    reviews,
    total: sampleReviews.length,
    limit,
    offset,
  })
}
