
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

async function main() {
    console.log("🔍 Starting Connectivity Diagnosis...");
    
    // Resolve .env path from scripts folder to root
    const envPath = path.resolve(process.cwd(), '.env');
    console.log(`Reading .env from: ${envPath}`);

    let envContent = '';
    try {
        envContent = fs.readFileSync(envPath, 'utf-8');
    } catch (err) {
        console.error("❌ Could not read .env file:", err.message);
        return;
    }

    const env = {};
    envContent.split('\n').forEach((line, index) => {
        const trimmed = line.trim();
        if(!trimmed || trimmed.startsWith('#')) return; // Skip empty/comments
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            env[key] = value;
            console.log(`Line ${index+1}: Found key '${key}'`);
        } else {
             console.log(`Line ${index+1}: Could not parse line (starts with '${trimmed.substring(0, 5)}...')`);
        }
    });

    const shopifyDomain = env['VITE_SHOPIFY_DOMAIN'];
    const shopifyToken = env['VITE_SHOPIFY_ACCESS_TOKEN'];
    const supabaseUrl = env['VITE_SUPABASE_URL'];
    const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

    console.log(`VITE_SHOPIFY_DOMAIN: ${shopifyDomain ? '✅ Present' : '❌ Missing'} (${shopifyDomain || ''})`);
    console.log(`VITE_SHOPIFY_ACCESS_TOKEN: ${shopifyToken ? '✅ Present' : '❌ Missing'}`);
    console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Present' : '❌ Missing'}`);
    console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Present' : '❌ Missing'}`);

    if (shopifyDomain && shopifyToken) {
        console.log("\n--- Testing Shopify ---");
        try {
            const query = `{ products(first: 1) { edges { node { title } } } }`;
            const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': shopifyToken
                },
                body: JSON.stringify({ query })
            });
            const json = await response.json();
            if (json.data && json.data.products) {
                console.log(`✅ Shopify Connected! Found product: ${json.data.products.edges[0]?.node?.title || 'None'}`);
            } else {
                console.error(`❌ Shopify Error: ${json.errors?.[0]?.message || JSON.stringify(json)}`);
            }
        } catch (err) {
            console.error(`❌ Shopify Network Error: ${err.message}`);
        }
    }

    if (supabaseUrl && supabaseKey) {
        console.log("\n--- Testing Supabase ---");
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
            if (!error) {
                console.log(`✅ Supabase Connected! 'products' table reachable (Count: ${count}).`);
            } else {
                console.error(`❌ Supabase Error: ${error.message}`);
            }
        } catch (err) {
            console.error(`❌ Supabase Client Error: ${err.message}`);
        }
    }
}

main();
