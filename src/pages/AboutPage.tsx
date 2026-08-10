import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"
import { usePageSEO } from "@/hooks/usePageSEO"

export function AboutPage() {
    const seo = usePageSEO('about', {
        title: "Our Story | 100% Real Sports Items",
        description: "We sell real signed sports items. We work with the players. Every item has a smart tag and a lifetime guarantee.",
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
                title="Always Real. Guaranteed."
                subtitle="We save the best sports moments. Every item is 100% real."
                backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
            />

            {/* The Philosophy Section */}
            <section className="pt-12 pb-24 bg-ivory relative overflow-hidden flex items-center">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div className="space-y-6 pt-2">
                            <span className="text-gold font-bold tracking-widest text-sm uppercase">Our Promise</span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy leading-[1.1]">
                                Real Items. <br />
                                <span className="italic text-charcoal/80">Safe for You.</span>
                            </h2>
                            <div className="space-y-4 pt-4 max-w-xl">
                                <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                    Most shops sell on guesswork. They print cheap paper certificates at home. They guess if the player signed it. We got tired of it.
                                </p>
                                <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                    We do not guess. We are in the room. We hold the pens. We get every item directly from the player. We stand right there. If we did not see them sign it, we do not sell it. It is that simple.
                                </p>
                                <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                    This is not just a shop. We wanted a better way to collect. Everything is hand-framed. It looks premium. Every item has a smart digital tag that lasts forever.
                                </p>
                             </div>
                            
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-navy/5">
                                <div>
                                    <h4 className="font-serif text-2xl text-navy mb-2">Direct to You</h4>
                                    <p className="text-sm text-navy/60">We work directly with the players. We get every item from them.</p>
                                </div>
                                <div>
                                    <h4 className="font-serif text-2xl text-navy mb-2">Digital Proof</h4>
                                    <p className="text-sm text-navy/60">Every item is saved on our safe list. Proof that stays forever.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative mt-8 lg:mt-0">
                            <div className="aspect-[4/3] lg:aspect-video bg-navy/5 rounded-sm overflow-hidden relative shadow-2xl border-4 border-white max-w-xl">
                                <img
                                    src="/images/athlete-signing.png"
                                    alt="Authentic signature detail"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-gold p-6 shadow-xl rounded-sm hidden md:block border-2 border-white">
                                <div className="text-center">
                                    <span className="block text-3xl font-bold text-navy">100%</span>
                                    <span className="text-[10px] font-bold text-navy/80 uppercase tracking-widest block mt-1">Always Real</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
