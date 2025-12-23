import { chatMemory } from './memory'
import { getRecommendations, type RecommendationOptions } from './recommendations'
import { TEAM_INFO } from './knowledge'
import { extractEntities } from './utils'
import { getResponse } from './templates'
import type { Product } from '@/types/schema'

export interface ChatResponse {
  message: string
  quickReplies?: string[]
  products?: Product[]
  action?: 'scroll_waitlist' | 'capture_email'
  capturedData?: { email: string, interest: string }
}

class ChatEngine {
  async processMessage(userMessage: string, isLocked: boolean = false): Promise<ChatResponse> {
    const lower = userMessage.toLowerCase()

    // 1. LOCKED STATE CHECK - HIGHEST PRIORITY
    if (isLocked) {
      if (!userMessage || userMessage.trim() === '') {
        return {
          message: "Hi there! Looking for a piece of history? I'm here to help.\n\nEvery item comes with NFC authentication and a lifetime guarantee.\n\nHowever, access is currently **Restricted** to the public.",
          quickReplies: ['How do I enter?', 'Join Waitlist']
        }
      }

      if (lower.includes('password') || lower.includes('enter') || lower.includes('unlock')) {
        return {
          message: "Passwords are sent to waitlist members 48 hours before a drop.\n\nDo you have a password to enter?",
          quickReplies: ['I have a password', 'Join Waitlist']
        }
      }

      return {
        message: "Our collection is reserved for members only right now. \n\nJoin the waitlist to get early access and the password for our next drop.",
        quickReplies: ['Join Waitlist'],
        action: 'scroll_waitlist'
      }
    }

    // 2. LEAD GEN / AWAITING EMAIL
    const currentTopic = chatMemory.getTopic()
    if (currentTopic === 'awaiting_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const email = userMessage.match(emailRegex)?.[0] || userMessage.trim()

      if (emailRegex.test(email)) {
        chatMemory.setTopic(null)
        const interest = chatMemory.getLastInterest() || 'General'
        return {
          message: "Thanks! I've added you to the notification list. 📩\n\nWe will email you the moment stock arrives.\n\nIs there anything else I can help with?",
          quickReplies: ['Browse other sports', 'Authenticity info'],
          capturedData: { email, interest }
        }
      }

      // CHECK FOR INTENT CHANGE / CORRECTION
      // If user says "No I want Maldini", we shouldn't say "Invalid email".
      const correctionEntities = extractEntities(userMessage)
      if (correctionEntities.athletes.length > 0 || correctionEntities.teams.length > 0 ||
        lower.includes('search') || lower.includes('look') || lower.includes('buy') || lower.includes('cancel')) {

        chatMemory.setTopic(null) // Exit lead gen state
        return this.processMessage(userMessage, isLocked) // Recursively process the new intent
      }

      return {
        message: "That doesn't look like a valid email. Please try again so we can notify you.\n\nOr type 'cancel' to stop.",
        quickReplies: ['Cancel']
      }

    } else if (lower === 'cancel') {
      chatMemory.setTopic(null)
      chatMemory.setLastInterest('')
      return {
        message: "No problem. What else can I help you find?",
        quickReplies: ['Browse all']
      }
    }

    // 3. INITIAL GREETING (Unlocked)
    if (!userMessage || userMessage.trim() === '') {
      const memory = chatMemory.getTeam()
      if (memory) {
        return {
          message: `Welcome back! 👋\n\nStill looking for ${memory} memorabilia?`,
          quickReplies: [`Show me ${memory} items`, 'Browse other sports']
        }
      }
      return {
        message: "Hi there! Looking for a piece of history? I'm here to help. \n\nEvery item comes with NFC authentication and a lifetime guarantee.\n\nWhat's your favourite sport?",
        quickReplies: ['F1', 'Football', 'Boxing', 'Tennis', 'Browse all']
      }
    }

    // HELPER: No Stock Logic
    const handleNoStock = (interest: string, label: string): ChatResponse => {
      chatMemory.setTopic('awaiting_email')
      chatMemory.setLastInterest(interest)
      return {
        message: `We are currently sold out of ${label} items due to high demand.\n\nEnter your email to get notified instantly when we restock.`,
        quickReplies: ['Cancel'],
        action: 'capture_email'
      }
    }

    // PURCHASE INTENT
    if (lower.includes('buy') || lower.includes('purchase') || lower.includes('add to cart') ||
      lower.includes('checkout')) {
      return {
        message: "Great! 🎯 Which item would you like to add to your basket?",
        quickReplies: ['Show me shirts', 'Show me photos', 'Browse all']
      }
    }

    // --- PLAYER / TEAM ENTITY RECOGNITION (SEARCH SPECIFIC) ---
    const entities = extractEntities(userMessage)

    if (entities.athletes.length > 0) {
      const athlete = entities.athletes[0]
      chatMemory.addViewedPlayer(athlete.id)

      // Search products
      const products = await getRecommendations({ limit: 100 })
      const matches = products.filter(p =>
        p.title.toLowerCase().includes(athlete.name.toLowerCase()) ||
        athlete.aliases.some(a => p.title.toLowerCase().includes(a))
      )

      if (matches.length === 0) {
        // LEAD GEN for Specific Player
        return handleNoStock(athlete.name, athlete.name)
      }

      return {
        message: `Yes! 🎯 We have ${matches.length} ${athlete.name} authenticated items available.`,
        quickReplies: ['Add to basket', 'Show more', 'Browse all'],
        products: matches.slice(0, 6)
      }
    }

    // --- CATEGORY BROWSING ---

    // F1 / MOTORSPORT
    if (lower.includes('f1') || lower.includes('formula 1') || lower.includes('racing') ||
      lower.includes('motogp') || lower.includes('motocross') || lower.includes('motorcross') || lower.includes('bike') || lower.includes('motor')) {

      const isMoto = lower.includes('motogp') || lower.includes('motocross') || lower.includes('motorcross') || lower.includes('bike')

      // Determine refined label for "No Stock" message logic
      let stockLabel = 'F1'
      let interest = 'F1'

      if (lower.includes('motocross') || lower.includes('motorcross')) {
        stockLabel = 'Motocross'
        interest = 'Motocross'
      } else if (lower.includes('motogp')) {
        stockLabel = 'MotoGP'
        interest = 'MotoGP'
      } else if (isMoto) {
        stockLabel = 'Motorsport'
        interest = 'Motorsport'
      } else if (!lower.includes('f1') && !lower.includes('formula 1')) {
        // User said "racing" or "motor" but not F1 specifically
        stockLabel = 'Motorsport'
        interest = 'Motorsport'
      }

      const products = await getRecommendations({ itemType: 'f1' })

      if (products.length === 0) return handleNoStock(interest, stockLabel)

      return {
        message: isMoto
          ? "While we specialize in F1, we love all motorsport! 🏎️\n\nHere are our top racing items."
          : "Lights out and away we go! 🏎️ Here's our fastest selling F1 memorabilia.",
        quickReplies: ['View all F1', 'Search driver', 'Browse all'],
        products
      }
    }

    // BOXING / UFC
    if (lower.includes('boxing') || lower.includes('ufc') || lower.includes('mma') || lower.includes('glove')) {
      const products = await getRecommendations({ itemType: 'boxing' })
      if (products.length === 0) return handleNoStock('Boxing', 'Boxing & UFC')
      return {
        message: "Excellent! 🥊 The sweet science. Here are our top items.",
        quickReplies: ['View all Boxing', 'Search fighter'],
        products
      }
    }

    // TENNIS
    if (lower.includes('tennis')) {
      const products = await getRecommendations({ itemType: 'tennis' })
      if (products.length === 0) return handleNoStock('Tennis', 'Tennis')
      return {
        message: "Perfect! 🎾 Here are our exclusive tennis memorabilia pieces.",
        quickReplies: ['View all Tennis', 'Search player'],
        products
      }
    }

    // RUGBY
    if (lower.includes('rugby')) {
      const products = await getRecommendations({ itemType: 'rugby' })
      if (products.length === 0) return handleNoStock('Rugby', 'Rugby')
      return {
        message: "Rugby legends! 🏉 Check out these authentic signed items.",
        quickReplies: ['View all Rugby', 'Search specific team'],
        products
      }
    }

    // BASKETBALL
    if (lower.includes('basketball') || lower.includes('nba')) {
      const products = await getRecommendations({ itemType: 'basketball' })
      if (products.length === 0) return handleNoStock('Basketball', 'NBA')
      return {
        message: "Slam dunk! 🏀 Check out these NBA legends.",
        quickReplies: ['View all Basketball', 'Search specific player'],
        products
      }
    }

    // GOLF
    if (lower.includes('golf')) {
      const products = await getRecommendations({ itemType: 'golf' })
      if (products.length === 0) return handleNoStock('Golf', 'Golf')
      return {
        message: "Fore! ⛳ Discover our authentic golf memorabilia.",
        quickReplies: ['View all Golf', 'Search golfer'],
        products
      }
    }

    // CRICKET
    if (lower.includes('cricket')) {
      const products = await getRecommendations({ itemType: 'cricket' })
      if (products.length === 0) return handleNoStock('Cricket', 'Cricket')
      return {
        message: "Howzat! 🏏 Here's our finest cricket memorabilia.",
        quickReplies: ['View all Cricket', 'Search specific player'],
        products
      }
    }

    // FOOTBALL / SOCCER (Generic)
    if (lower.includes('football') || lower.includes('soccer') || lower.includes('la liga') || lower.includes('premier league')) {
      // Logic for teams handled above via entities? No, entity extraction does athletes.
      // Need Team Extraction? Use TEAM_INFO loop.

      const knownTeams = TEAM_INFO.map(t => t.commonName.toLowerCase())
      const detectedTeam = knownTeams.find(t => lower.includes(t))

      if (detectedTeam) {
        const products = await getRecommendations({ team: detectedTeam, itemType: 'shirt' })
        if (products.length === 0) return handleNoStock('Football', detectedTeam)

        return {
          message: `Great choice! ⚽ Here are our best ${detectedTeam} items.`,
          quickReplies: [`View all ${detectedTeam}`, 'Search player'],
          products
        }
      }

      return {
        message: "Great choice! ⚽ Football memorabilia is our specialty.\n\nWhich team do you support?",
        quickReplies: ['Liverpool', 'Manchester United', 'Chelsea', 'Other teams']
      }
    }

    // AUTHENTICITY / NFC
    if (lower.includes('authentic') || lower.includes('nfc') || lower.includes('fake') || lower.includes('certificate')) {
      return {
        message: "Every item we sell is verified by our digital NFC system! 🛡️\n\n• Tap your phone to the tag\n• See digital certificate instantly\n• View signing photos\n• Lifetime authenticity guarantee\n\nNo more paper certificates that get lost.",
        quickReplies: ['Show me items', 'How does it work?']
      }
    }

    // SMART FALLBACK: PREDICTIVE ENTITY EXTRACTION
    // If we missed the entity but user asked for "signed X", assume 'X' is the interest.
    const signingMatch = lower.match(/(?:signed|autographed)\s+(.*?)\s+(?:shirt|jersey|shitr|photo|boot|glove|item|memorabilia)/)
    if (signingMatch && signingMatch[1]) {
      const suspectedName = signingMatch[1].replace(/\b(?:a|an|the)\b/g, '').trim() // Clean articles
      if (suspectedName.length > 2) {
        // Capitalize for display
        const displayInterest = suspectedName.charAt(0).toUpperCase() + suspectedName.slice(1)
        return handleNoStock(displayInterest, displayInterest)
      }
    }

    // FALLBACK
    return {
      message: getResponse('UNKNOWN_INPUT'),
      quickReplies: ['Browse by sport', 'Browse by team', 'Gift recommendations']
    }
  }
}

export const chatEngine = new ChatEngine()
