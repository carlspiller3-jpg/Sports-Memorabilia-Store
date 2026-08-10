import type { Product } from '@/types/schema'
import { extractTagData } from './tag-validator'

/**
 * SKU Format: {TEAM}-{ATHLETE}-{YEAR}-{TYPE}-{VARIANT}
 * Example: LIV-GER-05-S-F (Liverpool Gerrard 2005 Shirt Framed)
 */

// Team code mappings
const TEAM_CODES: Record<string, string> = {
  'Liverpool': 'LIV',
  'Manchester United': 'MUN',
  'Manchester City': 'MCI',
  'Arsenal': 'ARS',
  'Chelsea': 'CHE',
  'Tottenham': 'TOT',
  'Newcastle': 'NEW',
  'West Ham': 'WHU',
  'Aston Villa': 'AVL',
  'Leicester City': 'LEI',
  'Barcelona': 'BAR',
  'Real Madrid': 'RMA',
  'PSG': 'PSG',
  'All Blacks': 'ABL',
  'New Zealand': 'ABL',
  'Springboks': 'SPR',
  'South Africa': 'SPR',
  'England': 'ENG',
  'India': 'IND',
  'Brazil': 'BRA',
  'Argentina': 'ARG',
}

// Sport codes for individual sports (no team)
const SPORT_CODES: Record<string, string> = {
  'Boxing': 'BOX',
  'F1': 'F1',
  'Tennis': 'TEN',
  'Golf': 'GLF',
  'Athletics': 'ATH',
}

// Item type codes
const TYPE_CODES: Record<string, string> = {
  'shirt': 'S',
  'boot': 'B',
  'photo': 'P',
  'glove': 'G',
  'boxing': 'G',
  'ball': 'L',
  'bat': 'T',
  'trunks': 'K',
}

/**
 * Get team code from team name or sport
 */
function getTeamCode(team: string, sport: string): string {
  // Try team mapping first
  if (TEAM_CODES[team]) {
    return TEAM_CODES[team]
  }
  
  // Fall back to sport code for individual sports
  if (SPORT_CODES[sport]) {
    return SPORT_CODES[sport]
  }
  
  // Default fallback
  return 'XXX'
}

/**
 * Get athlete code from full name (first 3-4 chars of surname)
 */
function getAthleteCode(athleteName: string): string {
  if (!athleteName) return 'XXXX'
  
  // Extract surname (last word)
  const parts = athleteName.trim().split(' ')
  const surname = parts[parts.length - 1]
  
  // Take first 3-4 chars, uppercase
  const code = surname.substring(0, 4).toUpperCase()
  return code
}

/**
 * Extract year from product title (returns last 2 digits or XX)
 */
function extractYear(title: string): string {
  // Look for 4-digit year (1900-2099)
  const match = title.match(/\b(19|20)\d{2}\b/)
  if (match) {
    // Return last 2 digits
    return match[0].substring(2)
  }
  return 'XX'
}

/**
 * Get type code from item type
 */
function getTypeCode(itemType: string): string {
  const normalized = itemType.toLowerCase()
  return TYPE_CODES[normalized] || 'X'
}

/**
 * Get variant code from variant title
 */
function getVariantCode(variantTitle: string): string {
  const normalized = variantTitle.toLowerCase()
  
  if (normalized.includes('frame')) return 'F'
  if (normalized.includes('display')) return 'D'
  if (normalized.includes('unframe')) return 'U'
  
  return 'F' // Default to framed
}

/**
 * Generate SKU for a product
 */
export function generateSKU(product: Product): string {
  const { team, sport, athlete, itemType } = extractTagData(product)
  
  // Get each component
  const teamCode = getTeamCode(team, sport)
  const athleteCode = getAthleteCode(athlete)
  const year = extractYear(product.title)
  const typeCode = getTypeCode(itemType || product.product_type || '')
  const variantCode = getVariantCode(product.variants?.[0]?.title || 'Framed')
  
  // Build SKU
  const sku = `${teamCode}-${athleteCode}-${year}-${typeCode}-${variantCode}`
  
  return sku
}

/**
 * Validate SKU format
 */
export function validateSKU(sku: string): boolean {
  // Format: XXX-XXXX-XX-X-X (11-15 chars with hyphens)
  const pattern = /^[A-Z0-9]{2,4}-[A-Z]{3,4}-[A-Z0-9]{2}-[A-Z]-[A-Z]$/
  return pattern.test(sku)
}

/**
 * Check for duplicate SKUs in product array
 */
export function findDuplicateSKUs(products: Product[]): string[] {
  const skuCounts = new Map<string, number>()
  
  products.forEach(product => {
    const sku = generateSKU(product)
    skuCounts.set(sku, (skuCounts.get(sku) || 0) + 1)
  })
  
  return Array.from(skuCounts.entries())
    .filter(([_, count]) => count > 1)
    .map(([sku, _]) => sku)
}
