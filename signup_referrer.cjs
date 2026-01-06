const http = require('http');

// 1. Create a Referrer (User A)
const payload = JSON.stringify({
    email: "carl.spiller3+Referrer6@gmail.com",
    interest: "football",
    referralCode: "" // No referrer
});

const options = {
    hostname: '127.0.0.1',
    port: 3003,
    path: '/api/send-email', // Using the correct endpoint
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

console.log("Creating Referrer...");
const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', () => {
        console.log("Referrer Creation Response:", data);
    });
});

req.write(payload);
req.end();
