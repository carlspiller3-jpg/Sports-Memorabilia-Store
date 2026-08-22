import { Link } from "react-router-dom";
import { Building2, Award, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export function CorporateGiftingSection() {
    return (
        <section className="bg-ivory py-16 sm:py-20 lg:py-24 border-b border-stone/15">
            <div className="container mx-auto px-4">
                <div className="bg-navy text-white rounded-2xl p-8 sm:p-12 lg:p-16 border border-gold/20 shadow-2xl relative overflow-hidden">
                    {/* Background Subtle Pattern */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="grid gap-10 lg:grid-cols-2 items-center relative z-10">
                        {/* Copy Column */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold uppercase tracking-widest">
                                <Building2 className="h-4 w-4" />
                                <span>Corporate Accounts and B2B Gifting</span>
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-white sm:text-4xl lg:text-5xl leading-tight">
                                Executive Gifting and Corporate Suite Displays
                            </h2>

                            <p className="text-base sm:text-lg text-ivory/80 font-light leading-relaxed">
                                Custom engraved company plaques, bulk allocation packages, and tailored corporate stock decks for client retention, partner rewards, and executive office display.
                            </p>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                    <span className="text-sm text-ivory/90 font-medium">Bespoke laser engraved brass plaques with corporate logo and branding</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                    <span className="text-sm text-ivory/90 font-medium">Bulk allocation pricing for law firms, wealth managers, and sales incentive decks</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                    <span className="text-sm text-ivory/90 font-medium">Full UK tax invoicing and corporate credit facilities available</span>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <Link to="/contact?subject=corporate">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold/90 text-navy font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-xl flex items-center justify-center gap-2">
                                        Request Corporate Stock Deck
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                                <Link to="/b2b-proposal">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm border border-white/20 transition-all flex items-center justify-center gap-2">
                                        <FileText className="w-4 h-4 text-gold" />
                                        View B2B Proposal Deck
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Feature Box Column */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-3 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                                    <Award className="w-5 h-5" />
                                </div>
                                <h3 className="font-serif font-bold text-lg text-white">Client Retention</h3>
                                <p className="text-xs text-ivory/70 leading-relaxed">
                                    Reward high value client relationships with verified, museum grade framed sporting relics that stay on their office wall forever.
                                </p>
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-3 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <h3 className="font-serif font-bold text-lg text-white">Boardroom Displays</h3>
                                <p className="text-xs text-ivory/70 leading-relaxed">
                                    Transform executive reception areas, boardroom suites, and hospitality boxes with curated historic sporting assets.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
