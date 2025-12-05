import fs from 'fs'
import path from 'path'

// Load .env manually
try {
  const envPath = path.resolve(process.cwd(), '.env')
  console.log('📂 Loading .env from:', envPath)
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '') // Remove quotes
        process.env[key] = value
        // console.log(`   Loaded: ${key}`) // Don't log values for security
      }
    })
    console.log('✅ .env file loaded')
    console.log('   URL:', process.env.VITE_SUPABASE_URL)
  } else {
    console.warn('⚠️ .env file not found at:', envPath)
  }
} catch (e) {
  console.warn('⚠️ Could not load .env file:', e)
}

interface SEOContent {
  seo_title: string
  seo_description: string
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateSEOTitle(product: any): string {
  // Data structure: ["Liverpool", "Signed Photo", "Adam Lallana"]
  // Index 0: Team
  // Index 1: Type (verbose)
  // Index 2: Athlete
  
  const team = product.tags?.[0] || 'Team'
  const athlete = product.tags?.[2] || product.title // Fallback to title if no athlete tag
  const itemType = capitalize(product.product_type || 'item')
  const year = new Date().getFullYear()
  
  // Format: [Athlete] Signed [Item] - [Team] [Year] | NFC Authenticated
  const title = `${athlete} Signed ${itemType} - ${team} ${year} | NFC Authenticated`
  
  // Ensure under 60 characters
  return title.length > 60 ? title.substring(0, 57) + '...' : title
}

function generateSEODescription(product: any): string {
  const team = product.tags?.[0] || 'team'
  const athlete = product.tags?.[2] || product.title
  const itemType = product.product_type || 'item'
  
  const description = `Authentic ${athlete} signed ${itemType} from ${team}. Professionally framed with UV-protective glass. Includes NFC digital authentication. Perfect gift for ${team} fans. Limited availability.`
  
  // Ensure under 155 characters for meta description
  return description.length > 155 ? description.substring(0, 152) + '...' : description
}

async function generateSEOContent() {
  // Dynamic import to ensure env vars are loaded first
  const { supabase } = await import('../src/lib/supabase')
  
  console.log('🚀 Starting SEO content generation...')
  
  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) {
    console.error('❌ Error fetching products:', error)
    return
  }
  
  if (!products || products.length === 0) {
    console.log('⚠️  No products found')
    return
  }
  
  console.log(`📦 Found ${products.length} products`)
  
  let updated = 0
  let failed = 0
  
  for (const product of products) {
    const seoContent: SEOContent = {
      seo_title: generateSEOTitle(product),
      seo_description: generateSEODescription(product)
    }
    
    console.log(`\n📝 Processing: ${product.title}`)
    console.log(`   SEO Title: ${seoContent.seo_title}`)
    console.log(`   SEO Desc: ${seoContent.seo_description}`)
    
    const { error: updateError } = await supabase
      .from('products')
      .update(seoContent)
      .eq('id', product.id)
    
    if (updateError) {
      console.error(`   ❌ Failed to update: ${updateError.message}`)
      failed++
    } else {
      console.log(`   ✅ Updated successfully`)
      updated++
    }
  }
  
  console.log(`\n🎉 Complete!`)
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ❌ Failed: ${failed}`)
}

// Run the script
generateSEOContent()
  .then(() => {
    console.log('\n✨ SEO content generation finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error)
    process.exit(1)
  })
