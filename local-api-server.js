import 'dotenv/config';
import http from 'http';

const PORT = 3003;
const KLAVIYO_PRIVATE_KEY = process.env.KLAVIYO_PRIVATE_KEY;
const KLAVIYO_PUBLIC_KEY = process.env.KLAVIYO_PUBLIC_KEY;
const KLAVIYO_LIST_ID = process.env.KLAVIYO_LIST_ID;

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
                console.log(`[API] Generated Code for ${email}: ${newReferralCode}`);

                // 1. Create or Update Profile to ensure properties (Referral Code) are saved
                console.log(`[API] Processing Profile for: ${email}`);
                let profileId;

                // Search for existing profile
                const profileSearchRes = await fetch(`https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`, {
                    method: 'GET',
                    headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'accept': 'application/json' }
                });
                const profileSearchData = await profileSearchRes.json();

                if (profileSearchData.data && profileSearchData.data.length > 0) {
                    // Update Existing
                    profileId = profileSearchData.data[0].id; // Assign to outer variable
                    console.log(`[API] Found Existing Profile: ${profileId}, Updating Properties...`);
                    await fetch(`https://a.klaviyo.com/api/profiles/${profileId}/`, {
                        method: 'PATCH',
                        headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                        body: JSON.stringify({
                            data: {
                                type: 'profile',
                                id: profileId,
                                attributes: {
                                    properties: {
                                        own_referral_code: newReferralCode,
                                        referred_by: referredByCode || '',
                                        interest: interest || 'General',
                                        source: 'Website Waitlist'
                                    }
                                }
                            }
                        })
                    });
                } else {
                    // Create New
                    console.log(`[API] Creating New Profile...`);
                    const createRes = await fetch(`https://a.klaviyo.com/api/profiles/`, {
                        method: 'POST',
                        headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                        body: JSON.stringify({
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
                        })
                    });
                    const createData = await createRes.json();
                    if (!createRes.ok) {
                        console.error('Create Profile Failed:', createData);
                        throw new Error('Failed to create profile');
                    }
                    profileId = createData.data.id;
                }

                // 2. Subscribe to List (Server Side)
                console.log(`[API] Subscribing Profile ${profileId} to List ${KLAVIYO_LIST_ID}...`);
                const subRes = await fetch(`https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`, {
                    method: 'POST',
                    headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                    body: JSON.stringify({
                        data: {
                            type: 'profile-subscription-bulk-create-job',
                            attributes: {
                                profiles: {
                                    data: [{ type: 'profile', id: profileId, attributes: { email: email } }]
                                }
                            },
                            relationships: {
                                list: { data: { type: 'list', id: KLAVIYO_LIST_ID } }
                            }
                        }
                    })
                });

                if (!subRes.ok) {
                    const subErr = await subRes.text();
                    console.error(`[API] Subscription Failed: ${subErr}`);
                    // Don't fail the request, just log
                } else {
                    console.log(`[API] Subscription Job Created`);
                }

                // 1.5 FAILSAVE: Trigger "Joined Waitlist" Event using Legacy Track API
                // This bypasses complex JSON-API validation and is reliable for custom events.
                const trackPayload = {
                    token: KLAVIYO_PUBLIC_KEY,
                    event: 'Joined Waitlist',
                    customer_properties: {
                        $email: email,
                        // Ensure properties are synced here too just in case
                        own_referral_code: newReferralCode
                    },
                    properties: {
                        interest: interest,
                        my_referral_code: newReferralCode
                    }
                };

                const trackData = Buffer.from(JSON.stringify(trackPayload)).toString('base64');
                const eventRes = await fetch(`https://a.klaviyo.com/api/track?data=${trackData}`);

                // Legacy API returns '1' on success, '0' on failure
                const eventResText = await eventRes.text();
                if (eventResText === '1') {
                    console.log(`[API] Triggered 'Joined Waitlist' event for ${email}`);
                } else {
                    // Log but don't fail, usually 0 means fail
                    console.warn(`[API] Legacy Track returned ${eventResText}`);
                }

                // 2. Increment Logic (Only if code provided)
                if (referredByCode) {
                    console.log(`[API] Searching for referrer with code: ${referredByCode}`);
                    const searchUrl = `https://a.klaviyo.com/api/profiles/?filter=equals(properties.own_referral_code,"${referredByCode}")`;
                    const searchRes = await fetch(searchUrl, {
                        method: 'GET',
                        headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15' }
                    });
                    const searchData = await searchRes.json();
                    if (searchData.data && searchData.data.length > 0) {
                        const referrer = searchData.data[0];
                        console.log(`[API] Found Referrer: ${referrer.id} (${referrer.attributes.email})`);
                        const newCount = (Number(referrer.attributes.properties.referral_count) || 0) + 1;
                        await fetch(`https://a.klaviyo.com/api/profiles/${referrer.id}/`, {
                            method: 'PATCH',
                            headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                            body: JSON.stringify({ data: { type: 'profile', id: referrer.id, attributes: { properties: { referral_count: newCount } } } })
                        });
                        console.log(`[API] Updated Referrer Count to ${newCount}`);
                        await fetch(`https://a.klaviyo.com/api/events/`, {
                            method: 'POST',
                            headers: { 'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`, 'revision': '2024-02-15', 'content-type': 'application/json' },
                            body: JSON.stringify({ data: { type: 'event', attributes: { profile: { data: { type: 'profile', id: referrer.id } }, metric: { name: 'Referral Success' }, properties: { new_total_entries: newCount, referred_email: email } } } })
                        });
                        console.log(`[API] Triggered Referral Success Event`);
                    } else {
                        console.log(`[API] Referrer NOT FOUND for code: ${referredByCode}`);
                    }
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, referralCode: newReferralCode }));
            } catch (error) {
                console.error("[API] Server Error", error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    } else { res.writeHead(404); res.end(); }
});

server.listen(PORT, () => { console.log(`Diagnostic Server running on http://127.0.0.1:${PORT}`); });
