

const resendApiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;

export default async function handler(req: any, res: any) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email address' });
        }

        console.log(`API: Sending email to ${email} via Native Fetch`);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'SportsSigned <hello@sportssigned.com>',
                to: [email],
                subject: 'Access Secured: The Vault is Locked',
                html: `
            <!DOCTYPE html>
            <html>
            <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a192f; color: #e6e6e6; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #0a192f; padding-bottom: 40px; }
                .container { max-width: 600px; margin: 0 auto; background-color: #0a192f; }
                .content { padding: 40px 20px; text-align: center; }
                
                /* Typography */
                h1 { font-family: 'Georgia', serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 1px; margin-bottom: 24px; }
                p { font-size: 16px; line-height: 1.8; color: #b3b3b3; margin-bottom: 20px; }
                .gold-text { color: #d4af37; font-weight: 600; }
                .small-text { font-size: 12px; color: #666; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; display: block; }
                
                /* Elements */
                .logo { font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 4px; color: #ffffff; text-decoration: none; border: 1px solid #d4af37; padding: 12px 24px; display: inline-block; margin-bottom: 40px; }
                .divider { height: 1px; width: 60%; background: linear-gradient(90deg, transparent, #d4af37, transparent); margin: 30px auto; opacity: 0.5; }
                .btn { background-color: #d4af37; color: #0a192f; padding: 16px 32px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 14px; display: inline-block; margin-top: 20px; border-radius: 2px; }
                
                /* Footer */
                .footer { font-size: 12px; color: #4a5568; margin-top: 60px; padding-top: 20px; border-top: 1px solid #1a2c4e; }
            </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <div class="content">
                            <!-- Logo -->
                            <div style="padding-top: 20px;">
                                <span class="logo">SPORTS SIGNED</span>
                            </div>

                            <!-- Pre-Header -->
                            <span class="small-text">Authentication Verified • Chain of Custody • Secure</span>

                            <!-- Main Headline -->
                            <h1>Welcome to the <span class="gold-text">Inner Circle</span>.</h1>

                            <!-- Body Text -->
                            <p>You have successfully secured your position on the Priority Access List for <strong>January 2026</strong>.</p>
                            
                            <p>At Sports Signed, we don't just sell memorabilia; we deal in <strong>History</strong>. Every piece in our upcoming collection is protected by our proprietary NFC Digital Chain of Custody, ensuring your asset retains its value for generations.</p>

                            <div class="divider"></div>

                            <p style="color: #ffffff; font-size: 18px;">"The Vault Opens in January."</p>

                            <p>As a priority member, you will receive:</p>
                            <p style="color: #d4af37;">
                                • 60-Minute Head Start on Drop Day<br>
                                • Access to "1-of-1" Inventory<br>
                                • Private Signing Event Invites
                            </p>

                            <p>Prepare your collection. The countdown has begun.</p>

                            <!-- Footer -->
                            <div class="footer">
                                <p>&copy; 2025 Sports Memorabilia Store Ltd.<br>
                                London, United Kingdom</p>
                                <p style="font-style: italic; color: #2d3748;">Authenticity Guaranteed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API Error:", data);
            return res.status(response.status).json({ error: data });
        }

        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Internal Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
