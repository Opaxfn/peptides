import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Shipping Policy | DeusWarehouse Canada",
  description: "Learn about our shipping policies, delivery times, packaging, and tracking for peptide and SARMS orders across Canada.",
  keywords: "shipping policy, peptide shipping Canada, discreet shipping, delivery times",
  openGraph: {
    title: "Shipping Policy | DeusWarehouse Canada",
    description: "Learn about our shipping policies, delivery times, packaging, and tracking for peptide and SARMS orders across Canada.",
    type: "website",
    url: "https://deuswarehouse.com/shipping",
    siteName: "DeusWarehouse",
  },
  alternates: {
    canonical: "https://deuswarehouse.com/shipping",
  },
}

const shippingMethods = [
  {
    name: "Standard Shipping",
    price: "Free for orders over $150",
    time: "5-7 business days",
    description: "Regular lettermail delivery. Orders under $150 have a flat $15 shipping fee.",
  },
  {
    name: "Express Shipping",
    price: "$25",
    time: "2-3 business days",
    description: "Priority courier delivery with signature required.",
  },
  {
    name: "Priority Shipping",
    price: "$40",
    time: "1-2 business days",
    description: "Fastest delivery option. Next-day delivery for orders placed before 2pm EST.",
  },
]

const shippingZones = [
  {
    region: "Ontario & Quebec",
    time: "2-4 business days",
    note: "Free shipping available on orders over $300",
  },
  {
    region: "British Columbia, Alberta, Manitoba",
    time: "3-5 business days",
    note: "Free shipping available on orders over $200",
  },
  {
    region: "Atlantic Canada (NL, PE, NS, NB)",
    time: "5-7 business days",
    note: "Free shipping available on orders over $250",
  },
  {
    region: "Northern Canada",
    time: "7-14 business days",
    note: "Additional shipping fees may apply for remote locations",
  },
]

export default function ShippingPage() {
  const shippingJsonLd = {
    "@context": "https://schema.org",
    "@type": "ExpressDeliveryService",
    name: "DeusWarehouse Shipping",
    provider: {
      "@type": "Organization",
      name: "DeusWarehouse",
    },
    areaServed: {
      "@type": "Country",
      name: "Canada",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 7,
        unitCode: "DAY",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingJsonLd) }}
      />
      {/* Hero banner */}
      <div className="bg-deus-black py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-deus-accent to-transparent" />
        <div className="content-container text-center">
          <span className="text-deus-accent text-xs tracking-[0.4em] uppercase font-medium">
            Delivery Information
          </span>
          <Heading
            level="h1"
            className="text-4xl small:text-5xl font-bold text-white mt-4 tracking-tight"
          >
            Shipping Policy
          </Heading>
          <p className="text-deus-gray-400 text-base max-w-2xl mx-auto mt-6 leading-relaxed">
            Fast, discreet shipping across Canada. Free shipping available on qualifying orders.
          </p>
        </div>
      </div>

      {/* Shipping Methods */}
      <div className="content-container py-16 small:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Delivery Options
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Shipping Methods
            </Heading>
            <div className="grid gap-4">
              {shippingMethods.map((method) => (
                <div
                  key={method.name}
                  className="border border-deus-gray-200 p-6 hover:border-deus-accent/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{method.name}</h3>
                      <p className="text-deus-gray-500 text-sm mt-1">{method.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-deus-accent">{method.price}</p>
                      <p className="text-sm text-deus-gray-500">{method.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Zones */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Delivery Regions
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Shipping Times by Province
            </Heading>
            <div className="border border-deus-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-deus-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Region</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Delivery Time</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-deus-gray-200">
                  {shippingZones.map((zone) => (
                    <tr key={zone.region}>
                      <td className="px-6 py-4 text-sm">{zone.region}</td>
                      <td className="px-6 py-4 text-sm">{zone.time}</td>
                      <td className="px-6 py-4 text-sm text-deus-gray-500">{zone.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Discreet Packaging */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Privacy
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Discreet Packaging
            </Heading>
            <div className="bg-deus-gray-50 p-8 border border-deus-gray-200">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">All orders ship in plain, unbranded packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">Return address shows generic business name only</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">No product names or descriptions on outer packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">Package contents are not visible from the outside</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tracking */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Tracking
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Order Tracking
            </Heading>
            <div className="space-y-4 text-deus-gray-600">
              <p>
                Once your order ships, you will receive an email with a tracking number and a link to track your package.
                You can also view tracking information in your account dashboard under Order History.
              </p>
              <p>
                Tracking updates may take 24-48 hours to appear after shipment. If you have any questions about your delivery,
                please contact our support team.
              </p>
            </div>
          </div>

          {/* Shipping Protection */}
          <div>
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Protection
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Shipping Protection
            </Heading>
            <div className="bg-deus-gray-50 p-8 border border-deus-gray-200">
              <p className="text-deus-gray-600 mb-4">
                We offer optional shipping protection at checkout for $2.99. This covers:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">Lost or stolen package replacement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">Damaged package replacement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-deus-accent">✓</span>
                  <span className="text-sm">Full refund if package cannot be located</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
