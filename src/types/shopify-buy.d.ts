declare module 'shopify-buy' {
  export interface Client {
    product: {
      fetchAll(pageSize?: number): Promise<any[]>;
      fetchByHandle(handle: string): Promise<any>;
    };
    checkout: {
      create(args?: { lineItems: any[] }): Promise<any>;
    };
  }
  
  export interface ClientConfig {
    domain: string;
    storefrontAccessToken: string;
    apiVersion?: string;
  }

  function buildClient(config: ClientConfig): Client;
  
  export default {
    buildClient
  };
}
