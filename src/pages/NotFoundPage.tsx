import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Helmet } from "react-helmet-async"

export function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-ivory">
            <Helmet>
                <title>Page Not Found | Sports Memorabilia Store</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <div className="text-center space-y-6 px-4">
                <h1 className="text-6xl md:text-8xl font-serif font-bold text-navy">404</h1>
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-charcoal">Page Not Found</h2>
                    <p className="text-stone/80 max-w-md mx-auto">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                </div>
                <Link to="/shop">
                    <Button size="lg" className="bg-gold text-navy hover:bg-gold/90 font-bold">
                        Return to Shop
                    </Button>
                </Link>
            </div>
        </div>
    )
}
