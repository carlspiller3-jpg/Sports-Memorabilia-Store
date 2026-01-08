import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { ShieldCheck, Truck, Package, ZoomIn, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
import { TrustBadge } from "@/components/ui/TrustBadge"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"


import { PLACEHOLDER_PRODUCTS, PLACEHOLDER_IMAGES } from "@/lib/placeholder-data"
import { useCart } from "@/context/CartContext"
import {
    generateSEOTitle,
    generateMetaDescription,
    generateImageAlt,
    generateBreadcrumbSchema,
    generateFAQSchema,
    generateProductSchema,
    getCanonicalUrl,
    generateOGTags,
    generateTwitterTags
} from "@/lib/seo"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { fetchProductByHandle } from "@/lib/shopify"
import { SigningEventLayout } from "@/components/product/SigningEventLayout"

export function ProductPage() {
    const { handle } = useParams<{ handle: string }>()
    const { addToCart } = useCart()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedFrame, setSelectedFrame] = useState<string>("")
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    useEffect(() => {
        async function loadProduct() {
            if (!handle) return
            setLoading(true)

            if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
                const liveProduct = await fetchProductByHandle(handle)
                if (liveProduct) {
                    setProduct(liveProduct)
                    if (liveProduct.variants && liveProduct.variants.length > 0) {
                        if (liveProduct.variants[0].option1) {
                            setSelectedFrame(liveProduct.variants[0].option1)
                        }
                    }
                }
                setLoading(false)
                return
            }

            // 1. Try to find in placeholders first (for demo/dev)
            const placeholder = PLACEHOLDER_PRODUCTS.find(p => p.handle === handle)
            if (placeholder) {
                setProduct(placeholder)
                if (placeholder.variants && placeholder.variants.length > 0) {
                    if (placeholder.variants[0].option1) {
                        setSelectedFrame(placeholder.variants[0].option1)
                    }
                }
                setLoading(false)
                return
            }

            // 2. Fallback to Supabase
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    variants (*)
                `)
                .eq('handle', handle)
                .single()

            if (error) {
                console.error('Error fetching product:', error)
            } else {
                setProduct(data)
                if (data.variants && data.variants.length > 0) {
                    if (data.variants[0].option1) {
                        setSelectedFrame(data.variants[0].option1)
                    }
                }
            }
            setLoading(false)
        }

        loadProduct()
    }, [handle])

    const selectedVariant = product?.variants?.find(v => v.option1 === selectedFrame) || product?.variants?.[0] || null

    const handleAddToCart = () => {
        if (product && selectedVariant) {
            addToCart(product, selectedVariant)
        }
    }

    // DEMO: Mock Signing Product for User Preview
    if (handle === 'test-signing') {
        const mockSigningProduct: Product = {
            id: "demo-eubank",
            title: "Chris Eubank Sr - World Tour Private Signing",
            handle: "test-signing",
            body_html: "Exclusive private signing session with British boxing legend, Chris Eubank Sr. <br/><br/><strong>Item Details:</strong><br/>• <strong>Gloves & Photos:</strong> Supplied by us and delivered professionally framed.<br/>• <strong>Send-In Service:</strong> You send your item, we get it signed and return it via tracked courier (unframed).",
            images: ["https://images.unsplash.com/photo-1615117967963-39d48dd48911?q=80&w=2000&auto=format&fit=crop"],
            options: [
                { id: "opt1", product_id: "demo-eubank", name: "Item Selection", position: 1, values: ["Framed Signed Glove", "Framed Signed Photo", "Send-In Service"] }
            ],
            variants: [
                {
                    id: "v1", product_id: "demo-eubank", title: "Framed Signed Glove", price: 299,
                    option1: "Framed Signed Glove", option2: null,
                    sku: "EUBANK-GLOVE-FRM", inventory_quantity: 50,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                },
                {
                    id: "v2", product_id: "demo-eubank", title: "Framed Signed Photo", price: 149,
                    option1: "Framed Signed Photo", option2: null,
                    sku: "EUBANK-PHOTO-FRM", inventory_quantity: 100,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                },
                {
                    id: "v3", product_id: "demo-eubank", title: "Send-In Service (Your Item)", price: 99,
                    option1: "Send-In Service", option2: null,
                    sku: "EUBANK-SENDIN", inventory_quantity: 200,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                }
            ],
            tags: ["SigningEvent"],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            vendor: "Sports Signed",
            product_type: "Private Signing",
            status: "active"
        }
        return <SigningEventLayout product={mockSigningProduct} />
    }

    if (loading) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>
    }

    if (!product) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center">Product not found</div>
    }

    // Check for Signing Event Tag
    if (product.tags && product.tags.includes('SigningEvent')) {
        return <SigningEventLayout product={product} />
    }

    if (!product) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center">Product not found</div>
    }

    // Determine images
    const mainImage = (product.images && product.images.length > 0) ? product.images[0] : (PLACEHOLDER_IMAGES[product.id] || "https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop")
    const images = (product.images && product.images.length > 0) ? product.images : [mainImage, mainImage, mainImage] // Mock gallery for now
    const price = selectedVariant?.price || 0

    // SEO metadata
    const seoTitle = product.seo_title || generateSEOTitle(product)
    const seoDescription = product.seo_description || generateMetaDescription(product, price)
    const imageAlt = generateImageAlt(product)
    const canonicalUrl = getCanonicalUrl(product.handle)
    const ogTags = generateOGTags(product, price, mainImage)
    const twitterTags = generateTwitterTags(product, price, mainImage)

    // Enhanced schema markup
    const productSchema = generateProductSchema(product, price, mainImage)
    const breadcrumbSchema = generateBreadcrumbSchema(product)
    const faqSchema = generateFAQSchema()

    return (
        <div className="min-h-screen bg-ivory py-8 lg:py-12">
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
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>
            <div className="container mx-auto px-4">

                {/* Breadcrumbs */}
                <div className="text-sm text-navy/50 mb-6 lg:mb-8 font-medium">
                    <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-navy">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Gallery Section */}
                    <div className="space-y-6">
                        <div className="aspect-[4/5] bg-white rounded-sm overflow-hidden border border-stone/10 relative group shadow-sm">
                            <img
                                src={images[activeImageIndex]}
                                alt={imageAlt}
                                loading="eager"
                                fetchPriority="high"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 z-10">
                                <TrustBadge type="authenticated" className="bg-white/95 backdrop-blur-md shadow-sm" />
                            </div>
                            <button className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="w-5 h-5 text-charcoal" />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`aspect-square bg-white rounded-sm overflow-hidden border transition-all ${activeImageIndex === i ? 'border-gold ring-1 ring-gold/20' : 'border-stone/20 hover:border-gold/50'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-8 lg:pt-4">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-charcoal leading-tight">
                                {seoTitle.split('|')[0].trim()}
                            </h1>
                            <div className="flex items-center gap-6">
                                <span className="text-3xl font-medium text-gold font-serif">£{selectedVariant?.price}</span>
                            </div>
                        </div>

                        <div className="h-px bg-gradient-to-r from-stone/20 to-transparent" />

                        {/* Variants / Options */}
                        {product.variants && product.variants.length > 1 && (
                            <div className="space-y-4">
                                <span className="text-sm font-bold text-charcoal uppercase tracking-wider flex items-center gap-2">
                                    Select Style
                                </span>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedFrame(variant.option1 || "")}
                                            className={`px-6 py-3 border rounded-sm text-sm font-medium transition-all relative overflow-hidden ${selectedFrame === variant.option1
                                                ? 'border-gold bg-gold text-white shadow-md'
                                                : 'border-stone/30 text-navy hover:border-navy/50 bg-white'
                                                }`}
                                        >
                                            {variant.option1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Urgency / Low Stock Warning */}
                        {selectedVariant?.inventory_quantity !== undefined && selectedVariant.inventory_quantity > 0 && selectedVariant.inventory_quantity < 5 && (
                            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-sm border border-amber-100 mb-4 animate-pulse">
                                <AlertTriangle className="w-4 h-4 fill-amber-600 text-white" />
                                <span className="text-sm font-bold">Only {selectedVariant.inventory_quantity} left in stock - Order soon.</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-4 pt-1">
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                className="w-full text-lg h-14 shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-shadow bg-charcoal text-white hover:bg-charcoal/90"
                            >
                                Add to Cart
                            </Button>

                            {/* Payment Icons */}
                            <div className="flex justify-center flex-wrap gap-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 text-[10px] text-stone-500">
                                <span className="flex items-center gap-1 border px-2 py-1 rounded"><ShieldCheck className="w-3 h-3" /> Secure Checkout</span>
                                <span className="flex items-center gap-1 border px-2 py-1 rounded"><Truck className="w-3 h-3" /> Fast Shipping</span>
                            </div>
                        </div>

                        {/* Certification & Provenance - EXPANDED TRINITY */}
                        <div className="grid grid-cols-1 gap-0 border border-stone/20 rounded-lg overflow-hidden divide-y divide-stone/20 bg-white shadow-sm mt-8">

                            {/* 1. Digital Authentication */}
                            <div className="flex items-start gap-5 p-5 hover:bg-stone/5 transition-colors">
                                <div className="flex-shrink-0 h-12 w-12 bg-blue-50/50 rounded-full flex items-center justify-center text-blue-700">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-charcoal text-base">Digitally Authenticated</h4>
                                    <p className="text-sm text-navy/70 mt-1 leading-relaxed">
                                        Verified via our exclusive <strong>NFC Tag Technology</strong>.
                                        Scan the item with your phone to access the immutable digital record and signing proof.
                                    </p>
                                    <div className="mt-3 flex gap-2">
                                        <div className="bg-stone-100 text-[10px] px-2 py-1 rounded-sm border border-stone-200 font-mono text-stone-600">NFC Verified</div>
                                        <div className="bg-stone-100 text-[10px] px-2 py-1 rounded-sm border border-stone-200 font-mono text-stone-600">Tamper Proof</div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Photo Proof / Provenance */}
                            <div className="flex items-start gap-5 p-5 hover:bg-stone/5 transition-colors">
                                <div className="flex-shrink-0 h-12 w-12 bg-purple-50/50 rounded-full flex items-center justify-center text-purple-700">
                                    <span className="font-bold font-mono text-lg mb-1">((•))</span>
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-charcoal text-base">Signing Session Provenance</h4>
                                    <p className="text-sm text-navy/70 mt-1 leading-relaxed">
                                        Obtained directly from exclusive private signing sessions. We guarantee the provenance of every item we sell.
                                    </p>
                                </div>
                            </div>

                            {/* 3. Delivery */}
                            <div className="flex items-start gap-5 p-5 hover:bg-stone/5 transition-colors">
                                <div className="flex-shrink-0 h-12 w-12 bg-green-50/50 rounded-full flex items-center justify-center text-green-700">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-charcoal text-base">Premium Presentation</h4>
                                    <p className="text-sm text-navy/70 mt-1 leading-relaxed">
                                        Arrives in our signature matte-black luxury packaging. Framed items are protected in custom crates for insured worldwide delivery.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 pt-8">
                            <h3 className="font-serif text-xl font-bold text-charcoal border-b border-stone/10 pb-2">Product Description</h3>
                            <div className="prose prose-sm text-navy/80 leading-relaxed max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: product.body_html || '' }} />

                                <div className="bg-ivory p-4 rounded-lg border border-gold/20 mt-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gold/10 rounded-bl-full -mr-8 -mt-8"></div>
                                    <h5 className="font-serif font-bold text-gold mb-2 relative z-10">Collector's Note</h5>
                                    <p className="text-xs text-charcoal/80 relative z-10">
                                        "A fantastic investment piece. {product.title} represents a significant moment in sporting history.
                                        With the included NFC authentication, the value is protected for future generations."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Product Information - SKU, Tags, SEO */}
                        <div className="space-y-4 pt-6 border-t border-stone/10 mt-6">
                            <h3 className="font-serif text-xl font-bold text-charcoal border-b border-stone/10 pb-2">Product Information</h3>

                            {/* SKU */}
                            <div className="flex items-start gap-3">
                                <span className="text-sm font-bold text-navy/60 uppercase tracking-wider min-w-[80px]">SKU:</span>
                                <span className="text-sm text-charcoal font-mono">{selectedVariant?.sku || 'N/A'}</span>
                            </div>

                            {/* Tags */}
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <span className="text-sm font-bold text-navy/60 uppercase tracking-wider min-w-[80px]">Tags:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-gold/10 text-charcoal text-xs font-medium rounded-full border border-gold/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SEO Title */}
                            <div className="flex items-start gap-3">
                                <span className="text-sm font-bold text-navy/60 uppercase tracking-wider min-w-[80px]">SEO Title:</span>
                                <span className="text-sm text-charcoal">{seoTitle}</span>
                            </div>

                            {/* SEO Description */}
                            <div className="flex items-start gap-3">
                                <span className="text-sm font-bold text-navy/60 uppercase tracking-wider min-w-[80px]">SEO Desc:</span>
                                <span className="text-sm text-charcoal">{seoDescription}</span>
                            </div>

                            {/* Image Alt Text */}
                            <div className="flex items-start gap-3">
                                <span className="text-sm font-bold text-navy/60 uppercase tracking-wider min-w-[80px]">Image Alt:</span>
                                <span className="text-sm text-charcoal">{imageAlt}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Reviews Section REMOVED */}
            {/* <div className="container mx-auto px-4">
                <ReviewList productHandle={product.handle} />
            </div> */}


            {/* Related Products */}
            <RelatedProducts currentProduct={product} />

            {/* Mobile Sticky CTA */}
            <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-stone/10 p-4 z-40 safe-area-bottom">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-stone/60">Price</p>
                        <p className="text-lg font-bold text-charcoal">£{selectedVariant?.price || 0}</p>
                    </div>
                    <Button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gold text-navy h-12 font-bold hover:bg-gold/90"
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    )
}
