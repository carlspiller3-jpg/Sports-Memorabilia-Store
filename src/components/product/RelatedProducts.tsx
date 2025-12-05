import { useEffect, useState } from "react"
import { ProductCard } from "@/components/ui/ProductCard"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data"
import { PLACEHOLDER_IMAGES } from "@/data/placeholders"
import { generateImageAlt } from "@/lib/seo"

interface RelatedProductsProps {
    currentProduct: Product
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRelated() {
            setLoading(true)

            // 1. Try to find related in placeholders first
            // Filter by matching tags (e.g. same team or athlete)
            const currentTags = currentProduct.tags || []
            const teamTag = currentTags[0] // Assuming first tag is team

            let related = PLACEHOLDER_PRODUCTS.filter(p =>
                p.id !== currentProduct.id && // Exclude current
                p.tags?.some(tag => currentTags.includes(tag)) // Match any tag
            ).slice(0, 4) // Limit to 4

            // 2. If not enough, fetch from Supabase
            if (related.length < 4) {
                const { data } = await supabase
                    .from('products')
                    .select(`*, variants (*)`)
                    .neq('id', currentProduct.id)
                    .contains('tags', [teamTag]) // Supabase array contains
                    .limit(4)

                if (data) {
                    // Merge and dedupe
                    const existingIds = new Set(related.map(p => p.id))
                    const newProducts = data.filter(p => !existingIds.has(p.id))
                    related = [...related, ...newProducts].slice(0, 4)
                }
            }

            setRelatedProducts(related)
            setLoading(false)
        }

        fetchRelated()
    }, [currentProduct])

    if (loading || relatedProducts.length === 0) return null

    return (
        <section className="py-16 bg-white border-t border-stone/10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-charcoal mb-8 text-center">
                    You Might Also Like
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {relatedProducts.map((product) => (
                        <a href={`/product/${product.handle}`} key={product.id} className="block group">
                            <ProductCard
                                title={product.seo_title || product.title}
                                price={product.variants?.[0]?.price || 0}
                                image={(product.images && product.images.length > 0) ? product.images[0] : (PLACEHOLDER_IMAGES[product.id] || "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop")}
                                altText={generateImageAlt(product)}
                                athlete={product.tags?.[2] || product.tags?.[0] || "Athlete"}
                                type={(product.product_type as "shirt" | "boot" | "photo" | "other") || "other"}
                            />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
