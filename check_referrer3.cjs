const https = require('https');

const PRIVATE_KEY = 'pk_cdd82beeadb004d366deef6c3cada74ad5';
const CODE = 'VIP-CAR-4XSBA';

const options = {
    hostname: 'a.klaviyo.com',
    path: `/api/profiles/?filter=equals(properties.own_referral_code,"${CODE}")`,
    method: 'GET',
    headers: {
        'Authorization': `Klaviyo-API-Key ${PRIVATE_KEY}`,
        'accept': 'application/vnd.api+json',
        'revision': '2024-10-15'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log("Found:", json.data ? json.data.length : 0);
            if (json.data && json.data.length > 0) {
                console.log("Profile ID:", json.data[0].id);
            }
        } catch (e) {
            console.log("Raw:", data);
        }
    });
});

req.end();
