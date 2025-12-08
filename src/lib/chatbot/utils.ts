import { ATHLETE_DB, TEAM_ALIASES, type Athlete } from './knowledge'

// Levenshtein distance for fuzzy matching
export function levenshteinDistance(a: string, b: string): number {
  const matrix = []

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

export function fuzzyMatch(input: string, target: string, threshold = 0.8): boolean {
  const distance = levenshteinDistance(input.toLowerCase(), target.toLowerCase())
  const maxLength = Math.max(input.length, target.length)
  const similarity = 1 - distance / maxLength
  return similarity >= threshold
}

export interface ExtractedEntities {
  athletes: Athlete[]
  teams: string[]
  sport?: 'Football' | 'Boxing' | 'Tennis' | 'F1' | 'Rugby' | 'Cricket' | 'Basketball' | 'Golf' | 'UFC'
  intent?: 'buy' | 'sell' | 'appraise' | 'contact' | 'signing'
}

export function extractEntities(input: string): ExtractedEntities {
  const lowerInput = input.toLowerCase()
  const entities: ExtractedEntities = {
    athletes: [],
    teams: []
  }

  // Extract Athletes
  for (const athlete of ATHLETE_DB) {
    // Check name and aliases
    if (lowerInput.includes(athlete.name.toLowerCase()) || 
        athlete.aliases.some(alias => lowerInput.includes(alias))) {
      entities.athletes.push(athlete)
      continue
    }

    // Fuzzy check if no exact match
    // Only fuzzy match words that are long enough to avoid false positives
    // Clean input of punctuation for better matching
    const cleanInput = lowerInput.replace(/[^\w\s]/g, '')
    const words = cleanInput.split(/\s+/)
    for (const word of words) {
      if (word.length > 3) {
        if (fuzzyMatch(word, athlete.name) || athlete.aliases.some(alias => fuzzyMatch(word, alias))) {
          entities.athletes.push(athlete)
          break
        }
      }
    }
  }

  // Extract Teams
  for (const [teamName, aliases] of Object.entries(TEAM_ALIASES)) {
    if (lowerInput.includes(teamName.toLowerCase()) || 
        aliases.some(alias => lowerInput.includes(alias))) {
      entities.teams.push(teamName)
    }
  }

  // Extract Sport (simple keyword check)
  if (lowerInput.includes('football') || lowerInput.includes('soccer')) entities.sport = 'Football'
  else if (lowerInput.includes('boxing') || lowerInput.includes('fight')) entities.sport = 'Boxing'
  else if (lowerInput.includes('tennis')) entities.sport = 'Tennis'
  else if (lowerInput.includes('f1') || lowerInput.includes('formula 1') || lowerInput.includes('racing') || lowerInput.includes('motorsport') || lowerInput.includes('motogp') || lowerInput.includes('motocross') || lowerInput.includes('bike')) entities.sport = 'F1'
  else if (lowerInput.includes('rugby')) entities.sport = 'Rugby'
  else if (lowerInput.includes('cricket')) entities.sport = 'Cricket'
  else if (lowerInput.includes('basketball') || lowerInput.includes('nba')) entities.sport = 'Basketball'
  else if (lowerInput.includes('golf')) entities.sport = 'Golf'
  else if (lowerInput.includes('ufc') || lowerInput.includes('mma')) entities.sport = 'UFC'

  return entities
}
