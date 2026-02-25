import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "DeusWarehouse | Premium Performance Products",
    template: "%s | DeusWarehouse",
  },
  description: "Premium pharmaceutical and performance products. Lab-tested, discreet shipping across Canada.",
  keywords: ["buy peptides online", "buy peptides canada", "buy sarms canada", "buy sarms online", "buy injectables canada", "premium peptides", "research compounds"],
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "DeusWarehouse | Premium Peptides & SARMS Online Canada",
    description: "Shop lab-tested peptides, SARMS, orals and injectables. Discreet shipping across Canada.",
    site: "@deuswarehouse",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "DeusWarehouse",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DeusWarehouse",
  description: "Premium pharmaceutical and performance products. Lab-tested, discreet shipping across Canada.",
  url: getBaseURL(),
  areaServed: {
    "@type": "Country",
    name: "Canada",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZJCKK657ES"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZJCKK657ES');
            `,
          }}
        />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
