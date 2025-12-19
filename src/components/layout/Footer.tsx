import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-navy pt-8 pb-8 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link to="/" className="block">
                            <img
                                src="/logo-transparent.png"
                                alt="SportsSigned"
                                className="h-16 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed">
                            The world's premier destination for authenticated sports memorabilia.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4 text-white">Shop</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link to="/shop?category=shirts" className="hover:text-gold transition-colors">Signed Shirts</Link></li>
                            <li><Link to="/shop?category=boots" className="hover:text-gold transition-colors">Boots & Equipment</Link></li>
                            <li><Link to="/shop?category=photos" className="hover:text-gold transition-colors">Photos & Displays</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4 text-white">Support</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link to="/shipping" className="hover:text-gold transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/authenticity" className="hover:text-gold transition-colors">Authenticity Guarantee</Link></li>
                            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-lg mb-4 text-white">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm font-bold">
                        © 2024 Sports Memorabilia Store Limited.
                    </p>
                    <div className="flex gap-6">
                        <Link to="/privacy" className="text-white/40 hover:text-gold text-sm transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="text-white/40 hover:text-gold text-sm transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
