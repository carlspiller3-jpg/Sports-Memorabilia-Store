
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

        // Generate Unique Referral Code (Deterministic based on email)
        // Takes first 3 chars of email + 4 random-looking chars generated from the email string
        const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const uniqueSuffix = Buffer.from(email).toString('base64').replace(/[^A-Z0-9]/g, '').substring(0, 5);
        const referralCode = `VIP-${cleanEmail.substring(0, 3)}-${uniqueSuffix}`;

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
    h1 { font-family: 'Georgia', serif; font-size: 30px; font-weight: 700; color: #1C273A; letter-spacing: -0.5px; margin-bottom: 24px; margin-top: 10px; text-transform: uppercase; }
    p { font-size: 16px; line-height: 1.6; color: #2E2E2E; margin-bottom: 20px; text-align: left; }
    .gold-text { color: #C6A664; font-weight: 700; }
    .small-text { font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: block; font-weight: 600; text-align: center; }
    
    /* Elements */
    .logo-container { margin-bottom: 15px; padding-bottom: 0px; display: inline-block; }
    .logo-img { max-width: 200px; height: auto; display: block; margin: 0 auto; }
    
    .infobox { background-color: #F9F7F3; border: 1px solid #D9D5CD; padding: 25px; text-align: left; margin: 30px 0; border-left: 4px solid #C6A664; }
    .infobox p { margin: 0 0 10px 0; font-size: 15px; font-weight: bold; }
    .infobox li { margin-bottom: 12px; color: #1C273A; font-weight: 500; line-height: 1.5; }
    
    .referral-box { background-color: #1C273A; color: #ffffff; padding: 20px; margin-top: 30px; border-radius: 4px; text-align: left; }
    .referral-code { font-family: monospace; font-size: 20px; color: #C6A664; letter-spacing: 2px; background: rgba(255,255,255,0.1); padding: 10px; display: inline-block; margin: 10px 0; font-weight: bold; }

    .btn { background-color: #1C273A; color: #ffffff !important; padding: 18px 40px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; display: inline-block; margin-top: 20px; border-radius: 0; }
    
    /* Footer */
    .footer { background-color: #1C273A; padding: 40px 20px; text-align: center; margin-top: 0; }
    .footer p { color: #D9D5CD; font-size: 12px; margin-bottom: 10px; opacity: 0.8; margin: 0; text-align: center; }
</style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="content">
                <!-- Logo -->
                <div class="logo-container">
                    <img src="https://sportssigned.com/logo-transparent.png" alt="SPORTS SIGNED" class="logo-img">
                </div>

                <!-- Pre-Header -->
                <span class="small-text">Authentication Verified • Chain of Custody</span>

                <!-- Main Headline -->
                <h1>You are on the <span class="gold-text">List</span>.</h1>

                <!-- Body Text -->
                <p>Thank you for signing up. You have secured your place for our launch.</p>
                
                <p>Most of our best inventory sells out before it ever reaches the public website. By the time most people see it, the limited pieces are usually gone.</p>
                
                <p><strong>But as a member, you get priority access.</strong></p>

                <div class="infobox">
                    <p style="text-transform: uppercase; font-size: 13px; letter-spacing: 1px; color: #1C273A;">Your Benefits:</p>
                    <ul style="padding-left: 20px; margin: 0;">
                        <li><strong>48-Hour Head Start:</strong> We email you on Saturday. We email everyone else on Monday. If you see something you want, you have two days to claim it.</li>
                        <li><strong>Guaranteed Send-In Slots:</strong> When we announce a signing, you can book your slot immediately. No lottery, no waiting.</li>
                        <li><strong>First to Know:</strong> You will hear about new athlete signings before we post on social media.</li>
                    </ul>
                </div>

                <div class="referral-box">
                    <p style="color: #C6A664; font-weight: bold; text-transform: uppercase; text-align: center; margin-bottom: 10px;">Want to meet an athlete?</p>
                    <p style="font-size: 14px; margin-bottom: 10px; text-align: center; color: #D9D5CD;">Invite friends using your unique code. Any referral enters you into the free draw.</p>
                    <div style="text-align: center;">
                        <span class="referral-code">${referralCode}</span>
                    </div>
                    <p style="font-size: 10px; color: #ffffff; opacity: 0.5; margin-top: 15px; text-align: center; line-height: 1.4;">
                        *Terms: Prize grants event access only. Winner responsible for all travel & accommodation. 18+ Only.
                    </p>
                </div>

                <p style="font-weight: bold; margin-top: 30px;">The Vault Opens: January 2026.<br>We'll be in touch.</p>

                <!-- Button -->
                <a href="https://sportssigned.com" class="btn">Enter The Vault</a>
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 Sports Memorabilia Store Limited.<br>
                London, United Kingdom</p>
                <br>
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
