import { Athlete, TeamProfile } from './types'
import { FOOTBALL_ATHLETES } from './data/football'
import { BOXING_ATHLETES } from './data/boxing'
import { F1_ATHLETES } from './data/f1'
import { BASKETBALL_ATHLETES } from './data/basketball'
import { OTHER_ATHLETES } from './data/others_athletes'

export type { Athlete }

// Aggregated Database
export const ATHLETE_DB: Athlete[] = [
  ...FOOTBALL_ATHLETES,
  ...BOXING_ATHLETES,
  ...F1_ATHLETES,
  ...BASKETBALL_ATHLETES,
  ...OTHER_ATHLETES
]

export const TEAM_ALIASES: Record<string, string[]> = {
  'Manchester United': ['man utd', 'united', 'red devils', 'mufc'],
  'Liverpool': ['lfc', 'reds', 'pool'],
  'Arsenal': ['gunners', 'afc'],
  'Chelsea': ['blues', 'cfc'],
  'Manchester City': ['man city', 'city', 'citizens', 'sky blues'],
  'Real Madrid': ['madrid', 'los blancos', 'real'],
  'Barcelona': ['barca', 'blaugrana'],
  'Ferrari': ['scuderia', 'prancing horse'],
  'Mercedes': ['silver arrows', 'merc'],
  'Red Bull Racing': ['red bull', 'rbr']
}

export const TEAM_INFO: TeamProfile[] = [
  { id: 'liverpool', name: 'Liverpool', league: 'Premier League', colors: ['red'], commonName: 'Liverpool' },
  { id: 'man_utd', name: 'Manchester United', league: 'Premier League', colors: ['red'], commonName: 'Man Utd' },
  { id: 'arsenal', name: 'Arsenal', league: 'Premier League', colors: ['red'], commonName: 'Arsenal' },
  { id: 'chelsea', name: 'Chelsea', league: 'Premier League', colors: ['blue'], commonName: 'Chelsea' },
  { id: 'man_city', name: 'Manchester City', league: 'Premier League', colors: ['blue', 'sky blue'], commonName: 'Man City' },
  { id: 'real_madrid', name: 'Real Madrid', league: 'La Liga', colors: ['white'], commonName: 'Real Madrid' },
  { id: 'barcelona', name: 'Barcelona', league: 'La Liga', colors: ['blue', 'red', 'blaugrana'], commonName: 'Barcelona' }
]
