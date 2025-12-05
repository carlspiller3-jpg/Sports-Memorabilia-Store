import { Helmet } from 'react-helmet-async'
import { Shield, Smartphone, CheckCircle, Lock, Zap, Globe } from 'lucide-react'

export function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>How NFC Authentication Works | Sports Memorabilia Store</title>
                <meta name="description" content="Learn how our NFC digital authentication technology guarantees the authenticity of every piece of sports memorabilia. Tap, verify, and own with confidence." />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-navy via-navy/95 to-charcoal text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-6">
                            <Shield className="w-4 h-4 text-gold" />
                            <span className="text-sm font-medium text-gold">Industry-Leading Technology</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                            How NFC Authentication Works
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Every piece comes with a unique NFC chip embedded in the frame. 
                            One tap with your phone instantly verifies authenticity—no apps, no hassle.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Process - 3 Steps */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-center text-charcoal mb-12">
                            Verify in <span className="text-gold">3 Simple Steps</span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Smartphone className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 1</div>
                                <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Tap Your Phone</h3>
                                <p className="text-navy/70 leading-relaxed">
                                    Hold your smartphone near the NFC chip on the back of the frame. 
                                    Works with any NFC-enabled phone (iPhone or Android).
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 2</div>
                                <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Instant Lookup</h3>
                                <p className="text-navy/70 leading-relaxed">
                                    Your phone automatically opens our verification page. 
                                    No app download required—it just works.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 3</div>
                                <h3 className="font-serif text-xl font-bold text-charcoal mb-4">Verified Authentic</h3>
                                <p className="text-navy/70 leading-relaxed">
                                    See the product details, athlete signature, and authenticity certificate. 
                                    Your item is 100% genuine.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why NFC is Better */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-center text-charcoal mb-4">
                            Why NFC is Better Than Paper Certificates
                        </h2>
                        <p className="text-center text-navy/70 mb-12 max-w-2xl mx-auto">
                            Traditional certificates can be forged, lost, or damaged. NFC technology is permanent, secure, and impossible to fake.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Benefit 1 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal mb-2">Impossible to Counterfeit</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        Each NFC chip has a unique encrypted ID that cannot be cloned or duplicated. 
                                        Paper certificates can be photocopied—NFC chips cannot.
                                    </p>
                                </div>
                            </div>

                            {/* Benefit 2 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <Globe className="w-6 h-6 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal mb-2">Lifetime Verification</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        Verify authenticity anytime, anywhere, forever. Even if you lose the paperwork, 
                                        the NFC chip remains embedded in the frame.
                                    </p>
                                </div>
                            </div>

                            {/* Benefit 3 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <Smartphone className="w-6 h-6 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal mb-2">No Apps Required</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        Works instantly with your phone's built-in NFC reader. 
                                        No downloads, no accounts, no hassle.
                                    </p>
                                </div>
                            </div>

                            {/* Benefit 4 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-gold" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal mb-2">Instant Resale Confidence</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        When you sell your item, the new owner can verify it immediately. 
                                        Increases resale value and buyer trust.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Details */}
            <section className="py-20 bg-gradient-to-br from-navy/5 to-gold/5">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-center text-charcoal mb-12">
                            The Technology Behind It
                        </h2>

                        <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10">
                            <div className="space-y-6">
                                <div className="border-l-4 border-gold pl-6">
                                    <h3 className="font-bold text-charcoal mb-2">What is NFC?</h3>
                                    <p className="text-navy/70 leading-relaxed">
                                        NFC (Near Field Communication) is the same technology used in contactless payments like Apple Pay and Google Pay. 
                                        It's secure, reliable, and built into every modern smartphone.
                                    </p>
                                </div>

                                <div className="border-l-4 border-gold pl-6">
                                    <h3 className="font-bold text-charcoal mb-2">How We Use It</h3>
                                    <p className="text-navy/70 leading-relaxed">
                                        Each frame contains a passive NFC chip (no battery required) programmed with a unique ID. 
                                        This ID is registered in our secure database along with the product details, athlete signature, and provenance.
                                    </p>
                                </div>

                                <div className="border-l-4 border-gold pl-6">
                                    <h3 className="font-bold text-charcoal mb-2">Security & Privacy</h3>
                                    <p className="text-navy/70 leading-relaxed">
                                        The NFC chip only stores a unique ID—no personal information. 
                                        When you tap, your phone sends this ID to our server, which returns the product details. 
                                        We log verification attempts to detect fraud, but we never track your location or identity.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-center text-charcoal mb-12">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-6">
                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Does my phone support NFC?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    Most smartphones made after 2014 have NFC. All iPhones from iPhone 7 onwards support it, 
                                    and most Android phones have it enabled by default. Check your phone's settings if unsure.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    What if the NFC chip stops working?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    NFC chips are extremely durable and have no moving parts or batteries. They're designed to last decades. 
                                    In the unlikely event of a malfunction, contact us with your order number and we'll replace the frame at no cost.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Can someone copy my NFC chip?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    No. Each chip has a unique encrypted ID that cannot be cloned or duplicated. 
                                    Even if someone tried to copy the ID, our system would detect multiple chips with the same ID and flag it as fraud.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Do I need an internet connection to verify?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    Yes, your phone needs an internet connection to look up the product details in our database. 
                                    The NFC chip itself doesn't need internet—it just stores the unique ID.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Where is the NFC chip located?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    The NFC chip is embedded in the back of the frame, usually in the bottom-right corner. 
                                    You'll see a small "NFC" logo indicating where to tap your phone.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-navy to-charcoal text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                        Ready to Own Authenticated Memorabilia?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Every piece comes with lifetime NFC authentication. Tap, verify, and own with complete confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/shop" 
                            className="inline-block bg-gold hover:bg-gold/90 text-charcoal font-bold px-8 py-4 rounded-lg transition-all shadow-lg shadow-gold/20"
                        >
                            Shop Collection
                        </a>
                        <a 
                            href="/verify" 
                            className="inline-block bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-lg transition-all"
                        >
                            Try Verification Demo
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
