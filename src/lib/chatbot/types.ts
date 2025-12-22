export interface Athlete {
    id: string
    name: string
    aliases: string[]
    sport: 'Football' | 'Boxing' | 'Tennis' | 'F1' | 'Rugby' | 'Cricket' | 'Basketball' | 'Golf' | 'UFC'
    team?: string
    league?: string
    era: string[]
    priceTier: 'Entry' | 'Mid' | 'High' | 'Premium'
    signingStatus: 'Available' | 'Limited' | 'Private Only' | 'Unavailable'
    funFacts: string[]
    salesHooks: string[]
    relatedAthletes: string[]
}

export interface TeamProfile {
    id: string
    name: string
    league: string
    colors: string[]
    commonName: string
}
