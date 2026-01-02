import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"

import { WaitlistModal } from "@/components/home/WaitlistModal"


import { TrustIndicators } from "@/components/home/TrustIndicators"

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
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "http://schema.org",
                            "@type": "OnlineStore",
                            "name": "Sports Memorabilia Store",
                            "url": "https://www.sportssigned.com",
                            "logo": "https://www.sportssigned.com/logo-transparent.png",
                            "description": "Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee.",
                            "image": "https://www.sportssigned.com/og-image.jpg",
                            "priceRange": "£££",
                            "address": {
                                "@type": "PostalAddress",
                                "addressCountry": "GB",
                                "addressLocality": "London"
                            }
                        }
                    `}
                </script>
            </Helmet>

            {/* Above the Fold: Hero + Trust Bar */}
            <div className="pt-24 min-h-screen lg:h-screen flex flex-col justify-between">
                <div className="flex-1 min-h-0 relative">
                    <Hero />
                </div>
                <TrustIndicators />
            </div>

            {/* Below the Fold Content */}
            <PresentationSection />
            <AuthenticitySection />
        </div>
    )
}
