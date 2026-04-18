import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, Zap, Copy, Check, Globe, ShoppingCart, Tag, Box, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"

interface SEOAssets {
    google: { title: string; meta: string; long: string }
    ebay: { title: string; header: string }
    etsy: { title: string; tags: string[] }
    amazon: { title: string; bullets: string[] }
    internal: { sku: string; tags: string }
}

export function SEOGeneratorPage() {
    const [athlete, setAthlete] = useState("")
    const [itemType, setItemType] = useState("Shirt")
    const [year, setYear] = useState("")
    const [team, setTeam] = useState("")
    const [auth, setAuth] = useState("Sports Memorabilia Store™ NFC")
    const [framing, setFraming] = useState("Bespoke Black Gallery Frame")
    const [history, setHistory] = useState("")

    const [assets, setAssets] = useState<SEOAssets | null>(null)
    const [activeTab, setActiveTab] = useState<keyof SEOAssets>("google")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const generate = () => {
        const aShort = athlete.split(' ').pop() || ""
        
        const newAssets: SEOAssets = {
            google: {
                title: `${athlete} Signed ${itemType} | Authentic ${team || year} Memorabilia`.substring(0, 60),
                meta: `Hand-signed ${athlete} ${itemType.toLowerCase()} with ${auth}. Gallery-standard framing. 100% guarantee. Official memorabilia from Sports Memorabilia Store. Shop the legend now.`.substring(0, 160),
                long: `HISTORICAL LEGACY\nOwn a definitive piece of sporting history with this hand-signed ${itemType.toLowerCase()} from ${athlete}. ${history ? history + '. ' : ''}\n\nAUTHENTICATION\nSecured with ${auth} and our proprietary NFC technology. Tap your smartphone to the display to instantly verify the digital certificate of authenticity.\n\nPRESENTATION\nHoused in our ${framing}. Using conservation-grade mounts and UV-protective glass to ensure your asset remains pristine for decades.\n\nSHIPPING\nFree, fully insured UK delivery. Experience world-class luxury unboxing by Sports Memorabilia Store.`
            },
            ebay: {
                title: `Authentic Hand Signed ${athlete} ${itemType} - ${team || ''} - ${auth} BOXED`.substring(0, 80),
                header: `Rare ${athlete} Memorabilia\nType: Signed ${itemType}\nSeason: ${year}\nTeam: ${team || 'N/A'}\nCOA: ${auth}`
            },
            etsy: {
                title: `${athlete} Signed ${itemType} Gift, Custom Framed ${team} Memorabilia, Man Cave Art, ${year} Collection`,
                tags: [athlete, `Signed ${itemType}`, team, 'Sports Gift', 'Gifts for Him', 'Birthday Gift', 'Custom Framed', 'Authenticated', 'Man Cave Art', 'Luxury Gift', 'Sports Memorabilia Store', year].filter(t => t !== "")
            },
            amazon: {
                title: `Sports Memorabilia Store Authentic ${athlete} Signed ${itemType} - ${team} Edition - Premium Gallery Framed`,
                bullets: [
                    `OFFICIAL SIGNATURE: Guaranteed hand-signed by ${athlete} during an exclusive professional signing session.`,
                    `NFC AUTHENTICATED: Features Sports Memorabilia Store™ NFC Technology for instant smartphone verification and digital provenance.`,
                    `GALLERY FRAMING: Housed in our bespoke black gallery frame with premium double-mounts and UV-protective glass.`,
                    `PERFECT GIFT: Delivered in high-end luxury packaging, designed for a world-class unboxing experience.`,
                    `LIFETIME GUARANTEE: Accompanied by full legal authentication and a 100% lifetime authenticity guarantee.`
                ]
            },
            internal: {
                sku: `${(team || 'GEN').substring(0, 3).toUpperCase()}-${athlete.split(' ').map(n => n[0]).join('').toUpperCase()}-${year.substring(0, 4)}-${itemType.substring(0, 3).toUpperCase()}-F`,
                tags: [athlete, team, itemType, year, 'Framed'].filter(t => t !== "").join(', ')
            }
        }
        setAssets(newAssets)
    }

    return (
        <div className="min-h-screen bg-ivory pt-36 pb-20">
            <Helmet><title>Omni-Channel SEO Generator | Admin</title></Helmet>

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin" className="p-2 hover:bg-stone/10 rounded-full text-navy/60">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold text-navy flex items-center gap-3">
                        <Zap className="w-8 h-8 text-gold" />
                        AI SEO Optimizer
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Inputs */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone/20 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gold">Athlete Name</label>
                                <input value={athlete} onChange={e => setAthlete(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy focus:outline-gold" placeholder="Mike Tyson" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gold">Item Type</label>
                                <select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy">
                                    <option>Shirt</option><option>Glove</option><option>Boot</option><option>Photo</option><option>Boxing Trunks</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gold">Year / Season</label>
                                <input value={year} onChange={e => setYear(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy" placeholder="23/24" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gold">Team / Event</label>
                                <input value={team} onChange={e => setTeam(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy" placeholder="Liverpool FC" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gold">Authenticity</label>
                            <select value={auth} onChange={e => setAuth(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy">
                                <option>Sports Memorabilia Store™ NFC</option><option>Beckett</option><option>PSA/DNA</option><option>Official Club COA</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gold">Product History</label>
                            <textarea value={history} onChange={e => setHistory(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy h-24" placeholder="Brief details about the signing or achievement..." />
                        </div>

                        <Button onClick={generate} className="w-full py-6 text-lg font-bold">Generate Assets</Button>
                    </div>

                    {/* Results */}
                    {assets ? (
                        <div className="space-y-6">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {(["google", "ebay", "etsy", "amazon", "internal"] as const).map(tab => (
                                    <button 
                                        key={tab} 
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-navy text-gold shadow-lg" : "bg-white text-navy/40 hover:bg-white/80"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone/20 animate-in fade-in slide-in-from-bottom-4">
                                {activeTab === "google" && (
                                    <div className="space-y-6">
                                        <ResultItem label="SEO Title" val={assets.google.title} id="g_t" onCopy={handleCopy} copiedId={copiedId} max={60} />
                                        <ResultItem label="Meta Description" val={assets.google.meta} id="g_m" onCopy={handleCopy} copiedId={copiedId} max={160} />
                                        <ResultItem label="Full Description" val={assets.google.long} id="g_l" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                                {activeTab === "ebay" && (
                                    <div className="space-y-6">
                                        <ResultItem label="eBay Title" val={assets.ebay.title} id="eb_t" onCopy={handleCopy} copiedId={copiedId} max={80} />
                                        <ResultItem label="eBay Headers" val={assets.ebay.header} id="eb_h" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                                {activeTab === "etsy" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Etsy Title" val={assets.etsy.title} id="et_t" onCopy={handleCopy} copiedId={copiedId} max={140} />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">SEO Tags (13)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {assets.etsy.tags.map(tag => <span key={tag} className="bg-ivory px-3 py-1 rounded-full text-xs font-medium text-navy border border-stone/10">{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "amazon" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Brand Title" val={assets.amazon.title} id="am_t" onCopy={handleCopy} copiedId={copiedId} />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Key Features</p>
                                            {assets.amazon.bullets.map((b, i) => <div key={i} className="bg-ivory p-3 rounded-lg text-xs text-navy border border-stone/5 flex justify-between items-center">{b} <button onClick={() => handleCopy(b, `am_b_${i}`)}>{copiedId === `am_b_${i}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-navy/20" />}</button></div>)}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "internal" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Generated SKU" val={assets.internal.sku} id="i_s" onCopy={handleCopy} copiedId={copiedId} />
                                        <ResultItem label="Shopify Tags" val={assets.internal.tags} id="i_t" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-navy/5 border-2 border-dashed border-navy/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                            <Box className="w-12 h-12 text-navy/10 mb-4" />
                            <p className="text-navy/40 font-medium">Input product details to generate <br/>optimized marketplace assets.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ResultItem({ label, val, id, onCopy, copiedId, max }: { label: string, val: string, id: string, onCopy: (text: string, id: string) => void, copiedId: string | null, max?: number }) {
    const isOver = max && val.length > max
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">{label}</p>
                {max && <p className={`text-[10px] font-bold ${isOver ? "text-red-500" : "text-green-600"}`}>{val.length}/{max}</p>}
            </div>
            <div className="relative group">
                <div className={`p-4 bg-ivory rounded-lg text-sm text-navy border border-stone/10 font-medium break-words whitespace-pre-wrap ${isOver ? "border-red-200" : ""}`}>
                    {val}
                </div>
                <button 
                    onClick={() => onCopy(val, id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm border border-stone/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-white"
                >
                    {copiedId === id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    )
}
