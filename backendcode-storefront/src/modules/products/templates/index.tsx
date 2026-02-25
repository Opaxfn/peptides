import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import { getProductReviews, ReviewStats } from "@lib/data/reviews"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

function generateProductJsonLd(product: HttpTypes.StoreProduct, region: HttpTypes.StoreRegion, reviewStats: ReviewStats | null) {
  const variant = product.variants?.[0]
  const price = variant?.prices?.[0]
  const priceAmount = price?.amount ? price.amount / 100 : 0
  const currency = price?.currency_code || "cad"

  const productJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description?.slice(0, 160) || `Premium ${product.title} - Lab-tested with discreet shipping across Canada.`,
    image: product.images?.slice(0, 10).map((img: any) => img.url) || [],
    sku: variant?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "DeusWarehouse",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.handle}`,
      priceCurrency: currency.toUpperCase(),
      price: priceAmount.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: variant?.inventory_quantity && variant.inventory_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "DeusWarehouse",
      },
    },
  }

  if (reviewStats && reviewStats.totalReviews > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewStats.averageRating.toFixed(1),
      reviewCount: reviewStats.totalReviews.toString(),
    }
  }

  return JSON.stringify(productJsonLd)
}

const ProductTemplate: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  let reviewStats: ReviewStats | null = null
  try {
    const reviewsResponse = await getProductReviews(product.id, countryCode)
    if (reviewsResponse?.stats) {
      reviewStats = reviewsResponse.stats
    }
  } catch (error) {
    console.error("Failed to fetch reviews for JSON-LD:", error)
  }

  const productJsonLd = generateProductJsonLd(product, region, reviewStats)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://deuswarehouse.com"
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Store",
        item: `${baseUrl}/store`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${baseUrl}/products/${product.handle}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div
        className="content-container  flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <ProductInfo product={product} countryCode={countryCode} />
          <ProductTabs product={product} />
        </div>
        <div className="block w-full relative">
          <ImageGallery images={images} productName={product.title} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
                reviewStats={reviewStats}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} reviewStats={reviewStats} />
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
