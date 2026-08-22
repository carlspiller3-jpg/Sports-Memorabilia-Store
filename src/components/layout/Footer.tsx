import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-navy pt-12 pb-8 text-white print:hidden border-t border-gold/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link to="/" className="block">
                            <img
                                src="/logo-white-text.png"
                                alt="Sports Memorabilia Store"
                                className="h-16 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-white/70 text-xs leading-relaxed">
                            Setting the new standard in sports memorabilia. Every item delivered fully framed, sealed, and verified.
                        </p>
                        <div className="flex items-center gap-2 text-gold text-xs font-semibold pt-1">
                            <Mail className="w-4 h-4 shrink-0" />
                            <a href="mailto:support@sportssigned.com" className="hover:underline">support@sportssigned.com</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-base mb-4 text-gold uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-2 text-xs text-white/70">
                            <li><Link to="/shop?category=shirts" className="hover:text-gold transition-colors">Signed Shirts</Link></li>
                            <li><Link to="/shop?category=boots" className="hover:text-gold transition-colors">Boots and Equipment</Link></li>
                            <li><Link to="/shop?category=photos" className="hover:text-gold transition-colors">Photos and Displays</Link></li>
                            <li><Link to="/drops" className="hover:text-gold transition-colors">Exclusive Drops</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-base mb-4 text-gold uppercase tracking-wider">Support and Verification</h4>
                        <ul className="space-y-2 text-xs text-white/70">
                            <li><Link to="/hub" className="hover:text-gold transition-colors">Knowledge Hub</Link></li>
                            <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
                            <li><Link to="/shipping" className="hover:text-gold transition-colors">Shipping and Returns</Link></li>
                            <li><Link to="/verify" className="hover:text-gold transition-colors">NFC Smart Tag Verification</Link></li>
                            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-serif font-bold text-base mb-4 text-gold uppercase tracking-wider">Connect</h4>
                        <div className="flex gap-3 mb-4">
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-gold hover:text-navy transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                        <p className="text-[10px] text-white/40 leading-normal">
                            UK Customer Care Hotline and Corporate Account Desk open Monday to Friday.
                        </p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div className="flex flex-col gap-1 items-center md:items-start">
                        <p className="text-white/60 text-xs font-bold">
                            © 2026 SPORTS MEMORABILIA STORE LIMITED. Registered in England and Wales.
                        </p>
                        <p className="text-white/30 text-[10px]">
                            Company Registration: 16854974 • VAT Registration: GB514026140 • Registered Office: 189 Greenwood, Walters Ash, High Wycombe, HP14 4XF
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-xs">
                        <Link to="/privacy" className="text-white/50 hover:text-gold transition-colors">Privacy Policy</Link>
                        <Link to="/cookies" className="text-white/50 hover:text-gold transition-colors">Cookie Policy</Link>
                        <Link to="/terms" className="text-white/50 hover:text-gold transition-colors">Terms of Service</Link>
                        <Link to="/refund-policy" className="text-white/50 hover:text-gold transition-colors">Refund Policy</Link>
                        <Link to="/shipping" className="text-white/50 hover:text-gold transition-colors">Shipping Returns</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
