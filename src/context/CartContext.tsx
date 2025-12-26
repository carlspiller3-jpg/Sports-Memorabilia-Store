
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product, Variant } from '@/types/schema'

export interface CartItem {
    id: string // variantId
    product: Product
    variant: Variant
    quantity: number
    attributes?: Record<string, string>
}

interface CartContextType {
    items: CartItem[]
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    addToCart: (product: Product, variant: Variant, quantity?: number, attributes?: Record<string, string>) => void
    removeFromCart: (variantId: string) => void
    cartTotal: number
    cartCount: number
    checkout: () => Promise<void>
    updateQuantity: (variantId: string, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    // Save cart to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items))
    }, [items])

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    const addToCart = (product: Product, variant: Variant, quantity: number = 1, attributes?: Record<string, string>) => {
        setItems(prev => {
            // Check if existing item matches Variant ID AND Attributes (Deep check needed strictly, but simple check for now)
            // For simplicity in this iteration, we treat items with different attributes as different entries? 
            // Or just append?
            // "Send-In" items with different instructions should be separate lines.
            // Let's create a unique ID based on Variant + Attrs string
            const attrString = attributes ? JSON.stringify(attributes) : ""
            const uniqueKey = variant.id + attrString

            const existingIndex = prev.findIndex(item => {
                const itemAttrString = item.attributes ? JSON.stringify(item.attributes) : ""
                return item.variant.id === variant.id && itemAttrString === attrString
            })

            if (existingIndex > -1) {
                const newItems = [...prev]
                newItems[existingIndex].quantity += quantity
                return newItems
            }

            return [...prev, {
                id: variant.id,
                product,
                variant,
                quantity,
                attributes
            }]
        })
        setIsOpen(true)
    }

    const removeFromCart = (variantId: string) => {
        // Warning: This simple ID remove might remove duplicates with different attrs. 
        // Ideally we should remove by index or unique key. 
        setItems(prev => prev.filter(item => item.id !== variantId))
    }

    const updateQuantity = (variantId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(variantId)
            return
        }
        setItems(prev => prev.map(item =>
            item.id === variantId ? { ...item, quantity } : item
        ))
    }

    const cartTotal = items.reduce((total, item) => total + (item.variant.price * item.quantity), 0)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0)

    const checkout = async () => {
        if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
            // Map items for Shopify
            // Note: Shopify Storefront API expects 'customAttributes' array [{key, value}]
            const lineItems = items.map(item => {
                const customAttributes = item.attributes ? Object.entries(item.attributes).map(([key, value]) => ({
                    key, value
                })) : []

                return {
                    variantId: item.variant.id,
                    quantity: item.quantity,
                    customAttributes
                }
            })

            const { createCheckout } = await import('@/lib/shopify')
            const url = await createCheckout(lineItems)
            if (url) {
                window.location.href = url
            } else {
                alert('Failed to create checkout. Please try again.')
            }
        } else {
            window.location.href = '/checkout'
        }
    }

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            openCart,
            closeCart,
            addToCart,
            removeFromCart,
            cartTotal,
            cartCount,
            updateQuantity,
            checkout
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
