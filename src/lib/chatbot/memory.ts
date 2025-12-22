export interface Message {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
  productIds?: string[]
}

export interface UserMemory {
  team?: string
  budget?: number
  itemType?: string
  occasion?: string
  lastInterest?: string
  currentTopic?: 'private_signing' | 'authentication' | 'product_search' | 'general' | 'awaiting_email'
  salesStage?: 'discovery' | 'recommendation' | 'objection' | 'closing'
  favouritePlayers?: string[]
  viewedPlayers?: string[] // Track which players they've seen to avoid repetition
  viewedProductIds?: string[] // Track seen products for pagination
  conversationHistory: Message[]
  lastVisit: Date
  sessionId: string
}

const MEMORY_KEY = 'chatbot_memory'

export class ChatMemory {
  private memory: UserMemory

  constructor() {
    this.memory = this.loadMemory()
  }

  // ... (existing methods)

  // ADDED METHODS FOR PAGINATION
  addViewedProductIds(ids: string[]): void {
    if (!this.memory.viewedProductIds) {
      this.memory.viewedProductIds = []
    }
    const newIds = ids.filter(id => !this.memory.viewedProductIds?.includes(id))
    this.memory.viewedProductIds = [...this.memory.viewedProductIds, ...newIds]
    this.save()
  }

  getViewedProductIds(): string[] {
    return this.memory.viewedProductIds || []
  }

  clearViewedProductIds(): void {
    this.memory.viewedProductIds = []
    this.save()
  }

  // Existing methods continue...
  addViewedPlayer(playerId: string): void {
    if (!this.memory.viewedPlayers) {
      this.memory.viewedPlayers = []
    }
    if (!this.memory.viewedPlayers.includes(playerId)) {
      this.memory.viewedPlayers.push(playerId)
      this.save()
    }
  }

  private loadMemory(): UserMemory {
    if (typeof window === 'undefined') {
      return this.getDefaultMemory()
    }

    const stored = localStorage.getItem(MEMORY_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          ...parsed,
          lastVisit: new Date(parsed.lastVisit),
          conversationHistory: parsed.conversationHistory.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }
      } catch (e) {
        console.error('Failed to parse memory:', e)
        return this.getDefaultMemory()
      }
    }

    return this.getDefaultMemory()
  }

  private getDefaultMemory(): UserMemory {
    return {
      conversationHistory: [],
      lastVisit: new Date(),
      sessionId: this.generateSessionId()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  save(): void {
    if (typeof window === 'undefined') return

    localStorage.setItem(MEMORY_KEY, JSON.stringify(this.memory))
  }

  addMessage(message: Message): void {
    this.memory.conversationHistory.push(message)
    this.save()
  }

  setTeam(team: string): void {
    this.memory.team = team
    this.save()
  }

  setBudget(budget: number): void {
    this.memory.budget = budget
    this.save()
  }

  setItemType(itemType: string): void {
    this.memory.itemType = itemType
    this.save()
  }

  setOccasion(occasion: string): void {
    this.memory.occasion = occasion
    this.save()
  }

  addFavouritePlayer(player: string): void {
    if (!this.memory.favouritePlayers) {
      this.memory.favouritePlayers = []
    }
    if (!this.memory.favouritePlayers.includes(player)) {
      this.memory.favouritePlayers.push(player)
      this.save()
    }
  }

  getTeam(): string | undefined {
    return this.memory.team
  }

  getBudget(): number | undefined {
    return this.memory.budget
  }

  getItemType(): string | undefined {
    return this.memory.itemType
  }

  setTopic(topic: 'private_signing' | 'authentication' | 'product_search' | 'general' | 'awaiting_email' | null): void {
    // @ts-ignore
    this.memory.currentTopic = topic
    this.save()
  }

  getTopic(): 'private_signing' | 'authentication' | 'product_search' | 'general' | 'awaiting_email' | undefined {
    // @ts-ignore
    return this.memory.currentTopic
  }

  setLastInterest(interest: string): void {
    this.memory.lastInterest = interest
    this.save()
  }

  getLastInterest(): string | undefined {
    return this.memory.lastInterest
  }

  setSalesStage(stage: 'discovery' | 'recommendation' | 'objection' | 'closing'): void {
    this.memory.salesStage = stage
    this.save()
  }

  getSalesStage(): 'discovery' | 'recommendation' | 'objection' | 'closing' | undefined {
    return this.memory.salesStage
  }



  getViewedPlayers(): string[] {
    return this.memory.viewedPlayers || []
  }

  getConversationHistory(): Message[] {
    return this.memory.conversationHistory
  }

  isReturningUser(): boolean {
    const daysSinceLastVisit = (new Date().getTime() - this.memory.lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceLastVisit < 30 && this.memory.conversationHistory.length > 0
  }

  clear(): void {
    this.memory = this.getDefaultMemory()
    this.save()
  }

  updateLastVisit(): void {
    this.memory.lastVisit = new Date()
    this.save()
  }
}

export const chatMemory = new ChatMemory()
