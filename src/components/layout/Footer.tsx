import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-navy text-ivory pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl font-bold text-gold">Sports Memorabilia Store</h3>
                        <p className="text-stone/80 text-sm leading-relaxed">
                            Premium signed sports memorabilia, authentically verified and beautifully framed.
                            Preserving legends, celebrating history.
                        </p>
                    </div>

                    {/* Shop */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-ivory">Shop</h4>
                        <ul className="space-y-2 text-sm text-stone/80">
                            <li><a href="/shop" className="hover:text-gold transition-colors">Framed Shirts</a></li>
                            <li><a href="/shop" className="hover:text-gold transition-colors">Boots & Gloves</a></li>
                            <li><a href="/shop" className="hover:text-gold transition-colors">Framed Photos</a></li>
                            <li><a href="/shop" className="hover:text-gold transition-colors">New Arrivals</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-ivory">Support</h4>
                        <ul className="space-y-2 text-sm text-stone/80">
                            <li><a href="/about" className="hover:text-gold transition-colors">Our Story</a></li>
                            <li><a href="/verify" className="hover:text-gold transition-colors">Verify Authenticity</a></li>
                            <li><a href="/shipping" className="hover:text-gold transition-colors">Shipping & Returns</a></li>
                            <li><a href="/contact" className="hover:text-gold transition-colors">Contact Us</a></li>
                            <li><a href="/faq" className="hover:text-gold transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-serif text-lg text-ivory">Stay Connected</h4>
                        <p className="text-sm text-stone/80">Subscribe for exclusive drops and private signings.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-navy border border-stone/20 rounded-sm px-4 py-2 text-sm text-ivory placeholder:text-stone/40 focus:outline-none focus:border-gold w-full"
                            />
                            <button className="bg-gold text-navy px-4 py-2 rounded-sm text-sm font-medium hover:bg-gold/90 transition-colors">
                                Join
                            </button>
                        </div>
                        <div className="flex gap-4 pt-4 text-stone/60">
                            <a href="#" className="hover:text-gold transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="hover:text-gold transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>
                </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-stone/60 text-sm">
                            © 2024 SportsSigned. All rights reserved. <span className="text-xs opacity-50 ml-2">v1.4.0 - CLEAN BUILD</span>
                        </p>
                        <div className="flex gap-6">
                            <Link to="/privacy" className="text-stone/60 hover:text-gold text-sm transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-stone/60 hover:text-gold text-sm transition-colors">Terms of Service</Link>
                        </div>
                    </div>
            </div>
        </footer>
    )
}
