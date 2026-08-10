import { PLACEHOLDER_PRODUCTS } from '../placeholder-data'
import type { Product } from '@/types/schema'

export interface RecommendationOptions {
  team?: string
  budget?: number
  itemType?: string
  maxPrice?: number
  limit?: number
  boostType?: string // Item type to prioritize in sorting (e.g. 'shirt')
  era?: string // e.g., 'Legend', 'Modern', '90s'
}

interface ProductRecommendation {
  product: Product
  score: number
  reason: string
}

import { fetchAllProducts } from '@/lib/shopify'

// Mock API Fetch - In Phase 4 this will call Shopify Client
async function fetchProducts(): Promise<Product[]> {
  if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
     const products = await fetchAllProducts()
     // Enhance live products with any local metadata if needed
     return products
  }
  // Simulate network delay if needed, or just return mock data
  return PLACEHOLDER_PRODUCTS
}

export async function getRecommendations(
  options: RecommendationOptions = {}
): Promise<Product[]> {
  const { team, budget, itemType, maxPrice, limit = 10, boostType, era } = options

  // Fetch all products (simulating collection fetch)
  const products = await fetchProducts()

  // Filter by item type if specified (this is strict filtering)
  let filtered = products
  if (itemType) {
    // Flexible matching for item type (e.g. 'boxing' matches 'glove' or 'trunks' or 'boxing' tag)
    filtered = products.filter(p => {
      const type = p.product_type?.toLowerCase() || ''
      const tags = p.tags?.map(t => t.toLowerCase()) || []
      const searchType = itemType.toLowerCase()
      
      if (searchType === 'boxing') {
        return type === 'boxing' || tags.includes('boxing')
      }
      if (searchType === 'tennis') {
        return type === 'tennis' || tags.includes('tennis')
      }
      return type === searchType || tags.includes(searchType)
    })
  }

  // Score and filter products
  const scored: ProductRecommendation[] = filtered
    .map(product => {
      let score = 0
      let reason = ''
      const tags = product.tags?.map(t => t.toLowerCase()) || []
      const type = product.product_type?.toLowerCase() || ''

      // Check team match
      if (team) {
        const teamMatch = tags.find(tag => tag.includes(team.toLowerCase()))
        if (teamMatch) {
          score += 50
          reason = `Perfect for ${team} fans`
        }
      }

      // Check Era match (Boost)
      if (era) {
        if (tags.includes(era.toLowerCase())) {
          score += 25
          reason = reason ? `${reason}. Matches era` : 'Matches preferred era'
        }
      }
      
      // Boost preferred item type if specified (soft sort)
      if (boostType) {
        const searchType = boostType.toLowerCase()
        if (type.includes(searchType) || tags.some(t => t.includes(searchType))) {
           score += 20
           reason = reason ? `${reason}. Preferred item type` : 'Matches your preference'
        }
      }

      // Check budget or maxPrice
      const price = product.variants?.[0]?.price || 0
      const priceLimit = maxPrice || budget
      
      if (priceLimit) {
        if (price <= priceLimit) {
          score += 30
          if (price <= priceLimit * 0.8) {
            score += 10
            reason = reason ? `${reason}. Great value` : 'Great value'
          }
        } else {
          score -= 50 // Penalise if over budget
        }
      }

      // Boost popular items (placeholder logic)
      if (tags.includes('popular') || tags.includes('legend')) {
        score += 10
      }

      return {
        product,
        score,
        reason: reason || 'Recommended for you'
      }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => {
        // Primary Sort: Score (Desc)
        if (b.score !== a.score) return b.score - a.score
        
        // Tie-breaker: Price (Desc) - Premium items first
        const priceA = a.product.variants?.[0]?.price || 0
        const priceB = b.product.variants?.[0]?.price || 0
        return priceB - priceA
    })
    .slice(0, limit)

  return scored.map(item => item.product)
}

export function formatPrice(price: number): string {
  return `£${price.toFixed(0)}`
}

export function getProductSummary(product: Product): string {
  // Try to intelligently pick tags
  const tags = product.tags || []
  const athlete = tags.find(t => ![product.product_type, 'Football', 'Boxing', 'Rugby', 'Cricket', 'Tennis', 'Glove', 'Shirt', 'Boot', 'Signed', 'Legend', 'Modern'].includes(t)) || 'Athlete'
  // Use Title as fallback if tag extraction fails significantly
  if (product.title) return `${product.title} - ${formatPrice(product.variants?.[0]?.price || 0)}`
  
  return `${athlete} | ${formatPrice(product.variants?.[0]?.price || 0)}`
}
