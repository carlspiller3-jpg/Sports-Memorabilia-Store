import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { TrustIndicators } from "@/components/home/TrustIndicators"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"

import { WaitlistModal } from "@/components/home/WaitlistModal"

export function HomePage() {
    return (
        <div className="min-h-screen">
            <WaitlistModal />
            <Helmet>
                <title>Sports Memorabilia Store | Premium Authenticated Collectibles</title>
                <meta
                    name="description"
                    content="Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee."
                />
                <meta property="og:title" content="Sports Memorabilia Store | Premium Authenticated Collectibles" />
                <meta property="og:description" content="Luxury gifting experiences people are proud to give. Authenticated sports memorabilia with premium framing." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* Above the Fold: Hero + Trust Bar */}
            <div className="pt-[80px]">
                <Hero />
                <TrustIndicators />
            </div>

            {/* Waitlist Section (Anchor) */}
            <section id="waitlist" className="bg-navy py-20 border-y border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">Be The First To Know</h2>
                    <p className="text-white/60 max-w-2xl mx-auto mb-8 text-lg">
                        Our first collection drops in <strong>January 2026</strong> featuring signed pieces from Messi, Gerrard, and Fury.
                        Stock is strictly limited. Enter your email to get 1 hour early access.
                    </p>
                    <form className="max-w-md mx-auto flex gap-3 flex-col sm:flex-row" onSubmit={(e) => { e.preventDefault(); alert('You are on the list! (Dev Mode)'); }}>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-4 rounded bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                            required
                        />
                        <button type="submit" className="bg-gold text-navy font-bold px-8 py-4 rounded hover:bg-gold/90 transition-colors uppercase tracking-wide">
                            Notify Me
                        </button>
                    </form>
                    <p className="text-white/30 text-xs mt-4">We respect your inbox. No spam. Unsubscribe anytime.</p>
                </div>
            </section>

            {/* Below the Fold Content */}
            <AuthenticitySection />
            <PresentationSection />
        </div>
    )
}
