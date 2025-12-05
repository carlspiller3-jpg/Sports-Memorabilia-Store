import { ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data"
import { generateImageAlt } from "@/lib/seo"

export function TrendingNow() {
    // Select specific trending items (e.g., Messi, Tyson, Carter)
    const trendingProducts = PLACEHOLDER_PRODUCTS.filter(p => 
        ['messi-boot-signed', 'tyson-glove-signed', 'carter-shirt-signed', 'lebron-jersey-signed'].includes(p.handle)
    ).slice(0, 4)

    // Fallback if specific items aren't found (just take first 4)
    const productsToShow = trendingProducts.length > 0 ? trendingProducts : PLACEHOLDER_PRODUCTS.slice(0, 4)

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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {productsToShow.map((product) => (
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

                <div className="mt-8 text-center sm:hidden">
                    <a href="/shop" className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    )
}
