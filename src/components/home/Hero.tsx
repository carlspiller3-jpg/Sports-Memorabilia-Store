import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
import { ShieldCheck, Box, Truck, Fingerprint } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full h-full min-h-[500px] flex flex-col overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 bg-navy">
        <img
          src="/hero-banner.png"
          alt="Premium authenticated sports memorabilia"
          className="h-full w-full object-contain object-right opacity-90"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 30%, black)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%, black)' 
          }}
        />
        {/* Deep Gradient Overlay - Ensures text legibility and further smooths the transition */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative flex-1 container mx-auto px-2 sm:px-4 flex flex-col justify-center h-full pt-16 pb-12 sm:pt-20">
        <div className="max-w-[60%] sm:max-w-3xl space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000 text-left">
          {/* Offer-Led Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold w-fit">
            <Fingerprint className="w-3 h-3 shrink-0" />
            <span className="leading-tight">100% Real. Guaranteed.</span>
          </div>

          {/* Headline: The Offer */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="font-serif text-3xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.95] sm:leading-[0.95]">
              Own the Moment.<br />
              Guaranteed for <span className="underline decoration-gold/50 underline-offset-4 sm:underline-offset-8 text-gold">Life.</span>
            </h1>
            <p className="text-[10px] sm:text-xl text-ivory/80 max-w-2xl leading-relaxed font-light">
              Official signed sports memorabilia. Direct athlete access, handcrafted UK framing with clear Perspex glaze, and smart NFC tag verification.
            </p>
          </div>

          {/* The Value Stack: Stacking the Benefits */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/10 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-widest">100% Wet Ink Signings</p>
                <p className="text-[8px] sm:text-[9px] text-ivory/50">Direct Athlete Access</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Fingerprint className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-widest">NFC Smart Tagged</p>
                <p className="text-[8px] sm:text-[9px] text-ivory/50">Instant Verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-widest">Framed and Ready to Hang</p>
                <p className="text-[8px] sm:text-[9px] text-ivory/50">Handcrafted UK Frame</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="h-10 sm:h-14 px-4 sm:px-10 text-[9px] sm:text-sm font-bold bg-gold hover:bg-gold/90 text-navy w-full shadow-2xl shadow-gold/20 rounded-sm uppercase tracking-widest">
                Browse The Collection
              </Button>
            </Link>
            <Link to="/verify" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-10 sm:h-14 px-4 sm:px-10 text-[9px] sm:text-sm font-bold border-white/20 text-white hover:bg-white hover:text-navy w-full backdrop-blur-sm bg-white/5 rounded-sm uppercase tracking-widest">
                Verify An NFC Tag
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
