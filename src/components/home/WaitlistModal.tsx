import { useState, useEffect, useRef } from "react";
import { X, Search, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const SUGGESTIONS = [
    "Football", "Boxing", "Formula 1", "Basketball", "American Football",
    "Rugby", "Cricket", "Tennis", "Golf", "UFC/MMA"
];

export function WaitlistModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [interest, setInterest] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2000);

        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterest(e.target.value);
        setShowSuggestions(true);
    };

    const selectSuggestion = (value: string) => {
        setInterest(value);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Create Profile & Generate Code in Klaviyo (via Local API)
            const emailRes = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    interest
                })
            });

            if (!emailRes.ok) throw new Error('Failed to create profile');

            const data = await emailRes.json();
            const newOwnCode = data.referralCode;

            // 2. Insert into Supabase (Log but don't fail if DB error)
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([
                    {
                        email,
                        interest
                    }
                ]);

            if (error) {
                console.error("Supabase Insert Error:", error);
                if (error.code === '23505') {
                    console.log("Already subscribed to DB");
                }
            }

            setIsOpen(false);
            setIsSuccess(true);

            setTimeout(() => {
                handleClose();
            }, 4000);

        } catch (err) {
            console.error("Error saving email:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredSuggestions = SUGGESTIONS.filter(item =>
        item.toLowerCase().includes(interest.toLowerCase()) &&
        item.toLowerCase() !== interest.toLowerCase()
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden">
            <div
                className="fixed inset-0 bg-navy/95 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative flex h-full w-full flex-col items-center pt-[25dvh] sm:justify-center sm:pt-0 p-4">
                <div className="relative w-full max-w-lg bg-white border border-navy/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 text-left">

                    <div className="bg-navy p-4 text-center border-b border-gold/20 rounded-t-xl relative">
                        <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
                            <Zap className="w-5 h-5 text-gold fill-gold" />
                        </div>
                        <h2 className="font-serif text-2xl text-white mb-1">
                            Store Is Now Live
                        </h2>
                        <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold">
                            Unlock a <span className="text-gold">10% Discount Code</span>
                        </p>
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1.5 bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-5 sm:p-8">
                        {!isSuccess ? (
                            <>
                                <p className="text-navy/70 text-center mb-6 text-sm sm:text-base leading-relaxed">
                                    Join our inner circle today and we'll send an immediate <strong>10% Discount Code</strong> to your inbox for your first order.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-2">
                                    <div>
                                        <label className="block text-[10px] font-bold text-navy/50 uppercase tracking-wider mb-0.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-2 rounded-lg bg-ivory border border-navy/10 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                                            required
                                        />
                                    </div>

                                    <div className="relative" ref={wrapperRef}>
                                        <label className="block text-[10px] font-bold text-navy/50 uppercase tracking-wider mb-0.5">My Main Interest</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={interest}
                                                onChange={handleInterestChange}
                                                onFocus={() => setShowSuggestions(true)}
                                                placeholder="e.g. Football, Boxing, F1..."
                                                className="w-full px-4 py-2 pl-9 rounded-lg bg-ivory border border-navy/10 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                                                required
                                            />
                                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-navy/30" />
                                        </div>

                                        {showSuggestions && filteredSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-navy/10 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                {filteredSuggestions.map((suggestion) => (
                                                    <button
                                                        key={suggestion}
                                                        type="button"
                                                        onClick={() => selectSuggestion(suggestion)}
                                                        className="w-full text-left px-4 py-2 text-sm text-navy hover:bg-ivory hover:text-gold transition-colors"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gold hover:bg-gold/90 text-navy font-bold text-base mt-4 shadow-lg shadow-gold/10"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Unlocking..." : "Get My 10% Discount"}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="w-full py-2 text-xs text-navy/40 font-medium hover:text-navy underline-offset-4 hover:underline"
                                    >
                                        No thanks, I'll just browse
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                                    <Check className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-2xl text-navy mb-2">Discount Unlocked</h3>
                                <p className="text-navy/60">
                                    Check your inbox for your <strong>10% Welcome Code</strong>.<br />
                                    Welcome to the collection.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
