const http = require('http');

// 2. Create a Referee (User B) using User A's code
const payload = JSON.stringify({
    email: "carl.spiller3+Referee3@gmail.com",
    interest: "boxing",
    referralCode: "VIP-CAR-4XSBA" // Updated Code from Test 3
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

console.log("Creating Referee...");
const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', () => {
        console.log("Referee Creation Response:", data);
    });
});

req.write(payload);
req.end();
