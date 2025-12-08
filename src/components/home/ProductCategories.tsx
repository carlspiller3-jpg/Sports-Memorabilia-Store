import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchCollections } from "@/lib/shopify"

export function ProductCategories() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCollections() {
            setLoading(true)
            const fetched = await fetchCollections()
            
            // Filter out 'frontpage' or empty collections
            const validCollections = fetched.filter(c => c.handle !== 'frontpage').slice(0, 4)
            
            if (validCollections.length > 0) {
                setCategories(validCollections)
            } else {
                // Fallback to static if no collections found (so the section isn't empty on dev)
                setCategories([
                    {
                        id: 1,
                        title: "Signed Shirts",
                        handle: "shirts",
                        link: "/shop?category=shirt",
                    },
                    {
                        id: 2,
                        title: "Signed Boots",
                        handle: "boots",
                        link: "/shop?category=boot",
                    },
                    {
                        id: 3,
                        title: "Signed Photos",
                        handle: "photos",
                        link: "/shop?category=photo",
                    },
                    {
                        id: 4,
                        title: "Gift Sets",
                        handle: "gifts",
                        link: "/shop",
                    },
                ])
            }
            setLoading(false)
        }
        loadCollections()
    }, [])

    return (
        <section id="categories" className="bg-white py-12 border-t border-stone/10">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl font-serif mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-charcoal/70">
                        Explore our curated collection of authentic memorabilia.
                    </p>
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/shop?category=${category.handle}`}
                            className="px-6 py-3 border rounded-sm text-sm font-medium transition-all relative overflow-hidden border-stone/30 text-navy hover:border-navy/50 bg-white hover:bg-stone/5"
                        >
                            {category.title}
                        </Link>
                    ))}
                    {loading && categories.length === 0 && (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-12 w-32 bg-stone/5 animate-pulse rounded-sm" />
                        ))
                    )}
                </div>

                {/* Optional CTA */}
                <div className="mt-8 text-center hidden">
                     {/* Hidden for cleaner look with tabs */}
                </div>
            </div>
        </section>
    )
}
