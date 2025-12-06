import { PLACEHOLDER_PRODUCTS } from '../../src/lib/placeholder-data'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Export product data to Shopify-compatible CSV format
 * Based on: https://help.shopify.com/en/manual/products/import-export/using-csv
 */

interface ShopifyCSVRow {
  Handle: string
  Title: string
  'Body (HTML)': string
  Vendor: string
  'Product Category': string
  Type: string
  Tags: string
  Published: string
  'Option1 Name': string
  'Option1 Value': string
  'Variant SKU': string
  'Variant Grams': string
  'Variant Inventory Tracker': string
  'Variant Inventory Qty': string
  'Variant Inventory Policy': string
  'Variant Fulfillment Service': string
  'Variant Price': string
  'Variant Compare At Price': string
  'Variant Requires Shipping': string
  'Variant Taxable': string
  'Variant Barcode': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'Gift Card': string
  'SEO Title': string
  'SEO Description': string
  'Variant Image': string
  'Variant Weight Unit': string
  Status: string
  // Custom Metafields
  'Metafield: custom.nfc_id [single_line_text_field]': string
  'Metafield: custom.athlete_name [single_line_text_field]': string
  'Metafield: custom.team_name [single_line_text_field]': string
  'Metafield: custom.sport [single_line_text_field]': string
}

function escapeCSV(value: string | null | undefined): string {
  if (!value) return ''
  // Escape double quotes and wrap in quotes if contains comma, newline, or quote
  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  return stringValue
}

function extractMetadata(product: typeof PLACEHOLDER_PRODUCTS[0]) {
  // Extract athlete name (usually 3rd tag)
  const athleteName = product.tags?.[2] || ''
  // Extract team (usually 1st tag)
  const teamName = product.tags?.[0] || ''
  // Extract sport (usually 2nd tag)
  const sport = product.tags?.[1] || ''
  
  return { athleteName, teamName, sport }
}

function generateSEOTitle(product: typeof PLACEHOLDER_PRODUCTS[0]): string {
  const athlete = product.tags?.[2] || product.tags?.[0] || 'Athlete'
  const itemType = product.product_type || 'Item'
  return `${athlete} Signed ${itemType} | NFC Authenticated`
}

function generateSEODescription(product: typeof PLACEHOLDER_PRODUCTS[0]): string {
  const athlete = product.tags?.[2] || product.tags?.[0] || 'athlete'
  const team = product.tags?.[0] || 'sports'
  const itemType = product.product_type || 'item'
  return `Official ${athlete} signed ${itemType}. Authentic ${team} memorabilia with digital NFC authentication. Premium framing available. Shop now with free UK delivery.`
}

function generateImageAlt(product: typeof PLACEHOLDER_PRODUCTS[0]): string {
  const athlete = product.tags?.[2] || product.tags?.[0] || 'Athlete'
  const team = product.tags?.[0] || ''
  const itemType = product.product_type || 'item'
  return `${athlete} ${team} signed ${itemType} with NFC authentication`
}

// Convert products to Shopify CSV format
const rows: ShopifyCSVRow[] = []

PLACEHOLDER_PRODUCTS.forEach((product) => {
  const variant = product.variants?.[0]
  const metadata = extractMetadata(product)
  
  // Format tags with Sport:, Team:, Athlete: prefixes
  const formattedTags = product.tags
    ?.map((tag: string, index: number) => {
      if (index === 0) return `Team:${tag}` // Team
      if (index === 1) return `Sport:${tag}` // Sport
      if (index === 2) return `Athlete:${tag}` // Athlete
      if (index === 3) return `Type:${tag}` // Type
      return tag
    })
    .join(', ') || ''

  const row: ShopifyCSVRow = {
    Handle: product.handle,
    Title: product.title,
    'Body (HTML)': product.body_html || '',
    Vendor: product.vendor || 'The Sports Memorabilia Store',
    'Product Category': 'Sporting Goods > Sports Memorabilia',
    Type: product.product_type || '',
    Tags: formattedTags,
    Published: product.status === 'active' ? 'TRUE' : 'FALSE',
    'Option1 Name': 'Variant',
    'Option1 Value': variant?.title || 'Default',
    'Variant SKU': variant?.sku || '',
    'Variant Grams': '500', // Default weight
    'Variant Inventory Tracker': 'shopify',
    'Variant Inventory Qty': String(variant?.inventory_quantity || 1),
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Price': String(variant?.price || 0),
    'Variant Compare At Price': '',
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
    'Variant Barcode': '',
    'Image Src': product.images?.[0] || '',
    'Image Position': '1',
    'Image Alt Text': generateImageAlt(product),
    'Gift Card': 'FALSE',
    'SEO Title': generateSEOTitle(product),
    'SEO Description': generateSEODescription(product),
    'Variant Image': '',
    'Variant Weight Unit': 'g',
    Status: product.status === 'active' ? 'active' : 'draft',
    'Metafield: custom.nfc_id [single_line_text_field]': `NFC-${product.id}`,
    'Metafield: custom.athlete_name [single_line_text_field]': metadata.athleteName,
    'Metafield: custom.team_name [single_line_text_field]': metadata.teamName,
    'Metafield: custom.sport [single_line_text_field]': metadata.sport,
  }

  rows.push(row)
})

// Generate CSV content
const headers = Object.keys(rows[0]) as (keyof ShopifyCSVRow)[]
const csvLines = [
  headers.join(','),
  ...rows.map((row) => headers.map((header) => escapeCSV(row[header])).join(','))
]

const csvContent = csvLines.join('\n')

// Write to file
const outputPath = path.join(__dirname, '..', 'shopify-products-import.csv')
fs.writeFileSync(outputPath, csvContent, 'utf-8')

console.log(`✅ Successfully exported ${rows.length} products to: ${outputPath}`)
console.log('\nNext steps:')
console.log('1. Review the CSV file')
console.log('2. Log into your Shopify admin')
console.log('3. Go to Products > Import')
console.log('4. Upload shopify-products-import.csv')
console.log('5. Map the metafields if prompted')
