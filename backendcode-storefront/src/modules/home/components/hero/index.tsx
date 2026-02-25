import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const getCategoryDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    "Add-ons": "Additional products and accessories",
    Peptides: "Research-grade peptides",
    SARMS: "Selective androgen modulators",
    Orals: "Oral compounds",
    Injectables: "Injectable compounds",
  }
  return descriptions[name] || "Browse our selection"
}

type HeroProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const Hero = ({ categories }: HeroProps) => {
  const categoryLinks = categories.map((cat) => ({
    name: cat.name,
    handle: cat.handle,
    desc: getCategoryDescription(cat.name),
  }))

  return (
    <>
      {/* Main Hero */}
      <div className="h-[80vh] w-full relative overflow-hidden">
        {/* Premium gradient background with warm tint */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a1a1a] via-[#252018] to-[#151515]" />
        
        {/* Accent glow - top right */}
        <div className="absolute top-20 right-20 z-0 w-[300px] h-[300px] bg-deus-accent/35 rounded-full blur-[100px]" />
        
        {/* Accent glow - bottom left */}
        <div className="absolute bottom-20 left-20 z-0 w-[300px] h-[300px] bg-deus-accent/35 rounded-full blur-[100px]" />

        {/* Background pattern - subtle */}
        <div className="absolute inset-0 z-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-deus-accent to-transparent" />

        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6 small:px-32 gap-8">
          <div className="flex flex-col items-center gap-4">
            <span className="text-deus-accent text-xs tracking-[0.4em] uppercase font-medium">
              Premium Performance &amp; Pharmaceutical Products
            </span>
            <Heading
              level="h1"
              className="text-4xl small:text-6xl leading-tight text-white font-bold tracking-tight"
            >
              YOUR TRUSTED
              <br />
              <span className="text-deus-accent">SOURCE</span>
            </Heading>
            <p className="text-deus-gray-400 text-base small:text-lg max-w-xl leading-relaxed mt-2">
              Lab-tested peptides, SARMs, and performance compounds.
              Shipped discreetly across Canada.
            </p>
          </div>

          <div className="flex flex-col xsmall:flex-row gap-4 mt-4">
            <LocalizedClientLink href="/store">
              <button className="deus-btn-accent">
                Shop All Products
              </button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/about">
              <button className="deus-btn-outline border-white text-white hover:bg-white hover:text-deus-black">
                Learn More
              </button>
            </LocalizedClientLink>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-deus-accent/50 to-transparent" />
      </div>

      {/* Trust bar */}
      <div className="bg-white border-b border-ui-border-base py-8">
        <div className="content-container">
          <div className="grid grid-cols-2 small:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-deus-accent text-2xl font-bold">99%</span>
              <span className="text-xs tracking-wider uppercase text-deus-gray-500">Purity Guaranteed</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-deus-accent text-2xl font-bold">Lab</span>
              <span className="text-xs tracking-wider uppercase text-deus-gray-500">Tested Quality</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-deus-accent text-2xl font-bold">100%</span>
              <span className="text-xs tracking-wider uppercase text-deus-gray-500">Discreet Packaging</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-deus-accent text-2xl font-bold">SOL</span>
              <span className="text-xs tracking-wider uppercase text-deus-gray-500">Crypto Accepted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories showcase */}
      <div className="bg-deus-gray-50 py-16">
        <div className="content-container">
          <div className="text-center mb-12">
            <span className="text-deus-accent text-xs tracking-[0.3em] uppercase font-medium">
              Browse Our Selection
            </span>
            <h2 className="text-2xl small:text-3xl font-bold text-deus-black mt-3">
              Shop by Category
            </h2>
          </div>
          <div className="grid grid-cols-2 small:grid-cols-3 gap-4 small:gap-6">
            {categoryLinks.map((cat) => (
              <LocalizedClientLink
                key={cat.name}
                href={`/categories/${cat.handle}`}
                className="group"
              >
                <div className="bg-white border border-deus-gray-200 p-8 text-center hover:border-deus-accent hover:shadow-lg transition-all duration-300 ease-out">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-deus-black group-hover:text-deus-accent transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-deus-gray-400 text-xs mt-2">{cat.desc}</p>
                </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Hero
