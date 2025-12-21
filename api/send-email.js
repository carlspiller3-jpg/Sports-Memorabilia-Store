import { Resend } from 'resend';

const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!resendApiKey) {
        console.error("API Error: Missing RESEND_API_KEY");
        return res.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
    }

    // Initialize inside handler to be safe
    const resend = new Resend(resendApiKey);

    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { email } = req.body;
        console.log(`API: Sending email to ${email}`);

        const { data, error } = await resend.emails.send({
            from: 'SportsSigned <hello@sportssigned.com>',
            to: [email],
            subject: 'Priority Access Confirmed: Welcome to The Vault',
            html: `
            <!DOCTYPE html>
            <html>
            <head>
            <style>
                body { font-family: 'Georgia', serif; color: #0a192f; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; background-color: #fafafa; }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #d4af37; }
                .logo { color: #0a192f; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; }
                .content { padding: 30px 0; }
                .h1 { font-family: 'Times New Roman', serif; color: #0a192f; font-size: 28px; margin-bottom: 10px; }
                .highlight { color: #d4af37; font-weight: bold; }
                .footer { font-size: 12px; color: #888; text-align: center; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <span class="logo">SPORTS SIGNED</span>
                    </div>
                    <div class="content">
                        <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #888;">Priority Access Confirmed</p>
                        <h1 class="h1">Welcome to <span class="highlight">The Vault</span>.</h1>
                        
                        <p>You are in.</p>
                        
                        <p>You have secured your position on the Priority Access List for our inaugural drop in <strong>January 2026</strong>. This list is strictly capped, and you have claimed one of the 500 spots.</p>
                        
                        <h3>What happens next?</h3>
                        <p>The vault is currently locked to the public. As a priority member, here is your advantage:</p>
                        <ul>
                            <li><strong>60 Minutes Early Access:</strong> On drop day, you will receive a password via email 1 hour before the store opens to the world.</li>
                            <li><strong>The Inventory:</strong> We will be releasing signed pieces from <em>Messi, Gerrard, Fury</em> and more.</li>
                        </ul>

                        <p>Until then, keep an eye on your inbox. We will be sharing preview images of the stock in the coming weeks.</p>
                        
                        <p><strong>The SportsSigned Team</strong><br>
                        London, UK</p>
                    </div>
                    <div class="footer">
                        &copy; 2025 Sports Memorabilia Store Ltd.<br>
                        Sent to you because you joined the waitlist at sportssigned.com
                    </div>
                </div>
            </body>
            </html>
            `
        });

        if (error) {
            console.error("Resend API Error:", error);
            return res.status(500).json({ error: error });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
