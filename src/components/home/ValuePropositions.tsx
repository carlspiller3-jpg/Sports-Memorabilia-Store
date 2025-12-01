import { ShieldCheck, Truck, Package, Lock } from "lucide-react"

const valueProps = [
    {
        icon: ShieldCheck,
        title: "Authenticity Guaranteed",
        description: "100% authentic or your money back",
    },
    {
        icon: Package,
        title: "Museum-Grade Quality",
        description: "Hand-framed by master craftsmen",
    },
    {
        icon: Lock,
        title: "Safe & Secure",
        description: "Apple Pay, Google Pay, Cards accepted",
    },
    {
        icon: Truck,
        title: "Reliable Delivery",
        description: "Carefully packaged and shipped with care",
    },
]

export function ValuePropositions() {
    return (
        <section className="bg-white py-16 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {valueProps.map((prop, index) => {
                        const Icon = prop.icon
                        return (
                            <div key={index} className="text-center space-y-3">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                                    <Icon className="h-6 w-6 text-gold" />
                                </div>
                                <h3 className="font-serif text-lg font-semibold text-navy">{prop.title}</h3>
                                <p className="text-sm text-charcoal/70">{prop.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
