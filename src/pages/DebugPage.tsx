import { useState } from 'react';

export function DebugPage() {
    const [result, setResult] = useState<string>('Ready to test...');

    const testEmail = async () => {
        setResult('Sending request...');
        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@debug.com' })
            });

            const text = await res.text();
            setResult(`Status: ${res.status}\nResult: ${text}`);
        } catch (e: any) {
            setResult(`Frontend Error: ${e.message}`);
        }
    };

    return (
        <div className="p-10 bg-white text-black font-mono min-h-screen pt-32">
            <h1 className="text-xl font-bold mb-4">Email API Diagnostic</h1>
            <button
                onClick={testEmail}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
                Run Test
            </button>
            <pre className="mt-4 p-4 bg-gray-100 rounded border border-gray-300 whitespace-pre-wrap">
                {result}
            </pre>
        </div>
    );
}
