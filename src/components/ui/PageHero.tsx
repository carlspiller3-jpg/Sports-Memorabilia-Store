interface PageHeroProps {
    title: string
    subtitle?: string
    backgroundImage?: string
    compact?: boolean
}

export function PageHero({ title, subtitle, compact = false }: PageHeroProps) {

    return (
        <div className={`bg-[#F9F9F7] ${compact ? 'py-12' : 'py-20 md:py-28'} relative overflow-hidden border-b border-stone/10`}>
            {/* Background Texture/Blur - consistent with Home Hero */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-navy/5 blur-[120px] rounded-full opacity-50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className={`${compact ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl lg:text-7xl'} font-serif font-bold mb-${compact ? '3' : '6'} text-navy tracking-tight`}>
                    {title}
                </h1>
                {subtitle && (
                    <div className="relative inline-block">
                        <p className={`${compact ? 'text-base' : 'text-lg md:text-xl'} text-charcoal/70 max-w-2xl mx-auto font-light leading-relaxed`}>
                            {subtitle}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
