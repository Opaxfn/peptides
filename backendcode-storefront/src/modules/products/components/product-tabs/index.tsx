"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const getCategoryContent = (product: HttpTypes.StoreProduct) => {
  const categories = product.categories || []
  const categoryHandle = categories[0]?.handle?.toLowerCase() || ""
  
  const categoryContent: Record<string, { 
    description: string; 
    features: string[];
    usage: string;
    keywords: string;
  }> = {
    peptides: {
      description: "Our premium research peptides are manufactured under strict quality controls, each batch tested by third-party labs for purity levels of 99%+.",
      features: [
        "99%+ purity guaranteed",
        "Third-party lab tested",
        "Research-grade quality",
        "Batch-specific COAs available"
      ],
      usage: "For research purposes only. Not for human consumption.",
      keywords: "research peptides, bpc-157, tb-500, cjc-1295, Sermion, peptides canada"
    },
    sarms: {
      description: "Premium selective androgen receptor modulators (SARMS) designed for research. Each compound is carefully synthesized and lab-tested for purity.",
      features: [
        "Lab-tested for purity",
        "Precise dosing",
        "Research-grade compounds",
        "Third-party verified"
      ],
      usage: "For research purposes only. Not for human consumption.",
      keywords: "sarms, rad-140, ostarine, lgd-4033, mk-2866, sarms canada"
    },
    orals: {
      description: "High-quality oral compounds formulated for optimal bioavailability. Easy administration for research protocols.",
      features: [
        "Optimal bioavailability",
        "Easy administration",
        "Lab-verified potency",
        "Consistent dosing"
      ],
      usage: "For research purposes only. Not for human consumption.",
      keywords: "oral peptides, mk-677, anavar, oral compounds canada"
    },
    injectables: {
      description: "Premium injectable formulations with pharmaceutical-grade purity. Sterile manufacturing process ensures the highest quality.",
      features: [
        "Pharmaceutical-grade",
        "99%+ purity",
        "Sterile manufacturing",
        "Refrigerated storage"
      ],
      usage: "For research purposes only. Not for human consumption.",
      keywords: "injectable peptides, hgh, testosterone, injectables canada"
    },
    "add-ons": {
      description: "Essential research supplies and accessories to support your research protocols. Quality syringes, vials, and consumables.",
      features: [
        "Medical-grade supplies",
        "Sterile packaging",
        "Research essentials",
        "Discreet packaging"
      ],
      usage: "For research purposes only.",
      keywords: "research supplies, syringes, vials, accessories canada"
    }
  }

  for (const [key, content] of Object.entries(categoryContent)) {
    if (categoryHandle.includes(key)) {
      return content
    }
  }

  return null
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const categoryContent = getCategoryContent(product)

  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} categoryContent={categoryContent} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product, categoryContent }: ProductTabsProps & { categoryContent: ReturnType<typeof getCategoryContent> }) => {
  return (
    <div className="text-small-regular py-8">
      {categoryContent && (
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{categoryContent.description}</p>
          <div className="mb-4">
            <span className="font-semibold text-gray-900">Key Features:</span>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {categoryContent.features.map((feature, idx) => (
                <li key={idx} className="text-gray-600">{feature}</li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-500 italic">{categoryContent.usage}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
      {categoryContent && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Explore more:</p>
          <div className="flex flex-wrap gap-2">
            <LocalizedClientLink 
              href="/categories/peptides"
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              Peptides
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/categories/sarms"
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              SARMS
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/categories/orals"
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              Orals
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/categories/injectables"
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              Injectables
            </LocalizedClientLink>
            <LocalizedClientLink 
              href="/store"
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              All Products
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
