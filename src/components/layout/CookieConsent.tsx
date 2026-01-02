
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookie_consent')
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-charcoal border-t border-gold/20 p-4 md:p-6 z-[60] shadow-2xl animate-in slide-in-from-bottom duration-500">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-ivory/90 text-sm md:text-base flex-1">
                    <p>
                        We use cookies to enhance your experience, analyse site traffic, and deliver personalised content.
                        By clicking "Accept", you consent to our use of cookies.
                        Read our <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link> and <Link to="/cookies" className="text-gold hover:underline">Cookie Policy</Link>.
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <button
                        onClick={handleAccept}
                        className="bg-gold hover:bg-gold/90 text-navy font-semibold px-6 py-2 rounded-sm transition-colors text-sm"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}
