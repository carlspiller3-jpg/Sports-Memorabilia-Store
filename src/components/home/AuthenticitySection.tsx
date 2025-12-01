import { Link } from "react-router-dom"

const authenticityFeatures = [
    {
        title: "Certificate of Authenticity",
        description: "Every item includes both digital and physical COA with unique serial numbers for lifetime verification.",
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
            </svg>
        ),
    },
    {
        title: "Signing Event Proof",
        description: "Photographic evidence from private signing sessions with athletes, ensuring complete transparency.",
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: "NFC Verification",
        description: "Scan the NFC tag on your item for instant blockchain verification and complete provenance history.",
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        title: "Lifetime Guarantee",
        description: "We stand behind every signature. If authenticity is ever questioned, we provide full support and documentation.",
        icon: (
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
    },
]

export function AuthenticitySection() {
    return (
        <section id="authenticity" className="bg-ivory py-16 sm:py-20 lg:py-28">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm font-medium text-navy w-fit">
                                <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Trust & Authenticity</span>
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
                                Guaranteed Authentic. Verified Forever.
                            </h2>
                            <p className="text-lg text-charcoal/70">
                                Our rigorous authentication process ensures that every piece of memorabilia is genuine,
                                giving you complete confidence in your purchase or gift.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            {authenticityFeatures.map((feature, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-gold/10 text-gold">
                                            {feature.icon}
                                        </div>
                                        <h3 className="font-serif text-lg font-semibold text-navy">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-charcoal/70 pl-15">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="pt-4">
                            <Link to="/verify">
                                <button className="text-sm font-semibold text-gold hover:text-gold/80 transition-colors inline-flex items-center gap-2">
                                    Verify Your Item
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* COA Visual */}
                    <div className="relative lg:order-last">
                        <div className="aspect-[3/4] w-full overflow-hidden rounded-sm bg-white shadow-2xl border border-stone/20">
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-ivory to-white p-8">
                                <div className="text-center space-y-6 max-w-sm">
                                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-gold bg-gold/10">
                                        <svg className="h-12 w-12 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-serif text-xl font-bold text-navy">
                                            Certificate of Authenticity
                                        </p>
                                        <p className="text-sm text-charcoal/60">
                                            Every item includes a unique COA with blockchain verification
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-stone space-y-1 text-xs text-charcoal/50">
                                        <p>Serial No: SM-2025-00001</p>
                                        <p>Verified: December 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-navy/5 blur-2xl" />
                        <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
                    </div>
                </div>
            </div>
        </section>
    )
}
