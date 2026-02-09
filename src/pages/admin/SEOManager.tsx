import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { Save, Globe, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { Link } from "react-router-dom"

interface SitePage {
    id: string
    page_key: string
    title: string
    meta_title: string
    meta_description: string
    og_image: string
}

export function SEOManager() {
    const [pages, setPages] = useState<SitePage[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPage, setSelectedPage] = useState<SitePage | null>(null)
    const [saving, setSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log("SEO Manager Mounted")
        fetchPages()
    }, [])

    async function fetchPages() {
        setLoading(true)
        setError(null)
        console.log("Fetching pages...")
        const { data, error: fetchError } = await supabase
            .from('site_pages')
            .select('*')
            .order('title')

        if (fetchError) {
            console.error('Error fetching pages:', fetchError)
            setError(fetchError.message)
        } else {
            console.log("Pages fetched:", data)
            setPages(data || [])
            if (data && data.length > 0 && !selectedPage) {
                setSelectedPage(data[0])
            }
        }
        setLoading(false)
    }

    async function seedDefaults() {
        setLoading(true)
        console.log("Seeding defaults...")
        const defaults = [
            {
                page_key: 'home',
                title: 'Home Page',
                meta_title: 'SportsSigned | Premium Authenticated Collectibles',
                meta_description: 'Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop',
                title: 'Shop All',
                meta_title: 'Shop Authentic Sports Memorabilia | SportsSigned',
                meta_description: 'Browse our collection of signed football shirts, boxing gloves, and boots. All items are 100% authentic and come with premium framing.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_football',
                title: 'Shop: Football',
                meta_title: 'Signed Football Shirts & Boots | Authentic Memorabilia',
                meta_description: 'Shop authentic signed football memorabilia. Premier League, La Liga, and International signed shirts, boots, and photos.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_boxing',
                title: 'Shop: Boxing',
                meta_title: 'Signed Boxing Gloves & Trunks | Authentic Memorabilia',
                meta_description: 'Exclusive signed boxing memorabilia from legends of the ring. Authenticated gloves, shorts, and photos.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_f1',
                title: 'Shop: F1',
                meta_title: 'F1 Memorabilia & Signed Racewear | SportsSigned',
                meta_description: 'Authentic Formula 1 memorabilia. Signed helmets, race suits, and visors from World Champions.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_rugby',
                title: 'Shop: Rugby',
                meta_title: 'Signed Rugby Shirts & Balls | SportsSigned',
                meta_description: 'Authentic rugby memorabilia from Union and League legends.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_cricket',
                title: 'Shop: Cricket',
                meta_title: 'Signed Cricket Bats & Shirts | SportsSigned',
                meta_description: 'Authentic cricket memorabilia. Signed bats, balls, and shirts from cricketing greats.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_tennis',
                title: 'Shop: Tennis',
                meta_title: 'Signed Tennis Memorabilia | SportsSigned',
                meta_description: 'Authentic signed tennis balls, racquets, and photos from Grand Slam champions.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_golf',
                title: 'Shop: Golf',
                meta_title: 'Signed Golf Memorabilia | SportsSigned',
                meta_description: 'Authentic signed flags, balls, and photos from the Masters and Open Championship.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shop_ufc',
                title: 'Shop: UFC',
                meta_title: 'Signed UFC Memorabilia | SportsSigned',
                meta_description: 'Authentic signed UFC gloves and posters from the octagon.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'about',
                title: 'About Us',
                meta_title: 'Our Story | SportsSigned',
                meta_description: 'We are setting the new standard in sports memorabilia. Learn about our commitment to authenticity, quality, and the "Unboxing Experience".',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'contact',
                title: 'Contact Us',
                meta_title: 'Contact Support | SportsSigned',
                meta_description: 'Get in touch with our team for questions about your order, sourcing requests, or partnership opportunities.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'faq',
                title: 'FAQ',
                meta_title: 'FAQ & Help | SportsSigned',
                meta_description: 'Questions about authenticity, shipping, or framing? Find all the answers here.',
                og_image: 'https://www.sportssigned.com/logo.png'
            },
            {
                page_key: 'shipping',
                title: 'Shipping & Returns',
                meta_title: 'Shipping Policy | SportsSigned',
                meta_description: 'We ship worldwide using insured, tracked couriers. Learn more about our delivery times and returns policy.',
                og_image: 'https://www.sportssigned.com/logo.png'
            }
        ]

        const { error: insertError } = await supabase
            .from('site_pages')
            .upsert(defaults, { onConflict: 'page_key', ignoreDuplicates: true })

        if (insertError) {
            console.error('Seeding error:', insertError)
            alert('Failed to seed data. Error: ' + insertError.message)
        } else {
            setSuccessMessage("Default pages loaded!")
            setTimeout(() => setSuccessMessage(""), 3000)
            fetchPages()
        }
        setLoading(false)
    }

    async function handleSave() {
        if (!selectedPage) return

        setSaving(true)
        const { error } = await supabase
            .from('site_pages')
            .update({
                meta_title: selectedPage.meta_title,
                meta_description: selectedPage.meta_description,
                og_image: selectedPage.og_image,
                updated_at: new Date().toISOString()
            })
            .eq('id', selectedPage.id)

        if (error) {
            console.error('Error saving page:', error)
            alert('Failed to save changes')
        } else {
            setSuccessMessage("Saved successfully!")
            setTimeout(() => setSuccessMessage(""), 3000)
            // Update local list
            setPages(pages.map(p => p.id === selectedPage.id ? selectedPage : p))
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="p-12 text-center pt-32">Loading SEO Manager...</div>
    }

    return (
        <div className="min-h-screen bg-ivory pt-28 pb-20 relative z-0">
            <Helmet>
                <title>SEO Manager | Admin</title>
            </Helmet>

            {/* Header - Use relative positioning to avoid overlap issues with main header */}
            <div className="bg-white border-b border-stone/10 top-0 z-10 shadow-sm relative">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/crm" className="p-2 hover:bg-stone/20 rounded-full text-navy/60 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="font-serif text-xl font-bold text-navy flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gold" />
                            SEO Manager
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={seedDefaults}
                            size="sm"
                            className="bg-navy text-white hover:bg-navy/90"
                        >
                            Load Missing Pages
                        </Button>
                        {successMessage && (
                            <span className="text-sm text-green-600 font-medium flex items-center gap-1 animate-fade-in mr-2">
                                <Check className="w-4 h-4" /> {successMessage}
                            </span>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={saving || !selectedPage}
                            className={`gap-2 ${saving ? 'opacity-70' : ''}`}
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sidebar: Page List */}
                <div className="md:col-span-1 bg-white rounded-lg shadow-sm border border-stone/10 overflow-hidden h-fit">
                    <div className="p-4 border-b border-stone/10 bg-ivory">
                        <h2 className="font-bold text-navy text-sm uppercase tracking-wider">Pages</h2>
                    </div>
                    <div className="divide-y divide-stone/5">
                        {pages.map(page => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPage(page)}
                                className={`w-full text-left p-4 text-sm font-medium transition-colors hover:bg-stone/5 flex justify-between items-center ${selectedPage?.id === page.id ? 'bg-navy/5 text-navy border-l-4 border-navy' : 'text-stone-600 border-l-4 border-transparent'}`}
                            >
                                {page.title}
                                {selectedPage?.id === page.id && <span className="w-2 h-2 rounded-full bg-gold"></span>}
                            </button>
                        ))}
                        {pages.length === 0 && (
                            <div className="p-8 text-center text-sm text-stone-400">
                                {error ? (
                                    <div className="text-red-500 mb-4">
                                        <p className="font-bold">Error loading pages:</p>
                                        <p className="font-mono text-xs mt-1">{error}</p>
                                        {error.includes('relation') && (
                                            <p className="text-xs mt-2 text-stone-500">
                                                Did you run the <strong>SUPABASE_SEO_v2.sql</strong> script?
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p>No pages found.</p>
                                        <Button onClick={seedDefaults} variant="outline" size="sm" className="mx-auto w-full">
                                            Load Default Pages
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content: Edit Form */}
                <div className="md:col-span-3">
                    {selectedPage ? (
                        <div className="bg-white rounded-lg shadow-sm border border-stone/10 p-6 md:p-8 space-y-6">

                            <div>
                                <h2 className="font-serif text-2xl font-bold text-navy mb-1">{selectedPage.title}</h2>
                                <p className="text-sm text-stone-500 font-mono">Key: {selectedPage.page_key}</p>
                            </div>

                            <div className="space-y-4">

                                {/* Meta Title */}
                                <div>
                                    <label className="block text-sm font-bold text-navy mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        value={selectedPage.meta_title || ''}
                                        onChange={(e) => setSelectedPage({ ...selectedPage, meta_title: e.target.value })}
                                        className="w-full p-3 border border-stone/20 rounded bg-stone/5 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 font-medium text-navy"
                                        placeholder="Page Title | Brand Name"
                                    />
                                    <p className="text-xs text-stone-400 mt-1 flex justify-between">
                                        <span>Recommended length: 50-60 characters</span>
                                        <span className={`${(selectedPage.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-stone-400'}`}>
                                            {selectedPage.meta_title?.length || 0} chars
                                        </span>
                                    </p>
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label className="block text-sm font-bold text-navy mb-2">Meta Description</label>
                                    <textarea
                                        value={selectedPage.meta_description || ''}
                                        onChange={(e) => setSelectedPage({ ...selectedPage, meta_description: e.target.value })}
                                        className="w-full p-3 border border-stone/20 rounded bg-stone/5 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 min-h-[120px] text-sm leading-relaxed"
                                        placeholder="A brief summary of the page content..."
                                    />
                                    <p className="text-xs text-stone-400 mt-1 flex justify-between">
                                        <span>Recommended length: 150-160 characters</span>
                                        <span className={`${(selectedPage.meta_description?.length || 0) > 160 ? 'text-red-500' : 'text-stone-400'}`}>
                                            {selectedPage.meta_description?.length || 0} chars
                                        </span>
                                    </p>
                                </div>

                                {/* OG Image */}
                                <div>
                                    <label className="block text-sm font-bold text-navy mb-2">Social Share Image (OG Image)</label>
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={selectedPage.og_image || ''}
                                                onChange={(e) => setSelectedPage({ ...selectedPage, og_image: e.target.value })}
                                                className="w-full p-3 border border-stone/20 rounded bg-stone/5 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 text-sm font-mono mb-2"
                                                placeholder="https://..."
                                            />
                                            <p className="text-xs text-stone-400">URL to the image displayed when sharing on Facebook/Twitter.</p>
                                        </div>
                                        {selectedPage.og_image && (
                                            <div className="w-32 h-20 bg-stone/10 rounded overflow-hidden border border-stone/20 flex-shrink-0">
                                                <img
                                                    src={selectedPage.og_image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            <div className="pt-6 border-t border-stone/10">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-navy/40 mb-3">Preview</h3>
                                <div className="bg-white border border-stone/20 rounded p-4 max-w-xl">
                                    <div className="text-[#1a0dab] text-xl font-medium truncate hover:underline cursor-pointer">
                                        {selectedPage.meta_title || 'Page Title'}
                                    </div>
                                    <div className="text-[#006621] text-sm truncate mt-0.5">
                                        https://sportssigned.com/{selectedPage.page_key}
                                    </div>
                                    <div className="text-[#545454] text-sm mt-1 line-clamp-2">
                                        {selectedPage.meta_description || 'Page description will appear here...'}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-stone-400 border border-dashed border-stone/20 rounded-lg p-12 bg-stone/5">
                            Select a page to edit SEO details
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
