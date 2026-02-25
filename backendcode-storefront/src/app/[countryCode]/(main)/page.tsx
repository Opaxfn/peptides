import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import ReviewsCarousel from "@modules/home/components/reviews-carousel"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { sdk } from "@lib/config"

async function getCarouselReviews() {
  try {
    const response = await sdk.client.fetch<any>("/store/reviews/carousel", {
      query: { limit: 10, offset: 0 },
    })
    return response.reviews || []
  } catch (error) {
    console.error("Failed to fetch carousel reviews:", error)
    return []
  }
}

export const metadata: Metadata = {
  title: "Buy Premium Peptides & SARMS Online Canada | DeusWarehouse",
  description:
    "Shop lab-tested peptides, SARMS, orals and injectables online. Discreet shipping across Canada. Best prices on premium research compounds.",
  keywords: ["buy peptides online", "buy peptides canada", "buy sarms canada", "buy sarms online", "buy injectables canada", "buy orals online", "premium peptides", "research compounds canada"],
  openGraph: {
    title: "Buy Premium Peptides & SARMS Online Canada | DeusWarehouse",
    description: "Shop lab-tested peptides, SARMS, orals and injectables online. Discreet shipping across Canada.",
    type: "website",
    url: "https://deuswarehouse.com",
    siteName: "DeusWarehouse",
  },
  alternates: {
    canonical: "https://deuswarehouse.com",
  },
}

async function CollectionSection({
  title,
  collectionId,
  regionId,
}: {
  title: string
  collectionId: string
  regionId: string
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId,
    queryParams: {
      limit: 6,
      collection_id: [collectionId],
    },
  })

  if (!products.length) return null

  return (
    <div className="py-12 small:py-16">
      <div className="content-container">
        <div className="flex items-center justify-between mb-8">
          <div className="text-center">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Collection
            </span>
            <h2 className="text-2xl small:text-3xl font-bold text-deus-black mt-2">
              {title}
            </h2>
          </div>
          <LocalizedClientLink
            href={`/collections/${title.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-deus-accent text-sm font-medium hover:underline"
          >
            View All
          </LocalizedClientLink>
        </div>
        <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 large:grid-cols-6 gap-x-4 gap-y-6">
          {products.map((product) => (
            <li key={product.id}>
              <div className="w-full max-w-[180px] small:max-w-[200px] mx-auto">
                <ProductPreview product={product} region={{ id: regionId } as any} isFeatured />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const {
    response: { products },
  } = await listProducts({
    regionId: region?.id,
    queryParams: {
      limit: 12,
    },
  })

  const { collections } = await listCollections({ limit: "10" })

  let topLevelCategories: any[] = []
  try {
    const categories = await listCategories()
    topLevelCategories = categories?.filter((c: any) => !c.parent_category) || []
  } catch (error) {
    console.error("Failed to fetch categories:", error)
  }

  const featuredCollections = collections.slice(0, 4)

  // Fetch carousel reviews server-side
  const carouselReviews = await getCarouselReviews()

  if (!region) {
    return null
  }

  return (
    <>
      <Hero categories={topLevelCategories} />
      <div className="py-12 small:py-16">
        <div className="content-container">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center">
              <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
                Collection
              </span>
              <h2 className="text-2xl small:text-3xl font-bold text-deus-black mt-2">
                Popular Products
              </h2>
            </div>
            <LocalizedClientLink
              href="/store"
              className="text-deus-accent text-sm font-medium hover:underline"
            >
              View All
            </LocalizedClientLink>
          </div>
          {products.length ? (
            <ul className="flex gap-4 overflow-x-auto pb-4">
              {products.map((product) => (
                <li key={product.id} className="flex-shrink-0 w-[180px] small:w-[200px]">
                  <ProductPreview product={product} region={region} isFeatured />
                </li>
              ))}
            </ul>
          ) : (
            <p className="content-container text-center text-ui-fg-subtle">
              No products available yet.
            </p>
          )}
        </div>
      </div>
      <ReviewsCarousel reviews={carouselReviews} />
      {featuredCollections.map((collection) => (
        <CollectionSection
          key={collection.id}
          title={collection.title || "Collection"}
          collectionId={collection.id}
          regionId={region.id}
        />
      ))}
    </>
  )
}
