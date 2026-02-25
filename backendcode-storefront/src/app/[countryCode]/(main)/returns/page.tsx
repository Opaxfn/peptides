import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "Returns & Refunds Policy | DeusWarehouse Canada",
  description: "Learn about our returns and refunds policy for peptide and SARMS products. We stand behind the quality of our products.",
  keywords: "returns policy, refunds, product guarantee, DeusWarehouse",
  openGraph: {
    title: "Returns & Refunds Policy | DeusWarehouse Canada",
    description: "Learn about our returns and refunds policy for peptide and SARMS products.",
    type: "website",
    url: "https://deuswarehouse.com/returns",
    siteName: "DeusWarehouse",
  },
  alternates: {
    canonical: "https://deuswarehouse.com/returns",
  },
}

const returnProcess = [
  {
    step: 1,
    title: "Contact Support",
    description: "Email our support team within 48 hours of delivery with your order number and issue details.",
  },
  {
    step: 2,
    title: "Provide Documentation",
    description: "Take photos of any damage or issues and send them to our team for review.",
  },
  {
    step: 3,
    title: "Review & Resolution",
    description: "Our team will review your case within 24-48 hours and provide a solution.",
  },
  {
    step: 4,
    title: "Resolution",
    description: "We will ship a replacement, offer store credit, or process a refund based on the situation.",
  },
]

const eligibleItems = [
  "Unopened products in original sealed packaging",
  "Products damaged during shipping",
  "Incorrect items received (wrong product or variant)",
  "Products with manufacturing defects",
]

const nonEligibleItems = [
  "Opened or used products (due to health & safety regulations)",
  "Products past their expiration date",
  "Items returned without original packaging",
  "Promotional items",
  "Shipping protection fees (non-refundable)",
]

export default function ReturnsPage() {
  const returnsJsonLd = {
    "@context": "https://schema.org",
    "@type": "MerchantReturnPolicy",
    name: "DeusWarehouse Returns",
    provider: {
      "@type": "Organization",
      name: "DeusWarehouse",
    },
    returnPolicy: {
      "@type": "RefundPolicy",
      name: "DeusWarehouse Return Policy",
      returnShippingFees: "Free",
      refundMethod: ["Refund", "Store credit", "Exchange"],
      returnWindow: "P14D",
      eligibleReturnMethod: "https://schema.org/OnlineOnly",
    },
    applicableCountry: "CA",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(returnsJsonLd) }}
      />
      {/* Hero banner */}
      <div className="bg-deus-black py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-deus-accent to-transparent" />
        <div className="content-container text-center">
          <span className="text-deus-accent text-xs tracking-[0.4em] uppercase font-medium">
            Satisfaction Guarantee
          </span>
          <Heading
            level="h1"
            className="text-4xl small:text-5xl font-bold text-white mt-4 tracking-tight"
          >
            Returns & Refunds
          </Heading>
          <p className="text-deus-gray-400 text-base max-w-2xl mx-auto mt-6 leading-relaxed">
            We stand behind the quality of our products. Learn about our return policy and how we handle issues.
          </p>
        </div>
      </div>

      {/* Return Policy Content */}
      <div className="content-container py-16 small:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Our Commitment */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Our Commitment
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Quality Guarantee
            </Heading>
            <div className="bg-deus-gray-50 p-8 border border-deus-gray-200">
              <p className="text-deus-gray-600 leading-relaxed mb-4">
                At DeusWarehouse, we are committed to providing the highest quality research peptides and compounds. 
                Every product undergoes rigorous third-party testing to ensure purity and potency. If you experience 
                any issues with your order, we are here to help.
              </p>
              <p className="text-deus-gray-600 leading-relaxed">
                Due to the nature of our products (research chemicals), we cannot accept returns on opened or used items 
                for safety and regulatory reasons. However, we will always make things right if there is a quality issue 
                or shipping error.
              </p>
            </div>
          </div>

          {/* Return Process */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Process
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              How to Initiate a Return
            </Heading>
            <div className="grid gap-6">
              {returnProcess.map((process) => (
                <div
                  key={process.step}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-deus-black text-white flex items-center justify-center flex-shrink-0 font-bold">
                    {process.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{process.title}</h3>
                    <p className="text-deus-gray-500 text-sm mt-1">{process.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible Items */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Eligibility
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              What Can Be Returned
            </Heading>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-green-200 bg-green-50 p-6">
                <h3 className="font-semibold text-lg mb-4 text-green-800">Eligible for Return</h3>
                <ul className="space-y-3">
                  {eligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="text-green-600">✓</span>
                      <span className="text-green-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-red-200 bg-red-50 p-6">
                <h3 className="font-semibold text-lg mb-4 text-red-800">Not Eligible for Return</h3>
                <ul className="space-y-3">
                  {nonEligibleItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="text-red-600">✗</span>
                      <span className="text-red-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Refund Options */}
          <div className="mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Refunds
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Refund Options
            </Heading>
            <div className="grid gap-4">
              <div className="border border-deus-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-2">Full Refund</h3>
                <p className="text-deus-gray-500 text-sm">
                  Original payment method refund for eligible returns. Processing time: 5-7 business days after approval.
                </p>
              </div>
              <div className="border border-deus-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-2">Store Credit</h3>
                <p className="text-deus-gray-500 text-sm">
                  Receive 10% bonus on all store credit refunds. Instant credit to your account for future purchases.
                </p>
              </div>
              <div className="border border-deus-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-2">Replacement</h3>
                <p className="text-deus-gray-500 text-sm">
                  We will ship a replacement product at no additional cost for damaged or incorrect items.
                </p>
              </div>
            </div>
          </div>

          {/* Quality Assurance */}
          <div>
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Assurance
            </span>
            <Heading level="h2" className="text-2xl font-bold mt-3 mb-6">
              Our Quality Promise
            </Heading>
            <div className="bg-deus-black text-white p-8">
              <p className="leading-relaxed mb-6">
                Every batch of our products is tested by independent third-party laboratories to verify purity and potency. 
                We maintain certificates of analysis (COAs) for all products. If you ever question the quality of a product, 
                we will provide the batch-specific COA upon request.
              </p>
              <p className="leading-relaxed">
                Our goal is your complete satisfaction. If something is not right with your order, please don't hesitate 
                to reach out. We will work tirelessly to resolve any issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
