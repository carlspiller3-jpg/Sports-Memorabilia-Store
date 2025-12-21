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
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem("waitlist_seen");
            if (!hasSeen) {
                setIsOpen(true);
            }
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
                    { email, interest }
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

            <div className="relative w-full max-w-lg bg-white border border-navy/10 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                {/* Decorative Header */}
                <div className="bg-navy p-6 text-center border-b border-gold/20 sticky top-0 z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-gold" />
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-white mb-2">
                        The Vault is Locked
                    </h2>
                    <p className="text-white/60 text-sm">
                        Next Drop: <span className="text-gold font-bold">January 2026</span>
                    </p>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <p className="text-navy/70 text-center mb-6 leading-relaxed">
                                Join the <strong>Priority Access List</strong> to receive your password 60 minutes before the public.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Input */}
                                <div>
                                    <label className="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-5 py-3 rounded-lg bg-ivory border border-navy/10 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                                        required
                                    />
                                </div>

                                {/* Autocomplete Interest Input */}
                                <div className="relative" ref={wrapperRef}>
                                    <label className="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-2">My Main Interest</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={interest}
                                            onChange={handleInterestChange}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="e.g. Football, Boxing, F1..."
                                            className="w-full px-5 py-3 pl-10 rounded-lg bg-ivory border border-navy/10 text-navy placeholder:text-navy/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                                            required
                                        />
                                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-navy/30" />
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && filteredSuggestions.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-navy/10 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                            {filteredSuggestions.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    onClick={() => selectSuggestion(suggestion)}
                                                    className="w-full text-left px-5 py-2 text-sm text-navy hover:bg-ivory hover:text-gold transition-colors"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gold hover:bg-gold/90 text-navy font-bold text-lg mt-4 shadow-lg shadow-gold/10"
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
