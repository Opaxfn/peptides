"use client"

import { useState } from "react"

type Review = {
  id: string
  author: string
  initials: string
  verified: boolean
  rating: number
  date: string
  text: string
  product: string
  productImage?: string
}

const reviews: Review[] = [
  {
    id: "1",
    author: "CA Customer",
    initials: "CC",
    verified: true,
    rating: 5,
    date: "02/12/2026",
    text: "Ordered Anavamed for pre show cut and everything feels as it should",
    product: "ANAVAMED 10mg",
  },
  {
    id: "2",
    author: "CA Customer",
    initials: "CC",
    verified: true,
    rating: 5,
    date: "02/12/2026",
    text: "Third time ordering, this time i bought my whole cycle with pct.",
    product: "RETATRUTIDE 10mg",
  },
  {
    id: "3",
    author: "CA Customer",
    initials: "CC",
    verified: true,
    rating: 5,
    date: "02/12/2026",
    text: "Needed my pct ASAP so i payed extra for express shipping only took 4 days.",
    product: "ENCLOMIMED 25mg",
  },
  {
    id: "4",
    author: "Micheal Renault",
    initials: "MR",
    verified: true,
    rating: 5,
    date: "02/12/2026",
    text: "Got it within a few days. Good news is that i am not hungry anymore! Took an extra day vs the estimate, but still Great!",
    product: "RETATRUTIDE 10mg",
  },
  {
    id: "5",
    author: "John Lamontagne",
    initials: "JL",
    verified: true,
    rating: 5,
    date: "02/12/2026",
    text: "Picked up Anadromed. Only 8 days in but I noticed a very noticeable strengh gain already.",
    product: "ANADROMED 50mg",
  },
  {
    id: "6",
    author: "Alex T.",
    initials: "AT",
    verified: true,
    rating: 5,
    date: "02/10/2026",
    text: "BPC-157 arrived in 3 days, discreet packaging. Already feeling the benefits after a week. Will order again.",
    product: "BPC-157 5mg",
  },
  {
    id: "7",
    author: "Marcus D.",
    initials: "MD",
    verified: true,
    rating: 5,
    date: "02/08/2026",
    text: "Semaglutide is legit. Down 12lbs in the first month. Shipping was fast to Ontario.",
    product: "SEMAGLUTIDE 5mg",
  },
  {
    id: "8",
    author: "Ryan K.",
    initials: "RK",
    verified: true,
    rating: 5,
    date: "02/05/2026",
    text: "First time trying MK677 and the sleep quality improvement alone is worth it. Solid product.",
    product: "MK677 10mg",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
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
  const isLong = review.text.length > 100

  return (
    <div className="bg-white rounded-lg border border-deus-gray-200 p-4 shadow-sm">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-deus-gray-200 flex items-center justify-center text-xs font-semibold text-deus-gray-600 flex-shrink-0">
          {review.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-deus-black truncate">
              {review.author}
            </span>
            {review.verified && (
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          {review.verified && (
            <span className="text-[10px] text-green-600 font-medium">Verified</span>
          )}
        </div>
      </div>

      {/* Rating + date */}
      <div className="flex items-center justify-between mb-2">
        <StarRating rating={review.rating} />
        <span className="text-[10px] text-deus-gray-400">{review.date}</span>
      </div>

      {/* Review text */}
      <p className="text-xs text-deus-gray-600 leading-relaxed">
        {isLong && !expanded ? `${review.text.slice(0, 100)}...` : review.text}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-deus-accent font-medium mt-1 hover:underline"
        >
          {expanded ? "Show less" : "See more"}
        </button>
      )}

      {/* Product tag */}
      <div className="mt-3 flex items-center gap-2 bg-deus-gray-50 rounded px-2.5 py-1.5 border border-deus-gray-100">
        <div className="w-6 h-6 bg-deus-gray-200 rounded flex-shrink-0" />
        <span className="text-[10px] font-medium text-deus-gray-600 truncate">
          {review.product}
        </span>
      </div>
    </div>
  )
}

export default function ReviewSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [sortBy, setSortBy] = useState<"highest" | "newest">("highest")

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <>
      {/* Floating trigger tab on right edge */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Open reviews"
      >
        <div className="bg-deus-black text-white px-2 py-4 rounded-l-lg shadow-lg flex flex-col items-center gap-1.5 hover:bg-deus-gray-800 transition-colors duration-200">
          <span className="text-[10px] font-medium tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
            Our Reviews
          </span>
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full xsmall:w-[420px] bg-deus-gray-50 z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-deus-gray-200 bg-white">
          <div>
            <h2 className="text-lg font-bold text-deus-black">Our Reviews</h2>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={5} />
              <span className="text-xs text-deus-gray-500">
                {reviews.length} reviews
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-deus-gray-100 transition-colors duration-200"
            aria-label="Close reviews"
          >
            <svg className="w-5 h-5 text-deus-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sort */}
        <div className="px-6 py-3 border-b border-deus-gray-200 bg-white">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "highest" | "newest")}
            className="text-sm border border-deus-gray-200 rounded px-3 py-1.5 text-deus-gray-600 bg-white focus:outline-none focus:border-deus-accent"
          >
            <option value="highest">Highest</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        {/* Reviews list - masonry-style 2 column */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="columns-1 xsmall:columns-2 gap-3 space-y-3">
            {sortedReviews.map((review) => (
              <div key={review.id} className="break-inside-avoid">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-deus-gray-200 bg-white text-center">
          <p className="text-[10px] text-deus-gray-400 tracking-wider uppercase">
            Verified reviews from real customers
          </p>
        </div>
      </div>
    </>
  )
}
