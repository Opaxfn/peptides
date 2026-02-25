import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Buy Premium Peptides, SARMS, Orals & Injectables Online Canada | DeusWarehouse",
  description: "Shop lab-tested peptides, SARMS, orals and injectables online. Best prices on premium research compounds with discreet shipping across Canada.",
  keywords: ["buy peptides online", "buy peptides canada", "buy sarms online", "buy sarms canada", "buy orals online", "buy injectables online", "research peptides", "premium compounds canada"],
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "Buy Premium Peptides, SARMS & More Online Canada | DeusWarehouse",
    description: "Shop lab-tested peptides, SARMS, orals and injectables. Discreet shipping across Canada.",
    type: "website",
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      q={q}
      countryCode={params.countryCode}
    />
  )
}
