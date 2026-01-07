import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"

export function AboutPage() {
    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>Our Story | The New Standard in Authentic Memorabilia</title>
                <meta name="description" content="We are redefining sports memorabilia. By working directly with athletes and utilising blockchain verification, we guarantee 100% authenticity for every signed shirt, boot, and photo." />
                <meta name="keywords" content="authentic sports memorabilia, signed football shirts, blockchain authentication, sports history, conservation framing" />
            </Helmet>

            <PageHero
                title="Not Just Another Sports Memorabilia Company."
                subtitle="Preserving historic moments with the elegance of luxury gifting."
                backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
            />

            {/* The Philosophy Section */}
            <section className="py-12 md:py-24 bg-ivory relative overflow-hidden min-h-[60vh] flex items-center">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6 pt-2">
                            <span className="text-gold font-bold tracking-widest text-sm uppercase">The Philosophy</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight">
                                Restoring Trust to <br />
                                <span className="italic text-charcoal/80">The Beautiful Game.</span>
                            </h2>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                Trust is the currency of history. In an industry often diluted by uncertainty, <strong>Sports Signed</strong> stands as the absolute authority.
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                We do not deal in probability. We deal in proof. By strictly controlling the chain of custody—from the athlete's hand to the collector's wall—we eliminate doubt entirely.
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                This is not just a marketplace. It is the new global standard for provenance.
                            </p>
                        </div>
                        <div className="relative mt-8 lg:mt-0">
                            <div className="aspect-[4/3] lg:aspect-video bg-navy/5 rounded-sm overflow-hidden relative shadow-2xl border-4 border-white max-w-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1549633036-bcd8207fa025?q=80&w=1956&auto=format&fit=crop"
                                    alt="Close up of a signature"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-gold p-4 shadow-xl rounded-sm hidden md:block">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-navy">100%</span>
                                    <span className="text-[10px] font-bold text-navy/80 uppercase tracking-widest">Lifetime Guarantee</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
