
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


        const { email, interest, referralCode: referredByCode } = req.body;

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
            const klaviyoListId = "Rxs6x7";
            const KLAVIYO_PRIVATE_KEY = "pk_adab87e0e1a4a0bd25c294e0764edd71dd";

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
                                            own_referral_code: referralCode,
                                            referred_by: referredByCode || '',
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

            // 1.5. Trigger "Joined Waitlist" Event (Transactional Trigger)
            await fetch(`https://a.klaviyo.com/api/events/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
                    'revision': '2024-02-15',
                    'content-type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    data: {
                        type: 'event',
                        attributes: {
                            profile: {
                                data: {
                                    type: 'profile',
                                    attributes: {
                                        email: email,
                                        properties: {
                                            own_referral_code: referralCode,
                                            interest: interest || 'General'
                                        }
                                    }
                                }
                            },
                            metric: {
                                name: 'Joined Waitlist'
                            },
                            properties: {
                                interest: interest || 'General',
                                my_referral_code: referralCode
                            }
                        }
                    }
                })
            });
            console.log("Triggered 'Joined Waitlist' event.");

            // 2. Update Referrer Count (If referredByCode exists)
            if (referredByCode) {
                try {
                    // A. Find Referrer Profile
                    const searchUrl = `https://a.klaviyo.com/api/profiles/?filter=equals(properties.own_referral_code,"${referredByCode}")`;
                    const searchRes = await fetch(searchUrl, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
                            'revision': '2024-02-15',
                            'accept': 'application/json'
                        }
                    });

                    const searchData = await searchRes.json();

                    if (searchData.data && searchData.data.length > 0) {
                        const referrerProfile = searchData.data[0];
                        const referrerId = referrerProfile.id;
                        const currentCount = Number(referrerProfile.attributes.properties.referral_count) || 0;
                        const newCount = currentCount + 1;

                        console.log(`Found referrer ${referrerId}. Updating count: ${currentCount} -> ${newCount}`);

                        // B. Update Referrer Profile (+1)
                        await fetch(`https://a.klaviyo.com/api/profiles/${referrerId}/`, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
                                'revision': '2024-02-15',
                                'content-type': 'application/json',
                                'accept': 'application/json'
                            },
                            body: JSON.stringify({
                                data: {
                                    type: 'profile',
                                    id: referrerId,
                                    attributes: {
                                        properties: {
                                            referral_count: newCount
                                        }
                                    }
                                }
                            })
                        });

                        // C. Trigger "Referral Success" Event (To Send Email)
                        await fetch(`https://a.klaviyo.com/api/events/`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
                                'revision': '2024-02-15',
                                'content-type': 'application/json',
                                'accept': 'application/json'
                            },
                            body: JSON.stringify({
                                data: {
                                    type: 'event',
                                    attributes: {
                                        profile: {
                                            data: {
                                                type: 'profile',
                                                id: referrerId
                                            }
                                        },
                                        metric: {
                                            name: 'Referral Success'
                                        },
                                        properties: {
                                            new_total_entries: newCount,
                                            referred_email: email
                                        }
                                    }
                                }
                            })
                        });
                        console.log("Referral logic complete.");
                    } else {
                        console.log("Referrer code not found:", referredByCode);
                    }
                } catch (refErr) {
                    console.error("Referral Logic Error:", refErr);
                }
            }
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
