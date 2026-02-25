"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState, useEffect, useRef } from "react"
import { searchProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchIcon from "@modules/common/icons/search"
import X from "@modules/common/icons/x"

const SearchBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProductsDebounced = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const products = await searchProducts({
          query: query.trim(),
          limit: 6,
          countryCode: "ca",
        })
        setResults(products)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchProductsDebounced, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      const params = new URLSearchParams(searchParams)
      params.set("q", trimmedQuery)
      params.set("page", "1")
      router.push(`/store?${params.toString()}`)
      setIsOpen(false)
      setQuery("")
      setResults([])
    }
  }

  const toggleSearch = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => document.getElementById("header-search-input")?.focus(), 100)
    }
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  const getProductPrice = (product: HttpTypes.StoreProduct): string | null => {
    const variant = product.variants?.[0]
    if (variant?.calculated_price?.calculated_amount && variant.calculated_price.currency_code) {
      return convertToLocale({
        amount: variant.calculated_price.calculated_amount,
        currency_code: variant.calculated_price.currency_code,
      })
    }
    return null
  }

  return (
    <div className="relative" ref={containerRef}>
      {!isOpen ? (
        <button
          onClick={toggleSearch}
          className="hover:text-deus-accent transition-colors duration-200"
          aria-label="Search"
        >
          <SearchIcon size={20} />
        </button>
      ) : (
        <div className="relative">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              id="header-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="h-8 px-2 text-xs border border-ui-border-base rounded-md bg-white w-32 focus:w-48 transition-all duration-200 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                setQuery("")
                setResults([])
              }}
              className="ml-1 text-gray-500 hover:text-deus-accent"
            >
              <X size={16} />
            </button>
          </form>

          {query.trim().length >= 2 && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-ui-border-base rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-xs text-gray-500">Loading...</div>
              ) : results.length > 0 ? (
                <>
                  {results.map((product) => (
                    <LocalizedClientLink
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 p-2 hover:bg-deus-gray-50 transition-colors"
                    >
                      {product.thumbnail && (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-deus-black truncate">
                          {product.title}
                        </p>
                        {getProductPrice(product) && (
                          <p className="text-xs text-deus-gray-500">
                            {getProductPrice(product)}
                          </p>
                        )}
                      </div>
                    </LocalizedClientLink>
                  ))}
                  <LocalizedClientLink
                    href={`/store?q=${encodeURIComponent(query.trim())}`}
                    onClick={handleResultClick}
                    className="block p-2 text-center text-xs font-medium text-deus-accent hover:bg-deus-gray-50 border-t"
                  >
                    View all results
                  </LocalizedClientLink>
                </>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">No products found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
