import { useState } from "react";
import { Link } from "react-router-dom";
import { Fingerprint, CheckCircle2, Shield, Smartphone, ArrowRight, ExternalLink } from "lucide-react";

export function NFCVerificationHub() {
    const [scanned, setScanned] = useState(false);

    return (
        <section className="bg-navy py-16 sm:py-20 lg:py-24 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                    {/* Left Copy */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold uppercase tracking-widest w-fit">
                            <Fingerprint className="h-4 w-4" />
                            <span>Live NFC Verification Demo</span>
                        </div>

                        <h2 className="text-3xl font-serif font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
                            Interactive Tag Test: Try Scanned Provenance
                        </h2>

                        <p className="text-base sm:text-lg text-ivory/80 font-light leading-relaxed">
                            Every item leaving our UK workshop is fitted with a tamper proof encrypted smart tag. Tapping any smartphone against the frame reads the chip key and opens digital proof.
                        </p>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                <span className="text-sm text-ivory/90 font-medium">No smartphone apps or downloads required</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                <span className="text-sm text-ivory/90 font-medium">Immutable signing date, location, and photo records</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                <span className="text-sm text-ivory/90 font-medium">Permanent resale provenance that cannot be lost or forged</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link to="/verify">
                                <button className="px-8 py-4 bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-xl flex items-center gap-2">
                                    Open Tag Verification Portal
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Interactive Tag Card */}
                    <div className="bg-white/5 border border-gold/20 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-2xl relative">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gold">Sample Tag ID</p>
                                    <p className="font-mono text-sm font-bold text-white">SM-2025-00001</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                                Active Registry Tag
                            </span>
                        </div>

                        {/* Card Content */}
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-ivory/60">Asset:</span>
                                    <span className="text-white font-bold">Lionel Messi Signed Argentina 2022 World Cup Shirt</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-ivory/60">Signing Session:</span>
                                    <span className="text-white font-bold">Paris, France (Witness Verified)</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-ivory/60">Framing Spec:</span>
                                    <span className="text-gold font-bold">Handcrafted UK Suede Mount</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setScanned(!scanned)}
                                className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-lg border border-white/15 transition-colors flex items-center justify-center gap-2"
                            >
                                <Fingerprint className="w-4 h-4 text-gold" />
                                {scanned ? "Hide Digital Certificate Data" : "Tap to Simulate NFC Scan"}
                            </button>

                            {scanned && (
                                <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-2 text-gold font-bold uppercase tracking-wider">
                                        <Shield className="w-4 h-4" />
                                        <span>Cryptographic Provenance Verified</span>
                                    </div>
                                    <p className="text-ivory/90 leading-relaxed">
                                        Certificate cryptographic hash matches the physical chip embedded in frame SM-2025-00001. High resolution signing photos attached.
                                    </p>
                                    <Link to="/verify?tag=SM-2025-00001" className="inline-flex items-center gap-1 text-gold underline font-bold pt-1">
                                        View Full Registry Record <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
