import { Metadata } from "next"
import { Heading } from "@medusajs/ui"

export const metadata: Metadata = {
  title: "About Us | DeusWarehouse",
  description:
    "Learn about DeusWarehouse - your trusted source for premium pharmaceutical and performance products in Canada.",
}

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero banner */}
      <div className="bg-deus-black py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-deus-accent to-transparent" />
        <div className="content-container text-center">
          <span className="text-deus-accent text-xs tracking-[0.4em] uppercase font-medium">
            Who We Are
          </span>
          <Heading
            level="h1"
            className="text-4xl small:text-5xl font-bold text-white mt-4 tracking-tight"
          >
            About DeusWarehouse
          </Heading>
          <p className="text-deus-gray-400 text-base max-w-2xl mx-auto mt-6 leading-relaxed">
            Providing Canadians with premium-grade performance and pharmaceutical
            products since day one.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <div className="content-container py-16 small:py-24">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Our Mission
            </span>
            <h2 className="text-2xl small:text-3xl font-bold text-deus-black mt-3 mb-6">
              Quality Without Compromise
            </h2>
            <div className="space-y-4 text-deus-gray-500 leading-relaxed">
              <p>
                At DeusWarehouse, we believe everyone deserves access to
                high-quality performance and pharmaceutical products. Our mission
                is to provide lab-tested, research-grade compounds at fair prices
                with the convenience and discretion you expect.
              </p>
              <p>
                Every product in our catalog undergoes rigorous third-party
                testing to verify purity and potency. We work directly with
                trusted manufacturers to ensure consistent quality across every
                batch.
              </p>
              <p>
                Based in Canada, we ship nationwide with fast, discreet
                packaging that protects your privacy and ensures your products
                arrive safely.
              </p>
            </div>
          </div>
          <div className="bg-deus-gray-50 p-10 border border-deus-gray-200">
            <div className="space-y-8">
              <div>
                <span className="text-deus-accent text-3xl font-bold">99%+</span>
                <p className="text-deus-gray-500 text-sm mt-1">
                  Purity verified through independent lab testing on every
                  product batch
                </p>
              </div>
              <div className="border-t border-deus-gray-200 pt-8">
                <span className="text-deus-accent text-3xl font-bold">
                  24-48h
                </span>
                <p className="text-deus-gray-500 text-sm mt-1">
                  Average processing time with expedited shipping options
                  available
                </p>
              </div>
              <div className="border-t border-deus-gray-200 pt-8">
                <span className="text-deus-accent text-3xl font-bold">
                  100%
                </span>
                <p className="text-deus-gray-500 text-sm mt-1">
                  Discreet, unbranded packaging on every order for your privacy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-deus-black py-16 small:py-24">
        <div className="content-container">
          <div className="text-center mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              What Sets Us Apart
            </span>
            <h2 className="text-2xl small:text-3xl font-bold text-white mt-3">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 gap-8">
            {[
              {
                title: "Purity First",
                description:
                  "Every product is independently tested. We publish certificates of analysis so you know exactly what you're getting.",
              },
              {
                title: "Customer Privacy",
                description:
                  "Discreet billing and plain packaging. We never share customer data and accept cryptocurrency for added anonymity.",
              },
              {
                title: "Fast Fulfillment",
                description:
                  "Orders are processed within 24 hours. We use trusted carriers to ensure reliable delivery across Canada.",
              },
              {
                title: "Expert Support",
                description:
                  "Our knowledgeable team is available to answer product questions and help you find what you need.",
              },
              {
                title: "Fair Pricing",
                description:
                  "We cut out middlemen and work directly with manufacturers to keep prices accessible without sacrificing quality.",
              },
              {
                title: "Crypto Friendly",
                description:
                  "We accept Solana (SOL) payments for fast, secure, and private transactions with no intermediaries.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="border border-deus-gray-800 p-8 hover:border-deus-accent transition-colors duration-300"
              >
                <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-3">
                  {value.title}
                </h3>
                <p className="text-deus-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="content-container py-16 small:py-24 text-center">
        <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
          Ready to get started?
        </span>
        <h2 className="text-2xl small:text-3xl font-bold text-deus-black mt-3 mb-4">
          Browse Our Products
        </h2>
        <p className="text-deus-gray-500 max-w-lg mx-auto mb-8">
          Explore our full catalog of lab-tested performance and pharmaceutical
          products. Shipped fast and discreet across Canada.
        </p>
        <a href="/store" className="deus-btn inline-block">
          Shop Now
        </a>
      </div>
    </div>
  )
}
