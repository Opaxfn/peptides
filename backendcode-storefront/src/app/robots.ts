import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseURL()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/checkout",
          "/account",
          "/account/*",
          "/api",
          "/admin",
          "/order/*/transfer",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
