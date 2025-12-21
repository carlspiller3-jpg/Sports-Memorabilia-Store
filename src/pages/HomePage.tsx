import { Helmet } from "react-helmet-async"
import { Hero } from "@/components/home/Hero"
import { TrustIndicators } from "@/components/home/TrustIndicators"
import { AuthenticitySection } from "@/components/home/AuthenticitySection"
import { PresentationSection } from "@/components/home/PresentationSection"

import { WaitlistModal } from "@/components/home/WaitlistModal"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function HomePage() {
    const [footerEmail, setFooterEmail] = useState("")
    const [footerReferral, setFooterReferral] = useState("")
    const [footerStatus, setFooterStatus] = useState<"idle" | "submitting" | "success">("idle")

    const handleFooterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFooterStatus("submitting")

        try {
            // 1. Insert into Supabase
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([{ email: footerEmail, interest: 'General', referral_code: footerReferral }])

            if (error && error.code !== '23505') throw error // Ignore duplicate errors

            // 2. Send Email
            const emailRes = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: footerEmail })
            })

            if (!emailRes.ok) {
                const errorData = await emailRes.json();
                console.error("Email API Failed:", errorData);
                alert(`DEBUG ERROR: Email failed to send. \nReason: ${JSON.stringify(errorData)}\n\n(Did you add VITE_RESEND_API_KEY to Vercel Settings?)`);
            }

            setFooterStatus("success")
            setFooterEmail("")
        } catch (err) {
            console.error(err)
            alert("Something went wrong. Please try again.")
            setFooterStatus("idle")
        }
    }

    return (
        <div className="min-h-screen">
            <WaitlistModal />
            <Helmet>
                <title>Sports Memorabilia Store | Premium Authenticated Collectibles</title>
                <meta
                    name="description"
                    content="Premium authenticated sports memorabilia with professional framing. Every piece comes with NFC digital authentication and lifetime guarantee."
                />
                <meta property="og:title" content="Sports Memorabilia Store | Premium Authenticated Collectibles" />
                <meta property="og:description" content="Luxury gifting experiences people are proud to give. Authenticated sports memorabilia with premium framing." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Helmet>

            {/* Above the Fold: Hero + Trust Bar */}
            <div className="pt-[80px] min-h-screen lg:h-screen flex flex-col justify-between">
                <div className="flex-1 min-h-0 relative">
                    <Hero />
                </div>
                <div className="shrink-0 z-10 w-full">
                    <TrustIndicators />
                </div>
            </div>

            {/* Waitlist Section (Anchor) */}
            <section id="waitlist" className="bg-navy py-20 border-y border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">Be The First To Know</h2>
                    <p className="text-white/60 max-w-2xl mx-auto mb-8 text-lg">
                        Our first collection drops in <strong>January 2026</strong> featuring an exclusive curation of signed pieces from global icons.
                        Stock is strictly limited. Enter your email to get 48 hours early access.
                    </p>

                    {footerStatus === "success" ? (
                        <div className="p-6 bg-white/10 rounded-lg max-w-md mx-auto animate-in zoom-in">
                            <p className="text-gold font-bold text-xl mb-2">You are on the list.</p>
                            <p className="text-white/70 text-sm">Review your inbox for confirmation.</p>
                        </div>
                    ) : (
                        <form className="max-w-2xl mx-auto flex gap-3 flex-col sm:flex-row" onSubmit={handleFooterSubmit}>
                            <input
                                type="email"
                                value={footerEmail}
                                onChange={(e) => setFooterEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-4 rounded bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                                required
                                disabled={footerStatus === "submitting"}
                            />
                            <input
                                type="text"
                                value={footerReferral}
                                onChange={(e) => setFooterReferral(e.target.value.toUpperCase())}
                                placeholder="Referral Code (Optional)"
                                className="w-full sm:w-48 px-6 py-4 rounded bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold tracking-widest"
                                disabled={footerStatus === "submitting"}
                            />
                            <button
                                type="submit"
                                disabled={footerStatus === "submitting"}
                                className="bg-gold text-navy font-bold px-8 py-4 rounded hover:bg-gold/90 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {footerStatus === "submitting" ? "Processing..." : "Notify Me"}
                            </button>
                        </form>
                    )}

                    <p className="text-white/30 text-xs mt-4">We respect your inbox. No spam. Unsubscribe anytime.</p>
                </div>
            </section>

            {/* Below the Fold Content */}
            <AuthenticitySection />
            <PresentationSection />
        </div>
    )
}
