import { Plus, Minus } from "lucide-react"
import { useState } from "react"

export function FAQPage() {
    const faqs = [
        {
            question: "Is every item authentic?",
            answer: "Yes, absolutely. Every single item we sell comes with a lifetime authenticity guarantee. We use proprietary NFC technology to digitally verify every item, alongside photo proof where available. Each item is personally procured and signed by the athlete directly - we never buy from third parties."
        },
        {
            question: "How does the NFC verification work?",
            answer: "Each item has a tamper-proof NFC tag attached (usually on the frame or item itself). Simply tap your smartphone to the tag to instantly view the item's digital certificate, signing history, and provenance on our secure platform. No app required - it works with any NFC-enabled phone."
        },
        {
            question: "Are all items already framed?",
            answer: "Yes! Every item we sell comes professionally framed to premium standards. We use UV-protective glass and acid-free mounts to ensure your memorabilia is preserved for generations. All items arrive ready to display - no additional framing needed."
        },
        {
            question: "What framing styles are available?",
            answer: "We offer multiple premium frame styles including classic black, elegant gold, and natural oak finishes. You can select your preferred frame style on each product page. All frames are professionally mounted with high-quality materials."
        },
        {
            question: "How long does shipping take?",
            answer: "For UK orders, standard shipping typically takes 3-5 business days and costs £8. International shipping times vary by destination (typically 5-10 business days), with costs calculated automatically at checkout. All shipments are fully insured and tracked."
        },
        {
            question: "What are your shipping costs?",
            answer: "UK shipping is a flat rate of £8 for all orders. International shipping costs are calculated automatically at checkout based on your destination. We use premium, insured carriers to ensure your item arrives safely."
        },
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day money-back guarantee. If you are not completely satisfied with your purchase, you can return it to us in its original condition for a full refund. Items must be returned in their original packaging with all certificates and tags intact. Please note that return shipping costs are the responsibility of the customer unless the item is defective."
        },
        {
            question: "Can I return a framed item?",
            answer: "Yes, framed items can be returned within 30 days in their original condition. Due to the fragile nature of framed memorabilia, please ensure items are securely packaged for return shipping. We recommend using the original packaging and a tracked, insured shipping service."
        },
        {
            question: "Do you buy memorabilia from customers?",
            answer: "No, we do not purchase items from customers or third parties. Every single item in our collection is personally procured by our team and signed directly by the athlete. This ensures complete authenticity and provenance for every piece we sell."
        },
        {
            question: "How do you source your items?",
            answer: "We work directly with athletes, sports clubs, and official signing events to procure all our memorabilia. Every item is signed in person by the athlete, with photo and video documentation where possible. This direct sourcing model ensures 100% authenticity."
        },
        {
            question: "Can I request a specific item or athlete?",
            answer: "While we can't guarantee specific requests, we're always interested in hearing what our customers are looking for. Please contact us via the Contact page with your request, and we'll do our best to source it for you through our network of athletes and clubs."
        },
        {
            question: "Do you offer gift wrapping?",
            answer: "All items are delivered in our signature premium packaging, which is elegant and gift-ready. If you'd like a personalized gift message included, please add a note at checkout and we'll include it with your order."
        },
        {
            question: "Can I collect my order in person?",
            answer: "We currently operate online only and do not have a physical showroom. All orders are shipped directly to your address. However, if you're in the London area and would like to arrange a special collection, please contact us to discuss options."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment gateway."
        },
        {
            question: "Is my payment information secure?",
            answer: "Absolutely. We use bank-grade SSL encryption for all transactions. We never store your full card details on our servers - all payment processing is handled by our secure, PCI-compliant payment provider."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship worldwide! International shipping costs are calculated automatically at checkout based on your destination (typically 5-10 business days). Please note: customers are responsible for any customs duties, import taxes, or tariffs charged by their country. These fees are not included in our shipping cost and must be paid by the recipient upon delivery. All international shipments are fully insured and tracked."
        },
        {
            question: "What if my item arrives damaged?",
            answer: "While extremely rare due to our premium packaging and insured shipping, if your item arrives damaged, please contact us immediately with photos. We'll arrange a replacement or full refund, including all shipping costs. All shipments are fully insured for your protection."
        },
        {
            question: "How does the Send-In Service work?",
            answer: "You send us your own item, we get it signed by the athlete during a private session, and we return it to you authenticated. You must book a 'Send-In Slot' on the event product page first. We will then email you the secure address to post your item to."
        },
        {
            question: "Is my Send-In item insured?",
            answer: "We insure your item fully while it is in our possession and during return transit to you. However, you are responsible for insuring the item when you post it TO us. We strongly recommend using a tracked, insured service (like Royal Mail Special Delivery)."
        },
        {
            question: "Can I request a specific dedication?",
            answer: "Yes! When booking your slot, you can enter 'Signing Instructions' (e.g., 'To John', 'Sign in Silver'). We do our absolute best to accommodate these, but they are ultimately at the athlete's discretion."
        }
    ]

    return (
        <div className="min-h-screen bg-ivory py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">Frequently Asked Questions</h1>
                    <p className="text-navy/60">Everything you need to know about our products and services.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-white rounded-sm border border-stone/10">
                    <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Still have questions?</h3>
                    <p className="text-navy/60 mb-4">We're here to help! Get in touch with our team.</p>
                    <a href="/contact" className="inline-block bg-gold text-navy px-6 py-3 rounded-sm font-medium hover:bg-gold/90 transition-colors">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white border border-stone/10 rounded-sm overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-stone/5 transition-colors"
            >
                <span className="font-bold text-charcoal text-lg">{question}</span>
                {isOpen ? (
                    <Minus className="w-5 h-5 text-gold flex-shrink-0" />
                ) : (
                    <Plus className="w-5 h-5 text-gold flex-shrink-0" />
                )}
            </button>
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-6 pt-0 text-navy/80 leading-relaxed border-t border-stone/5">
                    {answer}
                </div>
            </div>
        </div>
    )
}
