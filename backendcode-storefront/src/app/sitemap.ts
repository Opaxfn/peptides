import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getBaseURL } from "@lib/util/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  // Fetch all data for sitemap
  const [productsData, categoriesData, collectionsData] = await Promise.all([
    listProducts({ countryCode: "ca", queryParams: { limit: 100 } }),
    listCategories(),
    listCollections({ limit: 50 }),
  ])

  const products = productsData.response.products
  const categories = categoriesData || []
  const collections = collectionsData.collections || []

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Product pages
  const productPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.handle}`,
    lastModified: new Date(product.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Category pages
  const categoryPages = categories.map((category: any) => ({
    url: `${baseUrl}/categories/${category.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Collection pages
  const collectionPages = collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...collectionPages,
  ]
}
