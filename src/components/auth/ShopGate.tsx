import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";

const PASSWORD = "LEGENDS26"; // Simple shared password

export function ShopGate({ children }: { children: React.ReactNode }) {
    const { isLoading } = useAuth();
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        // Check session storage
        const sessionUnlocked = sessionStorage.getItem("shop_unlocked");
        if (sessionUnlocked === "true") {
            setIsUnlocked(true);
        }
    }, []);

    // 1. If loading auth, show nothing or spinner
    if (isLoading) return <div className="min-h-screen bg-navy flex items-center justify-center text-gold">Loading...</div>;

    // 2. If Session is Unlocked -> Show Content (Login does NOT bypass)
    if (isUnlocked) {
        return <>{children}</>;
    }

    // 3. Otherwise, Show the Velvet Rope (Lock Screen)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.toUpperCase() === PASSWORD) {
            setIsUnlocked(true);
            sessionStorage.setItem("shop_unlocked", "true");
            window.dispatchEvent(new Event("shop_unlocked"));
            setError(false);
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-ivory px-4 text-center pt-32 pb-12">
            <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-lg w-full border border-navy/10 relative">
                <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-navy/20">
                    <Lock className="w-8 h-8 text-gold" />
                </div>

                <h1 className="font-serif text-3xl text-navy mb-4">The Vault is Locked</h1>
                <p className="text-charcoal/60 mb-8 leading-relaxed font-light">
                    Our first collection is reserved for members with early access.
                    <br /><br />
                    Please enter your password to view the collection.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                setError(false);
                            }}
                            placeholder="Enter Password"
                            className="w-full px-6 py-4 text-center text-lg tracking-widest rounded bg-ivory border border-navy/10 text-navy focus:outline-none focus:border-gold transition-colors"
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2 animate-in slide-in-from-top-1">
                                Incorrect password. Please try again.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-navy text-white font-bold py-4 rounded hover:bg-navy/90 transition-colors uppercase tracking-widest text-sm"
                    >
                        Unlock Access
                    </button>
                </form>

                <p className="mt-8 text-xs text-charcoal/40">
                    Don't have a password? <a href="/#waitlist" className="underline hover:text-gold">Join the Waitlist</a> for the next drop.
                </p>
            </div>
        </div>
    );
}
