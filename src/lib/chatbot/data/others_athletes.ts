import { Athlete } from '../types'

export const OTHER_ATHLETES: Athlete[] = [
    // --- TENNIS ---
    {
        id: 'federer',
        name: 'Roger Federer',
        aliases: ['roger', 'maestro'],
        sport: 'Tennis',
        era: ['Legend'],
        priceTier: 'Premium',
        signingStatus: 'Limited',
        funFacts: ['20 Slams'],
        salesHooks: ['Tennis Elegance', 'The Maestro'],
        relatedAthletes: ['nadal', 'djokovic']
    },
    {
        id: 'nadal',
        name: 'Rafael Nadal',
        aliases: ['rafa'],
        sport: 'Tennis',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Limited',
        funFacts: ['King of Clay'],
        salesHooks: ['Rafa', 'Clay Dominance'],
        relatedAthletes: ['federer', 'alcaraz']
    },
    {
        id: 'djokovic',
        name: 'Novak Djokovic',
        aliases: ['nole'],
        sport: 'Tennis',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['Most Slams'],
        salesHooks: ['The GOAT?', 'Mental Giant'],
        relatedAthletes: ['nadal', 'federer']
    },
    {
        id: 'serena',
        name: 'Serena Williams',
        aliases: ['serena'],
        sport: 'Tennis',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['23 Grand Slams'],
        salesHooks: ['Queen of Court', 'Dominance'],
        relatedAthletes: ['venus', 'graf']
    },
    {
        id: 'agassi',
        name: 'Andre Agassi',
        aliases: [],
        sport: 'Tennis',
        era: ['Legend', '90s'],
        priceTier: 'Mid',
        signingStatus: 'Available',
        funFacts: ['Career Slam'],
        salesHooks: ['Las Vegas Kid', 'Style Icon'],
        relatedAthletes: ['sampras', 'courier']
    },
    {
        id: 'murray',
        name: 'Andy Murray',
        aliases: [],
        sport: 'Tennis',
        era: ['Legend'],
        priceTier: 'Mid',
        signingStatus: 'Available',
        funFacts: ['Wimbledon Champ'],
        salesHooks: ['British Hero', 'Sir Andy'],
        relatedAthletes: ['federer', 'henman']
    },
    {
        id: 'borg',
        name: 'Bjorn Borg',
        aliases: ['ice borg'],
        sport: 'Tennis',
        era: ['Legend', '70s'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['5 Straight Wimbledons'],
        salesHooks: ['Ice Borg', 'Rockstar of Tennis'],
        relatedAthletes: ['mcenroe', 'connors']
    },
    {
        id: 'mcenroe',
        name: 'John McEnroe',
        aliases: ['superbrat'],
        sport: 'Tennis',
        era: ['Legend', '80s'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['You cannot be serious'],
        salesHooks: ['Superbrat', 'Serve & Volley'],
        relatedAthletes: ['borg', 'connors']
    },

    // --- GOLF ---
    {
        id: 'woods',
        name: 'Tiger Woods',
        aliases: ['tiger'],
        sport: 'Golf',
        era: ['Legend'],
        priceTier: 'Premium',
        signingStatus: 'Unavailable',
        funFacts: ['82 Wins'],
        salesHooks: ['Tiger', 'Changed Golf'],
        relatedAthletes: ['nicklaus', 'mcilroy']
    },
    {
        id: 'nicklaus',
        name: 'Jack Nicklaus',
        aliases: ['golden bear'],
        sport: 'Golf',
        era: ['Legend'],
        priceTier: 'Premium',
        signingStatus: 'Available',
        funFacts: ['18 Majors'],
        salesHooks: ['Golden Bear', 'Most Majors'],
        relatedAthletes: ['palmer', 'player']
    },
    {
        id: 'palmer',
        name: 'Arnold Palmer',
        aliases: ['king'],
        sport: 'Golf',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Unavailable',
        funFacts: ['The King'],
        salesHooks: ['Arnie\'s Army', 'Charisma'],
        relatedAthletes: ['nicklaus', 'player']
    },
    {
        id: 'mcilroy',
        name: 'Rory McIlroy',
        aliases: ['rory'],
        sport: 'Golf',
        era: ['Modern'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['4 Majors'],
        salesHooks: ['Northern Irish Star', 'Pure Swing'],
        relatedAthletes: ['woods', 'spieth']
    },
    {
        id: 'seve',
        name: 'Seve Ballesteros',
        aliases: ['seve'],
        sport: 'Golf',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Unavailable',
        funFacts: ['Ryder Cup Hero'],
        salesHooks: ['Seve', 'Short Game Magician'],
        relatedAthletes: ['faldo', 'langer']
    },

    // --- CRICKET ---
    {
        id: 'tendulkar',
        name: 'Sachin Tendulkar',
        aliases: ['little master'],
        sport: 'Cricket',
        era: ['Legend'],
        priceTier: 'Premium',
        signingStatus: 'Limited',
        funFacts: ['100 Centuries'],
        salesHooks: ['God of Cricket', 'India Hero'],
        relatedAthletes: ['kohli', 'lara']
    },
    {
        id: 'warne',
        name: 'Shane Warne',
        aliases: ['warnie'],
        sport: 'Cricket',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Unavailable',
        funFacts: ['Ball of Century'],
        salesHooks: ['Spin King', 'Australian Icon'],
        relatedAthletes: ['mcgrath', 'ponting']
    },
    {
        id: 'bradman',
        name: 'Don Bradman',
        aliases: ['the don'],
        sport: 'Cricket',
        era: ['Legend'],
        priceTier: 'Premium',
        signingStatus: 'Unavailable',
        funFacts: ['Avg 99.94'],
        salesHooks: ['The Don', 'Unbeatable'],
        relatedAthletes: ['hobbs', 'sobers']
    },
    {
        id: 'sobers',
        name: 'Garfield Sobers',
        aliases: ['gary'],
        sport: 'Cricket',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['6 Sixes in Over'],
        salesHooks: ['Greatest All Rounder', 'Windies'],
        relatedAthletes: ['richards', 'lara']
    },
    {
        id: 'lara',
        name: 'Brian Lara',
        aliases: ['prince'],
        sport: 'Cricket',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['400 Not Out'],
        salesHooks: ['Prince of Trinidad', 'Flamboyant'],
        relatedAthletes: ['tendulkar', 'ambrose']
    },
    {
        id: 'botham',
        name: 'Ian Botham',
        aliases: ['beefy'],
        sport: 'Cricket',
        era: ['Legend'],
        priceTier: 'Mid',
        signingStatus: 'Available',
        funFacts: ['Ashes 81'],
        salesHooks: ['Beefy', 'Ashes Hero'],
        relatedAthletes: ['willis', 'gower']
    },

    // --- RUGBY ---
    {
        id: 'lomus',
        name: 'Jonah Lomu',
        aliases: [],
        sport: 'Rugby',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Unavailable',
        funFacts: ['First Global Rugby Star'],
        salesHooks: ['Unstoppable', 'All Black Icon'],
        relatedAthletes: ['mccaw', 'cullen']
    },
    {
        id: 'wilkinson',
        name: 'Jonny Wilkinson',
        aliases: ['wilko'],
        sport: 'Rugby',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['WC Winning Drop Goal'],
        salesHooks: ['English Hero', 'Perfectionist'],
        relatedAthletes: ['johnson', 'robinson']
    },
    {
        id: 'carter',
        name: 'Dan Carter',
        aliases: ['dc'],
        sport: 'Rugby',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['Points Record'],
        salesHooks: ['Perfect 10', 'All Black Great'],
        relatedAthletes: ['mccaw', 'nonu']
    },
    {
        id: 'edwards',
        name: 'Gareth Edwards',
        aliases: [],
        sport: 'Rugby',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['Greatest Try Ever'],
        salesHooks: ['Welsh Wizard', 'Barbarians'],
        relatedAthletes: ['barry', 'williams']
    },
    {
        id: 'odriscoll',
        name: 'Brian O\'Driscoll',
        aliases: ['bod'],
        sport: 'Rugby',
        era: ['Legend'],
        priceTier: 'High',
        signingStatus: 'Available',
        funFacts: ['Irish Captain'],
        salesHooks: ['BOD', 'Irish Legend'],
        relatedAthletes: ['oconnell', 'sexton']
    }
]
