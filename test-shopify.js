
import Client from 'shopify-buy';

const domain = 'sportssigned.myshopify.com';
const storefrontAccessToken = '9d5879fee4c4ec895826d24b8bae48cc';

console.log('Testing Shopify Connection...');
console.log('Domain:', domain);
console.log('Token:', storefrontAccessToken);

const client = Client.buildClient({
    domain: domain,
    storefrontAccessToken: storefrontAccessToken
});

async function testFetch() {
    try {
        console.log('Fetching products...');
        const products = await client.product.fetchAll();
        console.log(`Successfully fetched ${products.length} products.`);

        if (products.length > 0) {
            console.log('First product title:', products[0].title);
            console.log('First product tags:', products[0].tags);
        } else {
            console.log('No products found. Check if products are Active and available to the private app channel.');
        }

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

testFetch();
