import { useState, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"
import { WaitlistModal } from "@/components/home/WaitlistModal"
import { TrustIndicators } from "@/components/home/TrustIndicators"
import { supabase } from "@/lib/supabase"

export function HomePage() {
    const [seo, setSeo] = useState({
        title: "SportsSigned | Premium Authenticated Collectibles",
        description: "Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee.",
        ogImage: "https://www.sportssigned.com/og-image.jpg"
    })

    useEffect(() => {
        async function fetchSEO() {
            const { data } = await supabase
                .from('site_pages')
                .select('meta_title, meta_description, og_image')
                .eq('page_key', 'home')
                .single()

            if (data) {
                setSeo({
                    title: data.meta_title || seo.title,
                    description: data.meta_description || seo.description,
                    ogImage: data.og_image || seo.ogImage
                })
            }
        }
        fetchSEO()
    }, [])

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
                            "name": "SportsSigned",
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
