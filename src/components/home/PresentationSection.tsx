import { useState } from 'react';

export function PresentationSection() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <section className="bg-white py-16 sm:py-20 lg:py-28">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm font-medium text-navy w-fit">
                                <svg className="h-4 w-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                 <span>Premium Presentation</span>
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
                                Premium Framing. Luxury Box.
                            </h2>
                            <p className="text-lg text-charcoal/70">
                                We frame every item by hand. We use the best materials. It comes in a luxury box. You will love opening it.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 mt-0.5">
                                    <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-navy">Best Materials</h3>
                                    <p className="text-sm text-charcoal/70">Glass that stops sun damage, safe mounting, and strong wood frames.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 mt-0.5">
                                    <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-navy">Made by Experts</h3>
                                    <p className="text-sm text-charcoal/70">We build each frame by hand with care.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 mt-0.5">
                                    <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-navy">Luxury Box</h3>
                                    <p className="text-sm text-charcoal/70">A beautiful opening experience with safe packing.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 mt-0.5">
                                    <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-navy">Ready to Hang</h3>
                                    <p className="text-sm text-charcoal/70">We include the hooks. Put it on your wall today.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Grid */}
                    <div className="relative aspect-square lg:aspect-[4/3] w-full group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                        {/* Closed Box Image */}
                        <img
                            src="/premium-packaging.png"
                            alt="Premium navy and gold packaging"
                            className={`absolute inset-0 h-full w-full object-cover rounded-xl shadow-2xl transition-opacity duration-700 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                        />

                        {/* Open Box Image */}
                        <img
                            src="/premium-packaging-open.png"
                            alt="Open box revealing framed jersey"
                            className={`absolute inset-0 h-full w-full object-cover rounded-xl shadow-2xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                        />

                        {/* Interaction Hint */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-20 hover:scale-105 transition-transform">
                            <span className="text-navy font-bold uppercase tracking-wider text-xs">
                                {isOpen ? "Tap to Close" : "Tap to Unbox"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
