import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { TrustIndicators } from "@/components/home/TrustIndicators"
import { ProductCategories } from "@/components/home/ProductCategories"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"
import { ValuePropositions } from "@/components/home/ValuePropositions"

export function HomePage() {
    return (
        <div className="min-h-screen">
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

            <div className="flex flex-col min-h-[calc(100vh-64px)]"> {/* Subtract header height */}
                <div className="flex-1 flex flex-col">
                     <Hero />
                </div>
                <TrustIndicators />
            </div>
        </div>
    )
}
