import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBar from "@modules/layout/components/search-bar"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories(),
  ])

  const topLevelCategories = categories?.filter((c) => !c.parent_category) || []

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Top announcement bar */}
      <div className="bg-deus-black text-white text-center py-2 text-xs tracking-widest uppercase">
        ⚠️ <span className="text-amber-400 font-semibold">Research Use Only</span> — Not for Human Use | Free shipping on orders over $300 CAD &mdash; Discreet Packaging Guaranteed
      </div>

      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          {/* Left: Mobile menu */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} categories={topLevelCategories} />
            </div>
          </div>

          {/* Center: Brand */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="text-xl font-bold tracking-[0.2em] hover:text-deus-accent transition-colors duration-200 uppercase text-deus-black"
              data-testid="nav-store-link"
            >
              DEUS<span className="font-light">WAREHOUSE</span>
            </LocalizedClientLink>
          </div>

          {/* Right: Account + Search + Cart */}
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <LocalizedClientLink
                className="hover:text-deus-accent transition-colors duration-200 text-xs tracking-wider uppercase"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
              <SearchBar />
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-deus-accent flex gap-2 transition-colors duration-200"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      {/* Category navigation bar - desktop only */}
      <div className="hidden small:block bg-white border-b border-ui-border-base">
        <div className="content-container">
          <ul className="flex items-center justify-center gap-x-8 py-3">
            <li>
              <LocalizedClientLink
                href="/store"
                className="text-xs tracking-wider uppercase text-deus-gray-600 hover:text-deus-accent transition-colors duration-200 font-medium"
              >
                All Products
              </LocalizedClientLink>
            </li>
            {topLevelCategories.map((category) => (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="text-xs tracking-wider uppercase text-deus-gray-600 hover:text-deus-accent transition-colors duration-200 font-medium"
                >
                  {category.name}
                </LocalizedClientLink>
              </li>
            ))}
            <li>
              <LocalizedClientLink
                href="/about"
                className="text-xs tracking-wider uppercase text-deus-gray-600 hover:text-deus-accent transition-colors duration-200 font-medium"
              >
                About Us
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink
                href="/faq"
                className="text-xs tracking-wider uppercase text-deus-gray-600 hover:text-deus-accent transition-colors duration-200 font-medium"
              >
                FAQ
              </LocalizedClientLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
