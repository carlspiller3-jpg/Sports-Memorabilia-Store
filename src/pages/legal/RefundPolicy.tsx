import { ReactNode } from 'react';

export function RefundPolicy() {
    return (
        <LegalLayout title="Refund Policy" lastUpdated="December 2025">
            <Section title="1. Returns Period">
                <p>
                    Our policy lasts 14 days. If 14 days have gone by since your purchase was delivered, unfortunately, we cannot offer you a refund or exchange.
                    To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging.
                    It must also include the Certificate of Authenticity (COA) and any holographic tags must remain intact.
                </p>
            </Section>

            <Section title="2. Authenticity Guarantee">
                <p>
                    We offer a <strong>lifetime money-back guarantee</strong> regarding the authenticity of our items.
                </p>
                <p>
                    If any item is proven to be non-authentic by a recognised third-party authority (such as PSA/DNA, JSA, or Beckett),
                    we will issue a full refund immediately, including all shipping costs. This guarantee has no time limit.
                </p>
            </Section>

            <Section title="3. Non-Returnable Items">
                <p>
                    Several types of goods are exempt from being returned:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                    <li>Gift cards</li>
                    <li>Downloadable software products</li>
                    <li>Personalised items (e.g., items signed specifically "To [Name]")</li>
                </ul>
            </Section>

            <Section title="4. Refunds Process">
                <p>
                    Once your return is received and inspected (verifying the hologram and condition), we will send you an email to notify you that we have received your returned item.
                    We will also notify you of the approval or rejection of your refund.
                </p>
                <p>
                    If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within 5-10 business days.
                </p>
            </Section>

            <Section title="5. Shipping Returns">
                <p>
                    To return your product, please contact us at <a href="mailto:support@sportssigned.com" className="text-gold hover:underline">support@sportssigned.com</a> for a return authorisation.
                </p>
                <p>
                    You will be responsible for paying for your own shipping costs for returning your item (unless the return is due to an error on our part or an authenticity issue).
                    Shipping costs are non-refundable.
                </p>
                <p>
                    If you are shipping an item over £50, you should consider using a trackable shipping service or purchasing shipping insurance. We don't guarantee that we will receive your returned item.
                </p>
            </Section>
        </LegalLayout>
    )
}

function LegalLayout({ title, lastUpdated, children }: { title: string, lastUpdated: string, children: ReactNode }) {
    return (
        <div className="min-h-screen bg-ivory py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">{title}</h1>
                    <p className="text-navy/60">Last Updated: {lastUpdated}</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-stone/10 space-y-8 text-navy/80 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string, children: ReactNode }) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold text-charcoal font-serif">{title}</h2>
            <div className="space-y-4">
                {children}
            </div>
        </section>
    )
}
