import { useState, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { ShieldCheck, Calendar, Clock, MapPin, PenTool, CheckCircle, Package, ArrowRight, Truck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/types/schema"
import {
    generateSEOTitle,
    generateMetaDescription,
    generateImageAlt,
    getCanonicalUrl,
    generateOGTags,
    generateTwitterTags,
    generateProductSchema
} from "@/lib/seo"

interface SigningEventLayoutProps {
    product: Product
}

export function SigningEventLayout({ product }: SigningEventLayoutProps) {
    const { addToCart } = useCart()

    // Determine the unique "Item Types" (Option 1)
    // Assumption: Option 1 = Item Type (Photo, Boot, Send-In), Option 2 = Framing
    const itemTypes = product.options?.[0]?.values || []

    const [selectedType, setSelectedType] = useState<string>(itemTypes[0] || "")
    const [selectedFrame, setSelectedFrame] = useState<string>("")
    const [instructions, setInstructions] = useState("")
    const [wantsDedication, setWantsDedication] = useState(false)
    const [dedicationText, setDedicationText] = useState("")

    // Find valid variants for the selected Type
    const availableVariants = useMemo(() => {
        return product.variants?.filter(v => v.option1 === selectedType) || []
    }, [product, selectedType])

    // Find the specifically selected variant (Type + Frame)
    const selectedVariant = useMemo(() => {
        if (!product.variants) return null

        // If there's a second option (Framing), match it
        if (product.options && product.options.length > 1) {
            return availableVariants.find(v => v.option2 === selectedFrame) || availableVariants[0]
        }

        return availableVariants[0]
    }, [availableVariants, selectedFrame, product.options])

    // Auto-select first frame option when Type changes
    if (product.options && product.options.length > 1 && !selectedFrame && availableVariants.length > 0) {
        if (availableVariants[0].option2) setSelectedFrame(availableVariants[0].option2)
    }

    const isSendIn = selectedType.toLowerCase().includes("send-in") || selectedType.toLowerCase().includes("your item")

    const handleAddToCart = () => {
        if (!selectedVariant) return

        const attributes: Record<string, string> = {}
        if (isSendIn && instructions) attributes["Signing Instructions"] = instructions
        if (wantsDedication && dedicationText) attributes["Dedication"] = dedicationText

        // Add main item
        addToCart(product, selectedVariant, 1, attributes)

        // Add Dedication Fee if selected
        if (wantsDedication) {
            const dedicationVariant = {
                id: "dedication-fee-variant",
                product_id: "dedication-fee",
                title: "Dedication Fee",
                price: 25,
                option1: "Dedication",
                option2: null,
                option3: null,
                sku: "DEDICATION-FEE",
                inventory_quantity: 10,
                position: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                smart_contract_address: null,
                token_id: null
            }
            const dedicationProduct = {
                id: "dedication-fee",
                title: "Personalized Dedication Service",
                handle: "dedication-service",
                body_html: "Fee for personalized dedication.",
                images: [],
                options: [],
                variants: [dedicationVariant],
                tags: [],
                vendor: "The Sports Memorabilia Store",
                product_type: "Service",
                status: "active" as "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            // Small delay effectively handled by React batches, but safe enough
            addToCart(dedicationProduct, dedicationVariant, 1)
        }
    }

    // --- SEO GENERATION ---
    const price = selectedVariant?.price || product.variants?.[0]?.price || 0
    const mainImage = product.images?.[0] || ""

    const seoTitle = product.seo_title || generateSEOTitle(product)
    const seoDescription = product.seo_description || generateMetaDescription(product, price)
    const imageAlt = generateImageAlt(product)
    const canonicalUrl = getCanonicalUrl(product.handle)
    const ogTags = generateOGTags(product, price, mainImage)
    const twitterTags = generateTwitterTags(product, price, mainImage)
    const productSchema = generateProductSchema(product, price, mainImage)

    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                {/* Primary Meta Tags */}
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content={ogTags.type} />
                <meta property="og:url" content={ogTags.url} />
                <meta property="og:title" content={ogTags.title} />
                <meta property="og:description" content={ogTags.description} />
                <meta property="og:image" content={ogTags.image} />
                <meta property="og:site_name" content={ogTags.siteName} />

                {/* Twitter */}
                <meta name="twitter:card" content={twitterTags.card} />
                <meta name="twitter:title" content={twitterTags.title} />
                <meta name="twitter:description" content={twitterTags.description} />
                <meta name="twitter:image" content={twitterTags.image} />

                {/* Schema.org markup */}
                <script type="application/ld+json">
                    {JSON.stringify(productSchema)}
                </script>
            </Helmet>

            {/* Hero Header for User Event */}
            <div className="bg-charcoal text-white py-16 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544698310-74ea9d188c1b?q=80&w=2670&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay" />
                <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-4">
                        <PenTool className="w-4 h-4" /> Official Private Signing
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight">
                        {product.title}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-8 text-stone-400 text-sm mt-6 font-medium">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gold" /> March 15th, 2025</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> Manchester, UK</span>
                        <span className="flex items-center gap-2 text-white"><Clock className="w-4 h-4 text-gold" /> Deadline: March 10th</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-10 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Col: Product Image (Sticky) - Reduced Size */}
                    <div className="lg:col-span-4 h-fit lg:sticky lg:top-8">
                        <div className="bg-white p-2 rounded-sm shadow-xl border border-white/20">
                            <div className="aspect-[4/3] bg-stone-100 rounded-sm overflow-hidden relative">
                                <img
                                    src={product.images?.[0] || ""}
                                    alt={imageAlt}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-sm shadow-sm flex items-center gap-2 text-xs font-bold text-navy">
                                        <ShieldCheck className="w-4 h-4 text-gold" /> Authenticated
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Signals */}
                        <div className="mt-8 space-y-4 px-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <strong className="text-charcoal block">Guaranteed Authenticity</strong>
                                    <span className="text-navy/60">Every item comes with our proprietary NFC Digital Authentication technology.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div className="text-sm">
                                    <strong className="text-charcoal block">Secure Handling</strong>
                                    <span className="text-navy/60">
                                        {isSendIn
                                            ? "Secure tracked return delivery included."
                                            : "Professional framing and premium packaging included."
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: The "Configurator" */}
                    <div className="lg:col-span-8 space-y-8 pt-10 lg:pt-0">

                        {/* 1. Select Item Type - Apple Style Grid */}
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-2xl font-bold text-charcoal">1. Select Your Item</h3>
                                <span className="text-xs font-bold text-navy/40 uppercase tracking-wider">Required</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {itemTypes.map((type) => {
                                    const isSelected = selectedType === type
                                    const variant = product.variants?.find(v => v.option1 === type)
                                    const startingPrice = variant?.price || "0"

                                    return (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setSelectedType(type)
                                                // Reset frame when type changes
                                                setSelectedFrame("")
                                            }}
                                            className={`
                                                relative p-6 text-left border rounded-sm transition-all duration-300
                                                ${isSelected
                                                    ? 'border-gold bg-gold/5 ring-1 ring-gold shadow-md scale-[1.02]'
                                                    : 'border-stone/20 hover:border-gold/50 bg-white hover:bg-stone-50'
                                                }
                                            `}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`font-bold ${isSelected ? 'text-charcoal' : 'text-navy'}`}>{type}</span>
                                                {isSelected && <CheckCircle className="w-5 h-5 text-gold" />}
                                            </div>
                                            <p className="text-sm text-navy/60">From £{startingPrice}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 2. Select Framing (Only if variant has Option 2) */}
                        {product.options && product.options.length > 1 && !isSendIn && (
                            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="font-serif text-2xl font-bold text-charcoal">2. Finishing Options</h3>
                                <div className="space-y-3">
                                    {product.options[1].values.map((frameOpt) => {
                                        const isSelected = selectedFrame === frameOpt
                                        // Find price for this specific combo
                                        const v = availableVariants.find(v => v.option2 === frameOpt)

                                        if (!v) return null // Don't show inactive combos

                                        return (
                                            <button
                                                key={frameOpt}
                                                onClick={() => setSelectedFrame(frameOpt)}
                                                className={`
                                                    w-full flex items-center justify-between p-4 border rounded-sm transition-all
                                                    ${isSelected ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-stone/20 hover:border-gold/30 bg-white'}
                                                `}
                                            >
                                                <span className="font-medium text-charcoal">{frameOpt}</span>
                                                <span className="font-serif text-gold font-bold">£{v.price}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Special SEND-IN Instructions Section */}
                        {isSendIn && (
                            <div className="bg-ivory border border-gold/30 p-8 rounded-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Truck className="w-24 h-24 text-gold" />
                                </div>

                                <h3 className="font-serif text-2xl font-bold text-charcoal relative z-10">Important Instructions</h3>

                                <div className="space-y-4 relative z-10">
                                    <div className="bg-white p-4 rounded-sm border border-stone/10 text-sm text-navy/80 leading-relaxed">
                                        <p className="font-bold mb-2">How Send-In Works:</p>
                                        <ol className="list-decimal pl-5 space-y-2">
                                            <li>Complete your purchase here to get your <strong>Order #</strong>.</li>
                                            <li>
                                                <strong>Label your item safely:</strong>
                                                <ul className="list-disc pl-4 mt-1 text-xs text-navy/70 space-y-1">
                                                    <li><strong>Photos:</strong> Write Order # lightly on the BACK in pencil.</li>
                                                    <li><strong>Shirts/Gloves:</strong> Pin/Tie a visible tag to the item.</li>
                                                    <li><span className="text-red-600 font-bold">WARNING:</span> Never stick tape directly on the item surface.</li>
                                                </ul>
                                            </li>
                                            <li>Post your item to us (Tracked & Insured).</li>
                                            <li>We sign it and ship it back.</li>
                                        </ol>
                                        <div className="pt-3 mt-3 border-t border-stone/10">
                                            <a href="/hub/guide-to-send-in-autographs" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-charcoal transition-colors font-bold flex items-center gap-1">
                                                Read full Send-In Guide <ArrowRight className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-charcoal uppercase tracking-wider">Signing Requests</label>
                                        <textarea
                                            className="w-full h-32 p-4 text-sm border border-stone/20 rounded-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
                                            placeholder="E.g. Please sign on the number 10 in silver pen. Please dedicate to 'John'..."
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                        />
                                        <p className="text-xs text-stone-400">We will do our best to accommodate specific requests but they cannot be guaranteed.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dedication Section (Limited Inventory) */}
                        <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-charcoal">Add Dedication</h3>
                                    <p className="text-xs text-navy/60">Personalize your item (e.g. "To John")</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-serif text-gold font-bold text-lg">+£25</span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                        Only 8 Left
                                    </span>
                                </div>
                            </div>

                            <label className={`
                                flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all
                                ${wantsDedication ? 'border-gold bg-gold/5' : 'border-stone/20 hover:border-gold/30'}
                            `}>
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 text-gold border-stone/30 rounded focus:ring-gold"
                                    checked={wantsDedication}
                                    onChange={(e) => setWantsDedication(e.target.checked)}
                                />
                                <span className="text-sm text-navy/80 selection:bg-gold/20">
                                    Yes, I would like a specific dedication added to my item.
                                </span>
                            </label>

                            {wantsDedication && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Name (e.g. To Michael)"
                                        className="w-full p-3 border border-stone/20 rounded-sm focus:border-gold outline-none text-sm"
                                        value={dedicationText}
                                        onChange={(e) => setDedicationText(e.target.value)}
                                        maxLength={30}
                                    />
                                    <p className="text-xs text-stone-400 mt-2 text-right">{dedicationText.length}/30 chars</p>
                                </div>
                            )}
                        </div>

                        {/* 3. Checkout Action */}
                        <div className="pt-6 border-t border-stone/10">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-sm text-stone-400">Total Price</p>
                                    <p className="text-4xl font-serif font-bold text-charcoal">
                                        £{(selectedVariant?.price || 0) + (wantsDedication ? 25 : 0)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-stone-400">Est. Dispatch</p>
                                    <p className="text-sm font-bold text-navy">Late March 2025</p>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full text-lg h-16 shadow-xl shadow-gold/20"
                                onClick={handleAddToCart}
                                disabled={!selectedVariant}
                            >
                                {isSendIn ? "Book Send-In Slot" : "Pre-Order Now"} <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <p className="text-center text-xs text-stone-400 mt-4">Safe & Secure Checkout via Shopify Payments</p>
                        </div>

                        {/* Description & Tags */}
                        <div className="pt-8 border-t border-stone/10 space-y-6">
                            <div>
                                <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Event Details</h3>
                                <div className="prose prose-sm text-navy/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.body_html || "" }} />
                            </div>

                            {product.tags && product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {product.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-500 text-xs font-medium rounded-full uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
