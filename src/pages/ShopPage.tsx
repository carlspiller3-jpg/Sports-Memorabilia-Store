
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { PageHero } from "@/components/ui/PageHero"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/Sheet"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types/schema"
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-data"
import { PLACEHOLDER_IMAGES } from "@/data/placeholders"
import { generateImageAlt } from "@/lib/seo"
import { fetchAllProducts } from "@/lib/shopify"

export function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    // filteredProducts is now derived via useMemo
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState("featured")
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedType, setSelectedType] = useState<string>("all")
    const [selectedSport, setSelectedSport] = useState<string>("all")
    const [selectedTeam, setSelectedTeam] = useState<string>("all")
    const [priceRange, setPriceRange] = useState<string>("all")

    // Derived data for filters
    const sports = ["Football", "Boxing", "Rugby", "Cricket", "Tennis", "F1"]
    const priceRanges = [
        { label: "Under £100", value: "0-100" },
        { label: "£100 - £300", value: "100-300" },
        { label: "£300 - £500", value: "300-500" },
        { label: "Over £500", value: "500-10000" },
    ]

    // Extract unique teams/athletes from tags (excluding sports and types)
    const teams = [...new Set(products.flatMap((p: Product) => p.tags || []))]
        .filter((tag: string) => !sports.includes(tag) && !["Signed Photo", "Boot", "Shirt", "Glove", "Ball", "Bat", "Trunks"].includes(tag))
        .sort()

    useEffect(() => {
        async function loadProducts() {
            setLoading(true)

            if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
                const liveProducts = await fetchAllProducts()
                setProducts(liveProducts)
            } else {
                // 1. Start with placeholders
                let allProducts = [...PLACEHOLDER_PRODUCTS]

                // 2. Fetch from Supabase
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        *,
                        variants (*)
                    `)
                    .eq('status', 'active')

                if (error) {
                    console.error('Error fetching products:', error)
                } else if (data) {
                    allProducts = [...allProducts, ...data.filter(d => !allProducts.find(p => p.handle === d.handle))]
                }

                setProducts(allProducts)
            }
            setLoading(false)
        }

        loadProducts()
    }, [])

    // Filter logic using useMemo
    const filteredProducts = useMemo(() => {
        let result = [...products]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.tags?.some(tag => tag.toLowerCase().includes(query))
            )
        }

        // Type filter
        if (selectedType !== "all") {
            result = result.filter(p => p.product_type === selectedType)
        }

        // Sport filter
        if (selectedSport !== "all") {
            result = result.filter(p => p.tags?.includes(selectedSport))
        }

        // Team/Athlete filter
        if (selectedTeam !== "all") {
            result = result.filter(p => p.tags?.includes(selectedTeam))
        }

        // Price filter
        if (priceRange !== "all") {
            const [min, max] = priceRange.split('-').map(Number)
            result = result.filter(p => {
                const price = p.variants?.[0]?.price || 0
                return price >= min && price <= max
            })
        }

        return result
    }, [products, searchQuery, selectedType, selectedSport, selectedTeam, priceRange])

    // Sync search query to URL
    useEffect(() => {
        setSearchParams(prev => {
            if (searchQuery) {
                prev.set("q", searchQuery)
            } else {
                prev.delete("q")
            }
            return prev
        }, { replace: true })
    }, [searchQuery, setSearchParams])

    // Helper to get price range or single price
    const getPrice = (product: Product) => {
        if (!product.variants || product.variants.length === 0) return 0
        return product.variants[0].price
    }

    // Helper to get image
    const getImage = (product: Product) => {
        if (product.images && product.images.length > 0) return product.images[0]
        return PLACEHOLDER_IMAGES[product.id] || "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop"
    }

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-asc") return getPrice(a) - getPrice(b)
        if (sortBy === "price-desc") return getPrice(b) - getPrice(a)
        return 0
    })

    // Get unique product types for filter
    const productTypes = ["all", ...new Set(products.map(p => p.product_type).filter((t): t is string => t !== null))]

    return (
        <div className="min-h-screen bg-ivory pt-20">
            <PageHero
                title="Shop All"
                subtitle="Authentic sports memorabilia. Professionally framed and ready to display."
                backgroundImage="https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            <div className="container mx-auto px-4 py-6">
                {/* Compact Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-stone/10">
                    <div className="text-sm text-navy/60">
                        <span className="font-bold text-charcoal">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'item' : 'items'}
                    </div>

                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                        {/* Search */}
                        <div className="relative flex-1 md:flex-initial md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-stone/20 rounded-sm text-sm focus:outline-none focus:border-gold/50 transition-colours"
                            />
                        </div>

                        {/* Filter Button */}
                        <Button
                            variant="outline"
                            className="gap-2 bg-white border-stone/20 hover:border-gold/50"
                            onClick={() => setShowFilters(true)}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            <span className="hidden sm:inline">Filters</span>
                            {(selectedType !== "all" || selectedSport !== "all" || selectedTeam !== "all" || priceRange !== "all") && (
                                <span className="flex h-2 w-2 rounded-full bg-gold" />
                            )}
                        </Button>

                        {/* Filter Sheet */}
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                            <SheetContent side="right" className="w-full sm:max-w-md bg-ivory overflow-y-auto">
                                <SheetHeader className="border-b border-stone/10 pb-4 mb-6">
                                    <SheetTitle className="font-serif text-2xl text-charcoal">Filters</SheetTitle>
                                </SheetHeader>

                                <div className="space-y-8">
                                    {/* Sport */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Sport</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedSport("all")}
                                                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${selectedSport === "all" ? "bg-navy text-white border-navy" : "bg-white text-navy border-stone/20 hover:border-gold"}`}
                                            >
                                                All Sports
                                            </button>
                                            {sports.map(sport => (
                                                <button
                                                    key={sport}
                                                    onClick={() => setSelectedSport(sport)}
                                                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${selectedSport === sport ? "bg-navy text-white border-navy" : "bg-white text-navy border-stone/20 hover:border-gold"}`}
                                                >
                                                    {sport}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Price</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceRange === "all" ? "border-gold" : "border-stone/30 group-hover:border-gold"}`}>
                                                    {priceRange === "all" && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                                                </div>
                                                <input type="radio" name="price" className="hidden" checked={priceRange === "all"} onChange={() => setPriceRange("all")} />
                                                <span className={`${priceRange === "all" ? "text-navy font-medium" : "text-navy/70"}`}>Any Price</span>
                                            </label>
                                            {priceRanges.map(range => (
                                                <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${priceRange === range.value ? "border-gold" : "border-stone/30 group-hover:border-gold"}`}>
                                                        {priceRange === range.value && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                                                    </div>
                                                    <input type="radio" name="price" className="hidden" checked={priceRange === range.value} onChange={() => setPriceRange(range.value)} />
                                                    <span className={`${priceRange === range.value ? "text-navy font-medium" : "text-navy/70"}`}>{range.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Product Type */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Item Type</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedType("all")}
                                                className={`px-3 py-1.5 text-sm rounded-sm border transition-all ${selectedType === "all" ? "bg-gold/10 text-gold border-gold" : "bg-white text-navy border-stone/20 hover:border-gold"}`}
                                            >
                                                All Types
                                            </button>
                                            {productTypes.filter(t => t !== "all").map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedType(type)}
                                                    className={`px-3 py-1.5 text-sm rounded-sm border transition-all ${selectedType === type ? "bg-gold/10 text-gold border-gold" : "bg-white text-navy border-stone/20 hover:border-gold"}`}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Teams/Athletes */}
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Team / Athlete</h3>
                                        <select
                                            value={selectedTeam}
                                            onChange={(e) => setSelectedTeam(e.target.value)}
                                            className="w-full p-3 bg-white border border-stone/20 rounded-sm text-sm focus:outline-none focus:border-gold"
                                            aria-label="Filter by Team or Athlete"
                                        >
                                            <option value="all">All Teams & Athletes</option>
                                            {teams.map((team: string) => (
                                                <option key={team} value={team}>{team}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <SheetFooter className="mt-10 pt-6 border-t border-stone/10">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            setSelectedType("all")
                                            setSelectedSport("all")
                                            setSelectedTeam("all")
                                            setPriceRange("all")
                                        }}
                                    >
                                        Reset All Filters
                                    </Button>
                                    <Button className="w-full mt-2" onClick={() => setShowFilters(false)}>
                                        Show {filteredProducts.length} Items
                                    </Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>

                        {/* Sort */}
                        <div className="relative group">
                            <Button variant="outline" className="gap-2 bg-white border-stone/20 hover:border-gold/50">
                                Sort
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone/20 rounded-sm shadow-xl hidden group-hover:block z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={() => setSortBy('featured')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm transition-colours border-b border-stone/5">Featured</button>
                                <button onClick={() => setSortBy('price-asc')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm transition-colours border-b border-stone/5">Price: Low to High</button>
                                <button onClick={() => setSortBy('price-desc')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm transition-colours">Price: High to Low</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-stone/10 animate-pulse rounded-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sortedProducts.map((product) => (
                            <a href={`/product/${product.handle}`} key={product.id} className="block group" aria-label={`View ${product.title}`}>
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
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-navy/60 text-lg">No products found matching your criteria.</p>
                        <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSortBy("featured"); setSelectedType("all"); setSelectedSport("all"); setSelectedTeam("all"); setPriceRange("all"); }}>
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
