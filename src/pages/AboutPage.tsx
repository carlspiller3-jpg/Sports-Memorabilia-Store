import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"
import { usePageSEO } from "@/hooks/usePageSEO"

export function AboutPage() {
    const seo = usePageSEO('about', {
        title: "Our Story | The New Standard in Authentic Memorabilia",
        description: "We are redefining sports memorabilia. By working directly with athletes and utilising blockchain verification, we guarantee 100% authenticity for every signed shirt, boot, and photo.",
        ogImage: "https://www.sportssigned.com/og-image.jpg"
    })

    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:image" content={seo.ogImage} />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                <meta name="twitter:image" content={seo.ogImage} />
            </Helmet>

            <PageHero
                title="Setting the New Standard."
                subtitle="Preserving historic moments with the precision of a luxury gallery."
                backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
            />

            {/* The Philosophy Section */}
            <section className="py-12 md:py-24 bg-ivory relative overflow-hidden flex items-center">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 pt-2">
                            <span className="text-gold font-bold tracking-widest text-sm uppercase">The Authority</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight">
                                Restoring Trust to <br />
                                <span className="italic text-charcoal/80">Collecting History.</span>
                            </h2>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                Authenticity is not an opinion. In an industry diluted by uncertainty and questionable certificates, the <strong>Sports Memorabilia Store</strong> stands as the definitive source.
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                We do not rely on probability. We rely on proof. By strictly controlling the chain of custody—from the moment the ink touches the fabric until it reaches your hands—we eliminate doubt.
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                This is more than a store. This is the new global benchmark for provenance, backed by digital ledgers and lifetime guarantees.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-navy/5">
                                <div>
                                    <h4 className="font-serif text-2xl text-navy mb-2">Direct Access</h4>
                                    <p className="text-sm text-navy/60">We work directly with athletes and clubs, ensuring every piece is sourced from the source.</p>
                                </div>
                                <div>
                                    <h4 className="font-serif text-2xl text-navy mb-2">Digital Proof</h4>
                                    <p className="text-sm text-navy/60">Every item is registered on our immutable ledger. Proof that never fades.</p>
                                </div>
                            </div>
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
                            <div className="absolute -bottom-4 -right-4 bg-gold p-6 shadow-xl rounded-sm hidden md:block border-2 border-white">
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-navy">100%</span>
                                    <span className="text-[10px] font-bold text-navy/80 uppercase tracking-widest block mt-1">Authenticity Ledger</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
