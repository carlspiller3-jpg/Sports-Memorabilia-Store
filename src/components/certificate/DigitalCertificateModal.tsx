import React, { useState } from "react"
import { ShieldCheck, Printer, Maximize2, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CertificateData {
    title: string
    date: string
    location: string
    contract: string
    tokenId: string
    image: string
    tagId?: string
}

interface DigitalCertificateModalProps {
    certificate: CertificateData
    onClose: () => void
    onOpenFullPhoto?: () => void
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
    certificate,
    onClose,
    onOpenFullPhoto
}) => {
    const [imageLoaded, setImageLoaded] = useState(true)

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static print:block">
            {/* Modal Container */}
            <div className="relative max-w-3xl w-full bg-ivory rounded-lg shadow-2xl border-4 border-gold/40 my-auto print:shadow-none print:border-4 print:border-navy print:my-0 print:max-w-none">
                
                {/* Top Toolbar (Hidden during print) */}
                <div className="flex items-center justify-between px-6 py-4 bg-navy text-white rounded-t-sm border-b border-gold/30 print:hidden">
                    <div className="flex items-center space-x-2">
                        <img 
                            src="/logo-transparent.png" 
                            alt="" 
                            className="h-6 w-auto object-contain"
                        />
                        <span className="font-serif font-bold text-sm tracking-wider uppercase">
                            Official Digital Certificate of Authenticity
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white text-xs gap-1.5"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print or Save Certificate</span>
                        </Button>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            aria-label="Close Certificate"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Printable Certificate Card */}
                <div className="p-6 sm:p-10 relative bg-ivory text-charcoal print:p-8">
                    {/* Ornamental Inner Frame Border */}
                    <div className="border-2 border-gold/30 rounded-sm p-4 sm:p-8 relative bg-white/60 backdrop-blur-xs">
                        
                        {/* Header Company Logo and Title */}
                        <div className="text-center space-y-3 mb-8">
                            <div className="flex justify-center mb-3">
                                <img 
                                    src="/logo-transparent.png" 
                                    alt="Sports Memorabilia Store" 
                                    className="h-16 sm:h-20 w-auto object-contain drop-shadow-xs" 
                                />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold mb-1">
                                    Sports Memorabilia Store Limited
                                </p>
                                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy tracking-tight uppercase">
                                    Certificate of Authenticity
                                </h1>
                                <p className="text-xs text-navy/60 font-mono mt-1">
                                    Official Register ID: {certificate.tagId || "VERIFIED-NFC"}
                                </p>
                            </div>
                            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4" />
                        </div>

                        {/* Certificate Declaration Statement */}
                        <p className="text-xs sm:text-sm text-center text-charcoal/80 max-w-xl mx-auto leading-relaxed font-light mb-8">
                            This document officially certifies that the hand signed sports memorabilia item detailed below has been independently verified, cryptographically registered, and guaranteed genuine by Sports Memorabilia Store Limited under strict chain of custody protocols.
                        </p>

                        {/* Product Photo and Meta Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-8">
                            {/* Product Photo Preview */}
                            <div className="md:col-span-5 flex flex-col items-center">
                                <div 
                                    className="relative rounded border-2 border-gold/30 overflow-hidden bg-stone/10 shadow-md group cursor-pointer w-full max-w-[240px] aspect-4/3 flex items-center justify-center"
                                    onClick={onOpenFullPhoto}
                                >
                                    {imageLoaded ? (
                                        <img 
                                            src={certificate.image} 
                                            alt={certificate.title}
                                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                                            onError={() => setImageLoaded(false)}
                                        />
                                    ) : (
                                        <div className="p-4 text-center text-xs text-stone/50">Photo Preview</div>
                                    )}
                                    <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center print:hidden">
                                        <span className="text-[11px] font-medium text-white bg-navy/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                                            <Maximize2 className="w-3 h-3" /> View Photo
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-navy/50 mt-2 font-medium print:hidden">
                                    Click photo to enlarge
                                </span>
                            </div>

                            {/* Verification Specifications Grid */}
                            <div className="md:col-span-7 space-y-3 bg-ivory/80 p-4 sm:p-5 rounded border border-stone/15 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy/50 block">Item Description</span>
                                    <span className="font-serif text-base font-bold text-navy">{certificate.title}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone/10">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/50 block">Signing Date</span>
                                        <span className="font-medium text-charcoal">{certificate.date || "Official Signing"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/50 block">Signing Location</span>
                                        <span className="font-medium text-charcoal">{certificate.location || "United Kingdom"}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone/10">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/50 block">NFC Tag Serial</span>
                                        <span className="font-mono text-gold font-bold">{certificate.tagId || "NFC-ACTIVE"}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/50 block">Contract Issuer</span>
                                        <span className="font-medium text-navy">{certificate.contract}</span>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-stone/10">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-navy/50 block">Certificate Ledger Token</span>
                                    <span className="font-mono text-[10px] text-gold/90 break-all">{certificate.tokenId}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seal and Signature Footer */}
                        <div className="pt-6 border-t-2 border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                            {/* Gold Verification Emblem */}
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full border-2 border-gold bg-gradient-to-br from-amber-100 via-gold/20 to-amber-200 flex items-center justify-center p-1 text-center shadow-inner shrink-0">
                                    <div className="w-full h-full rounded-full border border-dashed border-gold/80 flex flex-col items-center justify-center p-1">
                                        <CheckCircle className="w-5 h-5 text-gold mb-0.5" />
                                        <span className="text-[7px] font-bold uppercase tracking-tighter leading-none text-navy">
                                            100% Verified
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-navy block uppercase tracking-wider">
                                        Unconditional Guarantee
                                    </span>
                                    <span className="text-[11px] text-navy/60 font-light block leading-tight">
                                        Backed by 100% money back lifetime legal authenticity warranty.
                                    </span>
                                </div>
                            </div>

                            {/* Signatory Signature Block */}
                            <div className="text-center sm:text-right">
                                <div className="font-serif italic text-lg text-navy tracking-wide font-bold">
                                    Sports Memorabilia Store
                                </div>
                                <div className="h-0.5 w-36 bg-gold/50 ml-auto my-1" />
                                <span className="text-[10px] uppercase font-bold tracking-widest text-navy/50 block">
                                    Official Issuing Authority
                                </span>
                                <span className="text-[9px] text-stone/60 block font-mono">
                                    London, United Kingdom
                                </span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Modal Footer Controls (Hidden during print) */}
                <div className="px-6 py-4 bg-stone/5 border-t border-stone/15 flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <span className="text-xs text-navy/60">
                        Smart Tag Serial: <strong className="font-mono text-gold">{certificate.tagId || "NFC-ACTIVE"}</strong>
                    </span>
                    <div className="flex items-center space-x-3">
                        {onOpenFullPhoto && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onOpenFullPhoto}
                                className="text-xs"
                            >
                                <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                                View Full High Res Photo
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onClose}
                            className="text-xs"
                        >
                            Close
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
