import { chatMemory } from './memory'
import { getRecommendations } from './recommendations'
import { ATHLETE_DB, type Athlete } from './knowledge'
import { extractEntities } from './utils'
import { getResponse } from './templates'
import type { Product } from '@/types/schema'

export interface ChatResponse {
  message: string
  quickReplies?: string[]
  products?: Product[]
}

class ChatEngine {
  async processMessage(userMessage: string): Promise<ChatResponse> {
    const lower = userMessage.toLowerCase()
    
    // Empty message = initial greeting
    if (!userMessage || userMessage.trim() === '') {
      const memory = chatMemory.getTeam()
      if (memory) {
        return {
          message: `Welcome back! 👋\n\nLast time you were interested in ${memory} memorabilia. Want to continue browsing?`,
          quickReplies: [`Show me ${memory} items`, 'Browse other sports', 'Help with authenticity']
        }
      }
      return {
        message: getResponse('GREETING') + "\n\nEvery item comes with NFC authentication and a lifetime guarantee.\n\nWhat's your favourite sport?",
        quickReplies: ['Football', 'Boxing', 'Tennis', 'Browse all']
      }
    }

    // PURCHASE INTENT DETECTION - Highest Priority
    if (lower.includes('buy') || lower.includes('purchase') || lower.includes('add to cart') || 
        lower.includes('add to basket') || lower.includes('checkout') || lower.includes('order')) {
      return {
        message: "Great! 🎯 I can help you with that.\n\nWhich item would you like to add to your basket?",
        quickReplies: ['Show me shirts', 'Show me photos', 'Show me boots', 'Browse all']
      }
    }

    // OCCASION DETECTION - Gift scenarios
    const occasions = {
      birthday: ['birthday', 'bday', 'b-day'],
      christmas: ['christmas', 'xmas', 'festive', 'holiday'],
      anniversary: ['anniversary'],
      graduation: ['graduation', 'graduating'],
      fathersday: ['father\'s day', 'fathers day', 'dad\'s day'],
      mothersday: ['mother\'s day', 'mothers day', 'mum\'s day', 'mom\'s day'],
      valentines: ['valentine', 'valentines'],
      gift: ['gift', 'present']
    }

    let detectedOccasion: string | null = null
    for (const [occasion, keywords] of Object.entries(occasions)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        detectedOccasion = occasion
        break
      }
    }

    if (detectedOccasion) {
      chatMemory.setOccasion(detectedOccasion)
      
      const occasionMessages: Record<string, string> = {
        birthday: "Perfect! 🎂 Signed memorabilia makes an unforgettable birthday gift.\n\nAll items come museum-framed and gift-ready. What's their favourite sport or team?",
        christmas: "Brilliant! 🎄 Sports memorabilia is the ultimate Christmas gift.\n\nWe offer premium gift wrapping and can include a personal message. What sport do they love?",
        fathersday: "Fantastic choice! 👔 Dads love authentic signed memorabilia.\n\nShirts are our most popular Father's Day gift — fully framed and ready to hang. What's his favourite team?",
        anniversary: "How thoughtful! 💝 Signed memorabilia is a unique anniversary gift.\n\nWhat's their favourite sport or player?",
        gift: "Sports memorabilia makes an incredible gift! 🎁\n\nAll items come in premium gift-ready packaging. What's the recipient's favourite sport?"
      }

      return {
        message: occasionMessages[detectedOccasion] || occasionMessages.gift,
        quickReplies: ['Football', 'Boxing', 'Tennis', 'Help me choose']
      }
    }

    // Sport selection - detect if team sport or individual
    if (lower.includes('football') || lower.includes('soccer')) {
      return {
        message: "Great choice! ⚽ Football memorabilia is our specialty.\n\nWhich team do you support?",
        quickReplies: ['Liverpool', 'Manchester United', 'Chelsea', 'Other teams']
      }
    }

    if (lower.includes('boxing')) {
      const products = await getRecommendations({ itemType: 'boxing', boostType: 'glove' })
      return {
        message: "Excellent! 🥊 Here are our top boxing items available right now.",
        quickReplies: ['View all Boxing', 'Search specific boxer'],
        products
      }
    }

    if (lower.includes('tennis')) {
      const products = await getRecommendations({ itemType: 'tennis', boostType: 'shirt' }) // or photo?
      return {
        message: "Perfect! 🎾 Here are our exclusive tennis memorabilia pieces.",
        quickReplies: ['View all Tennis', 'Search specific player'],
        products
      }
    }

    if (lower.includes('rugby')) {
      const products = await getRecommendations({ itemType: 'rugby', boostType: 'shirt' })
      return {
        message: "Rugby legends! 🏉 Check out these authentic signed items.",
        quickReplies: ['View all Rugby', 'Search specific team'],
        products
      }
    }

    if (lower.includes('cricket')) {
      const products = await getRecommendations({ itemType: 'cricket', boostType: 'bat' }) // Bat is distinct
      return {
        message: "Howzat! 🏏 Here's our finest cricket memorabilia.",
        quickReplies: ['View all Cricket', 'Search specific player'],
        products
      }
    }

    // Authentication & Verification Questions
    if (lower.includes('authentic') || lower.includes('real') || lower.includes('fake') || 
        lower.includes('genuine') || lower.includes('verify') || lower.includes('trust')) {
      chatMemory.setTopic('authentication')
      return {
        message: "Every item comes with our lifetime authenticity guarantee! 🛡️\n\n✓ NFC digital authentication (tap your phone to verify instantly)\n✓ Photo proof from signing sessions\n✓ Unique serial number for each item\n✓ Lifetime guarantee\n\nNo certificates needed - just tap and verify!",
        quickReplies: ['How does NFC work?', 'Show me items', 'Shipping info']
      }
    }
    
    // NFC Specific Questions
    if (lower.includes('nfc') || lower.includes('chip') || lower.includes('tag') || 
        lower.includes('scan') || lower.includes('tap')) {
      chatMemory.setTopic('authentication')
      return {
        message: "Our NFC authentication is simple and secure! 📱\n\nJust tap your smartphone on the NFC tag attached to your item. No app needed - it works instantly with any NFC-enabled phone.\n\nYou'll see:\n• Digital certificate\n• Signing history\n• Photo proof\n• Complete provenance\n\nIt's the most advanced authentication in sports memorabilia!",
        quickReplies: ['That sounds great!', 'Show me products', 'Any other questions?']
      }
    }
    
    // Certificate Questions (redirect to NFC)
    if (lower.includes('certificate') || lower.includes('coa') || lower.includes('paperwork') || 
        lower.includes('documentation')) {
      return {
        message: "We don't use traditional paper certificates - we've gone fully digital! 🚀\n\nEvery item has NFC authentication instead, which is:\n✓ More secure (can't be forged)\n✓ Instant verification\n✓ Never gets lost\n✓ Includes photo proof\n\nJust tap your phone to the NFC tag for instant verification!",
        quickReplies: ['Tell me more about NFC', 'Show me items', 'I understand']
      }
    }
    
    
    // Player-specific queries - NOW POWERED BY KNOWLEDGE BASE
    const entities = extractEntities(userMessage)
    
    if (entities.athletes.length > 0) {
      const athlete = entities.athletes[0] // Take the first matched athlete
      chatMemory.addViewedPlayer(athlete.id)
      
      // Determine what type of item they're asking for
      let itemType: string | undefined
      if (lower.includes('shirt') || lower.includes('jersey') || lower.includes('kit')) {
        itemType = 'shirt'
      } else if (lower.includes('photo') || lower.includes('picture') || lower.includes('frame')) {
        itemType = 'photo'
      } else if (lower.includes('boot') || lower.includes('shoe')) {
        itemType = 'boot'
      } else if (lower.includes('glove')) {
        itemType = 'boxing'
      }
      
      // Search for products matching the player
      const allProducts = await getRecommendations({ limit: 1000 })
      // Helper to sort products by type relevance (Shirt > Photo > Boot) then Price (Desc)
      const sortProducts = (products: Product[]) => {
        return products.sort((a, b) => {
          // 1. Type Priority
          const getTypeScore = (p: Product) => {
            const title = p.title.toLowerCase()
            if (title.includes('shirt')) return 4
            if (title.includes('photo') || title.includes('frame')) return 3
            if (title.includes('boot')) return 2
            if (title.includes('glove')) return 2
            return 1
          }
          const scoreA = getTypeScore(a)
          const scoreB = getTypeScore(b)
          if (scoreA !== scoreB) return scoreB - scoreA
          
          // 2. Price Descending
          const priceA = a.variants?.[0]?.price || 0
          const priceB = b.variants?.[0]?.price || 0
          return priceB - priceA
        })
      }

      const playerProducts = sortProducts(allProducts.filter(p => 
        p.title.toLowerCase().includes(athlete.name.toLowerCase()) ||
        athlete.aliases.some(alias => p.title.toLowerCase().includes(alias)) ||
        p.tags?.some(tag => 
          tag.toLowerCase().includes(athlete.name.toLowerCase()) ||
          athlete.aliases.some(alias => tag.toLowerCase().includes(alias))
        )
      ))
      
      // Filter by item type if specified
      const matchingProducts = itemType 
        ? playerProducts.filter(p => 
            p.title.toLowerCase().includes(itemType) || 
            p.tags?.some(tag => tag.toLowerCase() === itemType)
          )
        : playerProducts
      
      if (matchingProducts.length > 0) {
        // Found exact match - use sales hooks from knowledge base
        const itemTypeDisplay = itemType ? `${itemType}${matchingProducts.length > 1 ? 's' : ''}` : 'items'
        const salesHook = athlete.salesHooks[0] || ''
        const upsellMessage = itemType === 'photo' 
          ? '\n\nFor gifts, shirts are by far the most impressive — fully framed and ready to hang.'
          : itemType === 'shirt'
          ? '\n\nAll shirts come museum-framed with premium matting — the perfect statement piece.'
          : ''
        
        // Store displayed product IDs to avoid repetition
        chatMemory.addViewedProductIds(matchingProducts.slice(0, 6).map(p => p.id))
        
        return {
          message: `Yes! 🎯 We have ${matchingProducts.length} ${athlete.name} signed ${itemTypeDisplay} available.\n\n${salesHook}${upsellMessage}`,
          products: matchingProducts.slice(0, 6),
          quickReplies: ['Add to basket', 'Show more', 'Browse all']
        }
      } else if (playerProducts.length > 0) {
        // Have player but not the specific item type
        const availableTypes = [...new Set(playerProducts.map(p => {
          if (p.title.toLowerCase().includes('shirt')) return 'shirts'
          if (p.title.toLowerCase().includes('photo')) return 'photos'
          if (p.title.toLowerCase().includes('boot')) return 'boots'
          if (p.title.toLowerCase().includes('glove')) return 'gloves'
          return 'items'
        }))]
        
        // Check if user had a preferred item type from context
        const rememberedItemType = chatMemory.getItemType()
        const itemTypeDisplay = itemType || rememberedItemType
        
        if (itemTypeDisplay) {
          // User wanted a specific item type
          return {
            message: `We don't currently have ${athlete.name} signed ${itemTypeDisplay}s, but we DO have ${availableTypes.join(' and ')}! 📸\n\nWould you like to see those instead?`,
            products: playerProducts.slice(0, 6),
            quickReplies: [`Show ${availableTypes[0]}`, 'Different player', 'Browse all']
          }
        } else {
          // User just asked for the player generally
          // Update context to this player's team to avoid stale context from previous chats
          if (athlete.team) {
            chatMemory.setTeam(athlete.team)
          }

          return {
            message: getResponse('PLAYER_FOUND', { name: athlete.name, types: availableTypes.join(' and ') }),
            products: playerProducts.slice(0, 6),
            quickReplies: ['Add to basket', 'Show more', 'Browse all']
          }
        }
      } else {
        // Don't have this player at all - show smart contextual alternatives using knowledge base
        let alternatives: Product[] = []
        
        // Try to find related athletes from the knowledge base
        const relatedAthletes = athlete.relatedAthletes
          .map(id => ATHLETE_DB.find(a => a.id === id))
          .filter((a): a is Athlete => a !== undefined)
        
        // Try to find items from related athletes
        if (relatedAthletes.length > 0) {
          for (const related of relatedAthletes.slice(0, 3)) {
            const relatedProducts = allProducts.filter(p =>
              p.title.toLowerCase().includes(related.name.toLowerCase()) ||
              related.aliases.some(alias => p.title.toLowerCase().includes(alias))
            )
            alternatives = [...alternatives, ...relatedProducts]
            if (alternatives.length >= 6) break
          }
        }
        
        // If still not enough, try by team
        if (alternatives.length < 3 && athlete.team) {
          const teamProducts = await getRecommendations({ team: athlete.team })
          alternatives = [...alternatives, ...teamProducts]
        }
        
        // If still not enough, try by sport
        if (alternatives.length < 3) {
          const sportProducts = await getRecommendations({ itemType: athlete.sport.toLowerCase() })
          alternatives = [...alternatives, ...sportProducts]
        }
        
        // Only show up to 6
        const itemsToShow = alternatives.slice(0, 6)
        
        if (itemsToShow.length === 0) {
           return {
             message: `We don't currently have ${athlete.name} in stock, and I couldn't find similar items right now. 😔\n\nWould you like to customize your search?`,
             products: [],
             quickReplies: ['View all items', 'Search team', 'Search sport']
           }
        }

        const teamContext = athlete.team ? ` from ${athlete.team}` : ''
        const funFact = athlete.funFacts[0] ? `\n\n💡 ${athlete.funFacts[0]}` : ''
        
        return {
          message: `We don't currently have ${athlete.name} memorabilia in stock. 😔\n\nBut here are some similar items${teamContext} you might love!${funFact}`,
          products: itemsToShow,
          quickReplies: ['Browse all', 'Search another player', 'Help me choose']
        }
      }
    }
    
    // Team-specific queries
    if (lower.includes('liverpool')) {
      chatMemory.setTeam('Liverpool')
      // Boost shirts as default "best" item type
      const products = await getRecommendations({ team: 'Liverpool', boostType: 'shirt' })
      return {
        message: getResponse('TEAM_FOUND', { team: 'Liverpool' }),
        quickReplies: ['View all Liverpool', 'Search player'],
        products
      }
    }
    
    if (lower.includes('manchester') || lower.includes('united') || lower.includes('city')) {
      const team = lower.includes('city') ? 'Manchester City' : 'Manchester United'
      chatMemory.setTeam(team)
      const products = await getRecommendations({ team, boostType: 'shirt' })
      return {
        message: getResponse('TEAM_FOUND', { team }),
        quickReplies: [`View all ${team}`, 'Search player'],
        products
      }
    }
    
    // Item type queries
    // Handle "Show all" reset command
    if (lower.includes('show all') && (lower.includes('shirt') || lower.includes('photo') || lower.includes('boot'))) {
      chatMemory.setTeam('') // Clear team context
      // Fall through to standard logic below which will now show all items
    }

    if (lower.includes('shirt') || lower.includes('jersey') || lower.includes('kit')) {
      chatMemory.setItemType('shirt')
      const rememberedTeam = chatMemory.getTeam()
      
      // If user previously mentioned a team, filter by that team
      const products = rememberedTeam 
        ? await getRecommendations({ itemType: 'shirt', team: rememberedTeam })
        : await getRecommendations({ itemType: 'shirt' })
      
      const message = rememberedTeam
        ? `I've filtered for **${rememberedTeam}** shirts based on our chat! 👕\n\nWant to see shirts from all teams instead?`
        : "Here are our most popular signed shirts! 👕"
      
      const quickReplies = rememberedTeam
        ? [`Show all Shirts`, `View ${rememberedTeam} items`, 'Browse all']
        : ['View all Shirts', 'Filter by Team', 'Browse all']
      
      const productsToShow = products.slice(0, 6)
      chatMemory.addViewedProductIds(productsToShow.map(p => p.id))

      return {
        message,
        quickReplies,
        products: productsToShow // Enforce 6-item cap
      }
    }
    
    if (lower.includes('photo') || lower.includes('picture') || lower.includes('frame')) {
      chatMemory.setItemType('photo')
      const rememberedTeam = chatMemory.getTeam()
      
      const products = rememberedTeam
        ? await getRecommendations({ itemType: 'photo', team: rememberedTeam })
        : await getRecommendations({ itemType: 'photo' })
      
      const message = rememberedTeam
        ? `Showing top **${rememberedTeam}** photos! 🖼️\n\nWould you prefer to browse our entire photo collection?`
        : "Check out these stunning framed photos! 🖼️"

      const quickReplies = rememberedTeam
        ? [`Show all Photos`, `View ${rememberedTeam} items`, 'Browse all']
        : ['View all Photos', 'Filter by Sport', 'Browse all']
      
      return {
        message,
        quickReplies,
        products: products.slice(0, 6) // Enforce 6-item cap
      }
    }
    
    if (lower.includes('boot') || lower.includes('shoe')) {
      chatMemory.setItemType('boot')
      const rememberedTeam = chatMemory.getTeam()
      
      const products = rememberedTeam
        ? await getRecommendations({ itemType: 'boot', team: rememberedTeam })
        : await getRecommendations({ itemType: 'boot' })
      
      const message = rememberedTeam
        ? `Here are the best **${rememberedTeam}** match-worn boots! 👟\n\nInterested in seeing boots from other teams?`
        : "Match-worn boots are incredible collector's pieces! 👟"

      const quickReplies = rememberedTeam
        ? [`Show all Boots`, `View ${rememberedTeam} items`, 'Browse all']
        : ['View all Boots', 'Search player', 'Browse all']
      
      return {
        message,
        quickReplies,
        products: products.slice(0, 6) // Enforce 6-item cap
      }
    }

    if (lower.includes('glove')) {
      chatMemory.setItemType('boxing')
      const products = await getRecommendations({ itemType: 'boxing' })
      return {
        message: "Signed boxing gloves are a knockout choice! 🥊",
        quickReplies: ['View all Boxing', 'Search specific boxer'],
        products
      }
    }
    
    // Shipping & Returns
    if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('postage')) {
      return {
        message: "We offer fast, insured shipping! 📦\n\n🇬🇧 UK: 3-5 days (£8 flat rate)\n🌍 International: 5-10 days\n\nAll items are fully insured during transit. Orders before 2pm GMT ship same day!",
        quickReplies: ['Great!', 'International shipping?', 'Browse items']
      }
    }
    
    if (lower.includes('return') || lower.includes('refund') || lower.includes('money back')) {
      return {
        message: "We offer a 30-day money-back guarantee! ✓\n\nNot happy? Return it for a full refund.\n\nItems must be in original condition with all tags intact. We want you to be completely satisfied!",
        quickReplies: ['That\'s reassuring', 'Show me items', 'Any other questions?']
      }
    }
    
    // Pricing & Budget
    if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || 
        lower.includes('cheap') || lower.includes('expensive') || lower.includes('how much')) {
      
      // Context-aware pricing
      const currentTopic = chatMemory.getTopic()
      
      if (currentTopic === 'private_signing' || lower.includes('signing') || lower.includes('private')) {
        return {
          message: "Private signing costs vary depending on the athlete and requirements. ✍️\n\nTypically:\n• Standard items (shirts/photos): £100 - £500+\n• Premium/Bespoke requests: £500 - £2000+\n\nFor an exact quote, please contact our team with your specific requirements!",
          quickReplies: ['Contact team', 'Back to products', 'Show me shirts']
        }
      }

      return {
        message: "Our prices vary based on the athlete and item rarity.\n\nTypical ranges:\n📸 Photos: £150-£400\n👕 Shirts: £300-£800\n👟 Boots/Gloves: £500-£1500\n\nWhat's your budget? I can help you find something perfect!",
        quickReplies: ['Under £300', '£300-£800', '£800+']
      }
    }
    
    // Budget responses
    if (lower.includes('under') && (lower.includes('300') || lower.includes('£300'))) {
      chatMemory.setBudget(300)
      const products = await getRecommendations({ maxPrice: 300 })
      return {
        message: "Great! I'll show you our best items under £300. These are all authentic, NFC-verified pieces.",
        products,
        quickReplies: ['Show more', 'Different budget', 'Help me choose']
      }
    }
    
    // Gift Questions
    if (lower.includes('gift') || lower.includes('present') || lower.includes('birthday')) {
      return {
        message: "Sports memorabilia makes an incredible gift! 🎁\n\nAll items come in premium gift-ready packaging. Add a personalized message at checkout!\n\nWhat's the recipient's favourite sport?",
        quickReplies: ['Football', 'Boxing', 'Tennis', 'Other sports']
      }
    }
    
    // Custom Requests & Services
    if (lower.includes('private signing') || lower.includes('custom') || lower.includes('bespoke') || 
        lower.includes('commission') || lower.includes('special request')) {
      chatMemory.setTopic('private_signing')
      return {
        message: "Great question! We do offer custom services for special requests. 🌟\n\nFor private signings, bespoke framing, or custom memorabilia, please contact our team directly.\n\nWould you like to browse our current collection while you're here?",
        quickReplies: ['Browse collection', 'Contact details', 'Show me shirts', 'Show me photos']
      }
    }

    // SHOW MORE LOGIC
    if (lower.includes('show more') || lower.includes('more items') || lower.includes('next')) {
       const viewedIds = chatMemory.getViewedProductIds()
       const team = chatMemory.getTeam()
       const itemType = chatMemory.getItemType()
       
       // Construct options based on memory
       const options: any = { limit: 100 } // Fetch more to filter locally
       if (team) options.team = team
       if (itemType) options.itemType = itemType
       
       let products = await getRecommendations(options)
       
       // Filter out already viewed items
       const newProducts = products.filter(p => !viewedIds.includes(p.id))
       
       if (newProducts.length > 0) {
         const productsToShow = newProducts.slice(0, 6)
         chatMemory.addViewedProductIds(productsToShow.map(p => p.id))
         
         return {
           message: "Here are some more items you might like! 👇",
           quickReplies: ['Add to basket', 'Show more', 'Browse all'],
           products: productsToShow
         }
       } else {
         return {
           message: "I've shown you all the top items matching your criteria right now! 🏁\n\nWould you like to browse something different?",
           quickReplies: ['Browse all', 'Change filter', 'Help me choose']
         }
       }
    }

    // Contact & Support
    if (lower.includes('contact') || lower.includes('email') || lower.includes('phone') || 
        lower.includes('speak to') || lower.includes('talk to')) {
      return {
        message: "Happy to help! 📞\n\nYou can reach our team at:\n• Email: info@sportsmemorabilia.com\n• Phone: 0800 123 4567\n\nOr I can help you find something right now?",
        quickReplies: ['Browse items', 'About authenticity', 'Shipping info']
      }
    }
    
    // Fallback/Unknown
    return {
      message: getResponse('UNKNOWN_INPUT'),
      quickReplies: ['Browse by sport', 'Browse by team', 'Gift recommendations', 'Help me choose']
    }
  }
}

export const chatEngine = new ChatEngine()
