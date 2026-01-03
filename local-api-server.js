import http from 'http';

const PORT = 3003;
const KLAVIYO_PRIVATE_KEY = "pk_adab87e0e1a4a0bd25c294e0764edd71dd";
const KLAVIYO_PUBLIC_KEY = "VMkY3E";
const KLAVIYO_LIST_ID = "WbMvGh";

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    if (req.method === 'POST' && req.url === '/api/send-email') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { email, interest, referralCode: referredByCode } = JSON.parse(body);
                console.log(`[API] Processing signup for: ${email}`);

                // Generate Code
                const cleanEmail = email.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                const uniqueSuffix = Buffer.from(email).toString('base64').replace(/[^A-Z0-9]/g, '').substring(0, 5);
                const newReferralCode = `VIP-${cleanEmail.substring(0, 3)}-${uniqueSuffix}`;

                // 1. Subscribe to Klaviyo
                console.log(`[API] sending to Klaviyo List: ${KLAVIYO_LIST_ID}`);
                const subRes = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_KEY}`, {
                    method: 'POST',
                    headers: { 'revision': '2024-02-15', 'content-type': 'application/json' },
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
                                                own_referral_code: newReferralCode,
                                                referred_by: referredByCode || '',
                                                interest: interest || 'General',
                                                source: 'Website Waitlist'
                                            }
                                        }
                                    }
                                }
                            },
                            relationships: { list: { data: { type: 'list', id: KLAVIYO_LIST_ID } } }
                        }
                    })
                });

                if (!subRes.ok) {
                    const subError = await subRes.text();
                    console.error(`[API] Klaviyo Subscribe FAILED: ${subRes.status} ${subError}`);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: `Klaviyo Error: ${subError}` }));
                    return;
                }
                console.log(`[API] Klaviyo Subscribe Success`);

                // 1.5 FAILSAVE: Trigger "Joined Waitlist" Event for the new user
                // This ensures we can trigger a Flow immediately even if List Opt-in is double-confirm.
                const eventRes = await fetch(`https://a.klaviyo.com/api/events/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                    body: JSON.stringify({
                        data: {
                            type: 'event',
                            attributes: {
                                profile: {
                                    data: {
                                        type: 'profile',
                                        attributes: {
                                            email: email
                                        }
                                    }
                                },
                                metric: {
                                    name: 'Joined Waitlist'
                                },
                                properties: {
                                    interest: interest,
                                    my_referral_code: newReferralCode
                                }
                            }
                        }
                    })
                });

                if (eventRes.ok) {
                    console.log(`[API] Triggered 'Joined Waitlist' event for ${email}`);
                } else {
                    console.error(`[API] Failed to trigger event: ${await eventRes.text()}`);
                }

                // 2. Increment Logic (Only if code provided)
                if (referredByCode) {
                    // ... (Increment logic same as before, keeping it brief for stability)
                    const searchUrl = `https://a.klaviyo.com/api/profiles/?filter=equals(properties.own_referral_code,"${referredByCode}")`;
                    const searchRes = await fetch(searchUrl, {
                        method: 'GET',
                        headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15' }
                    });
                    const searchData = await searchRes.json();
                    if (searchData.data && searchData.data.length > 0) {
                        const referrer = searchData.data[0];
                        const newCount = (Number(referrer.attributes.properties.referral_count) || 0) + 1;
                        await fetch(`https://a.klaviyo.com/api/profiles/${referrer.id}/`, {
                            method: 'PATCH',
                            headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                            body: JSON.stringify({ data: { type: 'profile', id: referrer.id, attributes: { properties: { referral_count: newCount } } } })
                        });
                        await fetch(`https://a.klaviyo.com/api/events/`, {
                            method: 'POST',
                            headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                            body: JSON.stringify({ data: { type: 'event', attributes: { profile: { data: { type: 'profile', id: referrer.id } }, metric: { name: 'Referral Success' }, properties: { new_total_entries: newCount, referred_email: email } } } })
                        });
                        console.log(`[API] Referrer Counted: ${referrer.id}`);
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error("[API] Server Error", error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } else { res.writeHead(404); res.end(); }
});

server.listen(PORT, () => { console.log(`Diagnostic Server running on http://127.0.0.1:${PORT}`); });
