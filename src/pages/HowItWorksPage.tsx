import { Helmet } from 'react-helmet-async'
import { Shield, Smartphone, CheckCircle, Lock, Zap, Globe } from 'lucide-react'

export function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>How Smart Tags Work | Sports Memorabilia Store</title>
                <meta name="description" content="Learn how smart tags prove our items are real. Tap with your phone to check." />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-navy via-navy/95 to-charcoal text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 rounded-full px-4 py-2 mb-6">
                            <Shield className="w-4 h-4 text-gold" />
                            <span className="text-sm font-medium text-gold">Smart Technology</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                            How Smart Tags Work
                        </h1>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Every item has a smart tag inside the frame. 
                            Tap your phone on it. See right away that it is 100% real. No apps needed.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Process - 3 Steps */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-center text-charcoal mb-12">
                            Verify in <span className="text-gold">3 Easy Steps</span>
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
                                    Hold your phone near the smart tag on the back of the frame. 
                                    Works with any phone.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Zap className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 2</div>
                                <h3 className="font-serif text-xl font-bold text-charcoal mb-4">See the Proof</h3>
                                <p className="text-navy/70 leading-relaxed">
                                    Your phone opens a page. It shows you the proof. 
                                    No need to download any apps. It just works.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10 text-center">
                                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-gold" />
                                </div>
                                <div className="text-sm font-bold text-gold uppercase tracking-wider mb-2">Step 3</div>
                                <h3 className="font-serif text-xl font-bold text-charcoal mb-4">100% Real</h3>
                                <p className="text-navy/70 leading-relaxed">
                                    See the player, the photos, and the proof. 
                                    Your item is 100% real.
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
                            Why Smart Tags are Better Than Paper
                        </h2>
                        <p className="text-center text-navy/70 mb-12 max-w-2xl mx-auto">
                            Paper certificates can be lost or copied. Smart tags are safe. They stay forever. No one can fake them.
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
                                    <h3 className="font-bold text-charcoal mb-2">Cannot Be Faked</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        Each smart tag has a special code. No one can copy it. 
                                        Anyone can copy paper—no one can copy our tags.
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
                                    <h3 className="font-bold text-charcoal mb-2">Stays Forever</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        Check if it is real at any time, from anywhere. 
                                        Even if you lose the box, the tag is safe inside the frame.
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
                                    <h3 className="font-bold text-charcoal mb-2">No Apps Needed</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        Works with the reader already in your phone. 
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
                                    <h3 className="font-bold text-charcoal mb-2">Easy to Sell Later</h3>
                                    <p className="text-navy/70 text-sm leading-relaxed">
                                        If you sell your item later, the new owner can check it instantly. 
                                        This helps you sell it for more money.
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
                            The Smart Tag Technology
                        </h2>

                        <div className="bg-white rounded-lg p-8 shadow-sm border border-stone/10">
                            <div className="space-y-6">
                                <div className="border-l-4 border-gold pl-6">
                                    <h3 className="font-bold text-charcoal mb-2">What is a Smart Tag?</h3>
                                    <p className="text-navy/70 leading-relaxed">
                                        It is the same technology you use to pay with your phone. 
                                        It is very safe and reliable. Every modern phone has it.
                                    </p>
                                </div>

                                <div className="border-l-4 border-gold pl-6">
                                    <h3 className="font-bold text-charcoal mb-2">How We Use It</h3>
                                    <p className="text-navy/70 leading-relaxed">
                                        We put a tiny smart chip inside each frame. It does not need a battery. 
                                        We save the chip ID in our safe system. We link it to the athlete's signature and photos.
                                    </p>
                                </div>

                                <div className="border-l-4 border-gold pl-6">
                                    <h3 className="font-bold text-charcoal mb-2">Safe and Private</h3>
                                    <p className="text-navy/70 leading-relaxed">
                                        The chip only holds one code. It has no personal info. 
                                        When you tap, your phone checks the code with our system. We never track you.
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
                            Common Questions
                        </h2>

                        <div className="space-y-6">
                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Does my phone support smart tags?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    Almost all phones made after 2014 do. All iPhones from iPhone 7 and up support it. 
                                    Most Android phones have it turned on. If you are not sure, check your phone settings.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    What if the smart tag stops working?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    Smart tags last for decades. They do not use batteries and have no moving parts. 
                                    If yours stops working, send us an email. We will fix or replace it for free.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Can someone copy my smart tag?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    No. Each tag has a special code that no one can copy. 
                                    If someone tries, our system will know it is fake.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Do I need internet to check?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    Yes. Your phone needs internet to show the proof page. 
                                    The tag itself does not need internet.
                                </p>
                            </details>

                            <details className="bg-white rounded-lg p-6 shadow-sm border border-stone/10 group">
                                <summary className="font-bold text-charcoal cursor-pointer list-none flex items-center justify-between">
                                    Where is the smart tag?
                                    <span className="text-gold group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-navy/70 mt-4 leading-relaxed">
                                    The tag is inside the back of the frame. It is in the bottom-right corner. 
                                    You will see a small logo. Tap your phone there.
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
                        Ready to Buy Real Signed Items?
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Every item has a lifetime smart tag. Tap to check, and buy with total trust.
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
                            Try the Demo
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
