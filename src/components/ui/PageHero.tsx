interface PageHeroProps {
    title: string
    subtitle?: string
    backgroundImage?: string
    compact?: boolean
}

export function PageHero({ title, subtitle, backgroundImage, compact = false }: PageHeroProps) {
    const bgImage = backgroundImage || "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
    
    return (
        <div className={`bg-charcoal text-ivory ${compact ? 'py-8' : 'py-16 md:py-24'} relative overflow-hidden border-b border-stone/10`}>
            <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center" 
                style={{ backgroundImage: `url('${bgImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className={`${compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-serif font-bold mb-${compact ? '2' : '4'}`}>
                    {title}
                </h1>
                {subtitle && (
                    <p className={`${compact ? 'text-sm' : 'text-lg md:text-xl'} text-ivory/${compact ? '70' : '80'} max-w-2xl mx-auto font-light`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}
