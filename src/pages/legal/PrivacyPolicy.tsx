import { ShieldCheck, Mail, Globe, Clock, UserCheck } from "lucide-react"

export function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-ivory py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">Privacy Policy</h1>
                    <p className="text-navy/60 font-medium uppercase tracking-widest text-sm">Effective Date: April 24, 2026</p>
                </div>

                <div className="bg-white p-8 md:p-16 rounded-sm shadow-sm border border-stone/10 space-y-12 text-navy/80 leading-relaxed">
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <UserCheck className="w-6 h-6 text-gold" />
                            <h2 className="text-2xl font-bold text-charcoal font-serif">1. Data Controller</h2>
                        </div>
                        <p>
                            Sports Memorabilia Store Limited ("we", "us", or "our") is the data controller responsible for your personal data. 
                            Our registered office is located at 189 Greenwood, Walters Ash, High Wycombe, HP14 4XF, United Kingdom. 
                            Our Company Registration Number is 16854974 and our VAT Registration Number is GB514026140.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-charcoal font-serif">2. The Data We Collect</h2>
                        <p>
                            We collect and process personal data to provide our services and maintain the integrity of our Heritage Registry. This includes:
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-4">
                            <div className="p-5 bg-stone/5 border border-stone/10 rounded-sm">
                                <h3 className="font-bold text-charcoal mb-2">Transaction & Identity</h3>
                                <p className="text-sm">Name, billing address, delivery address, and purchase history required to fulfill orders and verify provenance.</p>
                            </div>
                            <div className="p-5 bg-stone/5 border border-stone/10 rounded-sm">
                                <h3 className="font-bold text-charcoal mb-2">Technical & Usage</h3>
                                <p className="text-sm">IP address, browser type, and interaction data to optimize your experience and prevent fraudulent activity.</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-charcoal font-serif">3. Legal Basis for Processing</h2>
                        <p>
                            Under UK GDPR, we rely on the following legal bases:
                        </p>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Contractual Necessity:</strong> To fulfill your order and deliver your items.</li>
                            <li><strong>Legitimate Interests:</strong> To maintain the security of our site and the historical accuracy of our Registry.</li>
                            <li><strong>Legal Obligation:</strong> To comply with tax and accounting laws in the UK.</li>
                            <li><strong>Consent:</strong> Where you have opted-in to receive our intelligence updates and newsletters.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-6 h-6 text-gold" />
                            <h2 className="text-2xl font-bold text-charcoal font-serif">4. International Transfers</h2>
                        </div>
                        <p>
                            As we utilize Shopify for our e-commerce infrastructure, your data may be transferred to and stored in countries outside of the UK and EEA, including the United States. We ensure all such transfers are protected by standard contractual clauses or other legally recognized safeguards.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-6 h-6 text-gold" />
                            <h2 className="text-2xl font-bold text-charcoal font-serif">5. Data Retention</h2>
                        </div>
                        <p>
                            We retain transaction data for a minimum of 6 years to comply with UK tax laws. Information related to item provenance and our Heritage Registry is retained indefinitely to ensure the ongoing value and verification of your collectibles.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-charcoal font-serif">6. Your Legal Rights</h2>
                        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-navy/60">
                            <span className="px-3 py-1 bg-stone/10 rounded-full">Request Access</span>
                            <span className="px-3 py-1 bg-stone/10 rounded-full">Request Correction</span>
                            <span className="px-3 py-1 bg-stone/10 rounded-full">Request Erasure</span>
                            <span className="px-3 py-1 bg-stone/10 rounded-full">Object to Processing</span>
                            <span className="px-3 py-1 bg-stone/10 rounded-full">Data Portability</span>
                        </div>
                    </section>

                    <section className="space-y-4 p-8 bg-navy text-white rounded-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-8 h-8 text-gold" />
                            <h2 className="text-2xl font-bold font-serif text-white">7. Security</h2>
                        </div>
                        <p className="text-white/80">
                            We use industry-standard encryption and security protocols to protect your data. All payment processing is handled by Level 1 PCI-compliant providers (Shopify Payments / Stripe). We never store your full credit card details on our servers.
                        </p>
                    </section>

                    <section className="space-y-4 pt-8 border-t border-stone/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-6 h-6 text-gold" />
                            <h2 className="text-2xl font-bold text-charcoal font-serif">8. Contact & Complaints</h2>
                        </div>
                        <p>
                            If you have questions about this policy, please contact us at <a href="mailto:privacy@sportssigned.com" className="text-gold font-bold hover:underline">privacy@sportssigned.com</a>.
                        </p>
                        <p className="text-sm text-navy/50">
                            You also have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues (www.ico.org.uk).
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

