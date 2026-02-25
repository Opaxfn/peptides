"use client"

import { Heading } from "@medusajs/ui"
import { useState } from "react"

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Orders are processed within 24 hours on business days. Standard shipping within Canada takes 3-7 business days. Expedited shipping options are available at checkout for 1-3 business day delivery.",
      },
      {
        q: "Is the packaging discreet?",
        a: "Yes, absolutely. All orders ship in plain, unbranded packaging with no indication of the contents. The return address does not reference DeusWarehouse or any product names.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we only ship within Canada. We are working on expanding to international markets in the near future.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once your order ships, you will receive an email with a tracking number. You can also view tracking information in your account dashboard under order history.",
      },
      {
        q: "What is your return policy?",
        a: "Due to the nature of our products, we cannot accept returns on opened items. If you receive a damaged or incorrect product, please contact us within 48 hours of delivery and we will make it right.",
      },
    ],
  },
  {
    category: "Products & Quality",
    questions: [
      {
        q: "Are your products lab tested?",
        a: "Yes. Every batch of our products undergoes independent third-party testing for purity and potency. We maintain certificates of analysis (COAs) for all products.",
      },
      {
        q: "What purity levels do your products have?",
        a: "Our products maintain a minimum 99% purity standard, verified through HPLC and mass spectrometry testing by independent laboratories.",
      },
      {
        q: "How should I store my products?",
        a: "Most products should be stored in a cool, dry place away from direct sunlight. Some peptides require refrigeration after reconstitution. Specific storage instructions are included with each product.",
      },
      {
        q: "What categories of products do you carry?",
        a: "We carry peptides, SARMs, post-cycle therapy compounds, weight loss compounds, oral compounds, and injectables. Browse our full catalog on the Store page.",
      },
    ],
  },
  {
    category: "Payment & Security",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Solana (SOL) cryptocurrency payments for fast, secure, and private transactions. This allows for peer-to-peer payments with no intermediary processors.",
      },
      {
        q: "How does Solana payment work?",
        a: "At checkout, you will receive a unique Solana wallet address and the SOL amount to send. The payment is price-locked for a limited time to protect against crypto volatility. Once your payment is confirmed on the blockchain, your order is automatically processed.",
      },
      {
        q: "Is my personal information secure?",
        a: "We take privacy seriously. We use industry-standard encryption, minimal data collection practices, and never share customer information with third parties. Cryptocurrency payments add an extra layer of financial privacy.",
      },
      {
        q: "Will DeusWarehouse appear on my bank statement?",
        a: "Since we accept cryptocurrency payments, there is no bank statement entry at all. Your transaction exists only on the Solana blockchain.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "Do I need an account to order?",
        a: "While you can browse products without an account, you will need to create an account to place orders. This allows you to track orders, save addresses, and view your order history.",
      },
      {
        q: "How do I contact customer support?",
        a: "You can reach our support team through the contact information in your account dashboard. We aim to respond to all inquiries within 24 hours.",
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 1 hour of placement, provided they have not yet been processed. Contact support immediately if you need to make changes.",
      },
    ],
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-deus-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-deus-black group-hover:text-deus-accent transition-colors duration-200 pr-4">
          {question}
        </span>
        <span
          className={`text-deus-accent text-xl transition-transform duration-300 flex-shrink-0 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-deus-gray-500 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      }))
    ),
  }

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero banner */}
      <div className="bg-deus-black py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-deus-accent to-transparent" />
        <div className="content-container text-center">
          <span className="text-deus-accent text-xs tracking-[0.4em] uppercase font-medium">
            Help Center
          </span>
          <Heading
            level="h1"
            className="text-4xl small:text-5xl font-bold text-white mt-4 tracking-tight"
          >
            Frequently Asked Questions
          </Heading>
          <p className="text-deus-gray-400 text-base max-w-2xl mx-auto mt-6 leading-relaxed">
            Find answers to common questions about our products, shipping,
            payments, and more.
          </p>
        </div>
      </div>

      {/* FAQ content */}
      <div className="content-container py-16 small:py-24">
        <div className="max-w-3xl mx-auto">
          {faqs.map((section) => (
            <div key={section.category} className="mb-12 last:mb-0">
              <div className="mb-6">
                <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
                  {section.category}
                </span>
              </div>
              <div className="border border-deus-gray-200 divide-y-0 px-6">
                {section.questions.map((faq) => (
                  <FAQItem
                    key={faq.q}
                    question={faq.q}
                    answer={faq.a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto mt-16 text-center bg-deus-gray-50 border border-deus-gray-200 p-12">
          <h3 className="text-xl font-bold text-deus-black mb-3">
            Still have questions?
          </h3>
          <p className="text-deus-gray-500 text-sm mb-6">
            Our support team is here to help. Create an account and reach out
            through your dashboard.
          </p>
          <a href="/account" className="deus-btn inline-block">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
