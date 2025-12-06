
import { createStorefrontClient } from '@shopify/hydrogen-react';
import 'dotenv/config';

// Polyfill for fetch if needed (though usually available in modern Node)
// const fetch = require('node-fetch'); 

async function testConnection() {
    console.log("--> Starting Shopify Connection Test...");

    const domain = process.env.VITE_SHOPIFY_DOMAIN;
    const token = process.env.VITE_SHOPIFY_ACCESS_TOKEN;

    if (!domain || !token) {
        console.error("❌ Error: Missing Environment Variables.");
        console.error("   Please ensure VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_ACCESS_TOKEN are set in your .env file.");
        return;
    }

    console.log(`--> Connecting to: ${domain}`);

    try {
        // We'll use a direct fetch because shopify-buy might have issues in this raw script environment 
        // without setting up a full browser-like context, and we just want to test keys.
        const query = `
        {
            products(first: 3) {
                edges {
                    node {
                        id
                        title
                        handle
                    }
                }
            }
        }`;

        const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token
            },
            body: JSON.stringify({ query })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        if (json.errors) {
            console.error("❌ GraphQL Errors:", JSON.stringify(json.errors, null, 2));
        } else {
            const products = json.data.products.edges;
            console.log("✅ Connection Successful!");
            console.log(`--> Fetched ${products.length} products:`);
            products.forEach((p: any) => console.log(`   - ${p.node.title} (${p.node.handle})`));
        }

    } catch (error) {
        console.error("❌ Connection Failed:", error);
    }
}

testConnection();
