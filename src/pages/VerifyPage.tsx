import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { ShieldCheck, Loader2, XCircle, Smartphone, Zap, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { TrustBadge } from "@/components/ui/TrustBadge"
import { supabase } from "@/lib/supabase"
import { DigitalCertificateModal } from "@/components/certificate/DigitalCertificateModal"

export function VerifyPage() {
    const { tagId: routeTagId } = useParams<{ tagId: string }>()
    const [searchParams] = useSearchParams()
    const activeTagId = routeTagId || searchParams.get('tag_id') || searchParams.get('tag')

    interface VerifiedProduct {
        title: string
        date: string
        location: string
        contract: string
        tokenId: string
        image: string
        tagId?: string
    }

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [product, setProduct] = useState<VerifiedProduct | null>(null)
    const [showCertificate, setShowCertificate] = useState(false)
    const [showFullImage, setShowFullImage] = useState(false)

    const handleVerify = useCallback(async (tagIdToVerify: string) => {
        setStatus('loading')

        try {
            // Real Database Call
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .eq('tag_id', tagIdToVerify.toUpperCase())
                .single()

            if (error) throw error

            if (data) {
                setProduct({
                    title: data.title,
                    date: data.date_signed, // Map from DB column names
                    location: data.location,
                    contract: "The Sports Memorabilia Store", // Static issuer name
                    tokenId: data.id, // The Certificate UUID
                    image: data.image_url,
                    tagId: data.tag_id
                })
                setStatus('success')
            } else {
                setStatus('error')
            }

        } catch (error) {
            console.error('Verification failed:', error)
            setStatus('error')
        }
    }, [])

    // Simulate NFC scan handling
    useEffect(() => {
        if (activeTagId) {
            setTimeout(() => handleVerify(activeTagId), 0)
        }
    }, [activeTagId, handleVerify])

    return (
        <div className="min-h-screen bg-ivory">
            {/* Verification Interface */}
            <div className="min-h-screen pt-36 sm:pt-44 pb-20 px-4 flex flex-col items-center justify-start">
                <div className="max-w-md w-full space-y-8 text-center">

                    {status === 'idle' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-10 h-10 text-gold" />
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-charcoal">Authenticity Verified by NFC</h1>
                            <p className="text-navy/60">
                                Simply tap your smartphone against the NFC tag on your item to instantly view its authenticity certificate.
                            </p>
                            <div className="pt-4 p-6 bg-stone/5 rounded-lg border border-stone/10 text-sm text-navy/80 text-left">
                                <p className="mb-2 font-bold text-charcoal">Experiencing issues?</p>
                                <p>If your NFC tag does not scan, or if you have questions about your item's authenticity, please <a href="/contact" className="text-gold hover:underline font-medium">contact our support team</a> and include your order details.</p>
                            </div>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="space-y-6 pt-8">
                            <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
                            <p className="text-navy/60 font-medium">Verifying Certificate...</p>
                        </div>
                    )}

                    {status === 'success' && product && (
                        <div className="bg-white p-6 sm:p-8 rounded-sm shadow-xl border border-stone/20 space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-center">
                                <TrustBadge type="verified" className="bg-green-50 text-green-700 border-green-200" />
                            </div>

                            <div 
                                className="rounded-sm overflow-hidden bg-stone/5 cursor-pointer relative group border border-stone/10"
                                onClick={() => setShowCertificate(true)}
                            >
                                <img src={product.image} alt={product.title} className="w-full h-auto max-h-[60vh] object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
                                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <ShieldCheck className="w-8 h-8 text-gold" />
                                    <span className="text-white font-medium px-4 py-2 bg-black/60 rounded-full text-xs uppercase tracking-wider">
                                        View Digital Certificate
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="font-serif text-xl font-bold text-charcoal">{product.title}</h2>
                                <p className="text-sm text-navy/60">Signed on {product.date}</p>
                            </div>

                            <div className="border-t border-stone/10 pt-4 text-left space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-stone/60">Location</span>
                                    <span className="font-medium text-navy">{product.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone/60">Contract</span>
                                    <span className="font-mono text-xs text-gold">{product.contract}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-stone/60">Token ID</span>
                                    <span className="font-mono text-xs text-gold">{product.tokenId}</span>
                                </div>
                            </div>

                            <Button 
                                className="w-full bg-gold hover:bg-gold/90 text-navy font-bold uppercase tracking-wider py-3 text-xs" 
                                onClick={() => setShowCertificate(true)}
                            >
                                View Digital Certificate
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6 pt-8">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="text-2xl font-serif font-bold text-charcoal">Verification Failed</h2>
                            <p className="text-red-500/80">
                                We could not verify this item. Please contact support if you believe this is an error.
                            </p>
                            <Button variant="secondary" onClick={() => setStatus('idle')}>Try Again</Button>
                        </div>
                    )}

                </div>
            </div>

            {/* How It Works Section */}
            <section className="py-20 bg-white border-t border-stone/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-center text-charcoal mb-4">
                            How NFC Authentication Works
                        </h2>
                        <p className="text-center text-navy/70 mb-12 max-w-2xl mx-auto">
                            Every piece comes with a unique NFC chip embedded in the frame. One tap with your phone instantly verifies authenticity—no apps, no hassle.
                        </p>

                        {/* 3 Steps */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-ivory rounded-lg p-6 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Smartphone className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 1</div>
                                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">Tap Your Phone</h3>
                                <p className="text-sm text-navy/70">
                                    Hold your smartphone near the NFC chip on the back of the frame.
                                </p>
                            </div>

                            <div className="bg-ivory rounded-lg p-6 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 2</div>
                                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">Instant Lookup</h3>
                                <p className="text-sm text-navy/70">
                                    Your phone automatically opens our verification page. No app required.
                                </p>
                            </div>

                            <div className="bg-ivory rounded-lg p-6 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 3</div>
                                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">Verified Authentic</h3>
                                <p className="text-sm text-navy/70">
                                    See the product details and authenticity certificate. 100% genuine.
                                </p>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal mb-1 text-sm">Impossible to Counterfeit</h3>
                                    <p className="text-navy/70 text-xs leading-relaxed">
                                        Each NFC chip has a unique encrypted ID that cannot be cloned or duplicated.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal mb-1 text-sm">Lifetime Verification</h3>
                                    <p className="text-navy/70 text-xs leading-relaxed">
                                        Verify authenticity anytime, anywhere, forever. The chip is permanent.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="space-y-4">
                            <h3 className="font-serif text-xl font-bold text-charcoal mb-6">Common Questions</h3>

                            <details className="bg-ivory rounded-lg p-4 group">
                                <summary className="font-bold text-charcoal cursor-pointer text-sm list-none flex items-center justify-between">
                                    Does my phone support NFC?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-3 text-sm leading-relaxed">
                                    Most smartphones made after 2014 have NFC. All iPhones from iPhone 7 onwards support it.
                                </p>
                            </details>

                            <details className="bg-ivory rounded-lg p-4 group">
                                <summary className="font-bold text-charcoal cursor-pointer text-sm list-none flex items-center justify-between">
                                    Can someone copy my NFC chip?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-3 text-sm leading-relaxed">
                                    No. Each chip has a unique encrypted ID that cannot be cloned. Our system would detect duplicates.
                                </p>
                            </details>

                            <details className="bg-ivory rounded-lg p-4 group">
                                <summary className="font-bold text-charcoal cursor-pointer text-sm list-none flex items-center justify-between">
                                    Where is the NFC chip located?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-3 text-sm leading-relaxed">
                                    The NFC chip is embedded in the back of the frame, usually in the bottom right corner with an "NFC" logo.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Certificate Modal */}
            {showCertificate && product && (
                <DigitalCertificateModal
                    certificate={product}
                    onClose={() => setShowCertificate(false)}
                    onOpenFullPhoto={() => setShowFullImage(true)}
                />
            )}

            {/* Full Screen Image Modal */}
            {showFullImage && product && (
                <div 
                    className="fixed inset-0 z-[210] bg-black/95 flex flex-col items-center justify-center animate-in fade-in p-4"
                    onClick={() => setShowFullImage(false)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-[220]"
                        onClick={() => setShowFullImage(false)}
                    >
                        <XCircle className="w-10 h-10" />
                    </button>
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full max-w-5xl object-contain animate-in zoom-in-95 duration-300 cursor-zoom-out" 
                    />
                    <p className="text-white/50 text-sm mt-4 font-mono select-none">Tap anywhere to close</p>
                </div>
            )}
        </div>
    )
}
