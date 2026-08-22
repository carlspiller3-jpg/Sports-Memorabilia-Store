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
    status?: 'active' | 'archived'
}

export function ProductCard({ title, price, image, altText, athlete, type, className, status = 'active' }: ProductCardProps) {
    const isArchived = status === 'archived'

    return (
        <div className={cn(
            "group flex flex-col h-full relative bg-white border border-stone/20 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-500 ease-out",
            isArchived && "opacity-90",
            className
        )}>
            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden bg-stone/5 relative">
                <img
                    src={image}
                    alt={altText || title}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                        isArchived && "grayscale contrast-125"
                    )}
                />

                {/* Direct Spec Badges Overlay */}
                {!isArchived && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        <span className="bg-navy/90 text-gold text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs backdrop-blur-sm border border-gold/30">
                            NFC Tagged
                        </span>
                        <span className="bg-white/90 text-navy text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs backdrop-blur-sm border border-navy/10">
                            Framed in UK
                        </span>
                    </div>
                )}

                {isArchived && (
                    <div className="absolute inset-0 bg-navy/20 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 border border-navy/10 shadow-xl">
                            <p className="text-[10px] font-bold tracking-[0.3em] text-navy uppercase">Secured</p>
                        </div>
                    </div>
                )}


                {/* Quick Add Overlay */}
                {!isArchived && (
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <Button className="w-full shadow-lg" size="lg">
                            Quick View
                        </Button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-xs font-semibold tracking-wider text-gold uppercase line-clamp-1" title={athlete}>{athlete}</p>
                    <h3 className="font-serif text-lg font-medium text-charcoal leading-tight group-hover:text-navy transition-colors line-clamp-3" title={title}>
                        {title}
                    </h3>
                </div>
                <div className="flex flex-col pt-3 border-t border-stone/10 mt-auto">
                    <div className="flex items-center justify-between">
                        <span className={cn("font-bold text-lg", isArchived ? "text-stone/40 line-through" : "text-navy")}>
                            £{price.toLocaleString()}
                            <span className="text-[10px] ml-1 uppercase tracking-tighter opacity-50">inc. VAT</span>
                        </span>
                        {isArchived && (
                            <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest bg-navy/5 px-2 py-1 rounded-xs">Private Collection</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
