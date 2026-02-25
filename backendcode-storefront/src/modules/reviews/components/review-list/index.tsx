"use client"

import { useState } from "react"
import { Review } from "@lib/data/reviews"

type ReviewListProps = {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.comment.length > 150

  const initials = review.customer
    ? `${review.customer.first_name?.[0] || ""}${review.customer.last_name?.[0] || ""}`.toUpperCase()
    : "AN"

  return (
    <div className="bg-white rounded-lg border border-deus-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-deus-gray-200 flex items-center justify-center text-xs font-semibold text-deus-gray-600">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-deus-black">
              {review.customer
                ? `${review.customer.first_name} ${review.customer.last_name}`
                : "Anonymous"}
            </span>
            {review.verified_purchase && (
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          {review.verified_purchase && (
            <span className="text-[10px] text-green-600 font-medium">Verified Purchase</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <StarRating rating={review.rating} />
        <span className="text-[10px] text-deus-gray-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>

      {review.title && (
        <h4 className="text-sm font-semibold text-deus-black mb-1">
          {review.title}
        </h4>
      )}

      <p className="text-xs text-deus-gray-600 leading-relaxed">
        {isLong && !expanded ? `${review.comment.slice(0, 150)}...` : review.comment}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-deus-accent font-medium mt-1 hover:underline"
        >
          {expanded ? "Show less" : "See more"}
        </button>
      )}
    </div>
  )
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-deus-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
