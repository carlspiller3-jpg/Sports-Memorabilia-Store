
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Polyfill for fetch if needed (Node 18+ has it native)
// globalThis.fetch is available in Node 25

async function main() {
    console.log("🔍 Starting Connectivity Diagnosis...");
    
    // 1. Read .env manually
    let envContent = '';
    try {
        envContent = fs.readFileSync('.env', 'utf-8');
    } catch (err) {
        console.error("❌ Could not read .env file:", err.message);
        return;
    }

    const env = {};
    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    });

    const shopifyDomain = env['VITE_SHOPIFY_DOMAIN'];
    const shopifyToken = env['VITE_SHOPIFY_ACCESS_TOKEN'];
    const supabaseUrl = env['VITE_SUPABASE_URL'];
    const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

    console.log("\n--- Environment Variables Check ---");
    console.log(`VITE_SHOPIFY_DOMAIN: ${shopifyDomain ? '✅ Present' : '❌ Missing'} (${shopifyDomain || ''})`);
    console.log(`VITE_SHOPIFY_ACCESS_TOKEN: ${shopifyToken ? '✅ Present' : '❌ Missing'}`);
    console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`);
    console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Present' : '❌ Missing'}`);

    // 2. Test Shopify
    console.log("\n--- Testing Shopify Connectivity ---");
    if (shopifyDomain && shopifyToken) {
        const query = `
        {
            products(first: 1) {
                edges {
                    node {
                        id
                        title
                    }
                }
            }
        }`;

        try {
            const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': shopifyToken
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                console.error(`❌ Shopify HTTP Error: ${response.status} ${response.statusText}`);
            } else {
                const json = await response.json();
                if (json.errors) {
                    console.error("❌ Shopify GraphQL Errors:", JSON.stringify(json.errors, null, 2));
                } else if (!json.data || !json.data.products) {
                    console.error("❌ Shopify Unexpected Response:", JSON.stringify(json, null, 2));
                } else {
                    const products = json.data.products.edges;
                    console.log(`✅ Shopify Connected! Found ${products.length} products.`);
                    if(products.length > 0) {
                         console.log(`   Sample Product: ${products[0].node.title}`);
                    }
                }
            }
        } catch (err) {
             console.error("❌ Shopify Connection Failed:", err.message);
        }
    } else {
        console.log("⚠️ Skipping Shopify test due to missing variables.");
    }

    // 3. Test Supabase
    console.log("\n--- Testing Supabase Connectivity ---");
    if (supabaseUrl && supabaseKey) {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // Try to fetch public settings or a known table
            // We'll try to select from 'products' table which schema says exists
            const { data, error, count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true }); // Head request to just check permission/existence

            if (error) {
                console.error("❌ Supabase Error:", error.message, error.code, error.details);
                // If table doesn't exist, it might return 404 or specific error.
                // If connection works but table missing, that's still "connected" but "misconfigured database".
            } else {
                 console.log(`✅ Supabase Connected! 'products' table exists.`);
                 console.log(`   Row count in 'products': ${count}`);
            }

            // Also check auth just in case
            const { data: authData, error: authError } = await supabase.auth.getSession();
            if (authError) {
                 console.log(`⚠️ Supabase Auth Warning: ${authError.message}`);
            } else {
                 console.log(`✅ Supabase Auth Service Reachable.`);
            }

        } catch (err) {
            console.error("❌ Supabase Connection Failed (Exception):", err.message);
        }
    } else {
        console.log("⚠️ Skipping Supabase test due to missing variables.");
    }
    console.log("\n--- Diagnosis Complete ---");
}

main().catch(console.error);
