import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col space-y-8">
            {/* Trust badge */}
            <div className="inline-flex items-center space-x-2 rounded-full border border-gold bg-gold/10 px-4 py-2 text-sm font-medium text-navy w-fit">
              <svg
                className="h-4 w-4 text-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>100% Authenticated Memorabilia</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-navy sm:text-5xl lg:text-6xl">
                Premium Sports Memorabilia.{" "}
                <span className="text-gold">Authenticated. Expertly Framed.</span>
              </h1>
              <p className="text-lg text-charcoal/80 sm:text-xl max-w-2xl">
                Luxury gifting experiences people are proud to give. Every piece comes with a Certificate of Authenticity and museum-grade framing.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <Button
                  size="lg"
                  className="text-base font-semibold w-full sm:w-auto"
                >
                  Shop Collection
                </Button>
              </Link>
              <Link to="/verify">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base font-semibold border-navy text-navy hover:bg-navy hover:text-white w-full sm:w-auto"
                >
                  Verify Authenticity
                </Button>
              </Link>
            </div>

            {/* Trust elements */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-charcoal/70">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Lifetime Authenticity Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span>Museum-Grade Framing</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:order-last">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop"
                alt="Premium authenticated sports memorabilia collection featuring signed jerseys and framed photographs"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-navy/10 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
