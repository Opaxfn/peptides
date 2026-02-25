"use client"

import { clx } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"

type ShippingProtectionProps = {
  cart: HttpTypes.StoreCart
  price: number
  isEnabled: boolean
}

function setCookie(name: string, value: string, days: number = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

export default function ShippingProtection({
  cart,
  price,
  isEnabled: initialEnabled,
}: ShippingProtectionProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = () => {
    setLoading(true)
    try {
      const newEnabled = !enabled
      setEnabled(newEnabled)
      
      if (newEnabled) {
        setCookie("shipping_protection", "true")
      } else {
        setCookie("shipping_protection", "false")
      }
      
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-100 p-4 rounded-lg border">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900">
              Shipping Protection
            </span>
            <span className="text-xs text-neutral-500">
              ({convertToLocale({ amount: price, currency_code: cart.currency_code })})
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Protects against seizure, loss, and damage during shipping
          </p>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={clx(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2",
            {
              "bg-neutral-900": enabled,
              "bg-neutral-300": !enabled,
            }
          )}
        >
          <span
            className={clx(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
              {
                "translate-x-6": enabled,
                "translate-x-1": !enabled,
              }
            )}
          />
        </button>
      </div>
    </div>
  )
}
