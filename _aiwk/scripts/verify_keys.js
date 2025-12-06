
const domain = 'sports-memorabilia-store-3.myshopify.com';
const token = '9d5879fee4c4ec895826d24b8bae48cc';

async function verify() {
    console.log(`Checking connection to https://${domain}...`);
    try {
        // 1. Fetch First Product Variant
        // -----------------------------
        const productQuery = `
          {
            products(first: 1) {
              edges {
                node {
                  title
                  variants(first: 1) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token
            },
            body: JSON.stringify({ query: productQuery })
        });

        const json = await response.json();
        
        if (!json.data || json.data.products.edges.length === 0) {
            console.error('❌ No items found to test checkout with.');
            return; 
        }

        const product = json.data.products.edges[0].node;
        const variantId = product.variants.edges[0].node.id;
        console.log(`✅ Found Product: "${product.title}"`);
        console.log(`   Variant ID: ${variantId}`);

        // 2. Test Checkout Mutation
        // -------------------------
        console.log('\nAttempting to create checkout...');
        const checkoutMutation = `
            mutation checkoutCreate($input: CheckoutCreateInput!) {
              checkoutCreate(input: $input) {
                checkout {
                   webUrl
                }
                checkoutUserErrors {
                  code
                  field
                  message
                }
              }
            }
        `;

        const variables = {
            input: {
                lineItems: [{ variantId: variantId, quantity: 1 }]
            }
        };

        const checkoutResponse = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token
            },
            body: JSON.stringify({ query: checkoutMutation, variables: variables })
        });

        const checkoutJson = await checkoutResponse.json();
        const result = checkoutJson.data.checkoutCreate;

        if (result.checkoutUserErrors && result.checkoutUserErrors.length > 0) {
            console.error('❌ Checkout Failed with Storefront API Errors:');
            result.checkoutUserErrors.forEach(e => console.error(`   - [${e.code}] ${e.message}`));
        } else if (result.checkout && result.checkout.webUrl) {
            console.log('✅ Checkout Successful!');
            console.log('   URL:', result.checkout.webUrl);
        } else {
            console.error('❌ Unknown Checkout Error:', JSON.stringify(result, null, 2));
        }

    } catch (err) {
        console.error('❌ Network Error:', err.message);
    }
}

verify();
