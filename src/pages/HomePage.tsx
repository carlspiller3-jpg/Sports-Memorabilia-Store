import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"
import { WaitlistModal } from "@/components/home/WaitlistModal"
import { TrustIndicators } from "@/components/home/TrustIndicators"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { usePageSEO } from "@/hooks/usePageSEO"

export function HomePage() {
    const seo = usePageSEO('home', {
        title: "Our Story | Sports Memorabilia Store",
        description: "We are setting the new standard in sports memorabilia. Learn about our commitment to authenticity, quality, and the 'Unboxing Experience'.",
        ogImage: "https://www.sportssigned.com/logo.png"
    })

    return (
        <div className="min-h-screen">
            <WaitlistModal />
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
                <meta property="og:title" content={seo.title} />
                <meta property="og:description" content={seo.description} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={seo.ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={seo.title} />
                <meta name="twitter:description" content={seo.description} />
                <meta name="twitter:image" content={seo.ogImage} />
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "http://schema.org",
                            "@type": "OnlineStore",
                            "name": "Sports Memorabilia Store",
                            "url": "https://www.sportssigned.com",
                            "logo": "https://www.sportssigned.com/logo-transparent.png",
                            "description": "${seo.description}",
                            "image": "${seo.ogImage}",
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
            <div className="pt-32 min-h-screen lg:h-screen flex flex-col justify-between">
                <div className="flex-1 min-h-0 relative">
                    <Hero />
                </div>
                <TrustIndicators />
            </div>

            <FeaturedProducts />

            {/* Below the Fold Content */}
            <PresentationSection />
            <AuthenticitySection />
        </div>
    )
}
