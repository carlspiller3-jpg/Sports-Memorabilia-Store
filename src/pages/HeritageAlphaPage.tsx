import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Button } from "@/components/ui/Button"
import { TrendingUp, ShieldCheck, Database, ArrowRight, Download, Globe, PieChart } from "lucide-react"
import { WaitlistSignup } from "@/components/ui/WaitlistSignup"

export function HeritageAlphaPage() {
    return (
        <div className="min-h-screen bg-navy text-ivory selection:bg-gold/30">
            <Helmet>
                <title>Heritage Alpha | Sports Memorabilia Investment Report 2026</title>
                <meta name="description" content="Access the 2026 Sports Heritage Alpha Report. Discover why authenticated sports assets are outperforming traditional markets." />
            </Helmet>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/10 blur-[120px] rounded-full opacity-30" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full opacity-20" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
                        <TrendingUp className="w-3 h-3" />
                        Market Intelligence
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 tracking-tighter leading-[0.9] max-w-5xl mx-auto">
                        Why Sports Heritage Outperformed <span className="text-gold italic">Gold</span> in 2025.
                    </h1>
                    <p className="text-lg md:text-2xl text-ivory/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                        The 2026 Alpha Report is a data-driven audit of the authenticated memorabilia market. 
                        Understand the shift from "Fans" to "Institutional Collectors."
                    </p>
                    
                    <div className="max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-2xl relative group">
                        <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-center">Request Allocation Analysis</h3>
                        <WaitlistSignup interest="Alpha Report 2026" />
                        <p className="text-[10px] text-ivory/40 mt-6 text-center italic uppercase tracking-tighter">
                            Instant Digital Access to the 42-Page PDF
                        </p>
                    </div>
                </div>
            </section>

            {/* Data Preview Section */}
            <section className="py-24 bg-white/2">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight">
                                    Moving past the <br/>
                                    <span className="text-gold italic">Commodity Trap.</span>
                                </h2>
                                <p className="text-ivory/60 leading-relaxed text-lg max-w-lg">
                                    The global sports memorabilia market is projected to hit $227B by 2032. 
                                    But 99% of "autographed" items are depreciating liabilities. 
                                    The Alpha Report identifies the 1% of assets that act as wealth stores.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors group">
                                    <ShieldCheck className="w-6 h-6 text-gold mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-2 text-white">The Provenance Premium</h4>
                                    <p className="text-sm text-ivory/50">Why our Ledger entries add an average of 22.4% to immediate asset resale value.</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors group">
                                    <Database className="w-6 h-6 text-gold mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-2 text-white">Asset Flow Analysis</h4>
                                    <p className="text-sm text-ivory/50">Tracking the "Wealth Migration" from traditional cards to match-worn heritage.</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors group">
                                    <PieChart className="w-6 h-6 text-gold mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-2 text-white">Institutional Demand</h4>
                                    <p className="text-sm text-ivory/50">How private equity funds are utilizing verified sports heritage as a hedge.</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:bg-white/10 transition-colors group">
                                    <Globe className="w-6 h-6 text-gold mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-xs uppercase tracking-widest mb-2 text-white">Global Scalability</h4>
                                    <p className="text-sm text-ivory/50">Our roadmap to a friction-free global secondary market via the Heritage Ledger.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square bg-white/5 border border-white/10 rounded-sm flex flex-col p-8 overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Index Analysis</p>
                                        <h4 className="text-2xl font-serif font-bold text-white tracking-tight">HERITAGE VS. S&P 500</h4>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-gold" />
                                </div>
                                
                                <div className="flex-1 flex items-end gap-3 pb-8">
                                    {[30, 45, 35, 60, 85, 70, 95].map((h, i) => (
                                        <div key={i} className="flex-1 group relative">
                                            <div 
                                                className="bg-gold/20 group-hover:bg-gold/40 transition-all rounded-t-xs" 
                                                style={{ height: `${h}%` }}
                                            />
                                            <div 
                                                className="absolute bottom-0 w-full bg-gold animate-pulse opacity-50" 
                                                style={{ height: `${h/4}%` }} 
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gold rounded-full" />
                                        <span className="text-[10px] font-bold uppercase text-ivory/40 tracking-widest">Heritage Asset Class</span>
                                    </div>
                                    <span className="text-gold font-bold">+18.4% YOY</span>
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-2xl border border-gold/20 animate-bounce">
                                <div className="text-navy font-bold text-2xl leading-none tracking-tighter">94%</div>
                                <div className="text-navy/40 text-[8px] font-bold uppercase tracking-widest mt-1 italic">Verified Accuracy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-32 bg-navy border-t border-white/5 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">Ready to exit the <br/><span className="text-gold italic">Commodity Trap?</span></h2>
                    <p className="text-ivory/50 max-w-xl mx-auto mb-12 leading-relaxed">
                        Join 2,500+ private collectors receiving our monthly market intelligence. No fluff. Just data.
                    </p>
                    <div className="max-w-md mx-auto">
                        <WaitlistSignup interest="Footer CTA - Alpha" />
                    </div>
                </div>
            </section>
        </div>
    )
}
