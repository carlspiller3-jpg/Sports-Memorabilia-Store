
const domain = 'sports-memorabilia-store-3.myshopify.com';
const token = '9d5879fee4c4ec895826d24b8bae48cc';

async function verify() {
    console.log(`Checking connection to https://${domain}...`);
    try {
        const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token
            },
            body: JSON.stringify({
                query: '{ shop { name } }' // Simple query to check access
            })
        });

        if (!response.ok) {
            console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response:', text);
            return;
        }

        const json = await response.json();
        if (json.errors) {
            console.error('❌ GraphQL API Error:', JSON.stringify(json.errors, null, 2));
        } else {
            console.log('✅ Success! Connected to shop:', json.data.shop.name);
        }
    } catch (err) {
        console.error('❌ Network Error:', err.message);
    }
}

verify();
