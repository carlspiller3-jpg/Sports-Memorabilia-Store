
import type { Product } from '@/types/schema'

const createVariant = (id: string, price: number, title: string, stock: number) => ({
    id,
    product_id: 'stock',
    title,
    price,
    sku: `SKU-${id}`,
    option1: title,
    option2: null,
    option3: null,
    inventory_quantity: stock,
    smart_contract_address: null,
    token_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
})

const commonFields = (id: string, title: string, type: 'boot' | 'photo') => ({
    id,
    handle: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    vendor: 'Sports Memorabilia Store',
    product_type: type,
    status: 'active' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    options: [],
    // Using high-quality Unsplash placeholders that match the sport/type
    images: type === 'boot'
        ? ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop']
        : ['https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop']
})

export const INVENTORY_PRODUCTS: Product[] = [
    // --- SIGNED BOOTS ---
    {
        title: "Robin Van Persie Signed Nike Boot",
        body_html: "Authentic Nike boot hand-signed by Robin Van Persie. A premium collector's item.",
        tags: ["Football", "Boot", "Robin Van Persie", "Signed", "Premier League"],
        variants: [createVariant('boot-rvp', 90, 'Display Case', 6)],
        ...commonFields('boot-rvp', "Robin Van Persie Signed Nike Boot", 'boot')
    },
    {
        title: "Luis Diaz Signed Nike Boot (Black/Orange)",
        body_html: "Nike boot (Black/Orange colorway) signed by Liverpool star Luis Diaz.",
        tags: ["Football", "Boot", "Luis Diaz", "Liverpool", "Signed"],
        variants: [createVariant('boot-diaz', 70, 'Display Case', 5)],
        ...commonFields('boot-diaz', "Luis Diaz Signed Nike Boot", 'boot')
    },
    {
        title: "Divock Origi Signed Football Boot",
        body_html: "Football boot hand-signed by Divock Origi, Liverpool's cult hero.",
        tags: ["Football", "Boot", "Divock Origi", "Liverpool", "Signed"],
        variants: [createVariant('boot-origi', 70, 'Display Case', 6)],
        ...commonFields('boot-origi', "Divock Origi Signed Football Boot", 'boot')
    },
    {
        title: "Jordan Henderson Signed Blue Nike Boot",
        body_html: "Blue Nike boot signed by Champions League winning captain Jordan Henderson.",
        tags: ["Football", "Boot", "Jordan Henderson", "Liverpool", "Signed"],
        variants: [createVariant('boot-hendo', 70, 'Display Case', 4)],
        ...commonFields('boot-hendo', "Jordan Henderson Signed Blue Nike Boot", 'boot')
    },
    {
        title: "Sadio Mané Signed Boot",
        body_html: "Boot hand-signed by Liverpool legend Sadio Mané.",
        tags: ["Football", "Boot", "Sadio Mane", "Liverpool", "Signed"],
        variants: [createVariant('boot-mane', 60, 'Display Case', 3)],
        ...commonFields('boot-mane', "Sadio Mané Signed Boot", 'boot')
    },
    {
        title: "Darwin Nuñez Signed Boot",
        body_html: "Boot signed by Liverpool's number 9, Darwin Nuñez.",
        tags: ["Football", "Boot", "Darwin Nunez", "Liverpool", "Signed"],
        variants: [createVariant('boot-nunez', 40, 'Display Case', 3)],
        ...commonFields('boot-nunez', "Darwin Nuñez Signed Boot", 'boot')
    },
    {
        title: "Adam Lallana Signed Boot",
        body_html: "Boot hand-signed by Adam Lallana.",
        tags: ["Football", "Boot", "Adam Lallana", "Liverpool", "Signed"],
        variants: [createVariant('boot-lallana', 35, 'Display Case', 6)],
        ...commonFields('boot-lallana', "Adam Lallana Signed Boot", 'boot')
    },

    // --- SIGNED PHOTOS / PRINTS ---
    {
        title: "Treble Signed Premier League Winning Photo 18x12",
        body_html: "Iconic 18x12 photo celebrating the Premier League title, signed by three legends.",
        tags: ["Football", "Photo", "Liverpool", "Premier League", "Signed", "Multi-Signed"],
        variants: [createVariant('photo-treble', 90, 'Framed', 38)],
        ...commonFields('photo-treble', "Treble Signed Premier League Winning Photo", 'photo')
    },
    {
        title: "Trent & Robbo Dual Signed 16x12 Photo",
        body_html: "16x12 photo dual signed by full-back duo Trent Alexander-Arnold and Andy Robertson.",
        tags: ["Football", "Photo", "Liverpool", "Trent Alexander-Arnold", "Andy Robertson", "Signed"],
        variants: [createVariant('photo-trent-robbo', 60, 'Framed', 4)],
        ...commonFields('photo-trent-robbo', "Trent & Robbo Dual Signed Photo", 'photo')
    },
    {
        title: "Multi signed poster Trent Alexander-Arnold, Kostas Tsimikas and Thiago",
        body_html: "Large 42cm x 60cm poster signed by Trent, Tsimikas, and Thiago.",
        tags: ["Football", "Poster", "Liverpool", "Trent Alexander-Arnold", "Kostas Tsimikas", "Thiago", "Signed"],
        variants: [createVariant('poster-multi', 60, 'Unframed', 11)],
        ...commonFields('poster-multi', "Multi signed poster Trent Tsimikas Thiago", 'photo')
    },
    {
        title: "Adam Lallana and Jordan Henderson signed photo",
        body_html: "Photo signed by both Adam Lallana and Jordan Henderson.",
        tags: ["Football", "Photo", "Liverpool", "Adam Lallana", "Jordan Henderson", "Signed"],
        variants: [createVariant('photo-lallana-hendo', 60, 'Framed', 42)],
        ...commonFields('photo-lallana-hendo', "Adam Lallana and Jordan Henderson signed photo", 'photo')
    },
    {
        title: "Signed Jordan Henderson Changing of the Guard 12x8 Photo",
        body_html: "12x8 photo capturing the 'Changing of the Guard' moment, signed by Jordan Henderson.",
        tags: ["Football", "Photo", "Liverpool", "Jordan Henderson", "Signed"],
        variants: [createVariant('photo-hendo-guard', 50, 'Framed', 14)],
        ...commonFields('photo-hendo-guard', "Signed Jordan Henderson Changing of the Guard Photo", 'photo')
    },
    {
        title: "Signed Jordan Henderson confronting Costa 12x8 Photo",
        body_html: "Intense 12x8 photo of Henderson confronting Diego Costa, signed by Hendo.",
        tags: ["Football", "Photo", "Liverpool", "Jordan Henderson", "Signed"],
        variants: [createVariant('photo-hendo-costa', 50, 'Framed', 5)],
        ...commonFields('photo-hendo-costa', "Signed Jordan Henderson confronting Costa Photo", 'photo')
    },
    {
        title: "Cafu Signed 16X12 Montage Photo",
        body_html: "16x12 montage photo signed by Brazilian legend Cafu.",
        tags: ["Football", "Photo", "Brazil", "Cafu", "Legend", "Signed"],
        variants: [createVariant('photo-cafu-montage', 50, 'Framed', 12)],
        ...commonFields('photo-cafu-montage', "Cafu Signed 16X12 Montage Photo", 'photo')
    },
    {
        title: "CAFU SIGNED 12X8 WORLD CUP PHOTO",
        body_html: "12x8 photo of Cafu lifting the World Cup, hand-signed.",
        tags: ["Football", "Photo", "Brazil", "Cafu", "World Cup", "Signed"],
        variants: [createVariant('photo-cafu-wc-12x8', 50, 'Framed', 12)],
        ...commonFields('photo-cafu-wc-12x8', "CAFU SIGNED 12X8 WORLD CUP PHOTO", 'photo')
    },
    {
        title: "Cafu Signed 16X12 World Cup Photo",
        body_html: "Large 16x12 photo of Cafu with the World Cup trophy, signed.",
        tags: ["Football", "Photo", "Brazil", "Cafu", "World Cup", "Signed"],
        variants: [createVariant('photo-cafu-wc-16x12', 50, 'Framed', 5)],
        ...commonFields('photo-cafu-wc-16x12', "Cafu Signed 16X12 World Cup Photo", 'photo')
    },
    {
        title: "Cafu Signed Kissing UCL 10X8 Photo",
        body_html: "10x8 photo of Cafu kissing the Champions League trophy, signed.",
        tags: ["Football", "Photo", "AC Milan", "Cafu", "UCL", "Signed"],
        variants: [createVariant('photo-cafu-kiss', 50, 'Framed', 6)],
        ...commonFields('photo-cafu-kiss', "Cafu Signed Kissing UCL Photo", 'photo')
    },
    {
        title: "Cafu Signed 12X8 UCL Celebration Photo",
        body_html: "12x8 photo of Cafu celebrating UCL glory, signed.",
        tags: ["Football", "Photo", "AC Milan", "Cafu", "UCL", "Signed"],
        variants: [createVariant('photo-cafu-ucl-cel', 50, 'Framed', 4)],
        ...commonFields('photo-cafu-ucl-cel', "Cafu Signed UCL Celebration Photo", 'photo')
    },
    {
        title: "Signed A3 Andy Robertson & Trent Alexander-Arnold Metal Dibond Kop Art Print",
        body_html: "Premium A3 Metal Dibond 'Kop Art' print, signed by Robertson and Alexander-Arnold.",
        tags: ["Football", "Art Print", "Liverpool", "Trent Alexander-Arnold", "Andy Robertson", "Signed"],
        variants: [createVariant('art-robbo-trent', 70, 'Wall Mount', 9)],
        ...commonFields('art-robbo-trent', "Signed Andy Robertson Trent Kop Art Print", 'photo')
    },
    {
        title: "Signed A3 Darwin Nunez Metal Dibond Kop Art Print",
        body_html: "Premium A3 Metal Dibond 'Kop Art' print, signed by Darwin Nuñez.",
        tags: ["Football", "Art Print", "Liverpool", "Darwin Nunez", "Signed"],
        variants: [createVariant('art-nunez', 40, 'Wall Mount', 1)],
        ...commonFields('art-nunez', "Signed Darwin Nunez Metal Dibond Art Print", 'photo')
    },
    {
        title: "Thiago signed montage photo",
        body_html: "Montage photo hand-signed by Thiago Alcantara.",
        tags: ["Football", "Photo", "Liverpool", "Thiago", "Signed"],
        variants: [createVariant('photo-thiago', 35, 'Framed', 1)],
        ...commonFields('photo-thiago', "Thiago Signed Montage Photo", 'photo')
    },
    {
        title: "Boxing Super Middleweights Multi Signed Montage Photo",
        body_html: "Rare multi-signed montage photo featuring Boxing Super Middleweight legends.",
        tags: ["Boxing", "Photo", "Legends", "Multi-Signed", "Signed"],
        variants: [createVariant('photo-boxing-multi', 300, 'Framed', 11)],
        ...commonFields('photo-boxing-multi', "Boxing Super Middleweights Multi Signed Montage", 'photo')
    },
    {
        title: "Divock Origi UCL Signed Photo 16x12",
        body_html: "16x12 photo of Divock Origi in the Champions League, signed.",
        tags: ["Football", "Photo", "Liverpool", "Divock Origi", "UCL", "Signed"],
        variants: [createVariant('photo-origi-ucl', 30, 'Framed', 4)],
        ...commonFields('photo-origi-ucl', "Divock Origi UCL Signed Photo", 'photo')
    },
    {
        title: "Origi signed 16x12 Montage photo",
        body_html: "16x12 montage photo signed by Divock Origi.",
        tags: ["Football", "Photo", "Liverpool", "Divock Origi", "Signed"],
        variants: [createVariant('photo-origi-montage', 30, 'Framed', 14)],
        ...commonFields('photo-origi-montage', "Origi signed 16x12 Montage photo", 'photo')
    },
    {
        title: "Origi goal v Spurs UCL Final 16x12 photo",
        body_html: "16x12 photo of Origi's goal vs Spurs in the UCL Final, signed.",
        tags: ["Football", "Photo", "Liverpool", "Divock Origi", "UCL Final", "Signed"],
        variants: [createVariant('photo-origi-spurs', 30, 'Framed', 5)],
        ...commonFields('photo-origi-spurs', "Origi goal v Spurs UCL Final 16x12 photo", 'photo')
    },
    {
        title: "ORIGI 12X8 GOAL V SPURS UCL SIGNED PHOTO",
        body_html: "12x8 photo of Origi's UCL Final goal vs Spurs, signed.",
        tags: ["Football", "Photo", "Liverpool", "Divock Origi", "UCL Final", "Signed"],
        variants: [createVariant('photo-origi-spurs-sm', 30, 'Framed', 7)],
        ...commonFields('photo-origi-spurs-sm', "Origi 12x8 Goal v Spurs Signed Photo", 'photo')
    },
    {
        title: "Origi Goal V Barcelona Net View 16x12",
        body_html: "Iconic 16x12 'Net View' photo of Origi's goal vs Barcelona, signed.",
        tags: ["Football", "Photo", "Liverpool", "Divock Origi", "Barcelona", "Signed"],
        variants: [createVariant('photo-origi-barca', 30, 'Framed', 5)],
        ...commonFields('photo-origi-barca', "Origi Goal V Barcelona Net View 16x12", 'photo')
    },
    {
        title: "ORIGI 16 X 12 WITH UCL TROPHY SIGNED PHOTO",
        body_html: "16x12 photo of Divock Origi holding the UCL trophy, signed.",
        tags: ["Football", "Photo", "Liverpool", "Divock Origi", "UCL Trophy", "Signed"],
        variants: [createVariant('photo-origi-trophy', 30, 'Framed', 7)],
        ...commonFields('photo-origi-trophy', "Origi 16x12 With UCL Trophy Signed Photo", 'photo')
    },
    {
        title: "KOSTAS TSIMIKAS SIGNED PHOTO",
        body_html: "Photo hand-signed by the 'Greek Scouser' Kostas Tsimikas.",
        tags: ["Football", "Photo", "Liverpool", "Kostas Tsimikas", "Signed"],
        variants: [createVariant('photo-tsimikas', 30, 'Framed', 7)],
        ...commonFields('photo-tsimikas', "Kostas Tsimikas Signed Photo", 'photo')
    },
    {
        title: "Kostas Tsimikas away kit 16x12",
        body_html: "16x12 photo of Tsimikas in the away kit, signed.",
        tags: ["Football", "Photo", "Liverpool", "Kostas Tsimikas", "Signed"],
        variants: [createVariant('photo-tsimikas-away', 10, 'Framed', 12)],
        ...commonFields('photo-tsimikas-away', "Kostas Tsimikas Away Kit Signed Photo", 'photo')
    },
    {
        title: "Kostas Tsimikas with FA Cup 16x12",
        body_html: "16x12 photo of Tsimikas with the FA Cup, signed.",
        tags: ["Football", "Photo", "Liverpool", "Kostas Tsimikas", "FA Cup", "Signed"],
        variants: [createVariant('photo-tsimikas-fa', 10, 'Framed', 13)],
        ...commonFields('photo-tsimikas-fa', "Kostas Tsimikas with FA Cup Signed Photo", 'photo')
    },
    {
        title: "Kostas Tsimikas Hear Me Celebration 16x12",
        body_html: "16x12 photo of Tsimikas doing his 'Hear Me' celebration, signed.",
        tags: ["Football", "Photo", "Liverpool", "Kostas Tsimikas", "Signed"],
        variants: [createVariant('photo-tsimikas-cel', 10, 'Framed', 7)],
        ...commonFields('photo-tsimikas-cel', "Kostas Tsimikas Hear Me Celebration Photo", 'photo')
    },
    {
        title: "RIISE SIGNED A3 MONTAGE PHOTO",
        body_html: "A3 montage photo signed by John Arne Riise.",
        tags: ["Football", "Photo", "Liverpool", "John Arne Riise", "Signed"],
        variants: [createVariant('photo-riise-a3', 30, 'Framed', 2)],
        ...commonFields('photo-riise-a3', "Riise Signed A3 Montage Photo", 'photo')
    },
    {
        title: "Signed John Arne Riise 12x8 Photo",
        body_html: "12x8 photo signed by John Arne Riise.",
        tags: ["Football", "Photo", "Liverpool", "John Arne Riise", "Signed"],
        variants: [createVariant('photo-riise-12x8', 30, 'Framed', 91)],
        ...commonFields('photo-riise-12x8', "Signed John Arne Riise 12x8 Photo", 'photo')
    },
    {
        title: "TRENT ALEXANDER-ARNOLD SIGNED A3 MONTAGE PHOTO",
        body_html: "A3 montage photo signed by Trent Alexander-Arnold.",
        tags: ["Football", "Photo", "Liverpool", "Trent Alexander-Arnold", "Signed"],
        variants: [createVariant('photo-trent-montage', 30, 'Framed', 1)],
        ...commonFields('photo-trent-montage', "Trent Alexander-Arnold Signed A3 Montage", 'photo')
    },
    {
        title: "A3 Signed Trent Alexander-Arnold Photo in gold pen",
        body_html: "A3 photo signed by Trent Alexander-Arnold in premium gold pen.",
        tags: ["Football", "Photo", "Liverpool", "Trent Alexander-Arnold", "Signed", "Gold Pen"],
        variants: [createVariant('photo-trent-gold', 30, 'Framed', 3)],
        ...commonFields('photo-trent-gold', "A3 Signed Trent Alexander-Arnold Photo Gold Pen", 'photo')
    },
    {
        title: "Sami Hyypia signed photo",
        body_html: "Photo signed by Liverpool legend Sami Hyypiä.",
        tags: ["Football", "Photo", "Liverpool", "Sami Hyypia", "Signed"],
        variants: [createVariant('photo-sami', 30, 'Framed', 42)],
        ...commonFields('photo-sami', "Sami Hyypia Signed Photo", 'photo')
    },
    {
        title: "Sami Hyypiä CELEBRATION 10X8",
        body_html: "10x8 celebration photo signed by Sami Hyypiä.",
        tags: ["Football", "Photo", "Liverpool", "Sami Hyypia", "Signed"],
        variants: [createVariant('photo-sami-cel', 30, 'Framed', 41)],
        ...commonFields('photo-sami-cel', "Sami Hyypia Celebration 10x8 Photo", 'photo')
    },
    {
        title: "Sami Hyypiä v MILAN 10x8",
        body_html: "10x8 photo of Hyypiä vs Milan, signed.",
        tags: ["Football", "Photo", "Liverpool", "Sami Hyypia", "Signed"],
        variants: [createVariant('photo-sami-milan', 30, 'Framed', 48)],
        ...commonFields('photo-sami-milan', "Sami Hyypia v Milan 10x8 Photo", 'photo')
    },
    {
        title: "James Milner with EPL 16x12",
        body_html: "16x12 photo of James Milner with the Premier League trophy, signed.",
        tags: ["Football", "Photo", "Liverpool", "James Milner", "Premier League", "Signed"],
        variants: [createVariant('photo-milner-epl', 20, 'Framed', 1)],
        ...commonFields('photo-milner-epl', "James Milner with EPL 16x12 Signed", 'photo')
    },
    {
        title: "James Milner with UCL 16x12",
        body_html: "16x12 photo of James Milner with the Champions League trophy, signed.",
        tags: ["Football", "Photo", "Liverpool", "James Milner", "UCL", "Signed"],
        variants: [createVariant('photo-milner-ucl', 20, 'Framed', 2)],
        ...commonFields('photo-milner-ucl', "James Milner with UCL 16x12 Signed", 'photo')
    },
    {
        title: "Adam Lallana with EPL A3",
        body_html: "A3 photo of Adam Lallana with the Premier League trophy, signed.",
        tags: ["Football", "Photo", "Liverpool", "Adam Lallana", "Premier League", "Signed"],
        variants: [createVariant('photo-lallana-epl', 20, 'Framed', 32)],
        ...commonFields('photo-lallana-epl', "Adam Lallana with EPL A3 Signed", 'photo')
    },
    {
        title: "Adam Lallana with UCL A3",
        body_html: "A3 photo of Adam Lallana with the Champions League trophy, signed.",
        tags: ["Football", "Photo", "Liverpool", "Adam Lallana", "UCL", "Signed"],
        variants: [createVariant('photo-lallana-ucl', 20, 'Framed', 35)],
        ...commonFields('photo-lallana-ucl', "Adam Lallana with UCL A3 Signed", 'photo')
    },
    {
        title: "Signed Adam Lallana A4 Premier League Photo",
        body_html: "A4 photo of Adam Lallana celebrating the Premier League title, signed.",
        tags: ["Football", "Photo", "Liverpool", "Adam Lallana", "Premier League", "Signed"],
        variants: [createVariant('photo-lallana-a4', 20, 'Framed', 45)],
        ...commonFields('photo-lallana-a4', "Signed Adam Lallana A4 EPL Photo", 'photo')
    },
    {
        title: "Jan Molby A3 Montage Photo",
        body_html: "A3 montage photo signed by Jan Mølby.",
        tags: ["Football", "Photo", "Liverpool", "Jan Molby", "Signed"],
        variants: [createVariant('photo-molby-a3', 15, 'Framed', 31)],
        ...commonFields('photo-molby-a3', "Jan Molby A3 Montage Photo", 'photo')
    },
    {
        title: "Jimmy Case signed A3 montage",
        body_html: "A3 montage photo signed by Jimmy Case.",
        tags: ["Football", "Photo", "Liverpool", "Jimmy Case", "Signed"],
        variants: [createVariant('photo-case', 15, 'Framed', 10)],
        ...commonFields('photo-case', "Jimmy Case signed A3 montage", 'photo')
    },
    {
        title: "Bruce Grobbelaar signed A3 montage",
        body_html: "A3 montage photo signed by Bruce Grobbelaar.",
        tags: ["Football", "Photo", "Liverpool", "Bruce Grobbelaar", "Signed"],
        variants: [createVariant('photo-grobbelaar', 15, 'Framed', 6)],
        ...commonFields('photo-grobbelaar', "Bruce Grobbelaar signed A3 montage", 'photo')
    },
    {
        title: "Danny Murphy signed montage photo",
        body_html: "Montage photo signed by Danny Murphy.",
        tags: ["Football", "Photo", "Liverpool", "Danny Murphy", "Signed"],
        variants: [createVariant('photo-murphy', 15, 'Framed', 1)],
        ...commonFields('photo-murphy', "Danny Murphy signed montage photo", 'photo')
    },
    {
        title: "Phil Neal signed montage photo",
        body_html: "Montage photo signed by Phil Neal.",
        tags: ["Football", "Photo", "Liverpool", "Phil Neal", "Signed"],
        variants: [createVariant('photo-neal', 15, 'Framed', 4)],
        ...commonFields('photo-neal', "Phil Neal signed montage photo", 'photo')
    },
    {
        title: "Ronnie Whelan signed montage photo",
        body_html: "Montage photo signed by Ronnie Whelan.",
        tags: ["Football", "Photo", "Liverpool", "Ronnie Whelan", "Signed"],
        variants: [createVariant('photo-whelan', 12, 'Framed', 10)],
        ...commonFields('photo-whelan', "Ronnie Whelan signed montage photo", 'photo')
    },
    {
        title: "Signed Neville Southall 16x12 Montage Photograph",
        body_html: "16x12 montage photo signed by Everton legend Neville Southall.",
        tags: ["Football", "Photo", "Everton", "Neville Southall", "Signed"],
        variants: [createVariant('photo-southall-montage', 10, 'Framed', 19)],
        ...commonFields('photo-southall-montage', "Signed Neville Southall 16x12 Montage", 'photo')
    },
    {
        title: "Signed Neville Southall 16x12 Black and White Photograph",
        body_html: "16x12 black and white photo signed by Neville Southall.",
        tags: ["Football", "Photo", "Everton", "Neville Southall", "BW", "Signed"],
        variants: [createVariant('photo-southall-bw', 10, 'Framed', 6)],
        ...commonFields('photo-southall-bw', "Signed Neville Southall 16x12 BW Photo", 'photo')
    },
    {
        title: "Signed Neville Southall 12x8 Photograph",
        body_html: "12x8 photo signed by Neville Southall.",
        tags: ["Football", "Photo", "Everton", "Neville Southall", "Signed"],
        variants: [createVariant('photo-southall-12x8', 10, 'Framed', 18)],
        ...commonFields('photo-southall-12x8', "Signed Neville Southall 12x8 Photo", 'photo')
    },
    {
        title: "Signed Jan Molby 10x8 Photo",
        body_html: "10x8 photo signed by Jan Mølby.",
        tags: ["Football", "Photo", "Liverpool", "Jan Molby", "Signed"],
        variants: [createVariant('photo-molby-10x8', 10, 'Framed', 37)],
        ...commonFields('photo-molby-10x8', "Signed Jan Molby 10x8 Photo", 'photo')
    },
    {
        title: "Signed 12x8 Jan Molby Black and White Photo",
        body_html: "12x8 black and white photo signed by Jan Mølby.",
        tags: ["Football", "Photo", "Liverpool", "Jan Molby", "BW", "Signed"],
        variants: [createVariant('photo-molby-12x8-bw', 10, 'Framed', 30)],
        ...commonFields('photo-molby-12x8-bw', "Signed 12x8 Jan Molby BW Photo", 'photo')
    },
    {
        title: "Scott Carson signed 12x8 Photo",
        body_html: "12x8 photo signed by Scott Carson.",
        tags: ["Football", "Photo", "Liverpool", "Scott Carson", "Signed"],
        variants: [createVariant('photo-carson', 5, 'Framed', 53)],
        ...commonFields('photo-carson', "Scott Carson signed 12x8 Photo", 'photo')
    },
    {
        title: "Scott Carson 12x8 Signed Photo 1",
        body_html: "12x8 photo (variant 1) signed by Scott Carson.",
        tags: ["Football", "Photo", "Liverpool", "Scott Carson", "Signed"],
        variants: [createVariant('photo-carson-1', 5, 'Framed', 50)],
        ...commonFields('photo-carson-1', "Scott Carson 12x8 Signed Photo 1", 'photo')
    },
    // --- BOXING PHOTOS ---
    {
        title: "Signed Steve Collins 16x12 Photograph With Belt",
        body_html: "16x12 photo of Steve Collins with his belt, signed.",
        tags: ["Boxing", "Photo", "Steve Collins", "Signed"],
        variants: [createVariant('photo-collins-belt', 35, 'Framed', 2)],
        ...commonFields('photo-collins-belt', "Signed Steve Collins Photo With Belt", 'photo')
    },
    {
        title: "Signed Steve Collins 16x12 Photograph Fighting Eubank",
        body_html: "16x12 photo of Steve Collins fighting Eubank, signed.",
        tags: ["Boxing", "Photo", "Steve Collins", "Chris Eubank", "Signed"],
        variants: [createVariant('photo-collins-fight', 35, 'Framed', 2)],
        ...commonFields('photo-collins-fight', "Signed Steve Collins Photo Fighting Eubank", 'photo')
    },
    {
        title: "Glenn Irwin signed montage",
        body_html: "Montage photo signed by motorcycle racer Glenn Irwin.",
        tags: ["Motorsport", "Photo", "Glenn Irwin", "Signed"],
        variants: [createVariant('photo-irwin', 15, 'Framed', 50)],
        ...commonFields('photo-irwin', "Glenn Irwin signed montage", 'photo')
    }
]
