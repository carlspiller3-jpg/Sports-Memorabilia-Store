import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"
import { ShieldCheck, Frame, Truck, Heart, PenTool, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"

export function AboutPage() {
    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>Our Story | The New Standard in Authentic Memorabilia</title>
                <meta name="description" content="We are redefining sports memorabilia. By working directly with athletes and utilizing blockchain verification, we guarantee 100% authenticity for every signed shirt, boot, and photo." />
                <meta name="keywords" content="authentic sports memorabilia, signed football shirts, blockchain authentication, sports history, conservation framing" />
            </Helmet>

            <PageHero
                title="More Than Memorabilia."
                subtitle="We don't just sell items. We preserve the moments that stop the world."
                backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
            />

            {/* The Vision Section */}
            <section className="py-20 md:py-32 bg-ivory relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <span className="text-gold font-bold tracking-widest text-sm uppercase">The Vision</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight">
                                Restoring Trust to <br />
                                <span className="italic text-charcoal/80">The Beautiful Game.</span>
                            </h2>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                For too long, the sports memorabilia market has been shadowed by doubt. Fakes, vague certificates, and questionable histories have tainted the passion of collecting.
                                <br /><br />
                                <strong>We believe that owning a piece of history should feel as electric as the moment itself.</strong>
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                We founded the Sports Memorabilia Store with a singular obsession: <strong>Certainty</strong>. We wanted to build the sanctuary we always wished existed—a place where a fan could purchase a signed Messi shirt or a framed Gerrard photo and know, without a shadow of a doubt, that it is the real deal.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] bg-navy/5 rounded-sm overflow-hidden relative shadow-2xl border-8 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1549633036-bcd8207fa025?q=80&w=1956&auto=format&fit=crop"
                                    alt="Close up of a signature"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <p className="font-serif text-2xl italic">"Authenticity isn't a feature.<br />It's our entire foundation."</p>
                                </div>
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-gold p-6 shadow-xl rounded-sm hidden md:block">
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-navy">100%</span>
                                    <span className="text-xs font-bold text-navy/80 uppercase tracking-widest">Lifetime Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Process - Dark Section */}
            <section className="py-24 bg-navy text-ivory relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold">The Ironclad Standard</h2>
                        <p className="text-ivory/60 text-lg font-light">How we guarantee what others can only promise.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="space-y-6 relative group">
                            <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                                <PenTool className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold">1. In The Room</h3>
                            <p className="text-ivory/60 leading-relaxed">
                                We do not buy from the secondary market. We work directly with athletes and their certified agents. We are in the room, witnessing the pen hit the paper. If we didn't see it signed, we don't sell it.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-6 relative group">
                            <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold">2. Digital Proof</h3>
                            <p className="text-ivory/60 leading-relaxed">
                                Paper certificates can be forged. Blockchain cannot. Every item comes with a digital discrete twin—a permanent, immutable record of ownership and authenticity that lives on the blockchain.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-6 relative group">
                            <div className="w-16 h-16 border border-gold/30 rounded-full flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                                <Frame className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold">3. Museum Grade</h3>
                            <p className="text-ivory/60 leading-relaxed">
                                A signature fades if mistreated. We utilize conservation-grade materials, including UV-protective glass and acid-free mounts, ensuring your investment stands the test of time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="bg-white py-24 border-b border-stone/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-gold font-bold tracking-widest text-xs uppercase">Why We Lead</span>
                        <h2 className="text-3xl font-serif font-bold text-navy mt-2">Built for the Modern Collector</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="space-y-4 text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy group-hover:bg-navy group-hover:text-gold transition-colors">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-navy">Verified Forever</h3>
                            <p className="text-stone/60 text-sm leading-relaxed">
                                Your ownership is secured by unique holographic tagging and NFC technology.
                            </p>
                        </div>
                        <div className="space-y-4 text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy group-hover:bg-navy group-hover:text-gold transition-colors">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-navy">Curated Passion</h3>
                            <p className="text-stone/60 text-sm leading-relaxed">
                                We don't stock everything. We curate only the most significant pieces from the greatest icons.
                            </p>
                        </div>
                        <div className="space-y-4 text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy group-hover:bg-navy group-hover:text-gold transition-colors">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-navy">Global Logistics</h3>
                            <p className="text-stone/60 text-sm leading-relaxed">
                                From our vault to your wall. Fully insured global shipping with custom protective packaging.
                            </p>
                        </div>
                        <div className="space-y-4 text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy group-hover:bg-navy group-hover:text-gold transition-colors">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-navy">Secure Investment</h3>
                            <p className="text-stone/60 text-sm leading-relaxed">
                                Memorabilia is an asset class. We ensure your asset's provenance is unassailable.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-24 bg-ivory text-center border-t border-stone/10">
                <div className="container mx-auto px-4 space-y-8">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy max-w-2xl mx-auto leading-tight">
                        Ready to Own a Piece of <span className="text-gold">History?</span>
                    </h2>
                    <p className="text-lg text-charcoal/60 max-w-xl mx-auto font-light">
                        Explore our vault of authentically signed shirts, boots, and photographs from the legends of the game.
                    </p>
                    <Link to="/shop">
                        <Button size="lg" className="bg-navy text-white hover:bg-navy/90 px-10 h-16 text-lg font-bold shadow-xl shadow-navy/20">
                            View The Collection
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
