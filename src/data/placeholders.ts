
import type { Product } from "@/types/schema"

export const PLACEHOLDER_PRODUCTS: Product[] = [
    {
        id: "placeholder-1",
        title: "A3 Signed Trent Alexander-Arnold Photo in gold pen",
        handle: "a3-signed-trent-alexander-arnold-photo-gold-pen",
        body_html: "Beautiful photo of Liverpool Fan Favourite, Trent Alexander-Arnold. This beautiful photo of Trent Alexander-Arnold, capturing his essence as a Liverpool fan favourite. Hand signed in premium gold marker during a private signing session. Comes with full NFC digital authentication and photo proof of signing.",
        vendor: "Fiber Sports Memorabilia",
        product_type: "photo",
        status: "active",
        tags: ["Liverpool", "Signed Photo", "Trent Alexander-Arnold"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seo_title: "Trent Alexander-Arnold Signed Photo | Liverpool NFC",
        seo_description: "Authentic Trent Alexander-Arnold signed photo from Liverpool. Professionally framed with UV-protective glass. Includes NFC digital authentication.",
        variants: [
            {
                id: "var-1",
                product_id: "placeholder-1",
                title: "Default Title",
                price: 22.99,
                sku: "SKU-TAA-001",
                inventory_quantity: 10,
                option1: "Default",
                option2: null,
                smart_contract_address: null,
                token_id: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ],
    },
    {
        id: "placeholder-2",
        title: "Adam Lallana with EPL A3",
        handle: "adam-lallana-with-epl-a3",
        body_html: "Adam Lallana EPL A3 Photo – A Tribute to a Masterful Midfielder. Celebrate the career of Adam Lallana with this exclusive A3 photo. A perfect piece for any Liverpool collector.",
        vendor: "Fiber Sports Memorabilia",
        product_type: "photo",
        status: "active",
        tags: ["Liverpool", "Signed Photo", "Adam Lallana"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seo_title: "Adam Lallana Premier League Trophy Photo | Liverpool",
        seo_description: "Signed Adam Lallana photo with Premier League trophy. Professionally framed Liverpool memorabilia with NFC authentication. Limited edition.",
        variants: [
            {
                id: "var-2",
                product_id: "placeholder-2",
                title: "Default Title",
                price: 19.99,
                sku: "SKU-AL-EPL",
                inventory_quantity: 10,
                option1: "Default",
                option2: null,
                smart_contract_address: null,
                token_id: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]
    },
    {
        id: "placeholder-3",
        title: "Adam Lallana with UCL A3",
        handle: "adam-lallana-with-ucl-a3",
        body_html: "Adam Lallana UCL A3 Photo – A Tribute to a Masterful Midfielder. Celebrate the career of Adam Lallana with this exclusive A3 photo capturing his Champions League success.",
        vendor: "Fiber Sports Memorabilia",
        product_type: "photo",
        status: "active",
        tags: ["Liverpool", "Signed Photo", "Adam Lallana"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seo_title: "Adam Lallana Champions League Trophy Photo | Liverpool",
        seo_description: "Signed Adam Lallana photo with Champions League trophy. Professionally framed Liverpool memorabilia with NFC authentication. Limited edition.",
        variants: [
            {
                id: "var-3",
                product_id: "placeholder-3",
                title: "Default Title",
                price: 19.99,
                sku: "SKU-AL-UCL",
                inventory_quantity: 10,
                option1: "Default",
                option2: null,
                smart_contract_address: null,
                token_id: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]
    }
]

export const PLACEHOLDER_IMAGES: Record<string, string> = {
    "placeholder-1": "https://fibersportsmemorabilia.com/wp-content/uploads/2023/11/IMG_0126-300x300.jpeg",
    "placeholder-2": "https://fibersportsmemorabilia.com/wp-content/uploads/2024/08/Adam-Lalana-with-EPL-A3.jpg",
    "placeholder-3": "https://fibersportsmemorabilia.com/wp-content/uploads/2024/08/Adam-Lalana-with-UCL-A3.jpg"
}
