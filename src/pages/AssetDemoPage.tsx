
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Share2, ShieldCheck, Download, ExternalLink, Activity, ArrowUpRight, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function AssetDemoPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const item = {
        title: "Lionel Messi Signed FC Barcelona Shirt",
        season: "2014-2015 Treble Season",
        id: "SS-88392-LM10",
        acquired: "12 Dec 2023",
        value: "£3,850.00",
        valueChange: "+14.2%",
        authProvider: "Icons.com",
        authId: "IC-99283-X",
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2664&auto=format&fit=crop"
    };

    return (
        <div className="min-h-screen bg-navy text-white selection:bg-gold/30 font-sans pb-20">
            {/* Minimal Header */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-white/80 hover:text-white transition-colors">
                        <span className="font-serif tracking-widest text-xs">SPORTS SIGNED</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Lock className="w-3 h-3 text-gold" />
                        <span className="text-[10px] font-bold tracking-wider text-gold">SECURE VAULT</span>
                    </div>
                </div>
            </nav>

            <main className="pt-24 px-4 max-w-lg mx-auto md:max-w-4xl">

                {/* 1. Hero Image / Asset Card */}
                <div className="relative aspect-[4/5] md:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10 opactiy-80" />
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Hologram Effect Overlay (Simulated) */}
                    <div className="absolute top-4 right-4 z-20">
                        <div className="w-12 h-12 bg-gradient-to-br from-gold/40 to-transparent rounded-full flex items-center justify-center animate-pulse border border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                            <ShieldCheck className="w-6 h-6 text-gold drop-shadow-md" />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                        <h1 className="font-serif text-3xl md:text-4xl text-white mb-2 leading-tight">
                            {item.title}
                        </h1>
                        <p className="text-white/60 text-sm md:text-base mb-4 font-light">
                            {item.season}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-mono tracking-wider text-white/40">
                            <span>ID: {item.id}</span>
                            <span>•</span>
                            <span>ACQUIRED: {item.acquired}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Value Dashboard */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[50px] rounded-full pointer-events-none" />

                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-gold" />
                            <span className="text-xs text-white/50 uppercase tracking-widest">Comparable Market Data</span>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-serif text-white">£3,850</span>
                            <span className="text-xs text-white/40 mb-2 font-medium">(Avg. Sold Price)</span>
                            <div className="flex items-center gap-1 text-green-400 text-sm font-bold mb-2 ml-auto">
                                <ArrowUpRight className="w-3 h-3" />
                                3yr Trend
                            </div>
                        </div>
                        <p className="text-[9px] text-white/30 mt-4 leading-relaxed border-t border-white/5 pt-2">
                            *Data Source: Aggregated public sales records (eBay, Goldin, Sotheby's) for items of matching grade/authenticity. This data is historical and factual, not a guarantee of future value or a formal appraisal.
                        </p>

                        {/* Fake Trend Line */}
                        <div className="h-16 mt-6 flex items-end gap-1 opacity-50">
                            {[40, 45, 42, 50, 55, 58, 62, 65, 60, 70, 75, 80].map((h, i) => (
                                <div key={i} className="flex-1 bg-gold hover:bg-white transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle className="w-4 h-4 text-gold" />
                                <span className="text-xs text-white/50 uppercase tracking-widest">Authentication</span>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-sm text-white/60">Provider</span>
                                    <span className="text-sm text-white font-medium">{item.authProvider}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-sm text-white/60">Cert Number</span>
                                    <span className="text-sm text-white font-mono">{item.authId}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-sm text-white/60">Verification</span>
                                    <span className="text-green-400 text-[10px] font-bold px-2 py-0.5 bg-green-400/10 rounded-full border border-green-400/20">VERIFIED</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-6 border-white/20 text-white hover:bg-white hover:text-navy hover:border-white transition-all text-xs h-10 group">
                            View Official Record <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>

                {/* 3. Actions */}
                <div className="mt-8 flex flex-col gap-3">
                    <Button className="w-full bg-gold hover:bg-gold/90 text-navy font-bold h-12 shadow-lg shadow-gold/10">
                        Trade or Sell Item
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="border-white/10 text-white bg-white/5 hover:bg-white/10">
                            <Download className="w-4 h-4 mr-2" />
                            Certificate
                        </Button>
                        <Button variant="outline" className="border-white/10 text-white bg-white/5 hover:bg-white/10">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Provenance Chain */}
                <div className="mt-12 pt-12 border-t border-white/10">
                    <h3 className="text-xs text-white/40 uppercase tracking-widest mb-6 font-bold text-center">Provenance Chain</h3>
                    <div className="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                        {/* Event 1 */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gold border-[3px] border-navy shadow-[0_0_0_2px_rgba(255,255,255,0.1)]" />
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-medium">Acquired by You</span>
                                <span className="text-white/40 text-xs">Dec 12, 2023 • Online Store</span>
                            </div>
                        </div>
                        {/* Event 2 */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-navy border-[2px] border-white/20" />
                            <div className="flex flex-col">
                                <span className="text-white/80 text-sm">Authenticated by {item.authProvider}</span>
                                <span className="text-white/40 text-xs">Nov 04, 2023 • Warning: Witnessed Signing</span>
                            </div>
                        </div>
                        {/* Event 3 */}
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-navy border-[2px] border-white/20" />
                            <div className="flex flex-col">
                                <span className="text-white/80 text-sm">Signing Event (Barcelona)</span>
                                <span className="text-white/40 text-xs">Nov 04, 2023 • Private Session</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
