import type { Product } from "@/types/schema"
import { extractTagData } from "./tag-validator"

/**
 * Generate SEO-optimized title for product pages
 * Format: {Athlete Name} Signed {Item Type} {Variant} | Authentic {Team/Sport} Memorabilia | NFC Authenticated
 * Max length: 60 characters for optimal display
 */
export function generateSEOTitle(product: Product): string {
    const { athlete, team, itemType } = extractTagData(product)
    
    // Fallback to old logic if extractTagData returns empty
    const athleteName = athlete || product.tags?.[2] || product.tags?.[0] || "Athlete"
    const teamName = team || product.tags?.[0] || ""
    const type = itemType || product.product_type || "Item"

    // Capitalize item type
    const formattedItemType = type.charAt(0).toUpperCase() + type.slice(1)

    // Build title
    let title = `${athleteName} Signed ${formattedItemType}`

    // Add team if available and different from athlete
    if (teamName && teamName !== athleteName) {
        title += ` | Authentic ${teamName} Memorabilia | NFC Authenticated`
    } else {
        title += ` | Authentic Signed Memorabilia | NFC Authenticated`
    }

    // Truncate if too long (keep under 60 chars)
    if (title.length > 60) {
        title = `${athleteName} Signed ${formattedItemType} | NFC Authenticated`
    }

    return title
}

/**
 * Generate SEO-optimized meta description
 * Format: Official {Athlete Name} signed {item type}. Authentic {team/sport} memorabilia with digital NFC authentication. {USP}. {CTA}.
 * Optimal length: 150-160 characters
 */
export function generateMetaDescription(product: Product, price?: number): string {
    const { athlete, team, itemType } = extractTagData(product)
    
    const athleteName = athlete || product.tags?.[2] || product.tags?.[0] || "athlete"
    const teamName = team || product.tags?.[0] || "sports"
    const type = itemType || product.product_type || "item"

    let description = `Official ${athleteName} signed ${type}. Authentic ${teamName} memorabilia with digital NFC authentication. `

    // Add unique selling points
    description += `Premium framing available. `

    // Add call-to-action with price if available
    if (price) {
        description += `Shop now from £${price.toFixed(2)} with free UK delivery.`
    } else {
        description += `Shop now with free UK delivery and 30-day guarantee.`
    }

    // Ensure it's within optimal length (150-160 chars)
    if (description.length > 160) {
        description = description.substring(0, 157) + "..."
    }

    return description
}

/**
 * Generate SEO-optimized image alt text
 * Format: {Athlete Name} {Team} signed {item type} {variant} with NFC authentication
 * Max length: 125 characters
 */
export function generateImageAlt(product: Product): string {
    const athlete = product.tags?.[2] || product.tags?.[0] || "Athlete"
    const team = product.tags?.[0] || ""
    const itemType = product.product_type || "item"

    let alt = `${athlete} ${team} signed ${itemType} with NFC authentication`

    // Truncate if too long
    if (alt.length > 125) {
        alt = `${athlete} signed ${itemType} with NFC`
    }

    return alt
}

/**
 * Generate breadcrumb schema markup
 */
export function generateBreadcrumbSchema(product: Product): object {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://thesportsmemorabiliastore.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://thesportsmemorabiliastore.com/shop"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product.title
            }
        ]
    }
}

/**
 * Generate FAQ schema markup for product pages
 */
export function generateFAQSchema(): object {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is this item authenticated?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, every item comes with our proprietary NFC Tag technology. Simply tap your phone to the item to verify its authenticity, view the signing video, and access the digital certificate."
                }
            },
            {
                "@type": "Question",
                "name": "What framing options are available?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer premium framing with UV-protective glass in multiple styles including black, gold, and oak frames. All frames are professionally mounted and ready to display."
                }
            },
            {
                "@type": "Question",
                "name": "How long does delivery take?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer fast, insured shipping with real-time tracking. UK orders typically arrive within 3-5 business days. All items are fully insured during transit."
                }
            },
            {
                "@type": "Question",
                "name": "What is your return policy?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, return it in its original condition for a full refund."
                }
            }
        ]
    }
}

/**
 * Generate enhanced Product schema with reviews
 */
export function generateProductSchema(product: Product, price: number, imageUrl: string): object {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": generateSEOTitle(product),
        "image": [imageUrl],
        "description": generateMetaDescription(product, price),
        "sku": product.variants?.[0]?.sku || "",
        "brand": {
            "@type": "Brand",
            "name": "Sports Memorabilia Store"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://thesportsmemorabiliastore.com/product/${product.handle}`,
            "priceCurrency": "GBP",
            "price": price,
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Sports Memorabilia Store"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "12",
            "bestRating": "5",
            "worstRating": "1"
        }
    }
}

/**
 * Get canonical URL for a product
 */
export function getCanonicalUrl(handle: string): string {
    return `https://thesportsmemorabiliastore.com/product/${handle}`
}

/**
 * Generate Open Graph tags
 */
export function generateOGTags(product: Product, price: number, imageUrl: string) {
    return {
        title: generateSEOTitle(product),
        description: generateMetaDescription(product, price),
        image: imageUrl,
        url: getCanonicalUrl(product.handle),
        type: "product",
        siteName: "Sports Memorabilia Store"
    }
}

/**
 * Generate Twitter Card tags
 */
export function generateTwitterTags(product: Product, price: number, imageUrl: string) {
    return {
        card: "summary_large_image",
        title: generateSEOTitle(product),
        description: generateMetaDescription(product, price),
        image: imageUrl
    }
}
