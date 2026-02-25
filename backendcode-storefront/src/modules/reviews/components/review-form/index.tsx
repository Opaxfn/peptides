"use client"

import { useState } from "react"
import { createReview } from "@lib/data/reviews"

type ReviewFormProps = {
  productId: string
  countryCode: string
  onSuccess: () => void
  onCancel: () => void
}

function StarButton({
  rating,
  selected,
  onClick,
}: {
  rating: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus:outline-none transition-transform hover:scale-110"
    >
      <svg
        className={`w-8 h-8 ${selected ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </button>
  )
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Average",
  4: "Good",
  5: "Excellent",
}

export default function ReviewForm({
  productId,
  countryCode,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (comment.length < 10) {
      setError("Review must be at least 10 characters")
      return
    }

    setIsSubmitting(true)

    const result = await createReview(
      productId,
      { rating, title: title || undefined, comment },
      countryCode
    )

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-deus-gray-200 p-6">
      <h3 className="text-lg font-bold text-deus-black mb-4">Write a Review</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-deus-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              rating={star}
              selected={star <= rating}
              onClick={() => setRating(star)}
            />
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-deus-gray-600">
              ({ratingLabels[rating]})
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-deus-gray-700 mb-2">
          Review Title (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full px-3 py-2 border border-deus-gray-200 rounded focus:outline-none focus:border-deus-accent text-sm"
          placeholder="Summarize your experience"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-deus-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          minLength={10}
          maxLength={1000}
          rows={4}
          className="w-full px-3 py-2 border border-deus-gray-200 rounded focus:outline-none focus:border-deus-accent text-sm"
          placeholder="Share your experience with this product..."
        />
        <p className="text-xs text-deus-gray-400 mt-1">
          Minimum 10 characters ({comment.length}/1000)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-deus-gray-600 border border-deus-gray-200 rounded hover:bg-deus-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-deus-black rounded hover:bg-deus-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  )
}
