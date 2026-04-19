import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PresentationSection() {
    const [isOpen, setIsOpen] = useState(false);

    // Authentic Asset paths
    const shirtImage = "/real-shirt-origi.jpg";
    const logoImage = "/real-logo-gold.png";

    return (
        <section className="bg-[#FAF9F6] py-16 sm:py-20 lg:py-28 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center space-x-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 py-2 text-sm font-medium text-navy w-fit shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
                                <span className="uppercase tracking-[0.2em] text-[10px] font-bold">Unboxing Experience</span>
                            </div>

                            <h2 className="text-3xl font-serif text-navy sm:text-4xl lg:text-5xl leading-tight">
                                Gallery Framing.<br />Bespoke Packaging.
                            </h2>
                            <p className="text-lg text-navy/60 max-w-lg">
                                Your investment deserves a world-class arrival. Every piece is protected by our signature two-piece luxury lid-box, designed to be kept as part of the collection.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-[11px]">UV Protection</h3>
                                <p className="text-sm text-navy/50">Museum-grade glass shielding your piece.</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-[11px]">Bespoke Lid</h3>
                                <p className="text-sm text-navy/50">Dual-piece heavyweight construction.</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-[11px]">Digital Auth</h3>
                                <p className="text-sm text-navy/50">Scan the internal lid for full provenance.</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-navy uppercase tracking-wider text-[11px]">Global Ready</h3>
                                <p className="text-sm text-navy/50">Impact-resistant outer layering.</p>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="mt-8 px-8 py-4 bg-navy text-white rounded-none font-bold uppercase tracking-widest text-xs hover:bg-navy/90 transition-all shadow-xl"
                        >
                            {isOpen ? "Close Packaging" : "Open Lid"}
                        </button>
                    </div>

                    {/* Digital Unboxing Engine */}
                    <div className="relative aspect-square w-full flex items-center justify-center p-4 sm:p-8">
                        
                        {/* THE BOX BASE (The Shirt) */}
                        <div className="relative w-full aspect-square bg-[#0B1528] rounded-sm shadow-2xl p-4 sm:p-8 border-b-8 border-black/20 overflow-hidden">
                            {/* The Real Shirt Image */}
                            <img 
                                src={shirtImage} 
                                alt="Framed Signed Divock Origi Shirt" 
                                className="w-full h-full object-contain rounded-sm shadow-inner"
                            />
                            
                            {/* Inner Lid Shadowing */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                        </div>

                        {/* THE LID (Slides Off) */}
                        <AnimatePresence>
                            {!isOpen && (
                                <motion.div
                                    key="lid"
                                    initial={{ y: 0, opacity: 1 }}
                                    exit={{ 
                                        y: "-120%", 
                                        rotateZ: -5,
                                        opacity: 0,
                                        transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                                    }}
                                    className="absolute inset-4 sm:inset-8 z-30 flex items-center justify-center bg-[#1A263D] rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5"
                                >
                                    {/* Real Logo Asset */}
                                    <div className="w-3/4 max-w-[300px]">
                                        <img 
                                            src={logoImage} 
                                            alt="SM Sports Memorabilia Store Logo" 
                                            className="w-full h-auto brightness-110 contrast-125"
                                        />
                                    </div>

                                    {/* History Reveal State (Flipped Lid inside) */}
                                    <div className="hidden">History In Your Hands</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* INTERNAL LID (revealed on separate layer if we want to show it flipped) */}
                        <AnimatePresence>
                             {isOpen && (
                                <motion.div
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: "-150%", opacity: 0.15 }}
                                    className="absolute z-40 pointer-events-none w-1/2 text-center"
                                >
                                     <h4 className="font-serif text-[#D4AF37] text-3xl italic">History in your hands</h4>
                                </motion.div>
                             )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            
            {/* Custom Styles for Perspective */}
            <style dangerouslySetInnerHTML={{ __html: `
                .font-serif { font-family: 'Playfair Display', serif; }
            `}} />
        </section>
    );
}
