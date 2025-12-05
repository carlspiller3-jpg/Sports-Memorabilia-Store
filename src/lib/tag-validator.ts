import { PLACEHOLDER_PRODUCTS } from './placeholder-data'
import type { Product } from '@/types/schema'

/**
 * Tag Structure Convention:
 * tags[0] = Team (e.g., "Liverpool", "Manchester United")
 * tags[1] = Sport (e.g., "Football", "Boxing", "Rugby")
 * tags[2] = Athlete (e.g., "Steven Gerrard", "Tyson Fury")
 * tags[3] = Item Type (e.g., "Shirt", "Boot", "Photo")
 * tags[4+] = Additional tags (e.g., "Signed", "Match Worn")
 */

export interface TagValidationResult {
  isValid: boolean
  productId: string
  productTitle: string
  errors: string[]
  warnings: string[]
}

export interface TagConsistencyReport {
  totalProducts: number
  validProducts: number
  invalidProducts: number
  results: TagValidationResult[]
  uniqueTeams: string[]
  uniqueSports: string[]
  uniqueAthletes: string[]
}

/**
 * Validate a single product's tags
 */
export function validateProductTags(product: Product): TagValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check if tags exist
  if (!product.tags || product.tags.length === 0) {
    errors.push('No tags defined')
    return {
      isValid: false,
      productId: product.id,
      productTitle: product.title,
      errors,
      warnings
    }
  }

  // Validate minimum required tags (Team, Sport, Athlete, Type)
  if (product.tags.length < 4) {
    errors.push(`Only ${product.tags.length} tags found, expected at least 4 (Team, Sport, Athlete, Type)`)
  }

  // Validate Team (index 0)
  if (!product.tags[0] || product.tags[0].trim() === '') {
    errors.push('Team tag (index 0) is missing or empty')
  }

  // Validate Sport (index 1)
  if (!product.tags[1] || product.tags[1].trim() === '') {
    errors.push('Sport tag (index 1) is missing or empty')
  } else {
    // Check if sport is in approved list
    const validSports = ['Football', 'Boxing', 'Rugby', 'Cricket', 'F1', 'Tennis', 'Golf', 'Athletics']
    if (!validSports.includes(product.tags[1])) {
      warnings.push(`Sport "${product.tags[1]}" is not in the standard list: ${validSports.join(', ')}`)
    }
  }

  // Validate Athlete (index 2)
  if (!product.tags[2] || product.tags[2].trim() === '') {
    errors.push('Athlete tag (index 2) is missing or empty')
  }

  // Validate Item Type (index 3)
  if (!product.tags[3] || product.tags[3].trim() === '') {
    errors.push('Item Type tag (index 3) is missing or empty')
  } else {
    const validTypes = ['Shirt', 'Boot', 'Photo', 'Glove', 'Ball', 'Bat', 'Trunks']
    if (!validTypes.includes(product.tags[3])) {
      warnings.push(`Item Type "${product.tags[3]}" is not in the standard list: ${validTypes.join(', ')}`)
    }
  }

  // Check for duplicate tags
  const uniqueTags = new Set(product.tags)
  if (uniqueTags.size !== product.tags.length) {
    warnings.push('Duplicate tags detected')
  }

  return {
    isValid: errors.length === 0,
    productId: product.id,
    productTitle: product.title,
    errors,
    warnings
  }
}

/**
 * Validate all products and generate consistency report
 */
export function generateTagConsistencyReport(products: Product[] = PLACEHOLDER_PRODUCTS): TagConsistencyReport {
  const results = products.map(validateProductTags)
  
  const validProducts = results.filter(r => r.isValid).length
  const invalidProducts = results.filter(r => !r.isValid).length

  // Extract unique values for each tag position
  const uniqueTeams = new Set<string>()
  const uniqueSports = new Set<string>()
  const uniqueAthletes = new Set<string>()

  products.forEach(product => {
    if (product.tags) {
      if (product.tags[0]) uniqueTeams.add(product.tags[0])
      if (product.tags[1]) uniqueSports.add(product.tags[1])
      if (product.tags[2]) uniqueAthletes.add(product.tags[2])
    }
  })

  return {
    totalProducts: products.length,
    validProducts,
    invalidProducts,
    results,
    uniqueTeams: Array.from(uniqueTeams).sort(),
    uniqueSports: Array.from(uniqueSports).sort(),
    uniqueAthletes: Array.from(uniqueAthletes).sort()
  }
}

/**
 * Get tags in Shopify format (with prefixes)
 */
export function getShopifyFormattedTags(product: Product): string[] {
  if (!product.tags) return []

  return product.tags.map((tag, index) => {
    switch (index) {
      case 0: return `Team:${tag}`
      case 1: return `Sport:${tag}`
      case 2: return `Athlete:${tag}`
      case 3: return `Type:${tag}`
      default: return tag
    }
  })
}

/**
 * Extract structured tag data (used by SEO generator)
 */
export function extractTagData(product: Product) {
  return {
    team: product.tags?.[0] || '',
    sport: product.tags?.[1] || '',
    athlete: product.tags?.[2] || '',
    itemType: product.tags?.[3] || product.product_type || '',
    additionalTags: product.tags?.slice(4) || []
  }
}

/**
 * Print validation report to console
 */
export function printTagValidationReport() {
  const report = generateTagConsistencyReport()

  console.log('\n=== TAG CONSISTENCY REPORT ===\n')
  console.log(`Total Products: ${report.totalProducts}`)
  console.log(`✅ Valid: ${report.validProducts}`)
  console.log(`❌ Invalid: ${report.invalidProducts}`)
  console.log(`\n📊 Unique Values:`)
  console.log(`  Teams (${report.uniqueTeams.length}): ${report.uniqueTeams.join(', ')}`)
  console.log(`  Sports (${report.uniqueSports.length}): ${report.uniqueSports.join(', ')}`)
  console.log(`  Athletes (${report.uniqueAthletes.length}): ${report.uniqueAthletes.join(', ')}`)

  // Show invalid products
  const invalidResults = report.results.filter(r => !r.isValid)
  if (invalidResults.length > 0) {
    console.log(`\n❌ INVALID PRODUCTS:\n`)
    invalidResults.forEach(result => {
      console.log(`  ${result.productId} - ${result.productTitle}`)
      result.errors.forEach(error => console.log(`    ERROR: ${error}`))
      result.warnings.forEach(warning => console.log(`    WARNING: ${warning}`))
    })
  }

  // Show warnings
  const resultsWithWarnings = report.results.filter(r => r.warnings.length > 0 && r.isValid)
  if (resultsWithWarnings.length > 0) {
    console.log(`\n⚠️  WARNINGS:\n`)
    resultsWithWarnings.forEach(result => {
      console.log(`  ${result.productId} - ${result.productTitle}`)
      result.warnings.forEach(warning => console.log(`    ${warning}`))
    })
  }

  if (report.invalidProducts === 0 && resultsWithWarnings.length === 0) {
    console.log(`\n✅ All products have consistent tags!`)
  }

  return report
}
