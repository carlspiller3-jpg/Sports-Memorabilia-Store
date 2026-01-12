import { Truck, RotateCcw, ShieldCheck } from "lucide-react"

export function ShippingReturns() {
    return (
        <div className="min-h-screen bg-ivory pt-28 pb-12 lg:pt-36 lg:pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">Shipping & Returns</h1>
                    <p className="text-navy/60">Fast, insured delivery and peace of mind.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Shipping */}
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 space-y-6">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                            <Truck className="w-6 h-6 text-gold" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-charcoal">Shipping Policy</h2>
                        <div className="space-y-4 text-navy/80">
                            <p>
                                We offer <strong>Free Express Shipping</strong> on all UK orders over £100. All items are fully insured during transit.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex justify-between border-b border-stone/10 pb-2">
                                    <span>UK Standard Delivery</span>
                                    <span className="font-bold">3-5 Days</span>
                                </li>
                                <li className="flex justify-between border-b border-stone/10 pb-2">
                                    <span>UK Express Delivery</span>
                                    <span className="font-bold">Next Day</span>
                                </li>
                                <li className="flex justify-between border-b border-stone/10 pb-2">
                                    <span>International Shipping</span>
                                    <span className="font-bold">5-10 Days</span>
                                </li>
                            </ul>
                            <p className="text-sm text-stone/60 pt-2">
                                *Orders placed before 2pm GMT are dispatched same day.
                            </p>
                        </div>
                    </div>

                    {/* Returns */}
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 space-y-6">
                        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                            <RotateCcw className="w-6 h-6 text-gold" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-charcoal">Return Policy</h2>
                        <div className="space-y-4 text-navy/80">
                            <p>
                                We want you to be completely satisfied with your purchase. We offer a <strong>14-Day Money Back Guarantee</strong> on all items.
                            </p>
                            <div className="space-y-2">
                                <h3 className="font-bold text-charcoal">How to Return:</h3>
                                <ol className="list-decimal pl-5 space-y-2 text-sm">
                                    <li>Contact our support team at <a href="mailto:support@sportssigned.com" className="text-gold hover:underline">support@sportssigned.com</a> to initiate a return.</li>
                                    <li>Pack the item securely in its original packaging.</li>
                                    <li>Ship the item back to us using a tracked service.</li>
                                    <li>Refunds are processed within 5 business days of receipt.</li>
                                </ol>
                            </div>
                            <div className="flex items-center gap-2 bg-stone/5 p-3 rounded-sm text-sm">
                                <ShieldCheck className="w-4 h-4 text-gold" />
                                <span>Items must be returned in original condition with all tags intact.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
