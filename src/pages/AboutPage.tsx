import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"
import { ShieldCheck, Frame, Truck, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"

export function AboutPage() {
    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>About Us | Sports Memorabilia Store</title>
                <meta name="description" content="Our story: Preserving sports history with 100% authentic, NFC-verified memorabilia and premium framing." />
            </Helmet>

            <PageHero
                title="Our Story"
                subtitle="Preserving the moments that define sporting history."
                backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
            />

            {/* Mission Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
                            The New Standard
                        </h2>
                        <p className="text-lg text-charcoal/80 leading-relaxed font-light">
                            It started with a simple question: <em>"Is this real?"</em>
                        </p>
                        <p className="text-lg text-charcoal/80 leading-relaxed font-light">
                            We were fans first. Like you, we spent years hunting for pieces of history—that signed shirt from the '99 Final, the glove from the big fight. We wanted a physical link to the moments that shaped us. But the industry was broken. It was flooded with fakes, confusing paperwork, and cheap frames that focused on profit rather than preservation.
                        </p>
                        <p className="text-lg text-charcoal/80 leading-relaxed font-light">
                            We built SportsSigned to fix it. To replace doubt with certainty.
                        </p>
                        <p className="text-lg text-charcoal/80 leading-relaxed font-light">
                            We stripped away the middlemen. We go directly to the source, organizing private signings with the icons themselves. We witness every signature. Then, we lock that moment in time using state-of-the-art NFC digital passports that prove authenticity forever. Finally, we frame it with museum-grade materials, because history deserves to be preserved.
                        </p>
                        <p className="text-lg text-charcoal/80 leading-relaxed font-light font-medium italic text-navy">
                            This isn't just memorabilia. It's the new gold standard for the moments that matter.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="bg-white py-16 md:py-24 border-y border-stone/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Absolute Authenticity</h3>
                            <p className="text-stone/80 text-sm leading-relaxed">
                                Every item is verified via blockchain. No paper certificates. Just instant, immutable digital proof.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <Frame className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Conservation Grade</h3>
                            <p className="text-stone/80 text-sm leading-relaxed">
                                We utilize UV-protective glass and acid-free mounts to ensure your investment is preserved for generations.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Unrivaled Access</h3>
                            <p className="text-stone/80 text-sm leading-relaxed">
                                We curate opportunities. Our relationships allow us to bring you closer to the icons of sport.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Secure Logistics</h3>
                            <p className="text-stone/80 text-sm leading-relaxed">
                                Fully insured, white-glove shipping in custom protective packaging. Global delivery without compromise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-navy text-ivory text-center">
                <div className="container mx-auto px-4 space-y-8">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold">
                        Start Your Collection
                    </h2>
                    <p className="text-lg text-ivory/80 max-w-2xl mx-auto">
                        Discover our curated selection of signed shirts, boots, photos, and more.
                    </p>
                    <Link to="/shop">
                        <Button size="lg" className="bg-gold text-navy hover:bg-gold/90 px-8 h-14 text-lg font-bold">
                            View Collection
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
