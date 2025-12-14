import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
import { generateImageAlt } from "@/lib/seo"
import { useEffect, useState } from "react"
import { fetchProductsByCollection } from "@/lib/shopify"
import type { Product } from "@/types/schema"

export function TrendingNow() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadTrending() {
            setLoading(true)
            
            try {
                // Try fetching from a 'trending' collection first
                // Add a timeout race to prevent hanging
                const fetchPromise = fetchProductsByCollection('trending')
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('Timeout'), 5000))

                let fetched: any = await Promise.race([fetchPromise, timeoutPromise]).catch(() => [])
                
                if (fetched && fetched.length > 0) {
                    setProducts(fetched.slice(0, 4))
                } else {
                    setProducts([])
                }
            } catch (error) {
                console.error("Error loading trending:", error)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }
        loadTrending()
    }, [])

    const getImage = (product: any) => {
        if (product.images && product.images.length > 0) return product.images[0]
        return "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop"
    }

    const getPrice = (product: any) => {
        if (!product.variants || product.variants.length === 0) return 0
        return product.variants[0].price
    }

    return (
        <section className="py-16 sm:py-24 bg-ivory">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-8 sm:mb-12">
                    <div>
                        <span className="text-gold font-bold tracking-wider text-sm uppercase mb-2 block">Don't Miss Out</span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">Trending Now</h2>
                    </div>
                    <a href="/shop" className="hidden sm:flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors group">
                        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <a href={`/product/${product.handle}`} key={product.id} className="block group">
                                <ProductCard
                                    title={product.seo_title || product.title}
                                    price={getPrice(product)}
                                    image={getImage(product)}
                                    altText={generateImageAlt(product)}
                                    athlete={product.tags?.[2] || product.tags?.[0] || "Athlete"}
                                    type={(product.product_type as "shirt" | "boot" | "photo" | "other") || "other"}
                                />
                            </a>
                        ))}
                    </div>
                ) : (
                    loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                             {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-stone/5 animate-pulse rounded-sm" />
                             ))}
                        </div>
                    ) : (
                        <p className="text-center text-navy/60">No trending items at the moment. Check back soon!</p>
                    )
                )}

                <div className="mt-8 text-center sm:hidden">
                    <a href="/shop" className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    )
}
