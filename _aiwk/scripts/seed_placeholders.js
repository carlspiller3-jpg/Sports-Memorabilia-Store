
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://roajepffeplwuvfmntqr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvYWplcGZmZXBsd3V2Zm1udHFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTk3NzksImV4cCI6MjA4MDEzNTc3OX0.OCJb-Fh3ZEfmdMyfXQOEFYSu8IvA4CGPD5cCLYdyvtE'

const supabase = createClient(supabaseUrl, supabaseKey)

const products = [
    {
        title: "A3 Signed Trent Alexander-Arnold Photo in gold pen",
        handle: "a3-signed-trent-alexander-arnold-photo-gold-pen",
        description: "Beautiful photo of Liverpool Fan Favourite, Trent Alexander-Arnold. This beautiful photo of Trent Alexander-Arnold, capturing his essence as a Liverpool fan favourite.",
        price: 22.99,
        image_url: "https://fibersportsmemorabilia.com/wp-content/uploads/2023/11/IMG_0126-300x300.jpeg",
        tags: ["Liverpool", "Signed Photo", "Trent Alexander-Arnold"],
        product_type: "photo"
    },
    {
        title: "Adam Lallana with EPL A3",
        handle: "adam-lallana-with-epl-a3",
        description: "Adam Lallana EPL A3 Photo – A Tribute to a Masterful Midfielder. Celebrate the career of Adam Lallana with this exclusive A3 photo.",
        price: 19.99,
        image_url: "https://fibersportsmemorabilia.com/wp-content/uploads/2024/08/Adam-Lalana-with-EPL-A3.jpg",
        tags: ["Liverpool", "Signed Photo", "Adam Lallana"],
        product_type: "photo"
    },
    {
        title: "Adam Lallana with UCL A3",
        handle: "adam-lallana-with-ucl-a3",
        description: "Adam Lallana UCL A3 Photo – A Tribute to a Masterful Midfielder. Celebrate the career of Adam Lallana with this exclusive A3 photo.",
        price: 19.99,
        image_url: "https://fibersportsmemorabilia.com/wp-content/uploads/2024/08/Adam-Lalana-with-UCL-A3.jpg",
        tags: ["Liverpool", "Signed Photo", "Adam Lallana"],
        product_type: "photo"
    }
]

async function seed() {
    console.log('Seeding products...')

    for (const p of products) {
        // 1. Insert Product
        const { data: product, error: prodError } = await supabase
            .from('products')
            .upsert({
                title: p.title,
                handle: p.handle,
                body_html: p.description,
                vendor: "Fiber Sports Memorabilia",
                product_type: p.product_type,
                status: 'active',
                tags: p.tags
            }, { onConflict: 'handle' })
            .select()
            .single()

        if (prodError) {
            console.error('Error inserting product:', p.title, prodError)
            continue
        }

        console.log('Inserted product:', product.title)

        // 2. Insert Variant
        const { error: varError } = await supabase
            .from('variants')
            .upsert({
                product_id: product.id,
                title: "Default Title",
                price: p.price,
                sku: `SKU-${Math.floor(Math.random() * 10000)}`,
                inventory_quantity: 10,
                option1: "Default"
            })

        if (varError) {
            console.error('Error inserting variant for:', product.title, varError)
        } else {
            console.log('Inserted variant for:', product.title)
        }
    }
    console.log('Done!')
}

seed()
