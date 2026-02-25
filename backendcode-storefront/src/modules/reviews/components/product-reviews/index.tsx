"use client"

import { useState, useEffect } from "react"
import {
  getProductReviews,
  verifyPurchase,
  Review,
  ReviewStats,
} from "@lib/data/reviews"
import ReviewSummary from "../review-summary"
import ReviewList from "../review-list"
import ReviewForm from "../review-form"

type ProductReviewsProps = {
  productId: string
  countryCode: string
}

type ViewState = "summary" | "list" | "form"

export default function ProductReviews({ productId, countryCode }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  })
  const [canReview, setCanReview] = useState(false)
  const [view, setView] = useState<ViewState>("summary")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [reviewsData, verifyData] = await Promise.all([
        getProductReviews(productId, countryCode),
        verifyPurchase(productId, countryCode),
      ])

      if (reviewsData) {
        setReviews(reviewsData.reviews)
        setStats(reviewsData.stats)
      }

      setCanReview(verifyData.can_review)
      setLoading(false)
    }

    fetchData()
  }, [productId, countryCode])

  const handleReviewSubmitted = async () => {
    const reviewsData = await getProductReviews(productId, countryCode)
    if (reviewsData) {
      setReviews(reviewsData.reviews)
      setStats(reviewsData.stats)
    }
    setCanReview(false)
    setView("list")
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-deus-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-deus-gray-200 rounded w-32"></div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {view === "summary" && (
        <>
          <ReviewSummary
            stats={stats}
            onViewAllClick={() => setView("list")}
          />
          {canReview && (
            <button
              onClick={() => setView("form")}
              className="mt-3 text-sm text-deus-accent hover:underline font-medium"
            >
              Write a Review
            </button>
          )}
        </>
      )}

      {view === "list" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-deus-black">
              Customer Reviews ({stats.totalReviews})
            </h3>
            <div className="flex gap-3">
              {canReview && (
                <button
                  onClick={() => setView("form")}
                  className="text-sm text-deus-accent hover:underline font-medium"
                >
                  Write a Review
                </button>
              )}
              {stats.totalReviews > 0 && (
                <button
                  onClick={() => setView("summary")}
                  className="text-sm text-deus-gray-500 hover:text-deus-black"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
          <ReviewList reviews={reviews} />
        </div>
      )}

      {view === "form" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-deus-black">Write a Review</h3>
            <button
              onClick={() => setView("summary")}
              className="text-sm text-deus-gray-500 hover:text-deus-black"
            >
              Cancel
            </button>
          </div>
          <ReviewForm
            productId={productId}
            countryCode={countryCode}
            onSuccess={handleReviewSubmitted}
            onCancel={() => setView("summary")}
          />
        </div>
      )}
    </div>
  )
}
