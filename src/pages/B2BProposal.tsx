import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, TrendingUp, Building2, Download } from "lucide-react";

export function B2BProposal() {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-stone/10 py-12 print:p-0 print:bg-white">
            {/* Control Bar - Hidden when printing */}
            <div className="container mx-auto px-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-serif text-navy">B2B Proposition Preview</h1>
                    <p className="text-sm text-navy/60 mt-1">Click the button, then select <strong>"Save as PDF"</strong> in the destination menu.</p>
                </div>
                <Button onClick={handlePrint} className="bg-navy text-white hover:bg-navy/90 gap-2 shadow-xl shadow-navy/20">
                    <Download className="w-4 h-4" />
                    Print / Save as PDF
                </Button>
            </div>

            {/* A4 Page Container */}
            <div
                ref={contentRef}
                className="mx-auto bg-white w-[210mm] min-h-[297mm] shadow-2xl print:shadow-none print:w-full print:h-full print:m-0 flex flex-col relative overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-navy px-12 py-16 text-white relative overflow-hidden print:break-inside-avoid">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-12">
                            <img
                                src="/logo-transparent.png"
                                alt="Sports Memorabilia Store"
                                className="h-20 w-auto invert brightness-0 grayscale-0" // Using invert to make logo white if needed, or adjust based on actual logo
                                style={{ filter: "brightness(0) invert(1)" }}
                            />
                            <div className="text-right">
                                <p className="text-gold font-bold uppercase tracking-widest text-sm">Corporate Partnerships</p>
                                <p className="text-white/60 text-sm mt-1">2025/26 Season</p>
                            </div>
                        </div>

                        <h1 className="font-serif text-5xl font-bold leading-tight mb-6">
                            Authentic. Rare. <br />
                            <span className="text-gold">Legendary.</span>
                        </h1>
                        <p className="text-lg text-white/80 max-w-lg leading-relaxed font-light">
                            The premier destination for authenticated sports artifacts. Elevating corporate spaces and client relationships through history.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-12 py-12 flex-1 text-charcoal">

                    {/* The Problem & Solution */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div>
                            <h3 className="text-gold font-bold uppercase tracking-wider text-xs mb-3">The Challenge</h3>
                            <h2 className="font-serif text-2xl text-navy mb-4 font-bold">The Trust Deficit</h2>
                            <p className="text-sm leading-relaxed text-gray-600">
                                The sports memorabilia market is plagued by forgeries and low-quality presentation. Corporate buyers and interior designers often struggle to find pieces that offer both guaranteed authenticity and the premium aesthetic required for a luxury boardroom or high-end office.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gold font-bold uppercase tracking-wider text-xs mb-3">The Solution</h3>
                            <h2 className="font-serif text-2xl text-navy mb-4 font-bold">Uncompromising Quality</h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-700">
                                    <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
                                    <span><strong>100% Authenticated:</strong> Every item comes with immutable proof of authenticity via NFC & Blockchain technology.</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-700">
                                    <Building2 className="w-5 h-5 text-gold shrink-0" />
                                    <span><strong>Premium Framing:</strong> Professional bespoke mounting with UV-protective glass for lifetime preservation.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-200 mb-12" />

                    {/* Opportunities */}
                    <h2 className="font-serif text-3xl text-navy mb-8 font-bold">Partnership Opportunities</h2>

                    <div className="space-y-8">
                        {/* Item 1 */}
                        <div className="flex gap-6 items-start p-6 bg-ivory rounded-lg border border-stone/20 print:border-gray-300">
                            <div className="p-3 bg-navy text-gold rounded-full shrink-0">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-navy font-bold mb-2">Corporate Gifting & Concierge</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                    Forget generic hampers. Gift a piece of history. A signed Tyson Fury glove or a Messi shirt creates a lasting emotional connection with your VIP clients.
                                </p>
                                <p className="text-xs font-bold text-navy uppercase tracking-wider">Access to volume discounts & custom plaques</p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-6 items-start p-6 bg-ivory rounded-lg border border-stone/20 print:border-gray-300">
                            <div className="p-3 bg-navy text-gold rounded-full shrink-0">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-navy font-bold mb-2">Investment Portfolios</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                    For wealth managers and investment groups. Unique, high-value items (e.g., match-worn kits) are alternative assets that naturally appreciate in value.
                                </p>
                                <p className="text-xs font-bold text-navy uppercase tracking-wider">Priority access to "The Vault" off-market inventory</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-charcoal text-white px-12 py-8 mt-auto print:break-inside-avoid">
                    <div className="flex justify-between items-end">
                        <div>
                            <h4 className="font-serif text-lg mb-4">Contact Us</h4>
                            <div className="space-y-1 text-sm text-gray-400">
                                <p>partnerships@sportsmemorabilia.store</p>
                                <p>+44 (0) 20 7123 4567</p>
                                <p>www.sportsmemorabilia.store</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center space-x-2 border border-white/20 px-3 py-1 rounded-full bg-white/5 mb-2">
                                <ShieldCheck className="w-4 h-4 text-gold" />
                                <span className="text-xs tracking-wider">LIFETIME AUTHENTICITY GUARANTEE</span>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Confidential - For Business Partners Only</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @media print {
            body { 
                background: white; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .no-print { display: none; }
        }
      `}</style>
        </div>
    );
}
