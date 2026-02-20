import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"

export const metadata: Metadata = {
  title: "DeusWarehouse | Premium Performance & Pharmaceutical Products",
  description:
    "Shop lab-tested peptides, SARMs, and performance compounds. Discreet shipping across Canada. Crypto payments accepted.",
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
      limit: 24,
    },
  })

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="py-16 small:py-24">
        <div className="content-container text-center mb-12">
          <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
            Featured
          </span>
          <h2 className="text-2xl small:text-3xl font-bold text-deus-black mt-3">
            Popular Products
          </h2>
        </div>
        {products.length ? (
          <ul className="content-container grid grid-cols-2 small:grid-cols-4 medium:grid-cols-5 large:grid-cols-6 gap-x-4 gap-y-6">
            {products.map((product) => (
              <li key={product.id}>
                <div className="w-full max-w-[180px] small:max-w-[200px] mx-auto">
                  <ProductPreview product={product} region={region} isFeatured />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="content-container text-center text-ui-fg-subtle">
            No products available yet.
          </p>
        )}
      </div>
    </>
  )
}
