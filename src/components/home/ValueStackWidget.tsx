import { ShieldCheck, Frame, Truck, Database } from "lucide-react"

export function ValueStackWidget() {
    const benefits = [
        {
            icon: Frame,
            title: "£150 Framing Value",
            description: "Museum-grade conservation included"
        },
        {
            icon: Database,
            title: "Digital Ledger Provenance",
            description: "Immutable blockchain verification"
        },
        {
            icon: Truck,
            title: "Insured Global Dispatch",
            description: "Next-day white-glove delivery"
        }
    ]

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-sm space-y-6">
            <h3 className="text-[10px] font-bold text-gold uppercase tracking-[0.3em] mb-4">Included with every asset</h3>
            <div className="space-y-4">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                            <benefit.icon className="w-5 h-5 text-gold" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">{benefit.title}</p>
                            <p className="text-[10px] text-ivory/50 leading-relaxed">{benefit.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="text-[9px] font-bold text-ivory/40 uppercase tracking-widest">Lifetime Authenticity Guarantee</span>
            </div>
        </div>
    )
}
