import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

const categorySEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  "peptides": {
    title: "Buy Peptides Online Canada | Lab-Tested Research Peptides",
    description: "Shop premium peptides online in Canada. Lab-tested research peptides with discreet shipping across Canada. Best prices on quality peptides.",
    keywords: ["buy peptides online", "buy peptides canada", "peptides for sale", "research peptides canada", "premium peptides"]
  },
  "sarms": {
    title: "Buy SARMS Online Canada | Best Prices",
    description: "Shop SARMS for research online in Canada. Lab-tested selective androgen receptor modulators with discreet shipping. Best prices on SARMS in Canada.",
    keywords: ["buy sarms online", "buy sarms canada", "sarms for sale", "sarms canada", "buy sarms"]
  },
  "orals": {
    title: "Buy Oral Compounds Online Canada | Fast Shipping",
    description: "Shop oral peptides and compounds online in Canada. Lab-tested oral formulations with discreet shipping across Canada.",
    keywords: ["buy orals online", "buy orals canada", "oral peptides for sale", "oral compounds canada"]
  },
  "injectables": {
    title: "Buy Injectables Online Canada | Premium Quality",
    description: "Shop injectable peptides and compounds online in Canada. Lab-tested injectable formulations with discreet shipping across Canada.",
    keywords: ["buy injectables online", "buy injectables canada", "injectable peptides for sale", "injectables canada"]
  },
  "add-ons": {
    title: "Buy Accessories & Supplements Canada | Free Shipping",
    description: "Shop accessories and supplements for your research needs. Quality products with discreet shipping across Canada.",
    keywords: ["buy supplements canada", "accessories for sale", "research accessories"]
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)
    const categoryHandle = params.category.join("/")
    const seoData = categorySEO[categoryHandle] || null

    const title = productCategory.name + " | DeusWarehouse"
    const description = productCategory.description ?? seoData?.description ?? `${title} category.`

    return {
      title: seoData?.title || title,
      description: description,
      keywords: seoData?.keywords || [],
      alternates: {
        canonical: `${categoryHandle}`,
      },
      openGraph: {
        title: seoData?.title || title,
        description: description,
        type: "website",
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
