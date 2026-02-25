import { notFound } from "next/navigation"
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const categoryDescriptions: Record<string, { title: string; description: string; keywords: string }> = {
  peptides: {
    title: "Premium Research Peptides Online Canada",
    description: "Buy premium peptides online in Canada from DeusWarehouse. Our lab-tested research peptides include BPC-157, TB-500, Sermion, CJC-1295, and more. All peptides are 99%+ purity with third-party testing. Discreet shipping across Canada. Best prices on quality peptides in Canada.",
    keywords: "buy peptides online, buy peptides canada, peptides for sale, research peptides, bpc-157, tb-500, cjc-1295, Sermion"
  },
  sarms: {
    title: "Premium SARMS Online Canada",
    description: "Buy SARMS online in Canada from DeusWarehouse. Our selective androgen receptor modulators (SARMS) are lab-tested for purity and potency. Premium quality RAD-140, Ostarine, LGD-4033, and more. Discreet shipping across Canada. Best prices on SARMS in Canada.",
    keywords: "buy sarms online, buy sarms canada, sarms for sale, rad-140, ostarine, lgd-4033, sarms canada"
  },
  orals: {
    title: "Oral Compounds & Peptides Online Canada",
    description: "Buy oral peptides and compounds online in Canada. Easy-to-administer oral formulations for research. Lab-tested for purity. Popular orals include MK-677, Anavar, and more. Discreet shipping across Canada. Best prices on oral compounds in Canada.",
    keywords: "buy orals online, buy orals canada, oral peptides for sale, oral compounds, mk-677, anavar"
  },
  injectables: {
    title: "Injectable Peptides & Compounds Online Canada",
    description: "Buy injectable peptides and compounds online in Canada. Premium injectable formulations with 99%+ purity. Lab-tested for safety. Discreet shipping across Canada. Best prices on injectable peptides in Canada.",
    keywords: "buy injectables online, buy injectables canada, injectable peptides for sale, hgh, testosterone"
  },
  "add-ons": {
    title: "Accessories & Supplements Online Canada",
    description: "Buy research accessories and supplements online in Canada. Essential supplies for your research needs including syringes, vials, and more. Discreet shipping across Canada.",
    keywords: "buy accessories canada, research supplies, supplements"
  }
}

function getCategorySEO(handle: string) {
  return categoryDescriptions[handle] || null
}

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categorySEO = getCategorySEO(category.handle || "")

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://deuswarehouse.com"
  const categoryJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categorySEO?.title || category.name || "Products",
    description: categorySEO?.description || category.description || "",
    url: `${baseUrl}/categories/${category.handle}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <div
      className="flex flex-col py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="flex flex-row mb-8 text-2xl-semi gap-4">
          {parents &&
            parents.map((parent) => (
              <span key={parent.id} className="text-ui-fg-subtle">
                <LocalizedClientLink
                  className="mr-4 hover:text-black"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                /
              </span>
            ))}
            <h1 data-testid="category-page-title">{categorySEO?.title || category.name}</h1>
        </div>
        {categorySEO && (
          <div className="mb-8 text-base-regular">
            <p className="text-gray-600">{categorySEO.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Keywords: {categorySEO.keywords}
            </p>
          </div>
        )}
        {category.description && !categorySEO && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
    </>
  )
}
