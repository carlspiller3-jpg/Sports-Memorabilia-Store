export interface Athlete {
  id: string
  name: string
  aliases: string[] // For fuzzy match/variations
  sport: 'Football' | 'Boxing' | 'Tennis' | 'F1' | 'Rugby' | 'Cricket' | 'Basketball' | 'Golf' | 'UFC'
  team?: string
  league?: string
  era: string[] // e.g., "90s", "Modern", "Legend", "2000s"
  priceTier: 'Entry' | 'Mid' | 'High' | 'Premium'
  signingStatus: 'Available' | 'Limited' | 'Private Only' | 'Unavailable'
  funFacts: string[]
  salesHooks: string[] // Specific selling points
  relatedAthletes: string[] // IDs of similar players
}

export const ATHLETE_DB: Athlete[] = [
  // --- FOOTBALL LEGENDS ---
  {
    id: 'pele',
    name: 'Pele',
    aliases: ['pelé', 'edson arantes do nascimento', 'king of football'],
    sport: 'Football',
    team: 'Brazil',
    league: 'International',
    era: ['Legend', '60s', '70s'],
    priceTier: 'Premium',
    signingStatus: 'Unavailable',
    funFacts: ['Only player to win 3 World Cups', 'Scored over 1,000 career goals'],
    salesHooks: ['Own a piece of history from the King of Football', 'The ultimate centerpiece for any collection'],
    relatedAthletes: ['maradona', 'messi', 'ronaldo_nazario']
  },
  {
    id: 'maradona',
    name: 'Diego Maradona',
    aliases: ['maradona', 'diego', 'hand of god'],
    sport: 'Football',
    team: 'Argentina',
    league: 'International',
    era: ['Legend', '80s', '90s'],
    priceTier: 'Premium',
    signingStatus: 'Unavailable',
    funFacts: ['Captain of the 1986 World Cup winning team', 'Scored the "Goal of the Century"'],
    salesHooks: ['The Golden Boy\'s legacy is eternal', 'One of the most coveted signatures in sport'],
    relatedAthletes: ['pele', 'messi', 'tevez']
  },
  {
    id: 'messi',
    name: 'Lionel Messi',
    aliases: ['leo messi', 'messi', 'the goat'],
    sport: 'Football',
    team: 'Inter Miami',
    league: 'MLS',
    era: ['Modern', 'Legend', '2010s', '2020s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['8-time Ballon d\'Or winner', 'Barcelona\'s all-time top scorer'],
    salesHooks: ['The greatest player of his generation', 'Items from his World Cup winning era are skyrocketing in value'],
    relatedAthletes: ['ronaldo', 'maradona', 'neymar']
  },
  {
    id: 'ronaldo',
    name: 'Cristiano Ronaldo',
    aliases: ['cr7', 'ronaldo', 'cristiano'],
    sport: 'Football',
    team: 'Al Nassr',
    league: 'Saudi Pro League',
    era: ['Modern', 'Legend', '2000s', '2010s', '2020s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['All-time top scorer in men\'s international football', '5-time Ballon d\'Or winner'],
    salesHooks: ['One of the most dedicated athletes in history', 'A global icon - his signature is instantly recognizable'],
    relatedAthletes: ['messi', 'rooney', 'bale']
  },
  {
    id: 'gerrard',
    name: 'Steven Gerrard',
    aliases: ['stevie g', 'gerrard', 'captain fantastic'],
    sport: 'Football',
    team: 'Liverpool',
    league: 'Premier League',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Only player to score in FA Cup, League Cup, UEFA Cup and Champions League finals', 'Liverpool\'s longest-serving captain'],
    salesHooks: ['The hero of Istanbul 2005', 'The ultimate gift for any Liverpool fan'],
    relatedAthletes: ['lampard', 'scholes', 'torres', 'suarez']
  },
  {
    id: 'lampard',
    name: 'Frank Lampard',
    aliases: ['lampard', 'super frank'],
    sport: 'Football',
    team: 'Chelsea',
    league: 'Premier League',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Chelsea\'s all-time leading goalscorer', 'Highest scoring midfielder in Premier League history'],
    salesHooks: ['A true Chelsea legend', 'Perfect for framing alongside a Terry or Drogba item'],
    relatedAthletes: ['gerrard', 'terry', 'drogba']
  },
  {
    id: 'henry',
    name: 'Thierry Henry',
    aliases: ['henry', 'titi', 'king henry'],
    sport: 'Football',
    team: 'Arsenal',
    league: 'Premier League',
    era: ['Legend', '2000s'],
    priceTier: 'High',
    signingStatus: 'Limited',
    funFacts: ['Arsenal\'s all-time top scorer', 'Won the Golden Boot 4 times'],
    salesHooks: ['The King of Highbury', 'Invincibles era items are extremely collectible'],
    relatedAthletes: ['bergkamp', 'vieira', 'wright']
  },
  {
    id: 'rooney',
    name: 'Wayne Rooney',
    aliases: ['rooney', 'wazza'],
    sport: 'Football',
    team: 'Manchester United',
    league: 'Premier League',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Manchester United\'s all-time top scorer', 'England\'s second all-time top scorer'],
    salesHooks: ['A Manchester United icon', 'His bicycle kick goal is legendary'],
    relatedAthletes: ['ronaldo', 'scholes', 'giggs']
  },
  {
    id: 'haaland',
    name: 'Erling Haaland',
    aliases: ['haaland', 'the terminator'],
    sport: 'Football',
    team: 'Manchester City',
    league: 'Premier League',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Broke the Premier League single-season scoring record', 'Won the Treble in his debut season'],
    salesHooks: ['The future of football', 'Invest early in a future legend'],
    relatedAthletes: ['mbappe', 'debruyne', 'aguero']
  },
  {
    id: 'rashford',
    name: 'Marcus Rashford',
    aliases: ['rashford', 'marcus'],
    sport: 'Football',
    team: 'Manchester United',
    league: 'Premier League',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['scored on his PL, Europa League and England debuts', 'MBE awarded for charity work'],
    salesHooks: ['Manchester United\'s homegrown star', 'A symbol of the club'],
    relatedAthletes: ['rooney', 'fernandes', 'saka']
  },
  {
    id: 'grealish',
    name: 'Jack Grealish',
    aliases: ['grealish', 'jack', 'super jack'],
    sport: 'Football',
    team: 'Manchester City',
    league: 'Premier League',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Most expensive British player transfer', 'Treble winner'],
    salesHooks: ['The most popular player in England', 'Iconic calves'],
    relatedAthletes: ['debruyne', 'rice', 'foden']
  },
  {
    id: 'rice',
    name: 'Declan Rice',
    aliases: ['rice', 'dec'],
    sport: 'Football',
    team: 'Arsenal',
    league: 'Premier League',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Captained West Ham to European glory', 'Arsenal record signing'],
    salesHooks: ['The best DM in the league', 'Future England captain'],
    relatedAthletes: ['saka', 'kane', 'grealish']
  },
  {
    id: 'vardy',
    name: 'Jamie Vardy',
    aliases: ['vardy', 'jamie'],
    sport: 'Football',
    team: 'Leicester City',
    league: 'Premier League',
    era: ['Legend', '2010s'],
    priceTier: 'Mid',
    signingStatus: 'Available',
    funFacts: ['Scored in 11 consecutive PL games', 'From non-league to PL champion'],
    salesHooks: ['The ultimate underdog story', 'Leicester\'s greatest ever player'],
    relatedAthletes: ['kane', 'shearer', 'mahrez']
  },
  {
    id: 'terry',
    name: 'John Terry',
    aliases: ['jt', 'terry'],
    sport: 'Football',
    team: 'Chelsea',
    league: 'Premier League',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Chelsea\'s most successful captain', 'Highest scoring defender in PL history'],
    salesHooks: ['Captain, Leader, Legend', 'The heart of Chelsea'],
    relatedAthletes: ['lampard', 'drogba', 'cech']
  },
  {
    id: 'vandijk',
    name: 'Virgil van Dijk',
    aliases: ['vvd', 'van dijk', 'virgil'],
    sport: 'Football',
    team: 'Liverpool',
    league: 'Premier League',
    era: ['Modern', 'Legend', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Only defender to win UEFA Player of the Year', 'Captain of Netherlands'],
    salesHooks: ['The colossus', 'The best centre back of his generation'],
    relatedAthletes: ['salah', 'alisson', 'trent']
  },
  {
    id: 'saka',
    name: 'Bukayo Saka',
    aliases: ['saka', 'starboy'],
    sport: 'Football',
    team: 'Arsenal',
    league: 'Premier League',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Arsenal\'s 2020s talisman', 'England\'s Player of the Year x2'],
    salesHooks: ['Starboy', 'The face of Arsenal'],
    relatedAthletes: ['rice', 'odegaard', 'henry']
  },
  {
    id: 'fernandes',
    name: 'Bruno Fernandes',
    aliases: ['bruno', 'fernandes'],
    sport: 'Football',
    team: 'Manchester United',
    league: 'Premier League',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Manchester United captain', 'Top scoring midfielder'],
    salesHooks: ['Portuguese magnifico', 'Critical for any United collection'],
    relatedAthletes: ['rashford', 'ronaldo', 'pogba']
  },
  {
    id: 'mbappe',
    name: 'Kylian Mbappé',
    aliases: ['mbappe', 'kylian'],
    sport: 'Football',
    team: 'Real Madrid',
    league: 'La Liga',
    era: ['Modern', '2020s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['World Cup winner at 19', 'Scored a hat-trick in a World Cup final'],
    salesHooks: ['Already a World Cup legend', 'The new Galactico'],
    relatedAthletes: ['haaland', 'henry', 'zidane']
  },
  {
    id: 'bellingham',
    name: 'Jude Bellingham',
    aliases: ['bellingham', 'jude', 'hey jude'],
    sport: 'Football',
    team: 'Real Madrid',
    league: 'La Liga',
    era: ['Modern', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Youngest ever player for Birmingham City', 'Kopa Trophy winner'],
    salesHooks: ['England\'s golden boy', 'Real Madrid\'s new superstar'],
    relatedAthletes: ['kane', 'zidane', 'modric']
  },
  {
    id: 'kane',
    name: 'Harry Kane',
    aliases: ['kane', 'hurricane'],
    sport: 'Football',
    team: 'Bayern Munich',
    league: 'Bundesliga',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['England\'s all-time top scorer', 'Tottenham\'s all-time top scorer'],
    salesHooks: ['The ultimate professional', 'England\'s greatest goalscorer'],
    relatedAthletes: ['shearer', 'rooney', 'son']
  },
  
  // --- BOXING ---
  {
    id: 'ali',
    name: 'Muhammad Ali',
    aliases: ['ali', 'cassius clay', 'the greatest'],
    sport: 'Boxing',
    era: ['Legend', '60s', '70s'],
    priceTier: 'Premium',
    signingStatus: 'Unavailable',
    funFacts: ['Three-time World Heavyweight Champion', 'Known as "The Greatest"'],
    salesHooks: ['The most iconic sportsman of the 20th century', 'A true investment piece'],
    relatedAthletes: ['tyson', 'frazier', 'foreman']
  },
  {
    id: 'tyson',
    name: 'Mike Tyson',
    aliases: ['tyson', 'iron mike'],
    sport: 'Boxing',
    era: ['Legend', '80s', '90s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Youngest heavyweight champion in history', 'Known for his intimidating style'],
    salesHooks: ['The Baddest Man on the Planet', 'His signature is as explosive as his punch'],
    relatedAthletes: ['ali', 'holyfield', 'lewis']
  },
  {
    id: 'fury',
    name: 'Tyson Fury',
    aliases: ['fury', 'gypsy king'],
    sport: 'Boxing',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Undefeated lineal heavyweight champion', 'Completed one of the greatest comebacks in sport'],
    salesHooks: ['The Gypsy King', 'A charismatic champion with a unique signature'],
    relatedAthletes: ['joshua', 'usyk', 'wilder']
  },
  {
    id: 'joshua',
    name: 'Anthony Joshua',
    aliases: ['aj', 'joshua'],
    sport: 'Boxing',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'Mid',
    signingStatus: 'Available',
    funFacts: ['Two-time unified heavyweight champion', 'Olympic gold medalist'],
    salesHooks: ['A British boxing icon', 'Great value for a modern heavyweight great'],
    relatedAthletes: ['fury', 'lewis', 'klitschko']
  },

  // --- F1 ---
  {
    id: 'hamilton',
    name: 'Lewis Hamilton',
    aliases: ['hamilton', 'lewis'],
    sport: 'F1',
    team: 'Mercedes',
    era: ['Legend', 'Modern', '2000s', '2010s', '2020s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['Joint-record 7 World Championships', 'Most wins, poles, and podiums in F1 history'],
    salesHooks: ['The most successful driver in F1 history', 'Ferrari bound - Mercedes items are now historic'],
    relatedAthletes: ['schumacher', 'senna', 'verstappen']
  },
  {
    id: 'schumacher',
    name: 'Michael Schumacher',
    aliases: ['schumacher', 'schumi'],
    sport: 'F1',
    team: 'Ferrari',
    era: ['Legend', '90s', '2000s'],
    priceTier: 'Premium',
    signingStatus: 'Unavailable',
    funFacts: ['7 World Championships', 'Redefined fitness and professionalism in F1'],
    salesHooks: ['The Red Baron', 'Ferrari era items are the gold standard of F1 memorabilia'],
    relatedAthletes: ['hamilton', 'senna', 'vettel']
  },
  {
    id: 'verstappen',
    name: 'Max Verstappen',
    aliases: ['verstappen', 'max', 'super max'],
    sport: 'F1',
    team: 'Red Bull Racing',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Youngest ever F1 driver and winner', 'Dominant 3-time World Champion'],
    salesHooks: ['The current dominant force in F1', 'Already an all-time great'],
    relatedAthletes: ['hamilton', 'vettel', 'norris']
  },
  {
    id: 'senna',
    name: 'Ayrton Senna',
    aliases: ['senna', 'ayrton'],
    sport: 'F1',
    team: 'McLaren',
    era: ['Legend', '80s', '90s'],
    priceTier: 'Premium',
    signingStatus: 'Unavailable',
    funFacts: ['3 World Championships', 'Regarded by many as the fastest driver ever'],
    salesHooks: ['A mythical figure in motorsport', 'Rare and highly treasured items'],
    relatedAthletes: ['prost', 'schumacher', 'hamilton']
  },

  // --- TENNIS ---
  {
    id: 'federer',
    name: 'Roger Federer',
    aliases: ['federer', 'roger', 'maestro'],
    sport: 'Tennis',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['20 Grand Slam titles', 'Spent 310 weeks at world number 1'],
    salesHooks: ['The epitome of tennis elegance', 'Retired legend - items are appreciating'],
    relatedAthletes: ['nadal', 'djokovic', 'murray']
  },
  {
    id: 'nadal',
    name: 'Rafael Nadal',
    aliases: ['nadal', 'rafa', 'king of clay'],
    sport: 'Tennis',
    era: ['Legend', '2000s', '2010s', '2020s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['14 French Open titles', '22 Grand Slam titles'],
    salesHooks: ['The King of Clay', 'One of the fiercest competitors in history'],
    relatedAthletes: ['federer', 'djokovic', 'alcaraz']
  },
  {
    id: 'djokovic',
    name: 'Novak Djokovic',
    aliases: ['djokovic', 'nole', 'joker'],
    sport: 'Tennis',
    era: ['Legend', 'Modern', '2000s', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Record holder for most Grand Slam titles', 'Most weeks at world number 1'],
    salesHooks: ['Statistically the greatest of all time', 'Still dominating the sport'],
    relatedAthletes: ['federer', 'nadal', 'murray']
  },

  // --- MORE FOOTBALL LEGENDS ---
  {
    id: 'beckham',
    name: 'David Beckham',
    aliases: ['beckham', 'becks', 'golden balls'],
    sport: 'Football',
    team: 'Manchester United',
    league: 'Premier League',
    era: ['Legend', '90s', '2000s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['Class of 92 member', 'Iconic free-kick specialist'],
    salesHooks: ['A global icon beyond football', 'Treble winner with Manchester United'],
    relatedAthletes: ['rooney', 'scholes', 'giggs']
  },
  {
    id: 'zidane',
    name: 'Zinedine Zidane',
    aliases: ['zidane', 'zizou'],
    sport: 'Football',
    team: 'Real Madrid',
    league: 'La Liga',
    era: ['Legend', '90s', '2000s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['World Cup and Champions League winner', 'Ballon d\'Or winner'],
    salesHooks: ['The maestro of midfield', 'One of the most elegant players ever'],
    relatedAthletes: ['mbappe', 'henry', 'ronaldo']
  },
  {
    id: 'salah',
    name: 'Mohamed Salah',
    aliases: ['salah', 'mo salah', 'egyptian king'],
    sport: 'Football',
    team: 'Liverpool',
    league: 'Premier League',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Premier League Golden Boot winner', 'Champions League winner'],
    salesHooks: ['The Egyptian King', 'Liverpool\'s modern hero'],
    relatedAthletes: ['gerrard', 'mane', 'firmino']
  },
  {
    id: 'debruyne',
    name: 'Kevin De Bruyne',
    aliases: ['de bruyne', 'kdb'],
    sport: 'Football',
    team: 'Manchester City',
    league: 'Premier League',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Multiple Premier League titles', 'PFA Player of the Year'],
    salesHooks: ['The complete midfielder', 'Treble winner'],
    relatedAthletes: ['haaland', 'silva', 'aguero']
  },
  {
    id: 'neymar',
    name: 'Neymar Jr',
    aliases: ['neymar', 'ney'],
    sport: 'Football',
    team: 'Al Hilal',
    league: 'Saudi Pro League',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Most expensive transfer in history', 'Champions League winner'],
    salesHooks: ['Brazilian flair personified', 'One of the most skillful players ever'],
    relatedAthletes: ['messi', 'mbappe', 'ronaldo']
  },
  {
    id: 'vanbasten',
    name: 'Marco van Basten',
    aliases: ['van basten', 'basten'],
    sport: 'Football',
    team: 'AC Milan',
    league: 'Serie A',
    era: ['Legend', '80s', '90s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['3-time Ballon d\'Or winner', 'Scored legendary volley in Euro 88 final'],
    salesHooks: ['One of the greatest strikers ever', 'Rare signature from a Dutch master'],
    relatedAthletes: ['gullit', 'rijkaard', 'maldini']
  },
  {
    id: 'cantona',
    name: 'Eric Cantona',
    aliases: ['cantona', 'king eric'],
    sport: 'Football',
    team: 'Manchester United',
    league: 'Premier League',
    era: ['Legend', '90s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['5 Premier League titles', 'Iconic collar-up celebration'],
    salesHooks: ['The King of Old Trafford', 'A cult hero with unmatched charisma'],
    relatedAthletes: ['beckham', 'rooney', 'giggs']
  },
  {
    id: 'shearer',
    name: 'Alan Shearer',
    aliases: ['shearer'],
    sport: 'Football',
    team: 'Newcastle United',
    league: 'Premier League',
    era: ['Legend', '90s', '2000s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Premier League all-time top scorer', '260 Premier League goals'],
    salesHooks: ['The greatest Premier League goalscorer', 'A Newcastle legend'],
    relatedAthletes: ['kane', 'rooney', 'cole']
  },

  // --- MORE BOXING ---
  {
    id: 'mayweather',
    name: 'Floyd Mayweather',
    aliases: ['mayweather', 'money', 'pretty boy'],
    sport: 'Boxing',
    era: ['Legend', '90s', '2000s', '2010s'],
    priceTier: 'Premium',
    signingStatus: 'Available',
    funFacts: ['Undefeated 50-0 record', '15-time world champion'],
    salesHooks: ['Money Mayweather', 'Perfect record - perfect investment'],
    relatedAthletes: ['pacquiao', 'canelo', 'tyson']
  },
  {
    id: 'pacquiao',
    name: 'Manny Pacquiao',
    aliases: ['pacquiao', 'pac-man'],
    sport: 'Boxing',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Only 8-division world champion', 'Fighter of the Decade'],
    salesHooks: ['The Pac-Man', 'A true warrior and legend'],
    relatedAthletes: ['mayweather', 'marquez', 'hatton']
  },
  {
    id: 'canelo',
    name: 'Canelo Álvarez',
    aliases: ['canelo', 'saul alvarez', 'canelo alvarez'],
    sport: 'Boxing',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Undisputed super middleweight champion', 'Multiple weight world champion'],
    salesHooks: ['The face of modern boxing', 'Pound-for-pound king'],
    relatedAthletes: ['mayweather', 'golovkin', 'bivol']
  },

  // --- RUGBY ---
  {
    id: 'wilkinson',
    name: 'Jonny Wilkinson',
    aliases: ['wilkinson', 'jonny'],
    sport: 'Rugby',
    team: 'England',
    era: ['Legend', '2000s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Kicked winning drop goal in 2003 World Cup final', 'England\'s all-time top points scorer'],
    salesHooks: ['The hero of 2003', 'The most iconic moment in English rugby'],
    relatedAthletes: ['johnson', 'robinson', 'dallaglio']
  },
  {
    id: 'mccaw',
    name: 'Richie McCaw',
    aliases: ['mccaw', 'richie'],
    sport: 'Rugby',
    team: 'New Zealand',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Limited',
    funFacts: ['Two-time World Cup winning captain', 'Most capped All Black'],
    salesHooks: ['The greatest All Black captain', 'A true rugby legend'],
    relatedAthletes: ['carter', 'lomu', 'wilkinson']
  },
  {
    id: 'carter',
    name: 'Dan Carter',
    aliases: ['carter', 'dan'],
    sport: 'Rugby',
    team: 'New Zealand',
    era: ['Legend', '2000s', '2010s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Highest points scorer in international rugby history', 'Two-time World Cup winner'],
    salesHooks: ['The perfect 10', 'The greatest fly-half ever'],
    relatedAthletes: ['mccaw', 'wilkinson', 'barrett']
  },
  {
    id: 'kolisi',
    name: 'Siya Kolisi',
    aliases: ['kolisi', 'siya'],
    sport: 'Rugby',
    team: 'South Africa',
    era: ['Modern', 'Legend', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['First black captain of the Springboks', 'World Cup winning captain'],
    salesHooks: ['Captain South Africa', 'An inspirational leader'],
    relatedAthletes: ['mccaw', 'dupont', 'etsebeth']
  },
  {
    id: 'root',
    name: 'Joe Root',
    aliases: ['root', 'rooty'],
    sport: 'Cricket',
    team: 'England',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['England\'s highest test run scorer', 'Former England captain'],
    salesHooks: ['England\'s greatest batsman', 'Rootoooo'],
    relatedAthletes: ['stokes', 'cook', 'smith']
  },

  // --- CRICKET ---
  {
    id: 'tendulkar',
    name: 'Sachin Tendulkar',
    aliases: ['tendulkar', 'sachin', 'master blaster'],
    sport: 'Cricket',
    team: 'India',
    era: ['Legend', '90s', '2000s', '2010s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['100 international centuries', 'Highest run scorer in international cricket'],
    salesHooks: ['The God of Cricket', 'A billion fans can\'t be wrong'],
    relatedAthletes: ['kohli', 'lara', 'ponting']
  },
  {
    id: 'kohli',
    name: 'Virat Kohli',
    aliases: ['kohli', 'virat', 'king kohli'],
    sport: 'Cricket',
    team: 'India',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['Fastest to 12,000 ODI runs', 'Modern batting great'],
    salesHooks: ['King Kohli', 'The face of modern cricket'],
    relatedAthletes: ['tendulkar', 'dhoni', 'sharma']
  },
  {
    id: 'stokes',
    name: 'Ben Stokes',
    aliases: ['stokes', 'ben'],
    sport: 'Cricket',
    team: 'England',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'Mid',
    signingStatus: 'Available',
    funFacts: ['Headingley 2019 hero', 'World Cup and Ashes winner'],
    salesHooks: ['England\'s modern hero', 'The ultimate match-winner'],
    relatedAthletes: ['root', 'broad', 'anderson']
  },

  // --- BASKETBALL ---
  {
    id: 'jordan',
    name: 'Michael Jordan',
    aliases: ['jordan', 'mj', 'air jordan'],
    sport: 'Basketball',
    team: 'Chicago Bulls',
    era: ['Legend', '80s', '90s'],
    priceTier: 'Premium',
    signingStatus: 'Private Only',
    funFacts: ['6-time NBA champion', 'Widely regarded as the GOAT'],
    salesHooks: ['The greatest basketball player ever', 'An investment that never depreciates'],
    relatedAthletes: ['lebron', 'kobe', 'curry']
  },
  {
    id: 'lebron',
    name: 'LeBron James',
    aliases: ['lebron', 'king james', 'bron'],
    sport: 'Basketball',
    team: 'Los Angeles Lakers',
    era: ['Legend', 'Modern', '2000s', '2010s', '2020s'],
    priceTier: 'Premium',
    signingStatus: 'Limited',
    funFacts: ['4-time NBA champion', 'All-time leading scorer'],
    salesHooks: ['King James', 'Still dominating in his 20th season'],
    relatedAthletes: ['jordan', 'curry', 'durant']
  },
  {
    id: 'curry',
    name: 'Stephen Curry',
    aliases: ['curry', 'steph', 'chef curry'],
    sport: 'Basketball',
    team: 'Golden State Warriors',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['4-time NBA champion', 'Greatest shooter in NBA history'],
    salesHooks: ['The Chef', 'Revolutionized the game'],
    relatedAthletes: ['lebron', 'durant', 'thompson']
  },

  // --- GOLF ---
  {
    id: 'woods',
    name: 'Tiger Woods',
    aliases: ['tiger', 'woods', 'tiger woods'],
    sport: 'Golf',
    era: ['Legend', '90s', '2000s', '2010s'],
    priceTier: 'Premium',
    signingStatus: 'Private Only',
    funFacts: ['15 major championships', 'Dominated golf for two decades'],
    salesHooks: ['The most dominant golfer ever', 'A cultural icon beyond golf'],
    relatedAthletes: ['mcilroy', 'nicklaus', 'mickelson']
  },
  {
    id: 'mcilroy',
    name: 'Rory McIlroy',
    aliases: ['mcilroy', 'rory'],
    sport: 'Golf',
    era: ['Modern', '2010s', '2020s'],
    priceTier: 'High',
    signingStatus: 'Available',
    funFacts: ['4 major championships', 'Former world number 1'],
    salesHooks: ['The pride of Northern Ireland', 'One of the modern greats'],
    relatedAthletes: ['woods', 'spieth', 'rahm']
  }
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

export interface TeamProfile {
  id: string
  name: string
  league: string
  colors: string[]
  commonName: string
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
