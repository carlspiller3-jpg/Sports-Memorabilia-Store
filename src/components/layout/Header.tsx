

import { ShoppingBag, Search, Menu, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Link } from "react-router-dom"

export function Header() {
    const { openCart, cartCount } = useCart()
    const { user } = useAuth()

    const headerBg = "bg-ivory border-navy/5 text-navy shadow-sm"

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b py-4 print:hidden ${headerBg}`}>
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Sheet>
                    <SheetTrigger asChild>
                        <button className="md:hidden p-2 hover:bg-white/10 rounded-md transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="bg-ivory border-r border-stone/10">
                        <nav className="flex flex-col gap-6 mt-8 text-xl font-medium text-navy uppercase tracking-wider">
                            <Link to="/" className="hover:text-gold transition-colors">Home</Link>

                            <div className="h-px bg-stone/10 my-1" />

                            <Link to="/shop/football" className="hover:text-gold transition-colors font-bold">Football</Link>
                            <Link to="/shop/boxing" className="hover:text-gold transition-colors font-bold">Boxing</Link>
                            <Link to="/shop/f1" className="hover:text-gold transition-colors font-bold">F1</Link>
                            <Link to="/drops" className="text-gold hover:text-charcoal transition-colors font-black">Drops</Link>

                            <div className="h-px bg-stone/10 my-1" />

                            <Link to="/verify" className="text-base text-navy/70 hover:text-navy transition-colors">Verify Authenticity</Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <div className="flex-shrink-0 flex items-center z-[101] relative">
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo-transparent.png"
                            alt="Sports Memorabilia Store"
                            className="h-16 w-auto object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-navy">
                    <Link to="/shop/football" className="hover:text-gold transition-colors">Football</Link>
                    <Link to="/shop/boxing" className="hover:text-gold transition-colors">Boxing</Link>
                    <Link to="/shop/f1" className="hover:text-gold transition-colors">F1</Link>
                    <Link to="/drops" className="hover:text-gold transition-colors">Drops</Link>
                    <Link to="/verify" className="hover:text-gold transition-colors opacity-70">Verify</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2 hover:text-gold transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    <a href={user ? "/account" : "/login"} className="p-2 hover:text-gold transition-colors">
                        <User className="w-5 h-5" />
                    </a>

                    <button
                        onClick={openCart}
                        data-cart-trigger
                        className="hidden md:block p-2 hover:text-gold transition-colors relative"
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
