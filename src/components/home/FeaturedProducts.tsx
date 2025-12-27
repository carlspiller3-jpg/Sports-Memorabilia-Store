import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"

import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data"

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchFeaturedProducts() {
            setLoading(true)

            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          variants (*)
        `)
                .eq('status', 'active')
                .limit(4)

            if (error) {
                console.error('Error fetching products:', error)
                setProducts(PLACEHOLDER_PRODUCTS.slice(0, 4))
            } else if (data && data.length > 0) {
                setProducts(data)
            } else {
                setProducts(PLACEHOLDER_PRODUCTS.slice(0, 4))
            }
            setLoading(false)
        }

        fetchFeaturedProducts()
    }, [])

    const getPrice = (product: Product) => {
        if (!product.variants || product.variants.length === 0) return 0
        return product.variants[0].price
    }

    const getImage = (product: Product) => {
        if (product.images && product.images.length > 0) return product.images[0]
        if (product.handle.includes('messi')) return "https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop"
        if (product.handle.includes('ronaldo')) return "https://images.unsplash.com/photo-1577212017184-80cc3c0bcb85?q=80&w=1974&auto=format&fit=crop"
        if (product.handle.includes('fury')) return "https://images.unsplash.com/photo-1549719386-74dfc441d82c?q=80&w=1887&auto=format&fit=crop"
        if (product.handle.includes('hamilton')) return "https://images.unsplash.com/photo-1533575135643-0c093122c2b3?q=80&w=1935&auto=format&fit=crop"
        return "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop"
    }

    return (
        <section className="bg-ivory py-16 sm:py-20 lg:py-28">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl mb-4">
                        Featured Collection
                    </h2>
                    <p className="text-lg text-charcoal/70">
                        Discover our most sought-after pieces, each authenticated and ready to become a centerpiece in your collection.
                    </p>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-stone/10 animate-pulse rounded-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link to={`/product/${product.handle}`} key={product.id} className="block">
                                <ProductCard
                                    title={product.seo_title || product.title}
                                    price={getPrice(product)}
                                    image={getImage(product)}
                                    athlete={product.tags?.[0] || "Athlete"}
                                    type={product.product_type || "other"}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link to="/shop">
                        <Button size="lg" variant="outline">
                            View All Products
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
