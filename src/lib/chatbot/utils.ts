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

  const commonSurnames = ['best', 'king', 'love', 'rose', 'white', 'brown', 'black', 'green', 'young', 'long', 'small', 'power', 'speed', 'hope', 'joy', 'smart', 'wood', 'woods', 'west', 'north', 'south', 'east', 'star', 'legend', 'champion', 'gross']

  // Extract Athletes
  for (const athlete of ATHLETE_DB) {
    const nameLower = athlete.name.toLowerCase()

    // Determine target strings to match against (Name, Aliases, SAFE Surname)
    // We construct a dynamic list of strings that identify this athlete
    const matchTargets = [nameLower, ...athlete.aliases.map(a => a.toLowerCase())]

    // Add Surname if it's unique enough
    const nameParts = nameLower.split(' ')
    if (nameParts.length > 1) {
      const surname = nameParts[nameParts.length - 1]
      // Only add surname if > 3 chars and not in blacklist
      if (surname.length > 3 && !commonSurnames.includes(surname)) {
        matchTargets.push(surname)
      }
    }

    // 1. Exact Word Match (Regex)
    // This allows identifying "Cannavaro" from "What about Cannavaro?"
    const isExactMatch = matchTargets.some(target => {
      // Escape special regex chars in target just in case, though usually names are safe
      const safeTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`\\b${safeTarget}\\b`, 'i')
      return regex.test(lowerInput)
    })

    if (isExactMatch) {
      entities.athletes.push(athlete)
      continue
    }

    // 2. Fuzzy Match (Word by Word)
    // Matches "Canavaro" -> "Cannavaro"
    const cleanInput = lowerInput.replace(/[^\w\s]/g, '')
    const inputWords = cleanInput.split(/\s+/)

    let isFuzzyStart = false
    for (const word of inputWords) {
      if (word.length > 3) {
        // Check this input word against ANY of the valid targets (Name, Alias, Surname)
        if (matchTargets.some(target => fuzzyMatch(word, target))) {
          entities.athletes.push(athlete)
          isFuzzyStart = true
          break
        }
      }
    }
    if (isFuzzyStart) continue
  }

  // Extract Teams
  for (const [teamName, aliases] of Object.entries(TEAM_ALIASES)) {
    const teamRegex = new RegExp(`\\b${teamName.toLowerCase()}\\b`, 'i')
    const aliasRegexes = aliases.map(alias => new RegExp(`\\b${alias.toLowerCase()}\\b`, 'i'))

    if (teamRegex.test(lowerInput) || aliasRegexes.some(regex => regex.test(lowerInput))) {
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
