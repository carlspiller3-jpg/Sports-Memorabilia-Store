import { Link } from "react-router-dom";
import { Camera, Fingerprint, Frame, ShieldCheck, CheckCircle2 } from "lucide-react";

const proofPillars = [
    {
        number: "01",
        title: "Direct Athlete Signing Proof",
        subtitle: "Session Photo and Video Evidence",
        description: "High resolution photography and video footage captured during official signing sessions with the athlete. Eliminates paper certificate scams by showing the player signing the exact batch.",
        icon: Camera,
        badge: "Signing Media Included"
    },
    {
        number: "02",
        title: "Cryptographic NFC Smart Tag",
        subtitle: "Tap to Verify Digital Provenance",
        description: "An encrypted smart chip attached directly to every frame. Tap any smartphone against the frame to open the digital certificate of authenticity instantly. No paper to lose, no apps required.",
        icon: Fingerprint,
        badge: "Encrypted Smart Chip"
    },
    {
        number: "03",
        title: "Concrete Physical Framing Specs",
        subtitle: "Handcrafted UK Build Quality",
        description: "Handcrafted UK wooden frame in Satin Black Finish, double aperture custom suede mount board, laser etched metallic title plaque, and clear Perspex glaze (transit safe, high clarity).",
        icon: Frame,
        badge: "Museum Grade Specs"
    },
    {
        number: "04",
        title: "Unconditional Lifetime Guarantee",
        subtitle: "100% Money Back Protection",
        description: "A binding legal guarantee from Sports Memorabilia Store Limited. If any item is ever proven fake by a recognized authority, receive a 100% refund including return shipping forever.",
        icon: ShieldCheck,
        badge: "Binding Legal Guarantee"
    }
];

export function AuthenticitySection() {
    return (
        <section id="authenticity" className="bg-ivory py-16 sm:py-20 lg:py-24 border-y border-stone/10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <div className="inline-flex items-center space-x-2 rounded-full border border-gold bg-gold/10 px-4 py-1.5 text-xs font-bold text-navy uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4 text-gold" />
                        <span>The 4 Pillar Trust Engine</span>
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-navy sm:text-4xl lg:text-5xl leading-tight">
                        Built on Verifiable Physical Facts. Not Subjective Reviews.
                    </h2>
                    <p className="text-base sm:text-lg text-charcoal/70 max-w-2xl mx-auto font-light">
                        When evaluating high ticket sports memorabilia, subjective claims damage trust. We replace traditional review stars with four concrete, verifiable proof pillars.
                    </p>
                </div>

                {/* 4 Pillars Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {proofPillars.map((pillar) => {
                        const IconComponent = pillar.icon;
                        return (
                            <div
                                key={pillar.number}
                                className="bg-white p-6 sm:p-8 rounded-xl border border-stone/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-serif text-2xl font-bold text-gold/40 group-hover:text-gold transition-colors">
                                            {pillar.number}
                                        </span>
                                        <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold block mb-1">
                                            {pillar.badge}
                                        </span>
                                        <h3 className="font-serif text-xl font-bold text-navy leading-snug">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-xs font-semibold text-charcoal/60 mt-1 mb-3">
                                            {pillar.subtitle}
                                        </p>
                                        <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                                            {pillar.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Framing Specification Callout Banner */}
                <div className="mt-12 bg-navy text-ivory p-6 sm:p-8 rounded-xl border border-gold/20 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center lg:text-left">
                        <h4 className="font-serif text-xl font-bold text-gold">
                            Physical Framing Specifications (Standard Across All Apparel)
                        </h4>
                        <p className="text-xs sm:text-sm text-ivory/80 max-w-3xl">
                            Handcrafted UK wooden frame in Satin Black Finish • Double aperture custom suede mount board • Laser etched metallic title plaque • Clear Perspex glaze (transit safe, high clarity)
                        </p>
                    </div>
                    <Link to="/verify" className="shrink-0">
                        <button className="px-6 py-3 bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-widest rounded-sm transition-colors whitespace-nowrap">
                            Verify An NFC Tag
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
