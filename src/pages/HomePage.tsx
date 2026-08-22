import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { NFCVerificationHub } from "@/components/home/NFCVerificationHub"
import { CorporateGiftingSection } from "@/components/home/CorporateGiftingSection"
import { WaitlistModal } from "@/components/home/WaitlistModal"
import { usePageSEO } from "@/hooks/usePageSEO"

export function HomePage() {
    const seo = usePageSEO('home', {
        title: "Sports Memorabilia Store | Authentic Signed Collectibles",
        description: "Official signed sports memorabilia. Direct athlete access, handcrafted UK framing with clear Perspex glaze, and smart NFC tag verification.",
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

            {/* 1. Hero Section (Above the Fold) */}
            <div className="pt-24 min-h-screen lg:min-h-[600px] flex flex-col">
                <div className="flex-1 min-h-0 relative">
                    <Hero />
                </div>
            </div>

            {/* 2. The 4 Pillar Trust Engine (Positioned BEFORE Featured Products) */}
            <AuthenticitySection />

            {/* 3. Featured Signed Collectibles */}
            <FeaturedProducts />

            {/* 4. Physical Framing and Packaging Breakdown */}
            <PresentationSection />

            {/* 5. Live NFC Verification Demo Hub */}
            <NFCVerificationHub />

            {/* 6. B2B Corporate Gifting and Executive Accounts */}
            <CorporateGiftingSection />
        </div>
    )
}
