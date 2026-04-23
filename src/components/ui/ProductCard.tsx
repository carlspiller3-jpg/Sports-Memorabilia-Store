import { TrustBadge } from "@/components/ui/TrustBadge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    title: string
    price: number
    image: string
    altText?: string
    athlete: string
    type: string
    className?: string
}

export function ProductCard({ title, price, image, altText, athlete, type, className }: ProductCardProps) {
    // Strip SEO suffix
    const displayTitle = title.split(' | ')[0]
    
    // Fix generic athlete tags by extracting from the title
    const genericTags = ["football", "boxing", "rugby", "f1", "tennis", "cricket", "motorsport"]
    let displayAthlete = athlete
    if (!athlete || genericTags.includes(athlete.toLowerCase()) || athlete.length > 25) {
        displayAthlete = displayTitle.split(' Signed')[0]
    }

    return (
        <div className={cn("group flex flex-col h-full relative bg-white border border-stone/20 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 ease-out", className)}>
            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden bg-stone/5 relative">
                <img
                    src={image}
                    alt={altText || title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />


                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <Button className="w-full shadow-lg" size="lg">
                        Quick View
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-gold uppercase line-clamp-1" title={displayAthlete}>{displayAthlete}</p>
                    <h3 className="font-serif text-lg font-medium text-charcoal leading-tight group-hover:text-navy transition-colors line-clamp-3" title={displayTitle}>
                        {displayTitle}
                    </h3>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone/10 mt-auto">
                    <span className="text-charcoal font-medium">£{price.toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}
