import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { ArrowLeft, Zap, Copy, Check, Globe, ShoppingCart, Tag, Box, Info, Heart, Calendar } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
import { GoogleGenerativeAI } from "@google/generative-ai"

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
    const [signingDetails, setSigningDetails] = useState("")

    const [assets, setAssets] = useState<SEOAssets | null>(null)
    const [isGeneratingEEAT, setIsGeneratingEEAT] = useState(false)
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

    const generateEEAT = async () => {
        if (!athlete || !team) {
            alert("Please enter both Athlete Name and Team/Event first.");
            return;
        }
        
        let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            apiKey = localStorage.getItem("GEMINI_API_KEY");
            if (!apiKey) {
                apiKey = prompt("Please enter your Gemini API Key.");
                if (apiKey) {
                    localStorage.setItem("GEMINI_API_KEY", apiKey);
                } else {
                    return;
                }
            }
        }

        setIsGeneratingEEAT(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const promptText = `As a Senior Sports Journalist for a prestige broadsheet newspaper (The Times, The Telegraph), write a factual summary for this item: Hand-signed ${itemType} by ${athlete} (${team}).

TASK:
Write 2-3 punchy, authoritative sentences that document the historical significance of ${athlete} during their time with ${team}. Focus on raw stats, dates, and verifiable trophies.

STRICT WRITING RULES:
1. NO ROBOT SPEAK: Do not use words like "specimen", "textile", "perpetuity", "asset", "organization", "roster", "deficit", "regulations", "milestone", "triggered". 
2. USE FOOTBALL LANGUAGE: Use "squad", "club", "team", "players". 
3. ZERO HYPHENS: Do not use hyphens (no "record-breaking", no "world-class").
4. NO AI BULLSHIT: Strictly forbidden: "legendary", "iconic", "premier", "unparalleled", "cemented", "elite", "unique", "testament", "journey".
5. NO MARKETING DRAMA: No emotional adjectives. Just cold, hard sports history.
6. EEAT SIGNALS: Mention specific dates, goal counts, or trophy names (e.g., "Champions League final in Istanbul").

The tone should be human, direct, and elite. Write like a man who has covered sports for 40 years. 

Return ONLY the text. No introductions.`;

            const result = await model.generateContent(promptText);
            const response = await result.response;
            const text = response.text();
            
            if (text) {
                setHistory(text.trim());
            }
        } catch (e: any) {
            console.error("EEAT Generation Error:", e);
            const errorMsg = e.message?.toLowerCase() || "";
            
            if (errorMsg.includes("503") || errorMsg.includes("high demand")) {
                alert("GOOGLE API OVERLOAD (503): Google's servers are currently experiencing high demand. \n\nPlease wait 30 seconds and try again—your key and configuration are correct, the service is just busy.");
            } else if (errorMsg.includes("api key") || errorMsg.includes("expired") || errorMsg.includes("400") || errorMsg.includes("invalid")) {
                localStorage.removeItem("GEMINI_API_KEY");
                alert("CRITICAL ERROR: Your Gemini API Key is EXPIRED or INVALID. \n\nPlease get a fresh key from aistudio.google.com and paste it when prompted.");
            } else {
                alert("Failed to generate E-E-A-T: " + e.message);
            }
        } finally {
            setIsGeneratingEEAT(false);
        }
    }

    const generate = () => {
        const signText = signingDetails ? `Signed in ${signingDetails}.` : ""
        
        // 1. EBAY TITLE (CASSINI OPTIMIZED) - Pure keyword strings, no filler punctuation
        const ebTags = [athlete, "Signed", itemType, team, year, "COA", "Framed", "Authentic"].filter(Boolean)
        let ebTitle = ebTags.join(" ")
        ebTitle = smartTrim(ebTitle, 80).toUpperCase() // Cassini responds well to capitalized keywords

        // 2. ETSY TITLE & TAGS (MARKETPLACE INSIGHTS) - First 3 items must match perfectly
        const etsyMainHeader = `${athlete} Signed ${itemType}`
        const etsyTitle = smartTrim(`${etsyMainHeader} Gift, Custom Framed ${team} Memorabilia, Luxury Sports Art, ${year} Collection`, 140)
        const etsyTagsArr = [athlete, `Signed ${itemType}`, team, 'Sports Gift', 'Gifts for Him', 'Birthday Gift', 'Custom Framed', 'Authenticated', 'Man Cave Art', 'Luxury Gift', 'Memorabilia', year, 'Sports Memorabilia Store']

        // 3. AMAZON (A10 OPTIMIZED) - Brand-forward authority, ultra-clean
        const amzTitle = smartTrim(`Sports Memorabilia Store - Authentic ${athlete} Signed ${itemType} (${team} ${year})`, 150)

        const newAssets: SEOAssets = {
            google: {
                title: smartTrim(`${athlete} Signed ${itemType} | Authentic ${team || year} Memorabilia`, 60),
                meta: smartTrim(`Authentic ${athlete} Signed ${itemType} - Hand-signed ${team} (${year}) memorabilia. NFC Technology Verified. 24h Dispatch. Bespoke Framing. Fully Insured Delivery.`, 160),
                long: `PRODUCT SPECIFICATION\nAuthentic hand-signed ${itemType.toLowerCase()} from ${athlete}. ${signText} ${history ? history + '. ' : ''}This item is a verified historical asset for the ${team || ''} collector.\n\nTECHNOLOGY & PROVENANCE\nEvery item is secured with our proprietary NFC tech. Scan the item with your smartphone to instantly access the Digital Ledger, signing date, and full COA details verified by ${auth}.\n\nCRAFTSMANSHIP\nBespoke professional framing using conservation-grade mounts and UV-protective glass. Designed to preserve the integrity of the signature and materials for a lifetime.\n\nLOGISTICS\nPostage within 24hrs of order. Fully insured, secure UK delivery. Experience a premium archival unboxing experience from Sports Memorabilia Store.`
            },
            ebay: {
                title: ebTitle,
                header: `Elite ${athlete} Memorabilia\nType: Signed ${itemType}\nSeason: ${year}\nTeam: ${team || 'N/A'}\nProvenance: ${signText || 'Signed in Private Session'}\nCOA: ${auth}\nFraming: Professional Gallery Frame`
            },
            etsy: {
                title: etsyTitle,
                tags: etsyTagsArr,
                story: `Elevate your space with a piece of sporting heritage. This isn't just memorabilia; it's a conversation starter and a milestone gift for any ${team || 'sports'} fan. Whether you're celebrating a massive birthday, a promotion, or completing a dream man cave, this hand-signed ${athlete} ${itemType.toLowerCase()} captures the magic of the game.\n\nProfessionally framed and authenticated, it's a timeless heirloom. Authenticity guaranteed by Sports Memorabilia Store.`
            },
            amazon: {
                title: amzTitle,
                bullets: [
                    `HAND-SIGNED AUTHENTICITY: Guaranteed signature by ${athlete} - ${signText || 'Professional Session'}.`,
                    `NFC TECHNOLOGY: Includes Sports Memorabilia Store™ NFC tag for instant smartphone authentication and digital ledger access.`,
                    `BESPOKE FRAMING: Housed in professional black frames with conservation-grade double-mounts and UV-protective glass.`,
                    `ARCHIVAL PACKAGING: Delivered in secure, impact-resistant packaging designed for the preservation of high-value collectibles.`,
                    `LIFETIME GUARANTEE: Provided with a full legal Certificate of Authenticity and a 100% lifetime guarantee.`
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
            <Helmet><title>Elite Algorithm Optimizer | Admin</title></Helmet>

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/admin" className="p-2 hover:bg-stone/10 rounded-full text-navy/60">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="font-serif text-3xl font-bold text-navy flex items-center gap-3">
                        <Zap className="w-8 h-8 text-gold" />
                        Algorithm SEO Optimizer
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
                            <label className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2"><Calendar className="w-3 h-3"/> Signing Details (Historical Provenance)</label>
                            <input value={signingDetails} onChange={e => setSigningDetails(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy" placeholder="e.g. London, Nov 2023" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gold">Authenticity</label>
                            <select value={auth} onChange={e => setAuth(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy">
                                <option>Sports Memorabilia Store™ NFC</option><option>Beckett</option><option>PSA/DNA</option><option>Official Club COA</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label className="text-xs font-bold uppercase tracking-widest text-gold">Unique Achievement (E-E-A-T Signal)</label>
                                <button 
                                    onClick={generateEEAT}
                                    disabled={isGeneratingEEAT}
                                    className="text-[10px] bg-stone-100 hover:bg-stone-200 text-charcoal px-2 py-1 rounded-sm border border-stone-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Zap className="w-3 h-3 text-gold" />
                                    {isGeneratingEEAT ? "Generating..." : "Auto-Generate E-E-A-T"}
                                </button>
                            </div>
                            <textarea value={history} onChange={e => setHistory(e.target.value)} className="w-full p-3 bg-ivory border border-stone/10 rounded-lg text-navy h-24" placeholder="Brief details about the signing or achievement..." />
                        </div>

                        <Button onClick={generate} className="w-full py-6 text-lg font-bold">Generate Algorithm Assets</Button>
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
                                        <ResultItem label="SEO Title (Google Optimized)" val={assets.google.title} id="g_t" onCopy={handleCopy} copiedId={copiedId} max={60} />
                                        <ResultItem label="Meta Description" val={assets.google.meta} id="g_m" onCopy={handleCopy} copiedId={copiedId} max={160} />
                                        <ResultItem label="Core Description" val={assets.google.long} id="g_l" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                                {activeTab === "ebay" && (
                                    <div className="space-y-6">
                                        <ResultItem label="eBay Title (Cassini Optimized - No Filler)" val={assets.ebay.title} id="eb_t" onCopy={handleCopy} copiedId={copiedId} max={80} />
                                        <ResultItem label="Cassini Header Specs" val={assets.ebay.header} id="eb_h" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                                {activeTab === "etsy" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Etsy Gift Title" val={assets.etsy.title} id="et_t" onCopy={handleCopy} copiedId={copiedId} max={140} />
                                        <ResultItem label="Marketplace Insights Story" val={assets.etsy.story} id="et_s" onCopy={handleCopy} copiedId={copiedId} />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Marketplace Tags (Title-Synchronized)</p>
                                            <div className="flex flex-wrap gap-2">
                                                {assets.etsy.tags.map(tag => <span key={tag} className="bg-ivory px-3 py-1 rounded-full text-xs font-medium text-navy border border-stone/10">{tag}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "amazon" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Amazon A10 Title (Brand-First)" val={assets.amazon.title} id="am_t" onCopy={handleCopy} copiedId={copiedId} />
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">A10 Feature Bullets</p>
                                            {assets.amazon.bullets.map((b, i) => <div key={i} className="bg-ivory p-3 rounded-lg text-xs text-navy border border-stone/5 flex justify-between items-center">{b} <button onClick={() => handleCopy(b, `am_b_${i}`)}>{copiedId === `am_b_${i}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-navy/20" />}</button></div>)}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "internal" && (
                                    <div className="space-y-6">
                                        <ResultItem label="Generated SKU" val={assets.internal.sku} id="i_s" onCopy={handleCopy} copiedId={copiedId} />
                                        <ResultItem label="Shopify Collection Tags" val={assets.internal.tags} id="i_t" onCopy={handleCopy} copiedId={copiedId} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-navy/5 border-2 border-dashed border-navy/10 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                            <Box className="w-12 h-12 text-navy/10 mb-4" />
                            <p className="text-navy/40 font-serif text-lg italic">"Algorithm Optimization is the Science of Visibility."</p>
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
