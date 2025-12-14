

import { ShoppingBag, Search, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export function Header() {
    const { openCart, cartCount } = useCart()
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-stone/30 bg-ivory/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Mobile Menu */}
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="md:hidden p-2 hover:bg-stone/20 rounded-md">
                            <Menu className="w-5 h-5 text-navy" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <nav className="flex flex-col gap-6 mt-8 text-lg font-medium text-navy">
                            <a href="/" className="hover:text-gold transition-colors">Home</a>
                            <a href="/shop" className="hover:text-gold transition-colors">Shop</a>
                            <a href="/collections" className="hover:text-gold transition-colors">Collections</a>
                            <a href="/about" className="hover:text-gold transition-colors">Our Story</a>
                            <a href="/verify" className="hover:text-gold transition-colors">Verify Authenticity</a>
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gold rounded-sm flex items-center justify-center text-navy font-bold text-xl font-serif">
                            S
                        </div>
                        <span className="font-serif text-xl md:text-2xl font-bold text-navy tracking-tight">
                            Sports<span className="text-gold">Signed</span>
                        </span>
                    </a>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy/80">
                    <a href="/shop" className="hover:text-gold transition-colors">Shop</a>
                    <a href="/collections" className="hover:text-gold transition-colors">Collections</a>
                    <a href="/about" className="hover:text-gold transition-colors">Our Story</a>
                    <a href="/verify" className="hover:text-gold transition-colors">Verify Authenticity</a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2 hover:text-gold transition-colors text-navy">
                        <Search className="w-5 h-5" />
                    </button>
                    
                    <a href={user ? "/account" : "/login"} className="p-2 hover:text-gold transition-colors text-navy">
                         <User className="w-5 h-5" />
                    </a>

                    <button
                        onClick={openCart}
                        data-cart-trigger
                        className="hidden md:block p-2 hover:text-gold transition-colors text-navy relative"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}
