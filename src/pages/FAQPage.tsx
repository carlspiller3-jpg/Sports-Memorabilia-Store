
import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"

export function FAQPage() {
    const faqs = [
        {
            category: "Authenticity",
            items: [
                {
                    q: "How do I know the items are real?",
                    a: "Every item we sell comes with a lifetime guarantee of authenticity. We verify every signature using our proprietary blockchain-backed NFC technology. You can tap your phone against the item to see its full provenance and certificate of authenticity instantly."
                },
                {
                    q: "Do items come with a certificate?",
                    a: "Yes, but better. Instead of a paper certificate which can be lost or forged, your item comes with a tamper-proof digital certificate referenced by its unique NFC tag."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            items: [
                {
                    q: "Do you ship internationally?",
                    a: "Yes, we ship globally. All international orders are sent via tracked and insured courier services (DHL/FedEx) to ensure they arrive safely."
                },
                {
                    q: "How long does delivery take?",
                    a: "UK orders typically arrive within 1-2 working days. International shipping usually takes 3-7 working days depending on the destination and customs clearance."
                },
                {
                    q: "Is my package insured?",
                    a: "Absolutely. All shipments are fully insured against loss or damage during transit."
                }
            ]
        },
        {
            category: "Returns & Services",
            items: [
                {
                    q: "What is your return policy?",
                    a: "We offer a 14-day return policy for all items, provided they are returned in the exact condition they were received, with all security tags intact."
                },
                {
                    q: "Do you offer framing services?",
                    a: "Most of our items are available with professional framing options. You can select 'Framed' when adding an item to your cart."
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-ivory pb-20">
            <Helmet>
                <title>FAQ | Sports Memorabilia Store</title>
                <meta name="description" content="Frequently Asked Questions about our authentic sports memorabilia, shipping, and returns." />
            </Helmet>

            <PageHero 
                title="Frequently Asked Questions"
                subtitle="Everything you need to know about our products and services."
                backgroundImage="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto space-y-12">
                    {faqs.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-navy border-b border-stone/10 pb-2">
                                {section.category}
                            </h2>
                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <details key={i} className="group bg-white rounded-sm border border-stone/10 open:ring-1 open:ring-gold/50">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-medium text-charcoal hover:text-gold transition-colors">
                                            <span>{item.q}</span>
                                            <span className="transition-transform group-open:rotate-180">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <div className="px-6 pb-6 text-stone/80 leading-relaxed animate-fade-in">
                                            {item.a}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
