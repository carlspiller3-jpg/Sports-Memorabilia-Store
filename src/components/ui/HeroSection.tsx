import { Button } from "@/components/ui/Button"

export function HeroSection() {
    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-navy">
            {/* Background Image/Video Placeholder */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-navy/40 z-10 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop"
                    alt="Framed Jersey Background"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            {/* Content */}
            <div className="relative z-20 text-center space-y-8 max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
                <div className="space-y-4">
                    <span className="inline-block text-gold text-sm font-bold tracking-[0.2em] uppercase border-b border-gold/30 pb-2">
                        The Premium Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-ivory leading-tight tracking-tight">
                        Legends <span className="italic text-gold">Framed.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone/80 max-w-2xl mx-auto font-light leading-relaxed">
                        Authentic signed memorabilia from the world's greatest athletes.
                        Premium framing. 24-hour dispatch.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" className="min-w-[180px] text-base">
                        Shop New Arrivals
                    </Button>
                    <Button variant="outline" size="lg" className="min-w-[180px] text-base text-ivory border-ivory/20 hover:bg-ivory/10 hover:text-ivory">
                        View Collections
                    </Button>
                </div>
            </div>
        </section>
    )
}
