
import { Button } from "@/components/ui/Button"
import { TrustIndicators } from "./TrustIndicators"

export function Hero() {
  return (
    <section className="bg-[#F9F9F7] w-full min-h-screen lg:min-h-0 lg:h-full flex flex-col justify-between pt-4 pb-0 lg:py-0 relative">
      <div className="container mx-auto px-4 flex-1 flex items-center justify-center pt-2 lg:pt-2">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-20 items-center w-full">

          {/* Left Column: Content */}
          <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 order-1 lg:order-1 pt-4 lg:pt-0 pb-2 lg:pb-12">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-navy/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white w-fit shadow-lg">
              <svg className="h-4 w-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Authenticated Memorabilia</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.1]">
              Own a Piece of <br />
              <span className="text-gold">Sporting History</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-charcoal/80 max-w-xl leading-relaxed">
              Store Opens <strong>January 2026</strong>. Be the first inside.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="#waitlist">
                <Button size="lg" className="h-12 sm:h-14 px-8 text-base sm:text-lg font-bold bg-gold hover:bg-gold/90 text-charcoal w-full sm:w-auto shadow-lg shadow-gold/20">
                  Join the Drop Waitlist
                </Button>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Image Container */}
          <div className="relative order-2 lg:order-2 w-full aspect-square sm:h-[400px] lg:h-auto lg:max-h-[65vh] flex items-center justify-center">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-navy/5">
              <img
                src="/hero-banner.png"
                alt="Premium authenticated sports memorabilia vault"
                className="h-full w-full object-cover object-center transform hover:scale-105 transition-transform duration-1000"
              />
              {/* Subtle Overlay to ensure depth */}
              <div className="absolute inset-0 bg-navy/10 ring-1 ring-inset ring-white/10" />
            </div>

            {/* Decorative background blur element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gold/20 blur-[100px] opacity-30 rounded-full" />
          </div>

        </div>
      </div>
      <div className="w-full">
        <TrustIndicators />
      </div>
    </section>
  )
}
