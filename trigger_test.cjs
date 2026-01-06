const https = require('https');

// CONFIG
const KLAVIYO_PUBLIC_KEY = "VMkY3E"; // From server code
const TEST_EMAIL = 'carl.spiller3@gmail.com';

// 1. Construct Payload (Legacy Track API Format)
// This is the formatted object Klaviyo expects for the old /track endpoint
const trackPayload = {
    token: KLAVIYO_PUBLIC_KEY,
    event: 'Referral Success', // The name of the new metric
    customer_properties: {
        $email: TEST_EMAIL
    },
    properties: {
        new_total_entries: 1,
        referred_email: 'friend.test@example.com'
    }
};

// 2. Base64 Encode
const startData = JSON.stringify(trackPayload);
const b64Data = Buffer.from(startData).toString('base64');

console.log('Sending Legacy Track Request...');

// 3. Send GET Request
https.get(`https://a.klaviyo.com/api/track?data=${b64Data}`, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
        console.log('Response:', responseData); // Should be '1' for success
    });
}).on('error', (e) => {
    console.error(e);
});
