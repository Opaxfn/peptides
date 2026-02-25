"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Review } from "@lib/data/reviews"
import { clx } from "@medusajs/ui"

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={clx(
            "w-4 h-4",
            star <= rating ? "text-yellow-400" : "text-gray-300"
          )}
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
  const images = review.images || []
  const displayImage = images[0]
  
  const customerName = review.customer 
    ? `${review.customer.first_name} ${review.customer.last_name?.charAt(0) || ""}.`
    : "Verified Customer"

  return (
    <div className="flex-shrink-0 w-full small:w-[320px] mx-2">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full">
        {displayImage && (
          <div className="relative h-48 w-full bg-gray-100">
            <Image
              src={displayImage}
              alt="Customer review"
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>
        )}
        
        <div className="p-4">
          <StarRating rating={review.rating} />
          
          <p className="text-sm font-medium mt-2 text-gray-900">
            {customerName}
          </p>
          
          {review.title && (
            <p className="text-sm font-semibold mt-1 text-gray-900">
              {review.title}
            </p>
          )}
          
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {review.comment}
          </p>
          
          {review.verified_purchase && (
            <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Purchase
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

type ReviewsCarouselProps = {
  reviews: Review[]
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(reviews.length > 1)

  const checkScrollButtons = () => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    
    const scrollAmount = direction === "left" ? -340 : 340
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  // Don't render if no reviews
  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="content-container">
        <h2 className="text-2xl font-bold text-center mb-8">
          What Our Customers Say
        </h2>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Previous reviews"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide py-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={checkScrollButtons}
          >
            {reviews.map((review) => (
              <div key={review.id} className="snap-start">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Next reviews"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
