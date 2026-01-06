const https = require('https');

const PRIVATE_KEY = 'pk_cdd82beeadb004d366deef6c3cada74ad5';
const EMAIL = 'carl.spiller3+Referrer3@gmail.com';

const options = {
    hostname: 'a.klaviyo.com',
    path: `/api/profiles/?filter=equals(email,"${encodeURIComponent(EMAIL)}")`,
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
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Raw:", data);
        }
    });
});

req.end();
