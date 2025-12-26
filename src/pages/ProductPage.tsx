import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { ShieldCheck, Truck, Package, Star, ZoomIn, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { TrustBadge } from "@/components/ui/TrustBadge"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"


import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data"
import { PLACEHOLDER_IMAGES } from "@/data/placeholders"
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
import { ReviewList } from "@/components/reviews/ReviewList"
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
            id: "demo-signing",
            title: "Mike Tyson - Official Private Signing (March 2025)",
            handle: "test-signing",
            body_html: "Official private signing session with the boxing legend.",
            images: ["https://images.unsplash.com/photo-1544698310-74ea9d188c1b?q=80&w=2670&auto=format&fit=crop"],
            options: [
                { id: "opt1", product_id: "demo-signing", name: "Item Type", position: 1, values: ["Signed Glove", "Signed Photo", "Send-In Service"] },
                { id: "opt2", product_id: "demo-signing", name: "Framing", position: 2, values: ["Unframed", "Deluxe Dome Frame"] }
            ],
            variants: [
                {
                    id: "v1", product_id: "demo-signing", title: "Glove / Unframed", price: 150,
                    option1: "Signed Glove", option2: "Unframed",
                    sku: "DEMO-GLOVE-UNF", inventory_quantity: 10,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                },
                {
                    id: "v2", product_id: "demo-signing", title: "Glove / Framed", price: 350,
                    option1: "Signed Glove", option2: "Deluxe Dome Frame",
                    sku: "DEMO-GLOVE-FRM", inventory_quantity: 5,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                },
                {
                    id: "v3", product_id: "demo-signing", title: "Photo / Unframed", price: 80,
                    option1: "Signed Photo", option2: "Unframed",
                    sku: "DEMO-PHOTO-UNF", inventory_quantity: 20,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                },
                {
                    id: "v4", product_id: "demo-signing", title: "Photo / Framed", price: 180,
                    option1: "Signed Photo", option2: "Deluxe Dome Frame",
                    sku: "DEMO-PHOTO-FRM", inventory_quantity: 10,
                    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
                    smart_contract_address: null, token_id: null
                },
                {
                    id: "v5", product_id: "demo-signing", title: "Send-In / Unframed", price: 60,
                    option1: "Send-In Service", option2: "Unframed",
                    sku: "DEMO-SENDIN", inventory_quantity: 100,
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
                    <a href="/" className="hover:text-gold transition-colors">Home</a>
                    <span className="mx-2">/</span>
                    <a href="/shop" className="hover:text-gold transition-colors">Shop</a>
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
                                <div className="flex items-center gap-1 text-sm text-navy/60 bg-white px-3 py-1 rounded-full border border-stone/10 shadow-sm">
                                    <Star className="w-4 h-4 fill-gold text-gold" />
                                    <span className="font-bold text-charcoal">5.0</span>
                                    <span className="text-stone-400">|</span>
                                    <span>12 verified reviews</span>
                                </div>
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

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                className="w-full text-lg h-14 shadow-lg shadow-gold/20 hover:shadow-gold/30 transition-shadow"
                            >
                                Add to Cart
                            </Button>

                            {/* Payment Icons */}
                            <div className="flex justify-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="h-6 w-10 bg-stone/20 rounded" /> {/* Placeholder for Visa */}
                                <div className="h-6 w-10 bg-stone/20 rounded" /> {/* Placeholder for Mastercard */}
                                <div className="h-6 w-10 bg-stone/20 rounded" /> {/* Placeholder for Apple Pay */}
                            </div>
                        </div>

                        {/* Trust Signals - Upgraded */}
                        <div className="grid grid-cols-1 gap-4 pt-6">
                            <div className="flex items-start gap-4 p-4 bg-white border border-stone/10 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-gold/10 rounded-full text-gold">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-charcoal text-sm">Lifetime Authenticity Guarantee</h4>
                                    <p className="text-xs text-navy/70 mt-1">Every item comes with our proprietary NFC Tag technology for digital verification.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white border border-stone/10 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-gold/10 rounded-full text-gold">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-charcoal text-sm">Insured & Tracked Delivery</h4>
                                    <p className="text-xs text-navy/70 mt-1">Fully insured shipping with real-time tracking updates to your door.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white border border-stone/10 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-2 bg-gold/10 rounded-full text-gold">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-charcoal text-sm">Premium Presentation</h4>
                                    <p className="text-xs text-navy/70 mt-1">Delivered in our signature premium packaging, ready for gifting or display.</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 pt-6">
                            <h3 className="font-serif text-xl font-bold text-charcoal border-b border-stone/10 pb-2">Product Details</h3>
                            <div className="prose prose-sm text-navy/80 leading-relaxed">
                                <p>{product.body_html}</p>
                                <ul className="list-none space-y-2 pl-0 mt-4">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-gold" />
                                        <span>Hand signed by <strong>{product.tags?.[2] || "the athlete"}</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-gold" />
                                        <span>Includes <strong>NFC Digital Authentication</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-gold" />
                                        <span>Premium framing options available</span>
                                    </li>
                                </ul>
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

            {/* Reviews Section */}
            <div className="container mx-auto px-4">
                <ReviewList productHandle={product.handle} />
            </div>


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
