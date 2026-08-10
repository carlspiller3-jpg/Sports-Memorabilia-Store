import { Home, Search, ShoppingCart, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export function MobileNav() {
    const location = useLocation()
    const { items } = useCart()
    const { user } = useAuth()
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Shop", href: "/shop" },
        { icon: ShoppingCart, label: "Cart", href: "#", badge: cartCount, onClick: "openCart" },
        { icon: User, label: user ? "Account" : "Log In", href: user ? "/account" : "/login" },
    ]

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault()
        // Trigger cart drawer open
        const cartButton = document.querySelector('[data-cart-trigger]') as HTMLButtonElement
        if (cartButton) {
            cartButton.click()
        }
    }

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone/10 z-50 safe-area-bottom print:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href
                    const Icon = item.icon

                    if (item.onClick === "openCart") {
                        return (
                            <button
                                key={item.label}
                                onClick={handleCartClick}
                                className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${isActive ? "text-gold" : "text-navy/60"
                                    }`}
                            >
                                <div className="relative">
                                    <Icon className="w-6 h-6" />
                                    {item.badge && item.badge > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={item.label}
                            to={item.href}
                            className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${isActive ? "text-gold" : "text-navy/60"
                                }`}
                        >
                            <div className="relative">
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
