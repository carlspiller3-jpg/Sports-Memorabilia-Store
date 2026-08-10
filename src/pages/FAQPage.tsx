import { Helmet } from "react-helmet-async"
import { PageHero } from "@/components/ui/PageHero"

export function FAQPage() {
    const faqs = [
        {
            category: "Authenticity",
            items: [
                {
                    q: "How do I know the items are real?",
                    a: "Every item has a lifetime guarantee. We check each signature with a smart NFC tag. Tap your phone on the item. You will see the proof instantly."
                },
                {
                    q: "Do items come with a certificate?",
                    a: "Yes, but even better. Paper certificates can be lost or copied. Your item comes with a safe digital certificate linked to its smart tag."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            items: [
                {
                    q: "Do you ship to other countries?",
                    a: "Yes, we ship all over the world. We send all items with tracking and insurance. They will arrive safely."
                },
                {
                    q: "How long does shipping take?",
                    a: "UK orders arrive in 1 to 2 days. Shipping to other countries takes 3 to 7 days."
                },
                {
                    q: "Is my package safe during shipping?",
                    a: "Yes. We insure every package. If it gets lost or broken, we pay for it."
                }
            ]
        },
        {
            category: "Returns & Framing",
            items: [
                {
                    q: "Can I return my item?",
                    a: "Yes. You have 14 days to return it. It must be in the same condition with its tags on."
                },
                {
                    q: "Can you frame my item?",
                    a: "Yes. We frame most of our items. Select 'Framed' when you add the item to your cart."
                }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-ivory pb-20">
            <Helmet>
                <title>Common Questions | Sports Memorabilia Store</title>
                <meta name="description" content="Find quick answers about our real items, shipping, and returns." />
            </Helmet>

            <PageHero 
                title="Common Questions"
                subtitle="Find quick answers here about our items, shipping, and returns."
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
