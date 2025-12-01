import { useState, useEffect } from "react"
import { Filter, ChevronDown } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"

export function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState("featured")

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)

            // Fetch products with their variants
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    variants (*)
                `)
                .eq('status', 'active')

            if (error) {
                console.error('Error fetching products:', error)
            } else {
                setProducts(data || [])
            }
            setLoading(false)
        }

        fetchProducts()
    }, [])

    // Helper to get price range or single price
    const getPrice = (product: Product) => {
        if (!product.variants || product.variants.length === 0) return 0
        return product.variants[0].price
    }

    // Helper to get image (mock for now as we don't have images table yet)
    const getImage = (product: Product) => {
        // Return a mock image based on handle or title for demo purposes
        if (product.handle.includes('messi')) return "https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop"
        if (product.handle.includes('ronaldo')) return "https://images.unsplash.com/photo-1577212017184-80cc3c0bcb85?q=80&w=1974&auto=format&fit=crop"
        if (product.handle.includes('fury')) return "https://images.unsplash.com/photo-1549719386-74dfc441d82c?q=80&w=1887&auto=format&fit=crop"
        if (product.handle.includes('hamilton')) return "https://images.unsplash.com/photo-1533575135643-0c093122c2b3?q=80&w=1935&auto=format&fit=crop"
        return "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop"
    }

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === "price-asc") return getPrice(a) - getPrice(b)
        if (sortBy === "price-desc") return getPrice(b) - getPrice(a)
        return 0
    })

    return (
        <div className="min-h-screen bg-ivory py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">All Memorabilia</h1>
                        <p className="text-navy/60">Showing {products.length} authentic items</p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                        <div className="relative group">
                            <Button variant="outline" className="gap-2">
                                Sort by
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone/20 rounded-sm shadow-lg hidden group-hover:block z-10">
                                <button onClick={() => setSortBy('featured')} className="block w-full text-left px-4 py-2 hover:bg-stone/5 text-sm">Featured</button>
                                <button onClick={() => setSortBy('price-asc')} className="block w-full text-left px-4 py-2 hover:bg-stone/5 text-sm">Price: Low to High</button>
                                <button onClick={() => setSortBy('price-desc')} className="block w-full text-left px-4 py-2 hover:bg-stone/5 text-sm">Price: High to Low</button>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-stone/10 animate-pulse rounded-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {sortedProducts.map((product) => (
                            <a href={`/product/${product.handle}`} key={product.id} className="block">
                                <ProductCard
                                    title={product.title}
                                    price={getPrice(product)}
                                    image={getImage(product)}
                                    athlete={product.tags?.[0] || "Athlete"}
                                    type={(product.product_type as "shirt" | "boot" | "photo" | "other") || "other"}
                                />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
