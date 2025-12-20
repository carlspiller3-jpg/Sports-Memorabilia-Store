import { useState, useEffect } from "react";
import { X, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function WaitlistModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [interest, setInterest] = useState<string>("");
    const [footballTeam, setFootballTeam] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
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

        // TODO: Send { email, interest, footballTeam } to Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Saving:", { email, interest, footballTeam });

        setIsSuccess(true);
        setIsSubmitting(false);

        setTimeout(() => {
            handleClose();
        }, 4000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-navy/95 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-lg bg-white border border-navy/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Decorative Header */}
                <div className="bg-navy p-6 text-center border-b border-gold/20">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-6 h-6 text-gold" />
                    </div>
                    <h2 className="font-serif text-3xl text-white mb-2">
                        The Vault is Locked
                    </h2>
                    <p className="text-white/60 text-sm">
                        Next Drop: <span className="text-gold font-bold">January 2026</span>
                    </p>
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {!isSuccess ? (
                        <>
                            <p className="text-navy/70 text-center mb-6 leading-relaxed">
                                Avoid the rush. Join the <strong>Priority Access List</strong> to receive your password 60 minutes before the public.
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

                                {/* Interest Selector */}
                                <div>
                                    <label className="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-2">I Collect...</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Football', 'Boxing', 'F1', 'Other'].map((item) => (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => setInterest(item)}
                                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border ${interest === item
                                                        ? "bg-navy text-white border-navy"
                                                        : "bg-white text-navy/60 border-navy/10 hover:border-navy/30"
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Conditional Football Team Selector */}
                                {interest === 'Football' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-xs font-bold text-navy/50 uppercase tracking-wider mb-2">Team Preference</label>
                                        <select
                                            className="w-full px-5 py-3 rounded-lg bg-ivory border border-navy/10 text-navy/80 focus:outline-none focus:border-gold"
                                            value={footballTeam}
                                            onChange={(e) => setFootballTeam(e.target.value)}
                                        >
                                            <option value="">Select a team (Optional)</option>
                                            <option value="Liverpool">Liverpool</option>
                                            <option value="Man Utd">Manchester United</option>
                                            <option value="Arsenal">Arsenal</option>
                                            <option value="Man City">Manchester City</option>
                                            <option value="Chelsea">Chelsea</option>
                                            <option value="Real Madrid">Real Madrid</option>
                                            <option value="Barcelona">Barcelona</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gold hover:bg-gold/90 text-navy font-bold text-lg mt-4 shadow-lg shadow-gold/10"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Unlocking..." : "Secure Priority Access"}
                                </Button>
                            </form>
                            <p className="mt-4 text-xs text-center text-navy/30">We respect your privacy.</p>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                                <ChevronRight className="w-8 h-8" />
                            </div>
                            <h3 className="font-serif text-2xl text-navy mb-2">Access Secured</h3>
                            <p className="text-navy/60">
                                You are on the list{footballTeam ? ` for ${footballTeam} updates` : ""}.<br />
                                Watch your inbox in January.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
