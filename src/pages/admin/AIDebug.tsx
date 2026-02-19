
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/Button";

export function AIDebug() {
    const [status, setStatus] = useState("Idle");
    const [result, setResult] = useState("");
    const [error, setError] = useState("");

    const runTest = async () => {
        setStatus("Testing...");
        setResult("");
        setError("");

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            setError("Checking env... FAIL: VITE_GEMINI_API_KEY is missing or empty.");
            setStatus("Failed");
            return;
        }

        if (apiKey.length < 10) {
            setError(`Checking env... FAIL: Key seems too short (${apiKey.length} chars).`);
            setStatus("Failed");
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = "Reply with 'Success' if you can read this.";
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            setResult(`Success! Model replied: "${text}"`);
            setStatus("Success");
        } catch (e: any) {
            console.error(e);
            setError(`API Error: ${e.message || JSON.stringify(e)}`);
            setStatus("Failed");
        }
    };

    return (
        <div className="min-h-screen bg-navy text-ivory p-10 pt-32">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-playfair text-gold">AI Connection Debugger</h1>

                <div className="bg-charcoal p-6 rounded-lg border border-gold/20 font-mono text-sm space-y-2">
                    <p className="text-gold/80 uppercase text-xs tracking-wider mb-2">Environment Status</p>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                        <span>API Key Present:</span>
                        <span className={import.meta.env.VITE_GEMINI_API_KEY ? "text-green-400" : "text-red-400"}>
                            {import.meta.env.VITE_GEMINI_API_KEY ? "YES" : "NO"}
                        </span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span>Key Length:</span>
                        <span>{import.meta.env.VITE_GEMINI_API_KEY?.length || 0} chars</span>
                    </div>
                </div>

                <Button
                    onClick={runTest}
                    disabled={status === "Testing..."}
                    className="w-full h-12 text-lg"
                >
                    {status === "Testing..." ? "Connecting to Google..." : "Test AI Connection"}
                </Button>

                {error && (
                    <div className="p-4 bg-red-900/50 text-red-200 rounded border border-red-500/50">
                        <strong className="block mb-2 text-red-100">Connection Failed:</strong>
                        <pre className="whitespace-pre-wrap text-xs font-mono bg-black/30 p-2 rounded">{error}</pre>
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-green-900/50 text-green-100 rounded border border-green-500/50">
                        <strong className="block mb-2 text-green-300">Success! Google Responded:</strong>
                        <div className="font-serif italic text-lg px-4 py-2 border-l-2 border-green-500 bg-white/5">
                            "{result.replace('Success! Model replied: "', '').replace('"', '')}"
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
