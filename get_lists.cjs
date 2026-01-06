const https = require('https');

const PRIVATE_KEY = 'pk_cdd82beeadb004d366deef6c3cada74ad5';

const options = {
    hostname: 'a.klaviyo.com',
    path: '/api/lists/',
    method: 'GET',
    headers: {
        'Authorization': `Klaviyo-API-Key ${PRIVATE_KEY}`,
        'accept': 'application/vnd.api+json',
        'revision': '2024-10-15'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.data) {
                json.data.forEach(list => {
                    console.log(`List: ${list.attributes.name}, ID: ${list.id}`);
                });
            } else {
                console.log(JSON.stringify(json, null, 2));
            }

        } catch (e) {
            console.log("Raw output:", data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
