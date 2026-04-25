import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { PageHero } from "@/components/ui/PageHero"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/Sheet"
import type { Product } from "@/types/schema"
import { PLACEHOLDER_PRODUCTS, PLACEHOLDER_IMAGES } from "@/lib/placeholder-data"
import { generateImageAlt } from "@/lib/seo"
import { fetchAllProducts } from "@/lib/shopify"
import { WaitlistSignup } from "@/components/ui/WaitlistSignup"
import { usePageSEO } from "@/hooks/usePageSEO"
import { ATHLETE_DB, TEAM_INFO } from "@/lib/chatbot/knowledge"

export function ShopPage() {
    const { category } = useParams<{ category: string }>()

    // Determine the page key for SEO (e.g., 'shop_football' or just 'shop')
    const pageKey = category ? `shop_${category.toLowerCase()}` : 'shop'

    // Generate dynamic defaults based on category
    const defaultTitle = category
        ? `${category.charAt(0).toUpperCase() + category.slice(1)} Memorabilia - Shop Authentic | Sports Memorabilia Store`
        : "Shop Authentic Sports Memorabilia | Sports Memorabilia Store"

    const defaultDesc = category
        ? `Browse our exclusive collection of signed ${category} memorabilia. Authentic, framed, and verified.`
        : "Browse our collection of signed football shirts, boxing gloves, and boots. All items are 100% authentic and come with premium framing."

    const seo = usePageSEO(pageKey, {
        title: defaultTitle,
        description: defaultDesc,
        ogImage: "https://www.sportssigned.com/og-image.jpg"
    })

    // Use the SEO title directly
    const pageTitle = seo.title

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

    // Sync URL category to Filter State
    useEffect(() => {
        if (category) {
            const sportName = category.toLowerCase() === 'f1' ? 'F1' : category.charAt(0).toUpperCase() + category.slice(1);
            setSelectedSport(sportName);
        } else {
            setSelectedSport("all");
        }
    }, [category]);

    // Derived data for filters
    // Derived data for filters
    const sports = useMemo(() => {
        const allTags = products.flatMap(p => p.tags || [])
        // Define knowing sports to look for, or just take unique tags that aren't teams/types
        // For simplicity and accuracy with the new inventory, we'll scan for specific known sport keywords
        const knownSports = ["Football", "Boxing", "Rugby", "Cricket", "Tennis", "F1", "Motorsport", "Golf", "Athletics", "UFC"]
        return [...new Set(allTags.filter(tag => knownSports.includes(tag)))].sort()
    }, [products])

    const priceRanges = [
        { label: "Under £100", value: "0-100" },
        { label: "£100 - £300", value: "100-300" },
        { label: "£300 - £500", value: "300-500" },
        { label: "Over £500", value: "500-10000" },
    ]

    // Extract and categorize unique teams/athletes from tags
    const groupedFilters = useMemo(() => {
        const allTags = [...new Set(products.flatMap((p: Product) => p.tags || []))];
        const noise = ["Signed Photo", "Boot", "Shirt", "Glove", "Ball", "Bat", "Trunks", "Framed", "Mount", "Authenticated", "NFC", "Premium", "Display Case", "Gift Box"];
        const seasonRegex = /^\d{2}\/\d{2}$/;
        const teamKeywords = ["FC", "LFC", "United", "City", "Racing", "Scuderia", "Madrid", "Barcelona", "Club", "AFC", "CFC", "MUFC"];

        const groups = {
            teams: [] as string[],
            athletes: [] as string[],
            competitions: [] as string[]
        };

        allTags.forEach(tag => {
            if (sports.includes(tag) || noise.includes(tag) || seasonRegex.test(tag)) return;

            // Proper Casing with special handling for 'FC'
            let displayTag = tag.split(' ').map(word => {
                if (word.toLowerCase() === 'fc') return 'FC';
                if (word.toLowerCase() === 'lfc') return 'LFC';
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');

            const isKnownAthlete = ATHLETE_DB.some(a => a.name.toLowerCase() === tag.toLowerCase());
            const isKnownTeam = TEAM_INFO.some(t => t.name.toLowerCase() === tag.toLowerCase() || t.commonName.toLowerCase() === tag.toLowerCase()) || 
                               teamKeywords.some(k => tag.toLowerCase().includes(k.toLowerCase()));
            const isCompetition = ["Champions League", "Premier League", "La Liga", "Serie A", "World Cup", "Euros", "FA Cup"].some(c => tag.toLowerCase().includes(c.toLowerCase()));

            if (isKnownAthlete) groups.athletes.push(displayTag);
            else if (isKnownTeam) groups.teams.push(displayTag);
            else if (isCompetition) groups.competitions.push(displayTag);
            else {
                // Heuristic fallback
                if (tag.includes(' ')) groups.athletes.push(displayTag);
                else groups.teams.push(displayTag);
            }
        });

        return {
            teams: [...new Set(groups.teams)].sort(),
            athletes: [...new Set(groups.athletes)].sort(),
            competitions: [...new Set(groups.competitions)].sort()
        };
    }, [products, sports]);

    useEffect(() => {
        async function loadProducts() {
            setLoading(true)

            if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
                const liveProducts = await fetchAllProducts()
                setProducts(liveProducts)
            } else {
                setProducts([...PLACEHOLDER_PRODUCTS])
            }
            setLoading(false)
        }

        loadProducts()
    }, [])

    // Filter logic using useMemo
    const filteredProducts = useMemo(() => {
        let result = [...products]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.tags?.some(tag => tag.toLowerCase().includes(query))
            )
        }

        if (selectedType !== "all") {
            result = result.filter(p => p.product_type === selectedType)
        }

        // Sport filter
        if (selectedSport !== "all") {
            result = result.filter(p => p.tags?.some(tag => tag.toLowerCase() === selectedSport.toLowerCase()))
        }

        // Team/Athlete filter
        if (selectedTeam !== "all") {
            result = result.filter(p => p.tags?.some(tag => tag.toLowerCase() === selectedTeam.toLowerCase()))
        }

        if (priceRange !== "all") {
            const [min, max] = priceRange.split('-').map(Number)
            result = result.filter(p => {
                const price = p.variants?.[0]?.price || 0
                return price >= min && price <= max
            })
        }

        return result
    }, [products, searchQuery, selectedType, selectedSport, selectedTeam, priceRange])

    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts]
        if (sortBy === "price-asc") return result.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0))
        if (sortBy === "price-desc") return result.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0))
        return result
    }, [filteredProducts, sortBy])

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

    const getPrice = (product: Product) => product.variants?.[0]?.price || 0
    const getImage = (product: Product) => product.images?.[0]?.src || PLACEHOLDER_IMAGES[product.id]

    const productTypes = ["all", ...new Set(products.map(p => p.product_type).filter((t): t is string => t !== null))]

    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={seo.description} />
            </Helmet>

            <PageHero
                title={category ? category.toUpperCase() : "THE COLLECTION"}
                subtitle={category ? `PREMIUM AUTHENTICATED ${category.toUpperCase()} ASSETS` : "SETTING THE NEW STANDARD IN SPORTS MEMORABILIA"}
                backgroundImage="/shop-hero.png"
            />

            <div className="container mx-auto px-4 py-12">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white p-4 rounded-sm border border-stone/10 shadow-sm">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30 group-focus-within:text-gold transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by player, team or item..."
                            className="w-full pl-12 pr-4 py-3 bg-ivory/50 border border-transparent focus:bg-white focus:border-gold/30 rounded-sm text-sm transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2 flex-1 md:flex-none bg-white border-stone/20 hover:border-gold/50">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                    { (selectedType !== "all" || selectedSport !== "all" || selectedTeam !== "all" || priceRange !== "all") && (
                                        <span className="ml-1 w-2 h-2 bg-gold rounded-full" />
                                    ) }
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:max-w-md bg-ivory border-l border-stone/10 p-0 flex flex-col">
                                <SheetHeader className="p-8 border-b border-stone/10 bg-white">
                                    <SheetTitle className="font-serif text-2xl text-navy">Refine Search</SheetTitle>
                                </SheetHeader>
                                
                                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                    {/* Sport Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Sport</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedSport("all")}
                                                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedSport === "all" ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-stone/20 hover:border-navy/30"}`}
                                            >
                                                All Sports
                                            </button>
                                            {sports.map(sport => (
                                                <button
                                                    key={sport}
                                                    onClick={() => setSelectedSport(sport)}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedSport === sport ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-stone/20 hover:border-navy/30"}`}
                                                >
                                                    {sport}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Price Point</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setPriceRange("all")}
                                                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${priceRange === "all" ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-stone/20 hover:border-navy/30"}`}
                                            >
                                                Any Price
                                            </button>
                                            {priceRanges.map(range => (
                                                <button
                                                    key={range.value}
                                                    onClick={() => setPriceRange(range.value)}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${priceRange === range.value ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-stone/20 hover:border-navy/30"}`}
                                                >
                                                    {range.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Item Type Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Asset Type</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setSelectedType("all")}
                                                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedType === "all" ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-stone/20 hover:border-navy/30"}`}
                                            >
                                                All Assets
                                            </button>
                                            {productTypes.filter(t => t !== "all").map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setSelectedType(type)}
                                                    className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedType === type ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-stone/20 hover:border-navy/30"}`}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Teams/Athletes Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Heritage Filter</h3>
                                        <select
                                            value={selectedTeam}
                                            onChange={(e) => setSelectedTeam(e.target.value)}
                                            className="w-full p-4 bg-white border border-stone/20 rounded-sm text-sm focus:outline-none focus:border-navy transition-colors appearance-none cursor-pointer"
                                            aria-label="Filter by Team or Athlete"
                                        >
                                            <option value="all">All Teams & Athletes</option>
                                            
                                            {groupedFilters.teams.length > 0 && (
                                                <optgroup label="TEAMS">
                                                    {groupedFilters.teams.map(team => (
                                                        <option key={team} value={team}>{team}</option>
                                                    ))}
                                                </optgroup>
                                            )}

                                            {groupedFilters.athletes.length > 0 && (
                                                <optgroup label="ATHLETES">
                                                    {groupedFilters.athletes.map(athlete => (
                                                        <option key={athlete} value={athlete}>{athlete}</option>
                                                    ))}
                                                </optgroup>
                                            )}

                                            {groupedFilters.competitions.length > 0 && (
                                                <optgroup label="COMPETITIONS">
                                                    {groupedFilters.competitions.map(comp => (
                                                        <option key={comp} value={comp}>{comp}</option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="p-8 bg-white border-t border-stone/10 grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-12 text-xs font-bold uppercase tracking-widest border-stone/20"
                                        onClick={() => {
                                            setSelectedType("all")
                                            setSelectedSport("all")
                                            setSelectedTeam("all")
                                            setPriceRange("all")
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button 
                                        className="h-12 text-xs font-bold uppercase tracking-widest bg-gold text-charcoal hover:bg-gold/90 shadow-lg shadow-gold/20 border-none"
                                        onClick={() => setShowFilters(false)}
                                    >
                                        Show {filteredProducts.length} Items
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Sort */}
                        <div className="relative group">
                            <Button variant="outline" className="gap-2 bg-white border-stone/20 hover:border-gold/50">
                                Sort
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-stone/20 rounded-sm shadow-xl hidden group-hover:block z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={() => setSortBy('featured')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm transition-colors border-b border-stone/5">Featured</button>
                                <button onClick={() => setSortBy('price-asc')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm transition-colors border-b border-stone/5">Price: Low to High</button>
                                <button onClick={() => setSortBy('price-desc')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm transition-colors">Price: High to Low</button>
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
                                    title={product.title}
                                    price={getPrice(product)}
                                    image={getImage(product)}
                                    altText={generateImageAlt(product)}
                                    athlete={product.tags?.find(tag => ["Football", "Boxing", "Rugby", "F1", "Motorsport", "Golf", "Athletics", "UFC", "Tennis", "Cricket"].includes(tag)) || "Memorabilia"}
                                    type={(product.product_type as "shirt" | "boot" | "photo" | "other") || "other"}
                                />
                            </a>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                    <div className="max-w-xl mx-auto text-center py-20 px-4">
                        {searchQuery ? (
                            <>
                                <div className="w-16 h-16 bg-stone/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 text-navy/40" />
                                </div>
                                <h2 className="text-2xl font-serif text-charcoal mb-2">No results found</h2>
                                <p className="text-navy/60 mb-8">We couldn't find anything matching "{searchQuery}".</p>
                                <Button variant="outline" onClick={() => { setSearchQuery(""); setSortBy("featured"); setSelectedType("all"); setSelectedSport("all"); setSelectedTeam("all"); setPriceRange("all"); }}>
                                    Clear Search
                                </Button>
                            </>
                        ) : (
                            <div className="bg-white border border-stone/20 rounded-lg shadow-sm p-8 md:p-12">
                                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-xl">🔔</span>
                                </div>
                                <h2 className="text-2xl font-serif text-charcoal mb-3">Out of Stock</h2>
                                <p className="text-navy/70 mb-6">
                                    {selectedSport !== 'all' ? `We are currently out of authentic ${selectedSport} memorabilia.` : 'We are currently out of stock for this selection.'}
                                    <br />
                                    Join our list to be the first to know when new items arrive.
                                </p>

                                <WaitlistSignup interest={selectedSport !== 'all' ? selectedSport : 'Shop Filtering'} />
                                <div className="mt-8 pt-6 border-t border-stone/10">
                                    <button
                                        onClick={() => { setSelectedType("all"); setSelectedSport("all"); setSelectedTeam("all"); setPriceRange("all"); }}
                                        className="text-sm text-navy/40 hover:text-navy underline"
                                    >
                                        View all other items
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
