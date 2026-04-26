import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { PageHero } from "@/components/ui/PageHero"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/Sheet"
import type { Product } from "@/types/schema"
import { PLACEHOLDER_PRODUCTS, PLACEHOLDER_IMAGES, SECURED_HERITAGE } from "@/lib/placeholder-data"
import { generateImageAlt } from "@/lib/seo"
import { fetchAllProducts } from "@/lib/shopify"
import { WaitlistSignup } from "@/components/ui/WaitlistSignup"
import { usePageSEO } from "@/hooks/usePageSEO"
import { ATHLETE_DB, TEAM_INFO } from "@/lib/chatbot/knowledge"

export function ShopPage() {
    const { category } = useParams<{ category: string }>()
    const pageKey = category ? `shop_${category.toLowerCase()}` : 'shop'
    
    const seo = usePageSEO(pageKey, {
        title: category ? `${category} Memorabilia` : "Shop All",
        description: "Premium authenticated sports memorabilia."
    })

    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState("featured")
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [showFilters, setShowFilters] = useState(false)
    
    // Filter States
    const [selectedType, setSelectedType] = useState<string>("all")
    const [selectedSport, setSelectedSport] = useState<string>("all")
    const [selectedTeam, setSelectedTeam] = useState<string>("all")
    const [priceRange, setPriceRange] = useState<string>("all")

    const priceRanges = [
        { label: "Under £100", value: "0-100" },
        { label: "£100 - £300", value: "100-300" },
        { label: "£300 - £500", value: "300-500" },
        { label: "Over £500", value: "500-10000" },
    ]

    // Sync URL category to Filter State
    useEffect(() => {
        if (category) {
            const sportName = category.toLowerCase() === 'f1' ? 'F1' : category.charAt(0).toUpperCase() + category.slice(1);
            setSelectedSport(sportName);
        } else {
            setSelectedSport("all");
        }
    }, [category]);

    const [archivedProducts, setArchivedProducts] = useState<Product[]>([])

    // Data Loading
    useEffect(() => {
        async function loadProducts() {
            setLoading(true)
            try {
                // 1. Fetch Live Products from Shopify
                let liveProducts: Product[] = []
                if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
                    liveProducts = await fetchAllProducts()
                } else {
                    liveProducts = [...PLACEHOLDER_PRODUCTS]
                }

                // 2. Fetch Archived Products from Supabase (or Fallback)
                let archived: Product[] = []
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*, variants(*)')
                        .eq('status', 'archived')
                        .order('updated_at', { ascending: false })
                    
                    if (!error && data && data.length > 0) {
                        archived = data
                    } else {
                        archived = [...SECURED_HERITAGE]
                    }
                } catch (err) {
                    console.warn("Supabase fetch failed, using local archive", err)
                    archived = [...SECURED_HERITAGE]
                }

                setProducts(liveProducts)
                setArchivedProducts(archived)

            } catch (e) {
                console.error("Failed to load products", e);
                setProducts([...PLACEHOLDER_PRODUCTS])
                setArchivedProducts([...SECURED_HERITAGE])
            }
            setLoading(false)
        }
        loadProducts()
    }, [])

    // Filter Helpers
    const sports = useMemo(() => {
        const knownSports = ["Football", "Boxing", "Rugby", "Cricket", "Tennis", "F1", "Motorsport", "Golf", "Athletics", "UFC"]
        const allTags = products.flatMap(p => p.tags || [])
        return [...new Set(allTags.filter(tag => knownSports.includes(tag)))].sort()
    }, [products])

    const groupedFilters = useMemo(() => {
        const allTags = [...new Set(products.flatMap((p) => p.tags || []))];
        const noise = ["Signed", "Photo", "Boot", "Shirt", "Glove", "Ball", "Bat", "Trunks", "Framed", "Mount", "Authenticated", "NFC", "Premium", "Display Case", "Gift Box"];
        const seasonRegex = /^\d{2}\/\d{2}$/;
        const teamKeywords = ["FC", "LFC", "UNITED", "CITY", "RACING", "SCUDERIA", "MADRID", "BARCELONA", "CLUB", "AFC", "CFC", "MUFC"];

        const groups = {
            teams: [] as string[],
            athletes: [] as string[],
            competitions: [] as string[]
        };

        allTags.forEach(tag => {
            if (!tag || sports.includes(tag) || noise.includes(tag) || seasonRegex.test(tag)) return;

            // Proper Casing
            const displayTag = tag.split(' ').map(word => {
                const w = word.toLowerCase();
                if (w === 'fc' || w === 'lfc' || w === 'mufc' || w === 'afc') return word.toUpperCase();
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');

            const tagLower = tag.toLowerCase();
            const isKnownAthlete = ATHLETE_DB.some(a => a.name.toLowerCase() === tagLower);
            const isKnownTeam = TEAM_INFO.some(t => t.name.toLowerCase() === tagLower || t.commonName.toLowerCase() === tagLower) || 
                               teamKeywords.some(k => tagLower.includes(k.toLowerCase()));
            const isComp = ["League", "Cup", "World Cup", "Euro", "Final"].some(c => tagLower.includes(c.toLowerCase()));

            if (isKnownAthlete) groups.athletes.push(displayTag);
            else if (isKnownTeam) groups.teams.push(displayTag);
            else if (isComp) groups.competitions.push(displayTag);
            else {
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

    // Main Filter Logic
    const filteredProducts = useMemo(() => {
        let result = [...products]

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(p => 
                p.title.toLowerCase().includes(q) || 
                p.tags?.some(t => t.toLowerCase().includes(q))
            )
        }

        if (selectedType !== "all") result = result.filter(p => p.product_type === selectedType)
        if (selectedSport !== "all") result = result.filter(p => p.tags?.some(t => t.toLowerCase() === selectedSport.toLowerCase()))
        if (selectedTeam !== "all") result = result.filter(p => p.tags?.some(t => t.toLowerCase() === selectedTeam.toLowerCase()))
        
        if (priceRange !== "all") {
            const [min, max] = priceRange.split('-').map(Number)
            result = result.filter(p => {
                const pPrice = p.variants?.[0]?.price || 0
                return pPrice >= min && pPrice <= max
            })
        }

        return result
    }, [products, searchQuery, selectedType, selectedSport, selectedTeam, priceRange])

    const sortedProducts = useMemo(() => {
        const res = [...filteredProducts]
        if (sortBy === "price-asc") return res.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0))
        if (sortBy === "price-desc") return res.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0))
        return res
    }, [filteredProducts, sortBy])

    // Render Helpers
    const getPrice = (p: Product) => p.variants?.[0]?.price || 0
    const getImage = (p: Product) => p.images?.[0] || PLACEHOLDER_IMAGES[p.id] || ""
    const getAthlete = (p: Product) => {
        const sportsList = ["Football", "Boxing", "Rugby", "F1", "Motorsport", "Golf", "Athletics", "UFC", "Tennis", "Cricket"]
        const noiseTags = ["Signed", "Photo", "Boot", "Shirt", "Glove", "Ball", "Bat", "Trunks", "Framed", "Mount", "Authenticated", "NFC", "Premium", "Display Case", "Gift Box"]
        return p.tags?.find(t => !sportsList.includes(t) && !noiseTags.includes(t) && !/^\d{2}\/\d{2}$/.test(t)) || p.tags?.[0] || "Memorabilia"
    }
    const productTypes = ["all", ...new Set(products.map(p => p.product_type).filter((t): t is string => t !== null))]

    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>

            <PageHero
                title={category ? category.toUpperCase() : "THE COLLECTION"}
                subtitle={category ? `PREMIUM AUTHENTICATED ${category.toUpperCase()} ASSETS` : "SETTING THE NEW STANDARD IN SPORTS MEMORABILIA"}
            />

            <div className="container mx-auto px-4 py-12">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12 bg-white p-4 rounded-sm border border-stone/10 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                        <input
                            type="text"
                            placeholder="Search player or team..."
                            className="w-full pl-12 pr-4 py-3 bg-ivory/50 border border-transparent focus:bg-white focus:border-gold/30 rounded-sm text-sm outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="gap-2 flex-1 md:flex-none">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                    {(selectedType !== "all" || selectedSport !== "all" || selectedTeam !== "all" || priceRange !== "all") && (
                                        <span className="w-2 h-2 bg-gold rounded-full" />
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:max-max-w-md bg-ivory p-0 flex flex-col">
                                <SheetHeader className="p-8 border-b border-stone/10 bg-white">
                                    <SheetTitle className="font-serif text-2xl text-navy">Refine Search</SheetTitle>
                                </SheetHeader>
                                
                                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Sport</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={() => setSelectedSport("all")} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedSport === "all" ? "bg-navy text-white" : "bg-white text-navy/60"}`}>All</button>
                                            {sports.map(s => (
                                                <button key={s} onClick={() => setSelectedSport(s)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedSport === s ? "bg-navy text-white" : "bg-white text-navy/60"}`}>{s}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Price</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={() => setPriceRange("all")} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${priceRange === "all" ? "bg-navy text-white" : "bg-white text-navy/60"}`}>Any</button>
                                            {priceRanges.map(r => (
                                                <button key={r.value} onClick={() => setPriceRange(r.value)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${priceRange === r.value ? "bg-navy text-white" : "bg-white text-navy/60"}`}>{r.label}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Asset Type</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={() => setSelectedType("all")} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedType === "all" ? "bg-navy text-white" : "bg-white text-navy/60"}`}>All</button>
                                            {productTypes.filter(t => t !== "all").map(t => (
                                                <button key={t} onClick={() => setSelectedType(t)} className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${selectedType === t ? "bg-navy text-white" : "bg-white text-navy/60"}`}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em]">Heritage Filter</h3>
                                        <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="w-full p-4 bg-white border border-stone/20 rounded-sm text-sm outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                                            <option value="all">All Teams & Athletes</option>
                                            {groupedFilters.teams.length > 0 && <optgroup label="TEAMS">{groupedFilters.teams.map(t => <option key={t} value={t}>{t}</option>)}</optgroup>}
                                            {groupedFilters.athletes.length > 0 && <optgroup label="ATHLETES">{groupedFilters.athletes.map(a => <option key={a} value={a}>{a}</option>)}</optgroup>}
                                            {groupedFilters.competitions.length > 0 && <optgroup label="COMPETITIONS">{groupedFilters.competitions.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>}
                                        </select>
                                    </div>
                                </div>

                                <div className="p-8 bg-white border-t border-stone/10 grid grid-cols-2 gap-4">
                                    <Button variant="outline" className="h-12 font-bold uppercase tracking-widest text-[10px]" onClick={() => { setSelectedType("all"); setSelectedSport("all"); setSelectedTeam("all"); setPriceRange("all"); }}>Reset</Button>
                                    <Button className="h-12 font-bold uppercase tracking-widest text-[10px] bg-gold text-charcoal hover:bg-gold/90" onClick={() => setShowFilters(false)}>Show {filteredProducts.length} Items</Button>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="relative group">
                            <Button variant="outline" className="gap-2 bg-white">Sort <ChevronDown className="w-4 h-4" /></Button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-sm shadow-xl hidden group-hover:block z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button onClick={() => setSortBy('featured')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm border-b">Featured</button>
                                <button onClick={() => setSortBy('price-asc')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm border-b">Price: Low to High</button>
                                <button onClick={() => setSortBy('price-desc')} className="block w-full text-left px-4 py-3 hover:bg-stone/5 text-sm">Price: High to Low</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="aspect-[3/4] bg-stone/5 animate-pulse rounded-sm" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sortedProducts.map(p => (
                            <a href={`/product/${p.handle}`} key={p.id}>
                                <ProductCard
                                    title={p.title}
                                    price={getPrice(p)}
                                    image={getImage(p)}
                                    altText={generateImageAlt(p)}
                                    athlete={getAthlete(p)}
                                    type={p.product_type || "other"}
                                />
                            </a>
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="space-y-16">
                        <div className="max-w-xl mx-auto text-center py-10 px-4">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-6 h-6 text-navy/40" />
                            </div>
                            <h2 className="text-2xl font-serif text-navy mb-3 uppercase tracking-tight">Asset not found</h2>
                            <p className="text-stone/60 mb-8 max-w-sm mx-auto">
                                The shop is updated daily. Secure your place for the next authentication drop.
                            </p>

                            <WaitlistSignup interest={selectedSport !== 'all' ? selectedSport : 'General'} />
                        </div>

                        {/* Secured Archive Section */}
                        <div className="border-t border-stone/10 pt-16">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-serif text-navy">Recently Secured Heritage</h2>
                                    <p className="text-stone/50 text-sm max-w-md">These assets have been authenticated and moved into private collections.</p>
                                </div>
                                <a href="/shop" className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40 hover:text-navy transition-colors border-b border-stone/20 pb-1">View Full Ledger</a>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {archivedProducts.map(p => (
                                    <ProductCard
                                        key={p.id}
                                        title={p.title}
                                        price={getPrice(p)}
                                        image={getImage(p)}
                                        altText={generateImageAlt(p)}
                                        athlete={getAthlete(p)}
                                        type={p.product_type || "other"}
                                        status="archived"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
