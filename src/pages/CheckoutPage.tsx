import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function CheckoutPage() {
    return (
        <div className="min-h-screen bg-ivory py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl font-serif font-bold text-charcoal mb-8 text-center">Secure Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Checkout Form */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Express Checkout */}
                        <div className="bg-white p-6 rounded-sm border border-stone/20 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Express Checkout</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-2 bg-black text-white h-12 rounded-sm font-medium hover:opacity-90 transition-opacity">
                                    <span className="font-bold"> Pay</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-white border border-stone/30 text-charcoal h-12 rounded-sm font-medium hover:bg-stone/5 transition-colors">
                                    <span className="font-bold text-blue-500">G</span>
                                    <span className="font-bold text-red-500">o</span>
                                    <span className="font-bold text-yellow-500">o</span>
                                    <span className="font-bold text-blue-500">g</span>
                                    <span className="font-bold text-green-500">l</span>
                                    <span className="font-bold text-red-500">e</span>
                                    <span className="ml-1 text-stone/60">Pay</span>
                                </button>
                            </div>
                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-stone/20"></div>
                                <span className="flex-shrink-0 mx-4 text-stone/40 text-xs uppercase">Or pay with card</span>
                                <div className="flex-grow border-t border-stone/20"></div>
                            </div>
                        </div>

                        {/* Shipping Form (Mock) */}
                        <div className="bg-white p-6 rounded-sm border border-stone/20 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Shipping Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="border border-stone/20 p-3 rounded-sm w-full" />
                                <input type="text" placeholder="Last Name" className="border border-stone/20 p-3 rounded-sm w-full" />
                                <input type="email" placeholder="Email" className="border border-stone/20 p-3 rounded-sm w-full col-span-2" />
                                <input type="text" placeholder="Address" className="border border-stone/20 p-3 rounded-sm w-full col-span-2" />
                                <input type="text" placeholder="City" className="border border-stone/20 p-3 rounded-sm w-full" />
                                <input type="text" placeholder="Postcode" className="border border-stone/20 p-3 rounded-sm w-full" />
                            </div>
                            <Button size="lg" className="w-full mt-4">Continue to Payment</Button>
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-sm border border-stone/20 shadow-sm space-y-4 sticky top-24">
                            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Order Summary</h3>

                            <div className="flex gap-4 py-4 border-b border-stone/10">
                                <div className="w-16 h-16 bg-stone/5 rounded-sm overflow-hidden flex-shrink-0">
                                    <img src="https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-serif text-sm font-bold text-charcoal line-clamp-2">Lionel Messi Signed Argentina 2022 Home Shirt</h4>
                                    <p className="text-xs text-navy/60 mt-1">Black Frame</p>
                                </div>
                                <span className="font-medium text-sm">£349.99</span>
                            </div>

                            <div className="space-y-2 pt-2 text-sm">
                                <div className="flex justify-between text-navy/70">
                                    <span>Subtotal</span>
                                    <span>£349.99</span>
                                </div>
                                <div className="flex justify-between text-navy/70">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-charcoal text-lg pt-2 border-t border-stone/10">
                                    <span>Total</span>
                                    <span>£349.99</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 text-xs text-navy/60 bg-stone/5 p-3 rounded-sm">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-gold" />
                                    <span>Secure SSL Encryption. Authenticity Guaranteed.</span>
                                </div>
                                <div className="text-[10px] text-center pt-1 border-t border-stone/10 mt-1">
                                    By placing an order, you agree to our <a href="/terms" className="underline hover:text-navy">Terms</a> and <a href="/privacy" className="underline hover:text-navy">Privacy Policy</a>.
                                </div>
                                <div className="text-[10px] text-center pt-1 border-t border-stone/10 mt-1 text-navy/50">
                                    International orders: Customer is responsible for all customs duties, import taxes, and tariffs.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
