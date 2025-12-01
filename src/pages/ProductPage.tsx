import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { ShieldCheck, Truck, Package, Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { TrustBadge } from "@/components/ui/TrustBadge"
import { supabase } from "@/lib/supabase"
import type { Product, Variant } from "@/types/schema"

export function ProductPage() {
    const { handle } = useParams<{ handle: string }>()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedFrame, setSelectedFrame] = useState<string>("")
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)

    useEffect(() => {
        async function fetchProduct() {
            if (!handle) return
            setLoading(true)

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
                    // Default to first variant or specific logic
                    setSelectedVariant(data.variants[0])
                    if (data.variants[0].option1) {
                        setSelectedFrame(data.variants[0].option1)
                    }
                }
            }
            setLoading(false)
        }

        fetchProduct()
    }, [handle])

    // Update selected variant when frame changes
    useEffect(() => {
        if (product?.variants && selectedFrame) {
            const variant = product.variants.find(v => v.option1 === selectedFrame)
            if (variant) setSelectedVariant(variant)
        }
    }, [selectedFrame, product])

    if (loading) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>
    }

    if (!product) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center">Product not found</div>
    }

    // Mock images for now
    const images = [
        "https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1621996661448-032646298517?q=80&w=1974&auto=format&fit=crop"
    ]

    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.title,
        "image": images,
        "description": product.body_html,
        "brand": {
            "@type": "Brand",
            "name": "The Sports Memorabilia Store"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "GBP",
            "price": selectedVariant?.price || 0,
            "availability": "https://schema.org/InStock"
        }
    }

    return (
        <div className="min-h-screen bg-ivory py-12">
            <Helmet>
                <title>{product.title} | The Sports Memorabilia Store</title>
                <meta name="description" content={product.body_html || ""} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>
            <div className="container mx-auto px-4">

                {/* Breadcrumbs */}
                <div className="text-sm text-navy/50 mb-8">
                    <a href="/" className="hover:text-gold">Home</a> / <a href="/shop" className="hover:text-gold">Shop</a> / <span className="text-navy">{product.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-white rounded-sm overflow-hidden border border-stone/20 relative">
                            <img src={images[0]} alt={product.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4">
                                <TrustBadge type="authenticated" className="bg-white/90 backdrop-blur-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, i) => (
                                <div key={i} className="aspect-square bg-white rounded-sm overflow-hidden border border-stone/20 cursor-pointer hover:border-gold transition-colors">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-medium text-gold">£{selectedVariant?.price}</span>
                                <div className="flex items-center gap-1 text-sm text-navy/60">
                                    <Star className="w-4 h-4 fill-gold text-gold" />
                                    <span className="font-medium text-charcoal">5.0</span> (12 reviews)
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-stone/20" />

                        {/* Variants */}
                        {product.variants && product.variants.length > 1 && (
                            <div className="space-y-4">
                                <span className="text-sm font-bold text-charcoal uppercase tracking-wider">Style</span>
                                <div className="flex gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedFrame(variant.option1 || "")}
                                            className={`px-4 py-2 border rounded-sm text-sm capitalize transition-all ${selectedFrame === variant.option1
                                                ? 'border-gold bg-gold/5 text-gold font-medium'
                                                : 'border-stone/30 text-navy hover:border-navy/30'
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
                            <Button size="lg" className="w-full text-base h-12">
                                Add to Cart
                            </Button>
                            <p className="text-xs text-center text-navy/60">
                                Secure checkout with Apple Pay, Google Pay, and Cards.
                            </p>
                        </div>

                        {/* Trust Signals */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                            <div className="flex flex-col items-center text-center gap-2 p-4 bg-white border border-stone/10 rounded-sm">
                                <ShieldCheck className="w-6 h-6 text-gold" />
                                <span className="text-xs font-bold text-navy">Lifetime Authenticity</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 bg-white border border-stone/10 rounded-sm">
                                <Truck className="w-6 h-6 text-gold" />
                                <span className="text-xs font-bold text-navy">24h Dispatch</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 p-4 bg-white border border-stone/10 rounded-sm">
                                <Package className="w-6 h-6 text-gold" />
                                <span className="text-xs font-bold text-navy">Premium Packaging</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 pt-4">
                            <h3 className="font-serif text-xl font-bold text-charcoal">Product Details</h3>
                            <div className="prose prose-sm text-navy/80">
                                <p>{product.body_html}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
