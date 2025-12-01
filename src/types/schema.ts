export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Product {
    id: string
    title: string
    body_html: string | null
    vendor: string | null
    product_type: string | null
    handle: string
    status: 'active' | 'draft' | 'archived'
    tags: string[] | null
    created_at: string
    updated_at: string
    variants?: Variant[]
    options?: Option[]
    images?: string[] // Virtual field for now
}

export interface Variant {
    id: string
    product_id: string
    title: string
    price: number
    sku: string | null
    inventory_quantity: number
    option1: string | null
    option2: string | null
    smart_contract_address: string | null
    token_id: string | null
    created_at: string
    updated_at: string
}

export interface Option {
    id: string
    product_id: string
    name: string
    position: number
    values: string[]
}

export interface Database {
    public: {
        Tables: {
            products: {
                Row: Product
                Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'variants' | 'options' | 'images'>
                Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'variants' | 'options' | 'images'>>
            }
            variants: {
                Row: Variant
                Insert: Omit<Variant, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Variant, 'id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}
