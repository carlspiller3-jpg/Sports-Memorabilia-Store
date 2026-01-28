
const https = require('https');

const domain = 'sports-memorabilia-store-3.myshopify.com';
const accessToken = '9d5879fee4c4ec895826d24b8bae48cc';

const options = {
  hostname: domain,
  path: '/api/2024-01/graphql.json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': accessToken
  }
};

const payload = JSON.stringify({
  query: `
    {
      shop {
        name
      }
      products(first: 3) {
        edges {
          node {
            title
            tags
          }
        }
      }
    }
  `
});

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Body:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(payload);
req.end();
