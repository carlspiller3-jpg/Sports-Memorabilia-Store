import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, Zap, Copy, Check, Globe, ShoppingCart, Tag, Box, Info, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"

interface SEOAssets {
    google: { title: string; meta: string; long: string }
    ebay: { title: string; header: string }
    etsy: { title: string; tags: string[]; story: string }
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
    const [signingDetails, setSigningDetails] = useState("") // New: London, Nov 2023

    const [assets, setAssets] = useState<SEOAssets | null>(null)
    const [activeTab, setActiveTab] = useState<keyof SEOAssets>("google")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const smartTrim = (text: string, max: number) => {
        if (text.length <= max) return text
        const trimmed = text.substring(0, max)
        const lastSpace = trimmed.lastIndexOf(" ")
        return lastSpace > 0 ? trimmed.substring(0, lastSpace) : trimmed
    }

    const generate = () => {
        const aShort = athlete.split(' ').pop() || ""
        const signText = signingDetails ? `Signed in ${signingDetails}.` : ""
        
        // 1. EBAY TITLE LOGIC (Priority: Keywords > Brand)
        let ebTitle = `Hand Signed ${athlete} ${itemType} - ${team || ''} ${year} COA`.trim()
        if (ebTitle.length < 70) ebTitle += " FRAMED"
        if (ebTitle.length < 75) ebTitle += " NEW"
        ebTitle = smartTrim(ebTitle, 80)

        const newAssets: SEOAssets = {
            google: {
                title: smartTrim(`${athlete} Signed ${itemType} | Authentic ${team || year} Memorabilia`, 60),
                meta: smartTrim(`Own an authentic hand-signed ${athlete} ${itemType.toLowerCase()}. ${signText} Verified by ${auth}. Bespoke framing. 100% guarantee. Shop now.`, 160),
                long: `HISTORICAL LEGACY\nOwn a definitive piece of sporting history with this hand-signed ${itemType.toLowerCase()} from ${athlete}. ${signText} ${history ? history + '. ' : ''}\n\nAUTHENTICATION\nSecured with ${auth} and our proprietary NFC technology. Tap your smartphone to the display to instantly verify the digital certificate of authenticity and see proof of the signing session.\n\nPRESENTATION\nHoused in our ${framing}. Using conservation-grade mounts and UV-protective glass to ensure your investment remains pristine for decades. This is gallery-standard excellence.\n\nSHIPPING\nFree, fully insured UK delivery. Experience our world-class luxury unboxing, designed for high-value collectibles.`
            },
            ebay: {
                title: ebTitle,
                header: `Jordan Henderson Memorabilia\nType: Signed ${itemType}\nSeason: ${year}\nTeam: ${team || 'N/A'}\nProvenance: ${signText || 'Signed in Private Session'}\nCOA: ${auth}`
            },
            etsy: {
                title: smartTrim(`${athlete} Signed ${itemType} Gift, Custom Framed ${team} Memorabilia, Luxury Sports Art for Man Cave, ${year} Collection`, 140),
                tags: [athlete, `Signed ${itemType}`, team, 'Sports Gift', 'Gifts for Him', 'Birthday Gift', 'Custom Framed', 'Authenticated', 'Man Cave Art', 'Luxury Gift', 'Sports Memorabilia Store', year].filter(t => t !== ""),
                story: `Elevate your space with a piece of sporting heritage. This isn't just memorabilia; it's a conversation starter and a milestone gift. Whether you're celebrating a massive birthday, a promotion, or completing a dream man cave, this hand-signed ${athlete} ${itemType.toLowerCase()} captures the magic of the game.\n\nProfessionally framed and authenticated, it's a timeless heirloom for any true ${team || 'sports'} supporter. A gift they will never forget.`
            },
            amazon: {
                title: smartTrim(`Sports Memorabilia Store Authentic ${athlete} Signed ${itemType} - ${team} Edition - Premium Gallery Framed`, 150),
                bullets: [
                    `OFFICIAL SIGNATURE: Guaranteed hand-signed by ${athlete} - ${signText || 'Official Private Session'}.`,
                    `NFC AUTHENTICATED: Features Sports Memorabilia Store™ NFC Technology for instant smartphone verification and digital provenance.`,
                    `GALLERY FRAMING: Housed in our bespoke black gallery frame with premium double-mounts and UV-protective glass.`,
                    `PERFECT GIFT: Delivered in high-end luxury packaging, designed for a world-class unboxing experience for collectors.`,
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
            <Helmet><title>Elite SEO Optimizer | Admin</title></Helmet>

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin" className="p-2 hover:bg-stone/10 rounded-full text-navy/60">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold text-navy flex items-center gap-3">
                        <Zap className="w-8 h-8 text-gold" />
                        Elite SEO Optimizer
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
                            <label className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2"><Calendar className="w-3 h-3"/> Signing Details (City, Date)</label>
                            <input value={signingDetails} onChange={e => setSigningDetails(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy" placeholder="e.g. London, Nov 2023" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gold">Authenticity</label>
                            <select value={auth} onChange={e => setAuth(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy">
                                <option>Sports Memorabilia Store™ NFC</option><option>Beckett</option><option>PSA/DNA</option><option>Official Club COA</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gold">Unique Acheivements / Key Points</label>
                            <textarea value={history} onChange={e => setHistory(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy h-24" placeholder="Brief details about the signing or achievement..." />
                        </div>

                        <Button onClick={generate} className="w-full py-6 text-lg font-bold">Generate Elite Assets</Button>
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
                                        <ResultItem label="Product Page Description" val={assets.google.long} id="g_l" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                                {activeTab === "ebay" && (
                                    <div className="space-y-6">
                                        <ResultItem label="eBay Title (Calculated Stop)" val={assets.ebay.title} id="eb_t" onCopy={handleCopy} copiedId={copiedId} max={80} />
                                        <ResultItem label="eBay Headers" val={assets.ebay.header} id="eb_h" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                                {activeTab === "etsy" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Etsy Gift Title" val={assets.etsy.title} id="et_t" onCopy={handleCopy} copiedId={copiedId} max={140} />
                                        <ResultItem label="Storytelling Description" val={assets.etsy.story} id="et_s" onCopy={handleCopy} copiedId={copiedId} />
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
                                        <ResultItem label="Amazon Product Title" val={assets.amazon.title} id="am_t" onCopy={handleCopy} copiedId={copiedId} />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Key Features (Humanized)</p>
                                            {assets.amazon.bullets.map((b, i) => <div key={i} className="bg-ivory p-3 rounded-lg text-xs text-navy border border-stone/5 flex justify-between items-center">{b} <button onClick={() => handleCopy(b, `am_b_${i}`)}>{copiedId === `am_b_${i}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-navy/20" />}</button></div>)}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "internal" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Generated SKU" val={assets.internal.sku} id="i_s" onCopy={handleCopy} copiedId={copiedId} />
                                        <ResultItem label="Internal Tags" val={assets.internal.tags} id="i_t" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-navy/5 border-2 border-dashed border-navy/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                            <Box className="w-12 h-12 text-navy/10 mb-4" />
                            <p className="text-navy/40 font-medium italic">"Trust is the currency of history."</p>
                            <p className="text-navy/20 text-xs mt-2 font-medium uppercase tracking-widest">Input details to optimize assets</p>
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
