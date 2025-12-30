import { ShieldCheck, Frame, Truck } from "lucide-react"

const features = [
    {
        icon: ShieldCheck,
        title: "100% Authenticated",
        description: "Every item comes with NFC digital authentication."
    },
    {
        icon: Frame,
        title: "Premium Framing",
        description: "Professional framing with UV-protective glass."
    },
    {
        icon: Truck,
        title: "Secure Insured Shipping",
        description: "Fully insured global delivery in custom protective packaging."
    }
]

export function TrustIndicators() {
    return (
        <section className="bg-navy py-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-center gap-4 text-center md:text-left">
                            <div className="p-3 rounded-full bg-gold/10 text-gold shrink-0">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-white font-serif font-bold text-lg">{feature.title}</h3>
                                <p className="text-white/60 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
