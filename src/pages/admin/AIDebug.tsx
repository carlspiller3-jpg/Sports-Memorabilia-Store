
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
        <div className="p-10 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">AI Connection Debugger</h1>

            <div className="bg-gray-100 p-4 rounded mb-4 font-mono text-sm">
                <p><strong>Environment State:</strong></p>
                <p>Key Present: {import.meta.env.VITE_GEMINI_API_KEY ? "Yes (Hidden)" : "NO"}</p>
                <p>Key Length: {import.meta.env.VITE_GEMINI_API_KEY?.length || 0} chars</p>
            </div>

            <Button onClick={runTest} disabled={status === "Testing..."}>
                {status === "Testing..." ? "Connecting..." : "Test Connection"}
            </Button>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded border border-red-200">
                    <strong>Error:</strong>
                    <pre className="whitespace-pre-wrap mt-2 text-xs">{error}</pre>
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded border border-green-200">
                    <strong>Result:</strong>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}
