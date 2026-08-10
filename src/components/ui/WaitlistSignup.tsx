import { useState } from "react";
import { Button } from "./Button";
import { Check, Loader2, BellRing } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface WaitlistSignupProps {
    interest?: string;
    productHandle?: string;
    variantId?: string;
    title?: string; // Optional custom title
}

export function WaitlistSignup({ interest = "General", productHandle, variantId, title }: WaitlistSignupProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (productHandle) {
                // Product Specific Waitlist - EMAIL ONLY
                const { error } = await supabase
                    .from('product_waitlist')
                    .insert([
                        {
                            email,
                            product_handle: productHandle,
                            variant_id: variantId,
                            status: 'pending'
                        }
                    ]);

                if (error) throw error;

            } else {
                // General Newsletter / Interest
                try {
                    await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, interest })
                    });
                } catch (e) {
                    // console.warn("Email API skipped or failed", e);
                }

                const { error } = await supabase
                    .from('newsletter_subscribers')
                    .insert([
                        {
                            email,
                            interest,
                        }
                    ]);
                if (error && error.code !== '23505') throw error;
            }

            setIsSuccess(true);
        } catch (err) {
            console.error("Waitlist Error:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-6 animate-in fade-in zoom-in duration-500 bg-green-50/50 rounded-lg border border-green-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                </div>
                <p className="text-navy font-bold">You're on the list!</p>
                <p className="text-navy/60 text-sm text-center px-4 mt-2">
                    {productHandle
                        ? "We'll notify you 2 weeks before this item is ready, so you can secure it."
                        : "We'll notify you as soon as new items drop."
                    }
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {title && (
                <div className="flex items-center gap-2 mb-3 text-charcoal font-bold">
                    <BellRing className="w-4 h-4 text-gold" />
                    <span>{title}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white border border-stone/20 rounded-sm focus:outline-none focus:border-gold text-navy min-w-0"
                    required
                    disabled={isSubmitting}
                />
                <Button
                    type="submit"
                    className="bg-navy hover:bg-gold text-white px-6 h-[50px] transition-colors whitespace-nowrap"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            joining...
                        </>
                    ) : (
                        productHandle ? 'Join Waitlist' : 'Notify Me'
                    )}
                </Button>
            </form>
            {productHandle && (
                <p className="text-xs text-navy/50 mt-2 text-center sm:text-left">
                    We will notify you 2 weeks before payment is required.
                </p>
            )}
        </div>
    );
}
