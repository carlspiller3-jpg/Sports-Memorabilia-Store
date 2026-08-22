import { useState } from 'react';
import { Check, ShieldCheck, Box, PackageCheck, Layers } from 'lucide-react';

const framingSpecs = [
    {
        title: "Handcrafted UK Wooden Frame",
        subtitle: "Satin Black Finish",
        description: "Built by master picture framers in the UK using solid wood mouldings in a smooth Satin Black finish."
    },
    {
        title: "Double Aperture Custom Suede Mount",
        subtitle: "Archival Suede Board",
        description: "Custom precision cut double aperture mount board wrapped in luxury suede to create depth and contrast."
    },
    {
        title: "Laser Etched Metallic Title Plaque",
        subtitle: "Bespoke Engraving",
        description: "Polished metallic plaque featuring laser etched athlete stats, match details, and signing date verification."
    },
    {
        title: "Clear Perspex Glaze",
        subtitle: "Transit Safe & High Clarity",
        description: "Shatterproof optical grade Perspex glazing providing high clarity display while protecting glass from transit damage."
    }
];

export function PresentationSection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="bg-white py-16 sm:py-20 lg:py-24 border-b border-stone/10">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 rounded-full border border-gold bg-gold/10 px-4 py-1.5 text-xs font-bold text-navy uppercase tracking-widest w-fit">
                                <Layers className="h-4 w-4 text-gold" />
                                <span>Physical Framing Specifications</span>
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-navy sm:text-4xl lg:text-5xl leading-tight">
                                Handcrafted UK Framing. Engineered Transit Safety.
                            </h2>
                            <p className="text-base sm:text-lg text-charcoal/70 font-light">
                                Subjective claims do not build trust. We state the exact physical build facts of every display piece so you know exactly what is arriving at your door.
                            </p>
                        </div>

                        {/* Framing Specs List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {framingSpecs.map((spec, index) => (
                                <div key={index} className="flex items-start space-x-3 bg-ivory/60 p-4 rounded-lg border border-stone/15">
                                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold mt-0.5">
                                        <Check className="h-4 w-4 stroke-[3]" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-navy text-base leading-snug">{spec.title}</h3>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">{spec.subtitle}</p>
                                        <p className="text-xs text-charcoal/75 leading-relaxed">{spec.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Transit Packaging Note */}
                        <div className="p-4 bg-navy/5 border border-navy/10 rounded-lg flex items-center gap-3">
                            <PackageCheck className="w-5 h-5 text-navy shrink-0" />
                            <p className="text-xs text-navy/80 font-medium">
                                <strong className="text-navy">Custom Transit Packaging:</strong> Every framed asset is encased in custom double wall corrugated cartons with high density corner protection to ensure zero transit damage.
                            </p>
                        </div>
                    </div>

                    {/* Interactive Unboxing Image Box */}
                    <div className="relative aspect-square lg:aspect-[4/3] w-full group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        <img
                            src="/premium-packaging.png"
                            alt="Custom transit packaging box"
                            className={`absolute inset-0 h-full w-full object-cover rounded-xl shadow-2xl transition-opacity duration-700 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                        />

                        <img
                            src="/premium-packaging-open.png"
                            alt="Unboxed handcrafted UK framed jersey"
                            className={`absolute inset-0 h-full w-full object-cover rounded-xl shadow-2xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                        />

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-navy text-gold px-6 py-3 rounded-full shadow-xl border border-gold/30 flex items-center gap-3 z-20 hover:scale-105 transition-transform">
                            <span className="font-bold uppercase tracking-wider text-xs">
                                {isOpen ? "Tap to Close Transit Box" : "Tap to Unbox Package"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
