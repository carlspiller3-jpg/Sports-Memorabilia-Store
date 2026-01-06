const https = require('https');

// Simulate User C referring User A (VIP-CAR-Y2FC5)
// This hits the LOCAL server endpoint

const payload = JSON.stringify({
    email: "carl.spiller3+UserC@gmail.com",
    interest: "football",
    referralCode: "VIP-CAR-Y2FC5" // User A's code
});

const options = {
    hostname: '127.0.0.1',
    port: 3003,
    path: '/api/send-email',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = https.request(options, (res) => {
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.write(payload);
req.end();
