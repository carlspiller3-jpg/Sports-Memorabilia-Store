
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
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9F7F3; color: #2E2E2E; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #F9F7F3; padding-bottom: 40px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #D9D5CD; }
    .content { padding: 40px 30px; text-align: center; }
    
    /* Typography */
    h1 { font-family: 'Georgia', serif; font-size: 32px; font-weight: 400; color: #1C273A; letter-spacing: -0.5px; margin-bottom: 24px; margin-top: 10px; }
    p { font-size: 16px; line-height: 1.8; color: #2E2E2E; margin-bottom: 24px; }
    .gold-text { color: #C6A664; font-weight: 600; }
    .small-text { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 30px; display: block; font-weight: 600; }
    
    /* Elements */
    .logo-container { margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #C6A664; display: inline-block; }
    .logo { font-family: 'Georgia', serif; font-size: 26px; letter-spacing: 3px; color: #1C273A; text-decoration: none; text-transform: uppercase; font-weight: bold; }
    
    .infobox { background-color: #F9F7F3; border: 1px solid #D9D5CD; padding: 20px; text-align: left; margin: 30px 0; border-left: 4px solid #C6A664; }
    .infobox p { margin: 0 0 10px 0; font-size: 15px; }
    .infobox li { margin-bottom: 8px; color: #2E2E2E; }
    
    .btn { background-color: #1C273A; color: #ffffff !important; padding: 18px 36px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; font-size: 13px; display: inline-block; margin-top: 30px; }
    
    /* Footer */
    .footer { background-color: #1C273A; padding: 40px 20px; text-align: center; margin-top: 0; }
    .footer p { color: #D9D5CD; font-size: 12px; margin-bottom: 10px; opacity: 0.8; }
    .footer-link { color: #C6A664; text-decoration: none; }
</style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="content">
                <!-- Logo -->
                <div class="logo-container">
                    <span class="logo">SPORTS SIGNED</span>
                </div>

                <!-- Pre-Header -->
                <span class="small-text">Authentication Verified • Chain of Custody</span>

                <!-- Main Headline -->
                <h1>Welcome to the <span class="gold-text">Inner Circle</span>.</h1>

                <!-- Body Text -->
                <p>You have secured your position on the Priority Access List for <strong>January 2026</strong>.</p>
                
                <p>At Sports Signed, we treat memorabilia as an asset class. Every piece is backed by our digital chain of custody, ensuring provenance is absolute.</p>

                <div class="infobox">
                    <p style="font-weight: bold; color: #1C273A; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Priority Member Benefits:</p>
                    <ul style="padding-left: 20px; margin: 0;">
                        <li><strong>60-Minute Head Start</strong> on Drop Day.</li>
                        <li>Access to <strong>"1-of-1"</strong> Unlisted Inventory.</li>
                        <li>Private signing event invitations.</li>
                    </ul>
                </div>

                <p style="font-style: italic; color: #666; font-size: 18px;">"The Vault is strictly capped."</p>

                <!-- Button -->
                <a href="https://sportssigned.com" class="btn">Return to Vault</a>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 Sports Memorabilia Store Ltd.<br>
                London, United Kingdom</p>
                <p>Authenticity Guaranteed.</p>
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
