import { useState, useEffect, useRef } from "react";
import { X, Lock, ChevronRight, Search } from "lucide-react";
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
    const [referralCode, setReferralCode] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            // Force modal to show every time for now (User Request)
            // const hasSeen = localStorage.getItem("waitlist_seen");
            // if (!hasSeen) {
            setIsOpen(true);
            // }
        }, 2000);

        // Close suggestions on click outside
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
        localStorage.setItem("waitlist_seen", "true");
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
            const { error } = await supabase
                .from('newsletter_subscribers')
                .insert([
                    { email, interest, referral_code: referralCode }
                ]);

            if (error) {
                if (error.code === '23505') { // Unique violation (already subscribed)
                    console.log("Already subscribed");
                } else {
                    throw error;
                }
            } else {
                // 3. Trigger Email API
                const emailRes = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (!emailRes.ok) {
                    const errorData = await emailRes.json();
                    console.error("Email API Failed:", errorData);
                    alert(`DEBUG ERROR: Lead saved, but Email failed.\nReason: ${JSON.stringify(errorData)}`);
                } else {
                    setIsOpen(false);
                    setIsSuccess(true); // Corrected from setShowSuccess to setIsSuccess
                }
            }


            setTimeout(() => {
                handleClose();
            }, 4000);

        } catch (err) {
            console.error("Error saving email:", err);
            // In a real app we might show a toast error, but for the modal let's fail silently or alert
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter suggestions based on input
    const filteredSuggestions = SUGGESTIONS.filter(item =>
        item.toLowerCase().includes(interest.toLowerCase()) &&
        item.toLowerCase() !== interest.toLowerCase()
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-navy/95 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-lg bg-white border border-navy/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[80vh] overflow-y-auto flex flex-col">
                {/* Decorative Header */}
                <div className="bg-navy p-4 text-center border-b border-gold/20 sticky top-0 z-10 shrink-0">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-4 h-4 text-gold" />
                    </div>
                    <h2 className="font-serif text-xl text-white mb-0.5">
                        The Vault is Locked
                    </h2>
                    <p className="text-white/60 text-[10px] uppercase tracking-wider">
                        Next Drop: <span className="text-gold font-bold">January 2026</span>
                    </p>
                    <button
                        onClick={handleClose}
                        className="absolute top-3 right-3 p-1.5 bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    {!isSuccess ? (
                        <>
                            <p className="text-navy/70 text-center mb-4 text-sm leading-relaxed">
                                Join the <strong>Priority Access List</strong> to receive your password 48 hours before the public.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-[10px] font-bold text-navy/50 uppercase tracking-wider mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-2.5 rounded-lg bg-ivory border border-navy/10 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                                        required
                                    />
                                </div>

                                {/* Autocomplete Interest Input */}
                                <div className="relative" ref={wrapperRef}>
                                    <label className="block text-[10px] font-bold text-navy/50 uppercase tracking-wider mb-1">My Main Interest</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={interest}
                                            onChange={handleInterestChange}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="e.g. Football, Boxing, F1..."
                                            className="w-full px-4 py-2.5 pl-9 rounded-lg bg-ivory border border-navy/10 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                                            required
                                        />
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-navy/30" />
                                    </div>

                                    {/* Suggestions Dropdown */}
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

                                {/* Referral Code Input (Optional) */}
                                <div>
                                    <label className="block text-[10px] font-bold text-navy/50 uppercase tracking-wider mb-1">Referral Code (Optional)</label>
                                    <input
                                        type="text"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                        placeholder="e.g. VIP-1234"
                                        className="w-full px-4 py-2.5 rounded-lg bg-ivory border border-navy/10 text-navy text-sm placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold tracking-widest"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gold hover:bg-gold/90 text-navy font-bold text-base mt-2 shadow-lg shadow-gold/10"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Unlocking..." : "Secure Priority Access"}
                                </Button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-full py-3 text-sm text-navy/50 font-medium hover:text-navy underline-offset-4 hover:underline"
                                >
                                    No thanks, I'll just browse
                                </button>
                            </form>
                            <p className="mt-2 text-xs text-center text-navy/30">We respect your privacy.</p>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                                <ChevronRight className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-2xl text-navy mb-2">Access Secured</h3>
                            <p className="text-navy/60">
                                You are on the list for <strong>{interest}</strong> updates.<br />
                                Watch your inbox in January.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
