
export function CookiePolicy() {
    return (
        <div className="min-h-screen bg-ivory py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">Cookie Policy</h1>
                    <p className="text-navy/60">Last Updated: December 2025</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-stone/10 space-y-8 text-navy/80 leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-charcoal font-serif">1. What Are Cookies</h2>
                        <p>
                            Cookies are small text files that are placed on your computer or mobile device when you visit our website.
                            We use them to ensure our website works correctly, to understand how you use our site, and to provide personalized experiences.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-charcoal font-serif">2. Types of Cookies We Use</h2>
                        <ul className="list-disc pl-5 space-y-4">
                            <li>
                                <strong>Strictly Necessary Cookies:</strong> These are essential for the website to function (e.g., adding items to your cart, logging in). You cannot switch these off.
                            </li>
                            <li>
                                <strong>Analytics Cookies:</strong> We use tools like Google Analytics to understand visitor numbers and traffic sources so we can improve our performance.
                            </li>
                            <li>
                                <strong>Functional Cookies:</strong> These allow the website to provide enhanced functionality and personalization, such as remembering your preferences.
                            </li>
                            <li>
                                <strong>Marketing Cookies:</strong> These may be set by our advertising partners (e.g., Klaviyo, Facebook) to build a profile of your interests and show you relevant adverts on other sites.
                            </li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-charcoal font-serif">3. Managing Info</h2>
                        <p>
                            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
                            If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-charcoal font-serif">4. Updates to This Policy</h2>
                        <p>
                            We may update this policy from time to time. Any changes will be posted on this page with an updated revision date.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
