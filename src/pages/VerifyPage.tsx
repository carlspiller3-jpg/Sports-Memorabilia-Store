import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { ShieldCheck, Loader2, XCircle, Smartphone, Zap, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { TrustBadge } from "@/components/ui/TrustBadge"

export function VerifyPage() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [product, setProduct] = useState<any>(null)

    // Simulate NFC scan handling
    useEffect(() => {
        const tagId = searchParams.get('tag_id')
        if (tagId) {
            handleVerify(tagId)
        }
    }, [searchParams])

    const handleVerify = async (tagId: string) => {
        setStatus('loading')

        try {
            // TODO: Replace with actual API call to Supabase or Shopify Storefront API
            // Example Supabase implementation:
            /*
            const { data, error } = await supabase
                .from('nfc_tags')
                .select('*, products(*)')
                .eq('tag_id', tagId)
                .single()
            
            if (error) throw error
            setProduct(mapDatabaseToProduct(data))
            */

            // Simulation for Demo
            setTimeout(() => {
                if (tagId === 'error') {
                    setStatus('error')
                } else {
                    setProduct({
                        title: "Lionel Messi Signed Argentina 2022 Home Shirt",
                        date: "2022-12-18",
                        location: "Lusail Stadium, Qatar",
                        contract: "0x123...abc",
                        tokenId: "456",
                        image: "https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop"
                    })
                    setStatus('success')
                }
            }, 2000)
        } catch (error) {
            console.error('Verification failed:', error)
            setStatus('error')
        }
    }

    return (
        <div className="min-h-screen bg-ivory">
            {/* Verification Interface */}
            <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
                <div className="max-w-md w-full space-y-8 text-center">

                    {status === 'idle' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-10 h-10 text-gold" />
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-charcoal">Verify Authenticity</h1>
                            <p className="text-navy/60">
                                Scan your item's NFC tag or enter the Certificate ID manually to verify its authenticity on the blockchain.
                            </p>
                            <div className="pt-4">
                                <Button size="lg" className="w-full" onClick={() => handleVerify('demo')}>
                                    Simulate NFC Scan
                                </Button>
                            </div>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="space-y-6">
                            <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto" />
                            <p className="text-navy/60 font-medium">Verifying on Blockchain...</p>
                        </div>
                    )}

                    {status === 'success' && product && (
                        <div className="bg-white p-8 rounded-sm shadow-xl border border-stone/20 space-y-6 animate-in zoom-in-95 duration-500">
                            <div className="flex justify-center">
                                <TrustBadge type="verified" className="bg-green-50 text-green-700 border-green-200" />
                            </div>

                            <div className="aspect-square rounded-sm overflow-hidden bg-stone/5">
                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
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

                            <Button className="w-full" variant="outline">View Digital Certificate</Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
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
                                    The NFC chip is embedded in the back of the frame, usually in the bottom-right corner with an "NFC" logo.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
