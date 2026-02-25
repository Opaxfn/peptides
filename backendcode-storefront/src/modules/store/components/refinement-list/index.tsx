"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"

type RefinementListProps = {
  searchQuery?: string
  showSearch?: boolean
  'data-testid'?: string
}

const RefinementList = ({
  searchQuery,
  showSearch = true,
  'data-testid': dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchQuery ?? "")

  useEffect(() => {
    setQuery(searchQuery ?? "")
  }, [searchQuery])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)
    const trimmedQuery = query.trim()

    if (trimmedQuery) {
      params.set("q", trimmedQuery)
    } else {
      params.delete("q")
    }

    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  if (!showSearch) {
    return null
  }

  return (
    <div className="flex py-4 mb-4 w-full small:w-auto small:flex-shrink-0">
      <form onSubmit={handleSearch} className="flex gap-2 w-full small:w-64 small:flex-shrink-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="h-10 px-3 border border-ui-border-base rounded-md bg-ui-bg-base w-full"
        />
        <button
          type="submit"
          className="h-10 px-4 rounded-md border border-ui-border-base text-sm whitespace-nowrap"
        >
          Search
        </button>
      </form>
    </div>
  )
}

export default RefinementList
