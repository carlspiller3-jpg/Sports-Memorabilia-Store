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
                            More Than Just Memorabilia
                        </h2>
                        <p className="text-lg text-charcoal/80 leading-relaxed">
                            Sports Memorabilia Store was founded on a simple belief: <span className="font-semibold text-navy">true fans deserve true authenticity.</span>
                        </p>
                        <p className="text-lg text-charcoal/80 leading-relaxed">
                            In a market flooded with questionable items and paper certificates that are easily forged, we set out to build a new standard. We combine direct relationships with athletes, premium museum-quality framing, and cutting-edge NFC technology to create the most trusted destination for sports collectors.
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
                            <h3 className="font-serif text-xl font-bold text-navy">100% Authenticated</h3>
                            <p className="text-stone/80">
                                Every single item is verified with our proprietary NFC technology. No paper certificates, just instant digital proof.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <Frame className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Premium Framing</h3>
                            <p className="text-stone/80">
                                We use UV-protective glass and acid-free mounts to ensure your piece of history lasts a lifetime.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Fan Focused</h3>
                            <p className="text-stone/80">
                                We are fans first. We understand the emotion behind every signature and the story behind every game.
                            </p>
                        </div>
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-navy">Secure Delivery</h3>
                            <p className="text-stone/80">
                                Fully insured global shipping in custom-designed protective packaging.
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
