import { useState } from "react";
import { Button } from "./Button";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface WaitlistSignupProps {
    interest?: string;
}

export function WaitlistSignup({ interest = "General" }: WaitlistSignupProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Production API call
            const emailRes = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    interest
                })
            });

            if (!emailRes.ok) throw new Error('Failed to join waitlist');

            const data = await emailRes.json();
            const newOwnCode = data.referralCode;

            // 2. Supabase Insert
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([
                    {
                        email,
                        interest,
                        own_referral_code: newOwnCode
                    }
                ]);

            if (error && error.code !== '23505') {
                console.error("Supabase Error:", error);
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
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-500">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6" />
                </div>
                <p className="text-navy font-bold">You're on the list!</p>
                <p className="text-navy/60 text-sm">We'll notify you as soon as new items drop.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-stone-50 border border-stone/20 rounded-sm focus:outline-none focus:border-gold text-navy"
                required
                disabled={isSubmitting}
            />
            <Button
                type="submit"
                className="bg-navy hover:bg-gold text-white px-8 h-[50px] transition-colors"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining...
                    </>
                ) : (
                    'Notify Me'
                )}
            </Button>
        </form>
    );
}
