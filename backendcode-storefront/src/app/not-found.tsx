import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Metadata } from "next"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Page Not Found | DeusWarehouse",
  description: "The page you're looking for doesn't exist. Browse our premium peptides, SARMS, orals and injectables with discreet shipping across Canada.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[calc(100vh-200px)] py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-deus-black mb-4">404</h1>
        <h2 className="text-xl-semi text-ui-fg-base mb-2">Page Not Found</h2>
        <p className="text-regular text-ui-fg-base max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-4 items-center">
        <p className="text-sm text-ui-fg-subtle">Quick Links:</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <LocalizedClientLink href="/" className="deus-btn">
            Home
          </LocalizedClientLink>
          <LocalizedClientLink href="/store" className="deus-btn-outline">
            All Products
          </LocalizedClientLink>
          <LocalizedClientLink href="/categories/peptides" className="deus-btn-outline">
            Peptides
          </LocalizedClientLink>
          <LocalizedClientLink href="/categories/sarms" className="deus-btn-outline">
            SARMS
          </LocalizedClientLink>
        </div>
      </div>

      {/* Search prompt */}
      <div className="text-center mt-4">
        <p className="text-sm text-ui-fg-subtle">
          Looking for something specific?{" "}
          <Link href="/store" className="text-deus-accent hover:underline">
            Browse our store
          </Link>
        </p>
      </div>

      <Link
        className="flex gap-x-1 items-center group mt-4"
        href="/"
      >
        <Text className="text-ui-fg-interactive">Go to homepage</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  )
}
