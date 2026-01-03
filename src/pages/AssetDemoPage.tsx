
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Share2, ShieldCheck, Download, ExternalLink, Activity, ArrowUpRight, Lock, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function AssetDemoPage() {
    const [scrolled, setScrolled] = useState(false);
    const [hoveredStat, setHoveredStat] = useState<{ price: string; date: string } | null>(null);
    const [isRecordOpen, setIsRecordOpen] = useState(false);
    const [isCertOpen, setIsCertOpen] = useState(false);

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

    const graphData = [
        { h: 40, price: '£3,200', date: 'Jan 23' },
        { h: 45, price: '£3,350', date: 'Feb 23' },
        { h: 42, price: '£3,300', date: 'Mar 23' },
        { h: 50, price: '£3,450', date: 'Apr 23' },
        { h: 55, price: '£3,550', date: 'May 23' },
        { h: 58, price: '£3,600', date: 'Jun 23' },
        { h: 62, price: '£3,680', date: 'Jul 23' },
        { h: 65, price: '£3,750', date: 'Aug 23' },
        { h: 60, price: '£3,700', date: 'Sep 23' },
        { h: 70, price: '£3,800', date: 'Oct 23' },
        { h: 75, price: '£3,820', date: 'Nov 23' },
        { h: 80, price: '£3,850', date: 'Dec 23' }
    ];

    return (
        <div className="min-h-screen bg-navy text-white selection:bg-gold/30 font-sans pb-20 relative">
            {/* Minimal Header */}
            <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-navy/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
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

            <main className="pt-24 px-4 max-w-lg mx-auto md:max-w-4xl relative z-0">

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
                    <div className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group">

                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-gold" />
                                <span className="text-xs text-white/50 uppercase tracking-widest">Comparable Market Data</span>
                            </div>
                            {/* Dynamic Tooltip */}
                            {hoveredStat && (
                                <div className="text-[10px] text-gold font-mono animate-in fade-in bg-black/40 px-2 py-1 rounded">
                                    {hoveredStat.date}: {hoveredStat.price}
                                </div>
                            )}
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
                            *Data Source: Aggregated historical sales from eBay, Catawiki, Goldin, & Etsy. Collectibles are generally unregulated assets in the UK. This data is provided as a factual price guide only and does not constitute financial advice.
                        </p>

                        {/* Interactive Trend Line */}
                        <div
                            className="h-24 mt-6 flex items-end gap-1.5"
                            onMouseLeave={() => setHoveredStat(null)}
                        >
                            {graphData.map((data, i) => (
                                <div
                                    key={i}
                                    className="relative flex-1 group/bar cursor-pointer h-full flex items-end"
                                    onMouseEnter={() => setHoveredStat({ price: data.price, date: data.date })}
                                >
                                    <div
                                        className="w-full bg-gold/50 group-hover/bar:bg-gold transition-all duration-300 rounded-t-sm relative z-10"
                                        style={{ height: `${data.h}%` }}
                                    />
                                    {/* Hover glow effect */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-gold/5 blur-md opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none" />
                                </div>
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
                        <Button
                            variant="outline"
                            onClick={() => setIsRecordOpen(true)}
                            className="w-full mt-6 border-white/20 text-white hover:bg-white hover:text-navy hover:border-white transition-all text-xs h-10 group"
                        >
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
                        <Button
                            variant="outline"
                            onClick={() => setIsCertOpen(true)}
                            className="border-white/10 text-white bg-white/5 hover:bg-white/10"
                        >
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
                                <span className="text-white text-sm font-medium">Acquired by Private Collector</span>
                                <span className="text-white/40 text-xs">Dec 12, 2023 • Verified Transaction</span>
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

            {/* Official Record Modal */}
            {isRecordOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white text-navy w-full max-w-md rounded-xl p-6 shadow-2xl relative border border-white/10">
                        <button onClick={() => setIsRecordOpen(false)} className="absolute top-4 right-4 text-navy/40 hover:text-navy">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">Authentication Registry</h3>
                                <p className="text-xs text-navy/50">Official Database Record</p>
                            </div>
                        </div>
                        <div className="space-y-3 bg-ivory/50 p-4 rounded-lg border border-navy/5 font-mono text-sm">
                            <div className="flex justify-between"><span className="text-navy/50">Cert ID:</span> <span>IC-99283-X</span></div>
                            <div className="flex justify-between"><span className="text-navy/50">Item:</span> <span>FCB Shirt 2015</span></div>
                            <div className="flex justify-between"><span className="text-navy/50">Signer:</span> <span>Lionel Messi</span></div>
                            <div className="flex justify-between"><span className="text-navy/50">Date:</span> <span>04 Nov 2023</span></div>
                            <div className="flex justify-between"><span className="text-navy/50">Status:</span> <span className="text-green-600 font-bold">MATCH</span></div>
                        </div>
                        <Button className="w-full mt-6 bg-navy text-white hover:bg-navy/90" onClick={() => setIsRecordOpen(false)}>Close Record</Button>
                    </div>
                </div>
            )}

            {/* Certificate Modal */}
            {isCertOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-none shadow-2xl relative overflow-hidden flex flex-col">
                        <div className="h-2 bg-gold w-full" />
                        <div className="p-8 flex flex-col items-center text-center border-b border-navy/10">
                            <h2 className="font-serif text-3xl text-navy mb-1 tracking-wide">CERTIFICATE</h2>
                            <p className="text-navy/40 text-xs tracking-[0.3em] uppercase mb-8">Of Authenticity</p>

                            <p className="text-navy/70 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                                This document certifies that the accompanying item has been subjected to a rigorous examination and has been deemed authentic by our verified experts.
                            </p>

                            <div className="w-full bg-navy/5 p-4 rounded mb-6">
                                <p className="font-serif text-lg text-navy">{item.title}</p>
                                <p className="text-xs font-mono text-navy/50 mt-1">{item.id}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-16 h-16 border border-navy/10 rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 bg-gold/20 rounded-full" />
                                </div>
                                <div className="text-left ml-2">
                                    <p className="font-signature text-2xl text-navy">Sports Signed</p>
                                    <p className="text-[10px] uppercase text-navy/40 tracking-wider">Authorized Signature</p>
                                </div>
                            </div>
                        </div>
                        <Button className="m-4 bg-gold text-navy hover:bg-gold/90 font-bold" onClick={() => setIsCertOpen(false)}>
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                        </Button>
                        <button onClick={() => setIsCertOpen(false)} className="absolute top-4 right-4 text-navy/40 hover:text-navy">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
