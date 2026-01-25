import { INVENTORY_PRODUCTS } from './inventory'

export const PLACEHOLDER_PRODUCTS = INVENTORY_PRODUCTS

export const PLACEHOLDER_IMAGES: Record<string, string> = PLACEHOLDER_PRODUCTS.reduce((acc, product) => {
  if (product.images && product.images.length > 0) {
    acc[product.id] = product.images[0];
  }
  return acc;
}, {} as Record<string, string>);

