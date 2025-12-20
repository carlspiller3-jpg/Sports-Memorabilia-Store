import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function WaitlistModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        // Show modal after 2 seconds
        const timer = setTimeout(() => {
            // Check if user has already dismissed it or signed up (normally check localStorage)
            const hasSeen = localStorage.getItem("waitlist_seen");
            if (!hasSeen) {
                setIsOpen(true);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("waitlist_seen", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: This is where we will connect to Supabase
        // For now, simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Saving email:", email);

        setIsSuccess(true);
        setIsSubmitting(false);

        // Close after success
        setTimeout(() => {
            handleClose();
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-navy/90 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-navy border border-gold/30 rounded-lg shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {!isSuccess ? (
                    <>
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                Access Denied
                            </span>
                            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                                The Vault is Closed
                            </h2>
                            <p className="text-white/60">
                                We are preparing for our exclusive January 2026 drop.
                                Join the waitlist to get your password 1 hour before the public.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your private email"
                                    className="w-full px-5 py-3 rounded bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-gold text-center"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gold text-navy font-bold hover:bg-gold/90 text-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Securing Spot..." : "Get Early Access"}
                            </Button>
                        </form>
                        <p className="mt-4 text-xs text-white/20">Limited to first 500 members.</p>
                    </>
                ) : (
                    <div className="py-8">
                        <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-serif text-2xl text-white mb-2">You're on the list</h3>
                        <p className="text-white/60">Keep an eye on your inbox. We'll be in touch soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
