import { TrustBadge } from "@/components/ui/TrustBadge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ProductCardProps {
    title: string
    price: number
    image: string
    athlete: string
    type: string
    className?: string
}

export function ProductCard({ title, price, image, athlete, type, className }: ProductCardProps) {
    return (
        <div className={cn("group relative bg-white border border-stone/20 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 ease-out", className)}>
            {/* Image Container */}
            <div className="aspect-[4/5] overflow-hidden bg-stone/5 relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                    <TrustBadge type="authenticated" className="bg-white/90 backdrop-blur-sm shadow-sm" />
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <Button className="w-full shadow-lg" size="lg">
                        Quick View
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-gold uppercase">{athlete}</p>
                    <h3 className="font-serif text-lg font-medium text-charcoal leading-tight group-hover:text-navy transition-colors">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone/10">
                    <span className="text-charcoal font-medium">£{price.toLocaleString()}</span>
                    <span className="text-xs text-stone/60 capitalize">{type}</span>
                </div>
            </div>
        </div>
    )
}
