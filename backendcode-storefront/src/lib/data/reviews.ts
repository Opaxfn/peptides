import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export type Review = {
  id: string
  product_id: string
  variant_id: string | null
  customer_id: string
  order_id: string
  rating: number
  title: string | null
  comment: string
  verified_purchase: boolean
  status: "pending" | "approved" | "rejected"
  images?: string[]
  created_at: string
  customer?: {
    first_name: string
    last_name: string
    email?: string
  }
}

export type ReviewStats = {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number>
}

export type ReviewsResponse = {
  reviews: Review[]
  stats: ReviewStats
}

export type VerifyResponse = {
  can_review: boolean
  has_purchased: boolean
}

export async function getProductReviews(
  productId: string,
  countryCode: string
): Promise<ReviewsResponse | null> {
  try {
    const response = await sdk.client.fetch<ReviewsResponse>(`/store/reviews/${productId}`, {
      query: { countryCode },
    })
    return response
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return null
  }
}

export async function verifyPurchase(
  productId: string,
  countryCode: string
): Promise<VerifyResponse> {
  try {
    const response = await sdk.client.fetch<VerifyResponse>(
      `/store/reviews/${productId}/verify`,
      { query: { countryCode } }
    )
    return response
  } catch (error) {
    console.error("Failed to verify purchase:", error)
    return { can_review: false, has_purchased: false }
  }
}

export async function createReview(
  productId: string,
  data: {
    rating: number
    title?: string
    comment: string
    variant_id?: string
    images?: string[]
  },
  countryCode: string
): Promise<{ review?: Review; error?: string }> {
  try {
    const response = await sdk.client.fetch<{ review: Review }>(
      `/store/reviews/${productId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        query: { countryCode },
      }
    )
    return { review: response.review }
  } catch (error: any) {
    const message = error?.response?.data?.error || "Failed to create review"
    return { error: message }
  }
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function uploadReviewImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only JPG, PNG, and WebP images are allowed." }
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    return { error: "File too large. Maximum size is 5MB." }
  }

  try {
    const formData = new FormData()
    formData.append("file", file)

    // Get the JWT token from cookies (client-side)
    const token = typeof document !== "undefined" 
      ? document.cookie.split(";").find(c => c.trim().startsWith("_medusa_jwt="))?.split("=")[1]
      : null

    const headers: Record<string, string> = {}
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/reviews/upload`, {
      method: "POST",
      headers,
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { error: error.error || "Failed to upload image" }
    }

    const data = await response.json()
    return { url: data.url }
  } catch (error: any) {
    console.error("Upload error:", error)
    return { error: "Failed to upload image" }
  }
}

export type CarouselReviewsResponse = {
  reviews: Review[]
  total: number
  limit: number
  offset: number
}

export async function getCarouselReviews(
  limit: number = 10,
  offset: number = 0
): Promise<CarouselReviewsResponse | null> {
  try {
    const response = await sdk.client.fetch<CarouselReviewsResponse>(
      `/store/reviews/carousel`,
      {
        query: { limit, offset },
      }
    )
    return response
  } catch (error) {
    console.error("Failed to fetch carousel reviews:", error)
    return null
  }
}
