import { useState, useEffect } from "react"
import { PageHero } from "@/components/ui/PageHero"
import { WaitlistSignup } from "@/components/ui/WaitlistSignup"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"
import { ProductCard } from "@/components/ui/ProductCard"
import { generateImageAlt } from "@/lib/seo"
import { PLACEHOLDER_IMAGES } from "@/lib/placeholder-data"

export function DropsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadDrops() {
            setLoading(true)
            // Ideally, fetch products with tag 'Drop' or specific collection
            // For now, we simulate an empty drop to show the waitlist state
            // as per user request to handle "not seeing any products".

            // SIMULATED: const drops = [] 
            const { data } = await supabase
                .from('products')
                .select('*, variants(*)')
                .eq('status', 'active')
                .contains('tags', ['Drop']) // Assuming 'Drop' is a tag

            setProducts(data || [])
            setLoading(false)
        }
        loadDrops()
    }, [])

    const hasActiveDrops = products.length > 0

    return (
        <div className="min-h-screen bg-ivory pt-20">
            <PageHero
                title="New Drops"
                subtitle="Fresh inventory. Be the first to see what we've sourced."
                backgroundImage="https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-pulse">
                        {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-stone/10 rounded-sm" />)}
                    </div>
                ) : hasActiveDrops ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <a href={`/product/${product.handle}`} key={product.id} className="block group">
                                <ProductCard
                                    title={product.title}
                                    price={product.variants?.[0]?.price || 0}
                                    image={product.images?.[0] || PLACEHOLDER_IMAGES[product.id] || ""}
                                    altText={generateImageAlt(product)}
                                    athlete="New"
                                    type="drop"
                                />
                            </a>
                        ))}
                    </div>
                ) : (
                    // EMPTY STATE: Waitlist Signup
                    <div className="max-w-2xl mx-auto text-center py-12 bg-white border border-stone/20 rounded-lg shadow-sm p-8 md:p-12">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">🔔</span>
                        </div>
                        <h3 className="text-3xl font-serif text-charcoal mb-4">No Active Drops</h3>
                        <p className="text-navy/70 text-lg mb-8">
                            We are constantly sourcing new authentic items.
                            <br />
                            Join our list to be the first to know when new inventory is available.
                        </p>

                        <WaitlistSignup />
                    </div>
                )}
            </div>
        </div>
    )
}
