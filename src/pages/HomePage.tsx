import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { ProductCategories } from "@/components/home/ProductCategories"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"
import { ValuePropositions } from "@/components/home/ValuePropositions"

export function HomePage() {
    return (
        <div className="min-h-screen">
            <Helmet>
                <title>The Sports Memorabilia Store | Premium Authenticated Collectibles</title>
                <meta
                    name="description"
                    content="Premium authenticated sports memorabilia with museum-grade framing. Every piece comes with a Certificate of Authenticity and lifetime guarantee."
                />
                <meta property="og:title" content="The Sports Memorabilia Store | Premium Authenticated Collectibles" />
                <meta property="og:description" content="Luxury gifting experiences people are proud to give. Authenticated sports memorabilia with museum-grade framing." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            <Hero />
            <FeaturedProducts />
            <ProductCategories />
            <AuthenticitySection />
            <PresentationSection />
            <ValuePropositions />
        </div>
    )
}
