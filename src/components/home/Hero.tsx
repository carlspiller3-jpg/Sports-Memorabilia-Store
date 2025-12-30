import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
import { TrustIndicators } from "./TrustIndicators"

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/hero-banner.png"
          alt="Premium authenticated sports memorabilia"
          className="h-full w-full object-cover object-top"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 container mx-auto px-4 flex flex-col justify-center pb-12 pt-20 md:pt-0 md:pb-0">
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white w-fit">
            <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Certified Authentic</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Authentic. Rare. <br />
            <span className="text-gold">Legendary.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-white/80 max-w-xl leading-relaxed">
            The premier destination for authentic signed sports memorabilia. Explore a curated selection of verified artifacts from the world's greatest sporting legends.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/shop">
              <Button size="lg" className="h-12 sm:h-14 px-8 text-base sm:text-lg font-bold bg-gold hover:bg-gold/90 text-charcoal w-full sm:w-auto shadow-lg shadow-gold/20">
                Shop Collection
              </Button>
            </Link>
            <Link to="/verify">
              <Button size="lg" variant="outline" className="h-12 sm:h-14 px-8 text-base sm:text-lg font-bold border-white text-white hover:bg-white hover:text-charcoal w-full sm:w-auto backdrop-blur-sm bg-white/5">
                Verify Authenticity
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators - Restored Value Proposition */}
      <div className="relative z-10 w-full">
        <TrustIndicators />
      </div>
    </section>
  )
}
