
import ShopifyBuy from 'shopify-buy';
import type { Client } from 'shopify-buy';
import type { Product, Variant } from '@/types/schema';

const isLive = import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true';
const domain = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN || '';

let client: Client | null = null;

if (isLive && domain && storefrontAccessToken) {
  try {
    client = ShopifyBuy.buildClient({
      domain,
      storefrontAccessToken,
      apiVersion: '2024-01'
    });
  } catch (e) {
    console.warn('Failed to initialize Shopify Client:', e);
  }
}

export const shopifyClient = client;

// --- Mappers ---

export function mapShopifyProduct(shopifyProduct: any): Product {
  // Map Standard Fields
  const images = shopifyProduct.images?.map((img: any) => img.src || img.url).filter(Boolean) || [];
  const variants = shopifyProduct.variants?.map((v: any) => ({
    id: v.id,
    product_id: shopifyProduct.id,
    title: v.title,
    price: parseFloat(v.price.amount),
    sku: v.sku || `SKU-${v.id.substring(0, 8)}`, // Fallback
    inventory_quantity: (v.availableForSale || v.available) ? 10 : 0, // Simplified
    option1: v.selectedOptions?.[0]?.value || null,
    option2: v.selectedOptions?.[1]?.value || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as Variant)) || [];

  // Ensure tags are an array of strings
  // Shopify SDK usually returns an array of objects {value: 'tag'} or just strings depending on query
  // But shopify-buy usually maps them to objects or checking the raw GQL.
  // In shopify-buy v2+, tags might be a simple array if requested correctly but often strings.
  // We'll safely handle both.
  const tags = Array.isArray(shopifyProduct.tags)
    ? shopifyProduct.tags.map((t: any) => typeof t === 'string' ? t : t.value)
    : [];

  return {
    id: shopifyProduct.id,
    title: shopifyProduct.title,
    body_html: shopifyProduct.descriptionHtml || shopifyProduct.description || '',
    vendor: shopifyProduct.vendor,
    product_type: shopifyProduct.productType,
    handle: shopifyProduct.handle,
    status: 'active',
    tags,
    created_at: shopifyProduct.createdAt,
    updated_at: shopifyProduct.updatedAt,
    variants,
    images,
    seo_title: shopifyProduct.seo?.title || shopifyProduct.title,
    seo_description: shopifyProduct.seo?.description || shopifyProduct.description
  };
}

function mapGraphqlNodeToProduct(node: any): Product {
  const images = node.images?.edges?.map((edge: any) => edge.node.url) || [];
  const variants = node.variants?.edges?.map((edge: any) => {
    const v = edge.node;
    return {
      id: v.id,
      product_id: node.id,
      title: v.title,
      price: parseFloat(v.price?.amount || '0'),
      sku: v.sku || '',
      inventory_quantity: v.availableForSale ? 10 : 0,
      option1: v.selectedOptions?.[0]?.value || null,
      option2: v.selectedOptions?.[1]?.value || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Variant
  }) || [];

  return {
    id: node.id,
    title: node.title,
    body_html: node.descriptionHtml || node.description || '',
    vendor: node.vendor,
    product_type: node.productType,
    handle: node.handle,
    status: 'active', // GraphQL store API only returns active
    tags: node.tags || [],
    created_at: node.createdAt,
    updated_at: node.updatedAt,
    variants,
    images,
    seo_title: node.seo?.title || node.title,
    seo_description: node.seo?.description || node.description
  };
}

// --- Fetchers ---

export async function fetchAllProducts(): Promise<Product[]> {
  if (!domain || !storefrontAccessToken) {
    console.warn('Shopify format not initialized. Returning empty.');
    return [];
  }

  const query = `
      query getAllProducts {
        products(first: 250) {
          edges {
            node {
              id
              title
              description
              descriptionHtml
              handle
              productType
              vendor
              createdAt
              updatedAt
              tags
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                    }
                    sku
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
              seo {
                title
                description
              }
            }
          }
        }
      }
    `;

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      },
      body: JSON.stringify({ query })
    });

    const json = await response.json();
    if (json.errors) {
      console.error('Shopify API Errors:', json.errors);
      return [];
    }

    const products = json.data?.products?.edges || [];
    return products.map((edge: any) => mapGraphqlNodeToProduct(edge.node));

  } catch (err) {
    console.error('Error fetching Shopify products:', err);
    return [];
  }
}

export async function fetchProductByHandle(handle: string): Promise<Product | null> {
  if (!client) return null;

  try {
    const product = await client.product.fetchByHandle(handle);
    if (!product) return null;
    return mapShopifyProduct(product);
  } catch (err) {
    console.error(`Error fetching product ${handle}:`, err);
    return null;
  }
}

export async function createCheckout(items: { variantId: string, quantity: number }[]): Promise<string | null> {
  // We use the modern 'cartCreate' mutation via raw fetch 
  // because 'checkoutCreate' requires specific legacy permissions 
  // that are often missing or hard to configure.

  if (!domain || !storefrontAccessToken) return null;

  const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            message
            code
          }
        }
      }
    `;

  const variables = {
    input: {
      lines: items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }))
    }
  };

  try {
    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken
      },
      body: JSON.stringify({ query, variables })
    });

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify API Errors:', json.errors);
      return null;
    }

    const result = json.data?.cartCreate;

    if (result?.userErrors?.length > 0) {
      console.error('Cart Creation Errors:', result.userErrors);
      return null;
    }

    return result?.cart?.checkoutUrl || null;

  } catch (err) {
    console.error('Error creating cart/checkout:', err);
    return null;
  }
}

export const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      displayName
      email
      phone
      defaultAddress {
        id
        address1
        address2
        city
        province
        zip
        country
        formatted
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            zip
            country
            formatted
            firstName
            lastName
            phone
          }
        }
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      url
                      altText
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_CREATE = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_DELETE = `
  mutation customerAddressDelete($id: ID!, $customerAccessToken: String!) {
    customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
      deletedCustomerAddressId
      customerUserErrors {
        message
      }
    }
  }
`;

export const CUSTOMER_ADDRESS_UPDATE = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
      }
      customerUserErrors {
        message
      }
    }
  }
`;

// --- Collection Fetchers ---

export async function fetchCollections(): Promise<any[]> {
  if (!client) return [];

  try {
    const collections = await (client as any).collection.fetchAll();
    return collections.map((c: any) => ({
      id: c.id,
      title: c.title,
      handle: c.handle,
      description: c.description,
      image: c.image ? c.image.src : null
    }));
  } catch (err) {
    console.error('Error fetching collections:', err);
    return [];
  }
}

export async function fetchProductsByCollection(handle: string): Promise<Product[]> {
  if (!client) return [];

  try {
    const collection = await (client as any).collection.fetchByHandle(handle);
    if (!collection || !collection.products) return [];
    return collection.products.map(mapShopifyProduct);
  } catch (err) {
    console.error(`Error fetching products for collection ${handle}:`, err);
    return [];
  }
}
