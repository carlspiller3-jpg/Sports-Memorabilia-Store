import { INVENTORY_PRODUCTS, ARCHIVED_HERITAGE } from './inventory'

export const PLACEHOLDER_PRODUCTS = INVENTORY_PRODUCTS
export const SECURED_HERITAGE = ARCHIVED_HERITAGE

export const PLACEHOLDER_IMAGES: Record<string, string> = [...PLACEHOLDER_PRODUCTS, ...SECURED_HERITAGE].reduce((acc, product) => {
  if (product.images && product.images.length > 0) {
    acc[product.id] = product.images[0];
  }
  return acc;
}, {} as Record<string, string>);
