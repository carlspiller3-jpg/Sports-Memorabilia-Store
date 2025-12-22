
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


    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }


        const { email, interest } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email address' });
        }

        console.log(`API: Sending email to ${email} via Native Fetch`);

        // Generate Unique Referral Code (Deterministic based on email)
        // Takes first 3 chars of email + 4 random-looking chars generated from the email string
        const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const uniqueSuffix = Buffer.from(email).toString('base64').replace(/[^A-Z0-9]/g, '').substring(0, 5);
        const referralCode = `VIP-${cleanEmail.substring(0, 3)}-${uniqueSuffix}`;

        // --- KLAVIYO INTEGRATION START ---
        try {
            const klaviyoPublicKey = "VMkY3E";
            const klaviyoListId = "WbMvGh";

            await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${klaviyoPublicKey}`, {
                method: 'POST',
                headers: {
                    'revision': '2024-02-15',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        type: 'subscription',
                        attributes: {
                            profile: {
                                data: {
                                    type: 'profile',
                                    attributes: {
                                        email: email,
                                        properties: {
                                            referral_code: referralCode,
                                            interest: interest || 'General',
                                            source: 'Website Waitlist'
                                        }
                                    }
                                }
                            }
                        },
                        relationships: {
                            list: {
                                data: {
                                    type: 'list',
                                    id: klaviyoListId
                                }
                            }
                        }
                    }
                })
            });
            console.log("Klaviyo Sync Success");
        } catch (kErr) {
            console.error("Klaviyo Sync Failed:", kErr);
            // If Klaviyo fails, we still return success to the frontend,
            // but in production you might want better error handling/queueing.
        }
        // --- KLAVIYO INTEGRATION END ---

        // Success Response
        return res.status(200).json({ success: true, message: "Added to Waitlist" });

    } catch (error: any) {
        console.error("Internal Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
