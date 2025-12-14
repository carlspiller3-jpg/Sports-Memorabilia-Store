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

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/shop?category=${category.handle}`}
                            className="group relative h-32 md:h-40 overflow-hidden rounded-sm border border-stone/20"
                        >
                             <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors z-10" />
                            {/* Make assume we have images or use fallbacks */}
                            <img 
                                src={category.image || 
                                    (category.handle === 'shirts' ? 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2070&auto=format&fit=crop' :
                                    category.handle === 'boots' ? 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1964&auto=format&fit=crop' :
                                    category.handle === 'photos' ? 'https://images.unsplash.com/photo-1516245973784-0995fa1b8493?q=80&w=2069&auto=format&fit=crop' :
                                    'https://images.unsplash.com/photo-1493723843689-d9631fc161f5?q=80&w=2066&auto=format&fit=crop')
                                }
                                alt={category.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <h3 className="text-white font-serif font-bold text-lg md:text-xl tracking-wide text-center px-2 drop-shadow-md">
                                    {category.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                    {loading && categories.length === 0 && (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 md:h-40 bg-stone/5 animate-pulse rounded-sm" />
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
