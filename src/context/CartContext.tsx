
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Product, Variant } from '@/types/schema'

export interface CartItem {
    id: string // variantId
    product: Product
    variant: Variant
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
    addToCart: (product: Product, variant: Variant) => void
    removeFromCart: (variantId: string) => void
    cartTotal: number
    cartCount: number
    checkout: () => Promise<void>
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

    const addToCart = (product: Product, variant: Variant) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === variant.id)
            if (existing) {
                return prev.map(item =>
                    item.id === variant.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { id: variant.id, product, variant, quantity: 1 }]
        })
        setIsOpen(true)
    }

    const removeFromCart = (variantId: string) => {
        setItems(prev => prev.filter(item => item.id !== variantId))
    }

    const cartTotal = items.reduce((total, item) => total + (item.variant.price * item.quantity), 0)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0)

    const checkout = async () => {
        if (import.meta.env.VITE_USE_LIVE_SHOPIFY === 'true') {
            // Map items for Shopify
            const lineItems = items.map(item => ({
                variantId: item.variant.id, // Assuming variant.id is the Shopify GID
                quantity: item.quantity
            }))
            
            // Dynamic import to avoid SSR/Circ-dep issues if any, but standard import is fine here
            // We import standard at top, but let's assume imports are handled.
            // Actually I need to add the import at the top of the file.
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
