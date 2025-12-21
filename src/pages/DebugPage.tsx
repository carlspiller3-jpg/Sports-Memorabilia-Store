import { useState } from 'react';

export function DebugPage() {
    const [result, setResult] = useState<string>('Ready to test...');
    const [testEmailAddr, setTestEmailAddr] = useState<string>('');

    const testEmail = async () => {
        if (!testEmailAddr || !testEmailAddr.includes('@')) {
            setResult("Please enter a valid email address.");
            return;
        }

        setResult('Sending request...');
        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: testEmailAddr })
            });

            const text = await res.text();
            try {
                // Try format JSON
                const json = JSON.parse(text);
                setResult(`Status: ${res.status}\nResult: ${JSON.stringify(json, null, 2)}`);
            } catch {
                setResult(`Status: ${res.status}\nResult: ${text}`);
            }
        } catch (e: any) {
            setResult(`Frontend Error: ${e.message}`);
        }
    };

    return (
        <div className="p-10 bg-[#F9F7F3] text-black font-sans min-h-screen pt-32">
            <div className="max-w-2xl mx-auto border border-[#D9D5CD] bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-serif text-[#1C273A] mb-2">Email API Diagnostic</h1>
                <p className="text-gray-500 mb-6 text-sm">Send a real test email to verify branding and delivery.</p>

                <div className="flex gap-4 mb-6">
                    <input
                        type="email"
                        value={testEmailAddr}
                        onChange={(e) => setTestEmailAddr(e.target.value)}
                        placeholder="Enter your email address..."
                        className="flex-1 border border-gray-300 p-3 rounded-sm focus:border-[#C6A664] outline-none"
                    />
                    <button
                        onClick={testEmail}
                        className="bg-[#1C273A] text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-black transition-colors"
                    >
                        Send Test
                    </button>
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Server Response</h3>
                    <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap overflow-x-auto">
                        {result}
                    </pre>
                </div>
            </div>
        </div>
    );
}
