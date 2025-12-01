import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { ShieldCheck, Loader2, XCircle } from "lucide-react"
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
        // Simulate API call / Blockchain lookup
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
    }

    return (
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
    )
}
