import type { Product } from '@/types/schema'

// Helper to create a complete variant
const createVariant = (id: string, price: number, title: string, option1: string | null = null, option2: string | null = null) => ({
  id,
  product_id: 'placeholder',
  title,
  price,
  sku: `SKU-${id}`,
  option1,
  option2,
  option3: null,
  inventory_quantity: 1,
  smart_contract_address: null,
  token_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})

// Helper to create common product fields
const commonFields = (_id: string, title: string) => ({
  handle: title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
  vendor: 'SportsSigned',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  options: []
})

export const PLACEHOLDER_PRODUCTS: Product[] = [
  // --- FOOTBALL SHIRTS (10 items) ---
  {
    id: 'fb-shirt-1',
    title: 'Signed Steven Gerrard Liverpool Shirt 2005',
    body_html: 'Own a piece of Anfield history. This authentic Liverpool FC home shirt from the miraculous 2005 Champions League winning season is hand-signed by captain Steven Gerrard. Preserved in our premium framing with UV-protective glass.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Liverpool', 'Football', 'Steven Gerrard', 'Shirt', 'Signed', 'Legend', '2000s'],
    images: ['https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v1', 499, 'Framed', 'Framed', 'Standard Size')],
    ...commonFields('fb-shirt-1', 'Signed Steven Gerrard Liverpool Shirt 2005')
  },
  {
    id: 'fb-shirt-2',
    title: 'Signed Marcus Rashford Man Utd Shirt 2023',
    body_html: 'Official Manchester United home shirt signed by Marcus Rashford. A stunning piece for any Red Devils collection, professionally framed to the highest standard.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Manchester United', 'Football', 'Marcus Rashford', 'Shirt', 'Signed', 'Modern', '2020s'],
    images: ['https://images.unsplash.com/photo-1626245550536-e46d030a0052?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v2', 299, 'Framed', 'Framed', 'Size L')],
    ...commonFields('fb-shirt-2', 'Signed Marcus Rashford Man Utd Shirt')
  },
  {
    id: 'fb-shirt-3',
    title: 'Signed Kevin De Bruyne Man City Shirt 2024',
    body_html: 'Manchester City home shirt signed by midfield maestro Kevin De Bruyne. Features clear, bold signature and comes with our lifetime NFC authenticity guarantee.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Manchester City', 'Football', 'Kevin De Bruyne', 'Shirt', 'Signed', 'Modern', '2020s'],
    images: ['https://images.unsplash.com/photo-1565264316550-a1811f0c4c75?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v3', 350, 'Framed', 'Framed', 'Size M')],
    ...commonFields('fb-shirt-3', 'Signed Kevin De Bruyne Man City Shirt')
  },
  {
    id: 'fb-shirt-4',
    title: 'Signed Thierry Henry Arsenal Shirt 2004',
    body_html: 'Classic Arsenal Highbury farewell shirt signed by legend Thierry Henry. A rare collector\'s item celebrating the King of Highbury. Premium framing included.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Arsenal', 'Football', 'Thierry Henry', 'Shirt', 'Signed', 'Legend', '2000s', 'Invincibles'],
    images: ['https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v4', 599, 'Framed', 'Framed', 'Size L')],
    ...commonFields('fb-shirt-4', 'Signed Thierry Henry Arsenal Shirt')
  },
  {
    id: 'fb-shirt-5',
    title: 'Signed Harry Kane Tottenham Shirt 2018',
    body_html: 'Tottenham Hotspur home shirt signed by record goalscorer Harry Kane. Authenticated via NFC and presented in our signature premium display frame.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Tottenham', 'Football', 'Harry Kane', 'Shirt', 'Signed', 'Modern', '2010s'],
    images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v5', 399, 'Framed', 'Framed', 'Size XL')],
    ...commonFields('fb-shirt-5', 'Signed Harry Kane Tottenham Shirt')
  },
  {
    id: 'fb-shirt-6',
    title: 'Signed John Terry Chelsea Shirt 2012',
    body_html: 'Chelsea FC home shirt signed by captain John Terry. Celebrate the career of "Captain, Leader, Legend" with this authentically signed piece.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Chelsea', 'Football', 'John Terry', 'Shirt', 'Signed', 'Legend', '2000s', '2010s'],
    images: ['https://images.unsplash.com/photo-1577212017184-80cc25895079?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v6', 325, 'Framed', 'Framed', 'Size L')],
    ...commonFields('fb-shirt-6', 'Signed John Terry Chelsea Shirt')
  },
  {
    id: 'fb-shirt-7',
    title: 'Signed Alan Shearer Newcastle Shirt 1996',
    body_html: 'Iconic Newcastle United shirt signed by Premier League top scorer Alan Shearer. A must-have for any Toon Army fan. Verified authentic.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Newcastle', 'Football', 'Alan Shearer', 'Shirt', 'Signed', 'Legend', '90s'],
    images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v7', 450, 'Framed', 'Framed', 'Size XL')],
    ...commonFields('fb-shirt-7', 'Signed Alan Shearer Newcastle Shirt')
  },
  {
    id: 'fb-shirt-8',
    title: 'Signed Jack Grealish Aston Villa Shirt 2020',
    body_html: 'Aston Villa home shirt signed by Jack Grealish. A piece of Villa history, professionally framed and ready to display.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Aston Villa', 'Football', 'Jack Grealish', 'Shirt', 'Signed', 'Modern', '2020s'],
    images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v8', 250, 'Framed', 'Framed', 'Size M')],
    ...commonFields('fb-shirt-8', 'Signed Jack Grealish Aston Villa Shirt')
  },
  {
    id: 'fb-shirt-9',
    title: 'Signed Declan Rice West Ham Shirt 2023',
    body_html: 'West Ham United shirt signed by captain Declan Rice. Commemorating his leadership and the European triumph. Authenticated.',
    product_type: 'shirt',
    status: 'active',
    tags: ['West Ham', 'Football', 'Declan Rice', 'Shirt', 'Signed', 'Modern', '2020s'],
    images: ['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v9', 275, 'Framed', 'Framed', 'Size L')],
    ...commonFields('fb-shirt-9', 'Signed Declan Rice West Ham Shirt')
  },
  {
    id: 'fb-shirt-10',
    title: 'Signed Jamie Vardy Leicester Shirt 2016',
    body_html: 'Leicester City title winning season shirt signed by Jamie Vardy. Relive the 5000/1 miracle with this premium signed memorabilia.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Leicester City', 'Football', 'Jamie Vardy', 'Shirt', 'Signed', 'Legend', '2010s', 'Title Winner'],
    images: ['https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v10', 399, 'Framed', 'Framed', 'Size M')],
    ...commonFields('fb-shirt-10', 'Signed Jamie Vardy Leicester Shirt')
  },

  // --- BOOTS (10 items) ---
  {
    id: 'boot-1',
    title: 'Match Worn Wayne Rooney Boots 2008',
    body_html: 'An incredible piece of football history. These Nike T90 boots were match-worn by Wayne Rooney during the 2008 season. Shows signs of match use. Authenticated via NFC.',
    product_type: 'boot',
    status: 'active',
    tags: ['Manchester United', 'Football', 'Wayne Rooney', 'Boot', 'Match Worn', 'Legend', '2000s'],
    images: ['https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v11', 1200, 'Display Case', 'Display Case', 'Size UK 9')],
    ...commonFields('boot-1', 'Match Worn Wayne Rooney Boots')
  },
  {
    id: 'boot-2',
    title: 'Signed Lionel Messi Boots',
    body_html: 'Adidas F50 boots hand-signed by the GOAT himself, Lionel Messi. A pristine collector\'s item presented in a premium acrylic display case.',
    product_type: 'boot',
    status: 'active',
    tags: ['Barcelona', 'Football', 'Lionel Messi', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v12', 2500, 'Display Case')],
    ...commonFields('boot-2', 'Signed Lionel Messi Boots')
  },
  {
    id: 'boot-3',
    title: 'Signed Cristiano Ronaldo Boots',
    body_html: 'Nike Mercurial boots signed by Cristiano Ronaldo. Capture the speed and power of CR7 with this authenticated memorabilia piece.',
    product_type: 'boot',
    status: 'active',
    tags: ['Real Madrid', 'Football', 'Cristiano Ronaldo', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v13', 2200, 'Display Case')],
    ...commonFields('boot-3', 'Signed Cristiano Ronaldo Boots')
  },
  {
    id: 'boot-4',
    title: 'Signed Neymar Jr Boots',
    body_html: 'Puma Future boots signed by Brazilian magician Neymar Jr. Guaranteed authentic with digital NFC verification.',
    product_type: 'boot',
    status: 'active',
    tags: ['PSG', 'Football', 'Neymar', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v14', 900, 'Display Case')],
    ...commonFields('boot-4', 'Signed Neymar Jr Boots')
  },
  {
    id: 'boot-5',
    title: 'Signed Kylian Mbappe Boots',
    body_html: 'Nike Mercurial Superfly boots signed by Kylian Mbappe. Own a piece of the future GOAT\'s legacy. Premium display case included.',
    product_type: 'boot',
    status: 'active',
    tags: ['PSG', 'Football', 'Kylian Mbappe', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v15', 1100, 'Display Case')],
    ...commonFields('boot-5', 'Signed Kylian Mbappe Boots')
  },
  {
    id: 'boot-6',
    title: 'Signed Mohamed Salah Boots',
    body_html: 'Adidas X Speedflow boots signed by the Egyptian King, Mohamed Salah. Verified authentic and ready for display.',
    product_type: 'boot',
    status: 'active',
    tags: ['Liverpool', 'Football', 'Mohamed Salah', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v16', 850, 'Display Case')],
    ...commonFields('boot-6', 'Signed Mohamed Salah Boots')
  },
  {
    id: 'boot-7',
    title: 'Signed Virgil van Dijk Boots',
    body_html: 'Nike Tiempo Legend boots signed by Liverpool captain Virgil van Dijk. A commanding piece for any collection.',
    product_type: 'boot',
    status: 'active',
    tags: ['Liverpool', 'Football', 'Virgil van Dijk', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v17', 750, 'Display Case')],
    ...commonFields('boot-7', 'Signed Virgil van Dijk Boots')
  },
  {
    id: 'boot-8',
    title: 'Signed Erling Haaland Boots',
    body_html: 'Nike Phantom GX boots signed by goal machine Erling Haaland. Includes digital certificate of authenticity via NFC.',
    product_type: 'boot',
    status: 'active',
    tags: ['Manchester City', 'Football', 'Erling Haaland', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v18', 1300, 'Display Case')],
    ...commonFields('boot-8', 'Signed Erling Haaland Boots')
  },
  {
    id: 'boot-9',
    title: 'Signed Bukayo Saka Boots',
    body_html: 'New Balance Furon boots signed by Arsenal star Bukayo Saka. A perfect gift for any Gunner. Premium display case included.',
    product_type: 'boot',
    status: 'active',
    tags: ['Arsenal', 'Football', 'Bukayo Saka', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v19', 600, 'Display Case')],
    ...commonFields('boot-9', 'Signed Bukayo Saka Boots')
  },
  {
    id: 'boot-10',
    title: 'Signed Bruno Fernandes Boots',
    body_html: 'Nike Mercurial Vapor boots signed by Manchester United captain Bruno Fernandes. Authenticated and preserved.',
    product_type: 'boot',
    status: 'active',
    tags: ['Manchester United', 'Football', 'Bruno Fernandes', 'Boot', 'Signed'],
    images: ['https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v20', 550, 'Display Case')],
    ...commonFields('boot-10', 'Signed Bruno Fernandes Boots')
  },

  // --- PHOTOS (10 items) ---
  {
    id: 'photo-1',
    title: 'Signed Pele World Cup Photo 1970',
    body_html: 'Iconic photo of Pele celebrating the 1970 World Cup victory. Hand-signed by the King of Football. Professionally framed.',
    product_type: 'photo',
    status: 'active',
    tags: ['Brazil', 'Football', 'Pele', 'Photo', 'Signed', 'Legend', '70s'],
    images: ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v21', 800, 'Framed', 'Framed', 'Standard')],
    ...commonFields('photo-1', 'Signed Pele World Cup Photo')
  },
  {
    id: 'photo-2',
    title: 'Signed Maradona Hand of God Photo',
    body_html: 'The most famous moment in World Cup history. "Hand of God" photo signed by Diego Maradona. A true investment piece.',
    product_type: 'photo',
    status: 'active',
    tags: ['Argentina', 'Football', 'Maradona', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v22', 1500, 'Framed')],
    ...commonFields('photo-2', 'Signed Maradona Hand of God Photo')
  },
  {
    id: 'photo-3',
    title: 'Signed Muhammad Ali vs Liston Photo',
    body_html: 'The greatest sports photo of all time. Ali standing over Liston, signed by Muhammad Ali himself. Authenticated and framed.',
    product_type: 'photo',
    status: 'active',
    tags: ['Boxing', 'Muhammad Ali', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v23', 2000, 'Framed')],
    ...commonFields('photo-3', 'Signed Muhammad Ali vs Liston Photo')
  },
  {
    id: 'photo-4',
    title: 'Signed Mike Tyson Photo',
    body_html: 'Ferocious action shot signed by "Iron" Mike Tyson. Capture the power of the youngest heavyweight champion. Premium framing.',
    product_type: 'photo',
    status: 'active',
    tags: ['Boxing', 'Mike Tyson', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1615117970141-5250918c5250?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v24', 400, 'Framed')],
    ...commonFields('photo-4', 'Signed Mike Tyson Photo')
  },
  {
    id: 'photo-5',
    title: 'Signed Lewis Hamilton Photo',
    body_html: 'Photo of Lewis Hamilton celebrating his record-equalling 7th World Title. Signed by the F1 legend. Verified authentic.',
    product_type: 'photo',
    status: 'active',
    tags: ['F1', 'Lewis Hamilton', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v25', 600, 'Framed')],
    ...commonFields('photo-5', 'Signed Lewis Hamilton Photo')
  },
  {
    id: 'photo-6',
    title: 'Signed Roger Federer Photo',
    body_html: 'Wimbledon victory celebration photo signed by the maestro, Roger Federer. A timeless piece of tennis history.',
    product_type: 'photo',
    status: 'active',
    tags: ['Tennis', 'Roger Federer', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v26', 550, 'Framed')],
    ...commonFields('photo-6', 'Signed Roger Federer Photo')
  },
  {
    id: 'photo-7',
    title: 'Signed Usain Bolt Photo',
    body_html: 'World Record celebration photo signed by the fastest man alive, Usain Bolt. Authenticated via NFC.',
    product_type: 'photo',
    status: 'active',
    tags: ['Athletics', 'Usain Bolt', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1552674605-5d226a5ebe40?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v27', 350, 'Framed')],
    ...commonFields('photo-7', 'Signed Usain Bolt Photo')
  },
  {
    id: 'photo-8',
    title: 'Signed Jonny Wilkinson Drop Goal Photo',
    body_html: 'The moment that won the World Cup. 2003 drop goal photo signed by England hero Jonny Wilkinson. Professionally framed.',
    product_type: 'photo',
    status: 'active',
    tags: ['Rugby', 'England', 'Jonny Wilkinson', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v28', 450, 'Framed')],
    ...commonFields('photo-8', 'Signed Jonny Wilkinson Drop Goal Photo')
  },
  {
    id: 'photo-9',
    title: 'Signed Ben Stokes Headingley Photo',
    body_html: 'The miracle of Headingley. Ashes 2019 celebration photo signed by Ben Stokes. A stunning cricket collectible.',
    product_type: 'photo',
    status: 'active',
    tags: ['Cricket', 'England', 'Ben Stokes', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v29', 300, 'Framed')],
    ...commonFields('photo-9', 'Signed Ben Stokes Headingley Photo')
  },
  {
    id: 'photo-10',
    title: 'Signed Tiger Woods Photo',
    body_html: 'Masters victory photo signed by the legendary Tiger Woods. A premium piece for the golf enthusiast. Verified authentic.',
    product_type: 'photo',
    status: 'active',
    tags: ['Golf', 'Tiger Woods', 'Photo', 'Signed'],
    images: ['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v30', 1800, 'Framed')],
    ...commonFields('photo-10', 'Signed Tiger Woods Photo')
  },

  // --- BOXING (5 items) ---
  {
    id: 'box-1',
    title: 'Signed Anthony Joshua Glove 2016',
    body_html: 'Everlast boxing glove hand-signed by two-time heavyweight champion Anthony Joshua. A knockout addition to any collection. Authenticated.',
    product_type: 'boxing',
    status: 'active',
    tags: ['Boxing', 'Anthony Joshua', 'Glove', 'Signed', 'Modern', '2010s'],
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v31', 450, 'Display Case', 'Display Case', 'Standard')],
    ...commonFields('box-1', 'Signed Anthony Joshua Glove')
  },
  {
    id: 'box-2',
    title: 'Signed Tyson Fury Glove',
    body_html: 'Boxing glove signed by the Gypsy King himself, Tyson Fury. Celebrate the lineal heavyweight champion. Verified authentic via NFC.',
    product_type: 'boxing',
    status: 'active',
    tags: ['Boxing', 'Tyson Fury', 'Glove', 'Signed'],
    images: ['https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v32', 500, 'Display Case')],
    ...commonFields('box-2', 'Signed Tyson Fury Glove')
  },
  {
    id: 'box-3',
    title: 'Signed Floyd Mayweather Trunks',
    body_html: 'Replica trunks signed by the undefeated 50-0 legend, Floyd "Money" Mayweather. A premium investment piece. Professionally framed.',
    product_type: 'boxing',
    status: 'active',
    tags: ['Boxing', 'Floyd Mayweather', 'Trunks', 'Signed'],
    images: ['https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v33', 800, 'Framed')],
    ...commonFields('box-3', 'Signed Floyd Mayweather Trunks')
  },
  {
    id: 'box-4',
    title: 'Signed Canelo Alvarez Glove',
    body_html: 'Boxing glove signed by the pound-for-pound king, Saul "Canelo" Alvarez. Authenticated and presented in a premium display case.',
    product_type: 'boxing',
    status: 'active',
    tags: ['Boxing', 'Canelo Alvarez', 'Glove', 'Signed'],
    images: ['https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v34', 400, 'Display Case')],
    ...commonFields('box-4', 'Signed Canelo Alvarez Glove')
  },
  {
    id: 'box-5',
    title: 'Signed Manny Pacquiao Glove',
    body_html: 'Boxing glove signed by the 8-division world champion Manny Pacquiao. A piece of boxing history. Verified authentic.',
    product_type: 'boxing',
    status: 'active',
    tags: ['Boxing', 'Manny Pacquiao', 'Glove', 'Signed'],
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v35', 350, 'Display Case')],
    ...commonFields('box-5', 'Signed Manny Pacquiao Glove')
  },

  // --- RUGBY (3 items) ---
  {
    id: 'rugby-1',
    title: 'Signed Richie McCaw All Blacks Shirt 2015',
    body_html: 'New Zealand All Blacks shirt signed by the legendary captain Richie McCaw. A rare and prestigious item. Premium framing.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Rugby', 'New Zealand', 'Richie McCaw', 'All Blacks', 'Shirt', 'Signed', 'Legend', '2010s'],
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v36', 600, 'Framed', 'Framed', 'Size L')],
    ...commonFields('rugby-1', 'Signed Richie McCaw All Blacks Shirt')
  },
  {
    id: 'rugby-2',
    title: 'Signed Dan Carter Ball',
    body_html: 'Gilbert rugby ball signed by the greatest fly-half of all time, Dan Carter. Authenticated via NFC.',
    product_type: 'ball',
    status: 'active',
    tags: ['Rugby', 'New Zealand', 'Dan Carter', 'Ball', 'Signed'],
    images: ['https://images.unsplash.com/photo-1628891890377-571b79fe2e08?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v37', 300, 'Display Case')],
    ...commonFields('rugby-2', 'Signed Dan Carter Ball')
  },
  {
    id: 'rugby-3',
    title: 'Signed Siya Kolisi Shirt',
    body_html: 'Springboks shirt signed by World Cup winning captain Siya Kolisi. Celebrate South African rugby history. Professionally framed.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Rugby', 'South Africa', 'Siya Kolisi', 'Shirt', 'Signed'],
    images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v38', 450, 'Framed')],
    ...commonFields('rugby-3', 'Signed Siya Kolisi Shirt')
  },

  // --- CRICKET (2 items) ---
  {
    id: 'cricket-1',
    title: 'Signed Joe Root Bat 2021',
    body_html: 'Full size cricket bat signed by England\'s premier batsman Joe Root. A stunning display piece for any cricket lover. Verified authentic.',
    product_type: 'bat',
    status: 'active',
    tags: ['Cricket', 'England', 'Joe Root', 'Bat', 'Signed', 'Modern', '2020s'],
    images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v39', 500, 'Framed', 'Framed', 'Full Size')],
    ...commonFields('cricket-1', 'Signed Joe Root Bat')
  },
  {
    id: 'cricket-2',
    title: 'Signed Virat Kohli Shirt',
    body_html: 'India ODI shirt signed by the King, Virat Kohli. A must-have for any cricket fan. Presented in our premium framing.',
    product_type: 'shirt',
    status: 'active',
    tags: ['Cricket', 'India', 'Virat Kohli', 'Shirt', 'Signed'],
    images: ['https://images.unsplash.com/photo-1624526267942-ab44918c5f14?auto=format&fit=crop&q=80&w=800'],
    variants: [createVariant('v40', 600, 'Framed')],
    ...commonFields('cricket-2', 'Signed Virat Kohli Shirt')
  }
]

export const PLACEHOLDER_IMAGES: Record<string, string> = PLACEHOLDER_PRODUCTS.reduce((acc, product) => {
  if (product.images && product.images.length > 0) {
    acc[product.id] = product.images[0];
  }
  return acc;
}, {} as Record<string, string>);

