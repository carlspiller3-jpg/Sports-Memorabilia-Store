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
                title="Not Just Another Sports Memorabilia Company."
                subtitle="Preserving historic moments with the elegance of luxury gifting."
                backgroundImage="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
            />

            {/* The Vision Section */}
            <section className="py-8 md:py-16 bg-ivory relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6 pt-2">
                            <span className="text-gold font-bold tracking-widest text-sm uppercase">The Vision</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-navy leading-tight">
                                Restoring Trust to <br />
                                <span className="italic text-charcoal/80">The Beautiful Game.</span>
                            </h2>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                The memorabilia industry has a trust problem. Fakes are everywhere, and certificates of authenticity are often meaningless.
                                <br /><br />
                                <strong>We built this store to fix that.</strong>
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                Our approach is simple: absolute proof. We don't guess, and we don't take risks. We only stock items where we can trace the provenance directly to the source.
                            </p>
                            <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                                We wanted to build the store we always wanted to shop at—a place where you can buy a piece of sporting history and know, 100%, that it is the real deal.
                            </p>
                        </div>
                        <div className="relative mt-4 lg:mt-0">
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
