import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PresentationSection() {
    const [isOpen, setIsOpen] = useState(false);

    // Asset paths (using the new high-fidelity generation)
    const packagingImage = "/luxury_lid_packaging_v2_1776610542355.png";

    return (
        <section className="bg-ivory py-16 sm:py-20 lg:py-28 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-white px-4 py-2 text-sm font-medium text-navy w-fit shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-gold animate-pulse"></span>
                                <span className="uppercase tracking-widest text-[10px] font-bold">The Gold Standard</span>
                            </div>

                            <h2 className="text-3xl font-serif text-navy sm:text-4xl lg:text-5xl leading-tight">
                                Premium Framing.<br />Luxury Packaging.
                            </h2>
                            <p className="text-lg text-navy/60 max-w-lg">
                                Every piece is hand-framed using gallery-grade materials and delivered in a bespoke two-piece luxury lid box designed for the ultimate unboxing.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-xs">Ph Neutral Materials</h3>
                                <p className="text-sm text-navy/50">Acid-free mounting and UV-protective glass.</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-xs">Hand-Crafted</h3>
                                <p className="text-sm text-navy/50">Each frame built by master craftsmen.</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-xs">Two-Piece Lid</h3>
                                <p className="text-sm text-navy/50">Heavier, sturdier presentation box.</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-xs">Ready to Display</h3>
                                <p className="text-sm text-navy/50">Wall-ready with premium hardware.</p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Packaging Reveal */}
                    <div 
                        className="relative aspect-square w-full cursor-pointer perspective-1000 group"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {/* Shadow Base */}
                        <div className="absolute inset-0 bg-black/10 blur-3xl rounded-full scale-75 translate-y-12" />

                        {/* Main Box & Animation Container */}
                        <div className="relative h-full w-full flex items-center justify-center p-8">
                            
                            {/* The Base (Stays Put) */}
                            <div className="absolute inset-x-8 inset-y-12 bg-navy/90 rounded-lg shadow-2xl border-b-4 border-navy transform translate-y-4">
                                {/* The 'Interior' revealed when lid is gone */}
                                <div className="absolute inset-2 border border-gold/10 rounded flex flex-col items-center justify-center text-white/10 p-8 text-center">
                                    <span className="font-serif italic text-xl opacity-20">Your Piece of History</span>
                                </div>
                            </div>

                            {/* The Lid (The Star of the Show) */}
                            <motion.div
                                className="relative z-10 w-full h-auto will-change-transform"
                                initial={false}
                                animate={isOpen ? {
                                    y: -180,
                                    rotateX: 15,
                                    rotateZ: -5,
                                    scale: 1.05,
                                    filter: "brightness(1.1)"
                                } : {
                                    y: 0,
                                    rotateX: 0,
                                    rotateZ: 0,
                                    scale: 1,
                                    filter: "brightness(1)"
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 100,
                                    damping: 20
                                }}
                            >
                                <img
                                    src={packagingImage}
                                    alt="Sports Memorabilia Store Premium Packaging"
                                    className="w-full h-auto rounded-lg shadow-2xl"
                                />

                                {/* Interior Lid Message - Revealed as it lifts */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center bg-navy rounded-lg backface-hidden"
                                            style={{ rotateY: 180 }}
                                        >
                                            <div className="text-center p-8">
                                                <h4 className="font-serif text-gold text-2xl italic mb-2">History in your hands</h4>
                                                <div className="w-12 h-12 border border-gold/30 mx-auto rounded opacity-30 flex items-center justify-center">
                                                    <span className="text-[8px] text-gold uppercase tracking-tighter font-bold">Digital COA</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Interaction Hint */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                                <div className="bg-white/90 backdrop-blur px-8 py-3 rounded-full shadow-xl flex items-center gap-3 hover:bg-white transition-colors border border-navy/5">
                                    <span className="text-navy font-bold uppercase tracking-[0.2em] text-[10px]">
                                        {isOpen ? "Put back together" : "Tap to lift lid"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
