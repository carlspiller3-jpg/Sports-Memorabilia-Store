import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, TrendingUp, Building2, Download } from "lucide-react";

export function B2BProposal() {
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-stone/10 pt-28 pb-12 print:p-0 print:bg-white">
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
                <div className="bg-navy px-12 py-10 text-white relative overflow-hidden print:break-inside-avoid">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
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

                        <h1 className="font-serif text-4xl font-bold leading-tight mb-4">
                            Authentic. Rare. <br />
                            <span className="text-gold">Legendary.</span>
                        </h1>
                        <p className="text-lg text-white/80 max-w-lg leading-relaxed font-light">
                            We source the best. You gift the best. <br />
                            The only source for verifiable, authentic sports memorabilia.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-12 py-8 flex-1 text-charcoal text-justify">

                    {/* The Problem & Solution */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-gold font-bold uppercase tracking-wider text-xs mb-3">The Issue</h3>
                            <h2 className="font-serif text-2xl text-navy mb-4 font-bold">Most of it is fake.</h2>
                            <p className="text-sm leading-relaxed text-gray-600">
                                The memorabilia market is full of fakes and cheap presentations. Sending a client a "signed" shirt that turns out to be a knock-off, or comes in a flimsy plastic frame, damages your brand instead of building it.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-gold font-bold uppercase tracking-wider text-xs mb-3">The Solution</h3>
                            <h2 className="font-serif text-2xl text-navy mb-4 font-bold">Uncompromising Quality</h2>
                            <ul className="space-y-3">
                                <li className="text-sm text-gray-700">
                                    <strong>100% Authenticated:</strong> Every item comes with undeniable proof of authenticity via NFC & Blockchain technology.
                                </li>
                                <li className="text-sm text-gray-700">
                                    <strong>Premium Framing:</strong> Professional bespoke mounting with UV-protective glass for lifetime preservation.
                                </li>
                            </ul>
                        </div>
                    </div>


                    {/* Framed Example Image */}
                    {/* Framed Example Showcase */}
                    <div className="mb-8 flex flex-row items-center gap-6">
                        {/* Image - Left Aligned */}
                        <div className="shrink-0">
                            <img
                                src="/boardroom-framed-cropped.png"
                                alt="Framed memorabilia in boardroom"
                                className="h-48 w-auto rounded-xl shadow-2xl border border-navy/10"
                            />
                        </div>

                        {/* Text - Right Side */}
                        <div>
                            <h3 className="font-serif text-xl text-navy font-bold mb-3">Elevate Your Space</h3>
                            <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                Make a lasting impression. Whether it's the boardroom or the reception area, our authentic memorabilia creates a talking point that commands respect and celebrates excellence. It's not just decoration; it's a statement of success.
                            </p>
                        </div>
                    </div>

                    <hr className="border-gray-200 mb-8" />

                    {/* Opportunities */}
                    <h2 className="font-serif text-2xl text-navy mb-6 font-bold">What we offer</h2>

                    <div className="space-y-4">
                        {/* Item 1 */}
                        <div className="flex gap-6 items-start p-6 bg-ivory rounded-lg border border-stone/20 print:border-gray-300">
                            <div className="p-3 bg-navy text-gold rounded-full shrink-0">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-navy font-bold mb-2">Corporate Gifting</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                    A hamper gets eaten and forgotten. A signed masterpiece stays on the wall forever. Make a real impact with your VIP clients.
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-6 items-start p-6 bg-ivory rounded-lg border border-stone/20 print:border-gray-300">
                            <div className="p-3 bg-navy text-gold rounded-full shrink-0">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl text-navy font-bold mb-2">The Vault</h3>
                                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                    For investment. Highly sought-after signed pieces are alternative assets that hold value. We give our partners first refusal on stock that never hits the website.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-navy text-white px-12 py-6 mt-auto print:break-inside-avoid">
                    <div className="flex justify-between items-end">
                        <div>
                            <h4 className="font-serif text-lg mb-4">Contact</h4>
                            <div className="space-y-1 text-sm text-gray-400">
                                <p>rhys@sportssigned.com</p>
                                <p>sportssigned.com</p>
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
            @page { 
                margin: 0; 
                size: auto;
            }
            body { 
                background: white; 
                margin: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            /* Hide absolute everything except the content container */
            header, footer, nav, .no-print, [data-cart-trigger] { 
                display: none !important; 
            }
        }
      `}</style>
        </div >
    );
}
