


import { useState } from "react"
import { ShoppingBag, Trash2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/Sheet"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/context/CartContext"
import { PLACEHOLDER_IMAGES } from "@/data/placeholders"

export function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, cartTotal, checkout, updateQuantity } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    // Helper to get image
    const getImage = (productId: string) => {
        return PLACEHOLDER_IMAGES[productId] || "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1974&auto=format&fit=crop"
    }
    
    const handleCheckout = async () => {
        setIsCheckingOut(true)
        await checkout()
        setIsCheckingOut(false)
    }

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-ivory">
                <SheetHeader className="px-6 py-4 border-b border-stone/10 flex flex-row items-center justify-between space-y-0">
                    <SheetTitle className="font-serif text-xl text-charcoal flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-gold" />
                        Your Cart
                    </SheetTitle>
                    {/* Close button is handled by Sheet primitive usually, but we can add custom if needed */}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                            <ShoppingBag className="w-16 h-16 text-stone/30" />
                            <p className="text-navy font-medium">Your cart is empty</p>
                            <Button variant="outline" onClick={closeCart}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-24 bg-white border border-stone/10 rounded-sm overflow-hidden flex-shrink-0">
                                    <img
                                        src={(item.product.images && item.product.images.length > 0) ? item.product.images[0] : getImage(item.product.id)}
                                        alt={item.product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h4 className="font-serif font-bold text-charcoal line-clamp-2 text-sm">
                                            {item.product.title}
                                        </h4>
                                        <p className="text-xs text-navy/60 mt-1">
                                            {item.variant.option1 !== 'Default' ? item.variant.option1 : 'Standard'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-stone/20 rounded-md">
                                            <button 
                                                className="px-2 py-1 text-stone-500 hover:bg-stone/5"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-sm font-medium text-charcoal">{item.quantity}</span>
                                            <button 
                                                className="px-2 py-1 text-stone-500 hover:bg-stone/5"
                                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gold">£{(item.variant.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-stone-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-white border-t border-stone/10 space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-navy/60">
                                <span>Subtotal</span>
                                <span>£{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-navy/60">
                                <span>Shipping</span>
                                <span className="text-navy/60 font-medium">Calculated at checkout</span>
                            </div>
                            <div className="flex justify-between text-lg font-serif font-bold text-charcoal pt-2 border-t border-stone/10">
                                <span>Total</span>
                                <span>£{cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button 
                            className="w-full h-12 text-lg shadow-lg shadow-gold/20" 
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                        >
                            {isCheckingOut ? 'Redirecting...' : 'Checkout Securely'}
                        </Button>
                        <p className="text-[10px] text-center text-navy/40">
                            Secure checkout powered by Stripe. Encrypted & Safe.
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
