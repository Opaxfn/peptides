import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-deus-black text-white w-full">
      <div className="content-container flex flex-col w-full">
        {/* Main footer content */}
        <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="text-xl font-bold tracking-[0.2em] uppercase text-white hover:text-deus-accent transition-colors duration-200"
            >
              DEUS<span className="font-light">WAREHOUSE</span>
            </LocalizedClientLink>
            <p className="text-deus-gray-400 text-sm leading-relaxed">
              Premium pharmaceutical and performance products. Quality you can trust, delivered with discretion.
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-deus-gray-400 text-xs tracking-wider uppercase">Discreet Shipping</span>
              <span className="text-deus-accent">|</span>
              <span className="text-deus-gray-400 text-xs tracking-wider uppercase">Lab Tested</span>
            </div>
          </div>

          {/* Categories column */}
          {productCategories && productCategories?.length > 0 && (
            <div className="flex flex-col gap-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-deus-accent">
                Categories
              </span>
              <ul className="grid grid-cols-1 gap-3" data-testid="footer-categories">
                {productCategories?.slice(0, 6).map((c) => {
                  if (c.parent_category) {
                    return
                  }

                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-deus-gray-400 hover:text-white text-sm transition-colors duration-200"
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Collections column */}
          {collections && collections.length > 0 && (
            <div className="flex flex-col gap-y-4">
              <span className="text-xs font-semibold tracking-wider uppercase text-deus-accent">
                Collections
              </span>
              <ul className="grid grid-cols-1 gap-3">
                {collections?.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-deus-gray-400 hover:text-white text-sm transition-colors duration-200"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info column */}
          <div className="flex flex-col gap-y-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-deus-accent">
              Information
            </span>
            <ul className="grid grid-cols-1 gap-3">
              <li>
                <LocalizedClientLink
                  className="text-deus-gray-400 hover:text-white text-sm transition-colors duration-200"
                  href="/about"
                >
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="text-deus-gray-400 hover:text-white text-sm transition-colors duration-200"
                  href="/faq"
                >
                  FAQ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="text-deus-gray-400 hover:text-white text-sm transition-colors duration-200"
                  href="/store"
                >
                  Shop All
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="text-deus-gray-400 hover:text-white text-sm transition-colors duration-200"
                  href="/account"
                >
                  My Account
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-deus-gray-800 py-8">
          <div className="flex flex-col small:flex-row w-full justify-between items-center gap-4">
            <Text className="text-deus-gray-500 text-xs tracking-wider">
              &copy; {new Date().getFullYear()} DeusWarehouse. All rights reserved.
            </Text>
            <div className="flex items-center gap-6">
              <span className="text-deus-gray-500 text-xs">We accept SOL payments</span>
              <span className="text-deus-accent text-xs font-medium">Powered by Solana</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
