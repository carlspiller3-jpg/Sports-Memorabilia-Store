import { Link } from "react-router-dom"

const categories = [
    {
        id: 1,
        title: "Signed Shirts",
        description: "Authentic match-worn and signed football shirts from legendary players and unforgettable moments.",
        image: "https://images.unsplash.com/photo-1518605348435-2996d2606926?q=80&w=1936&auto=format&fit=crop",
        link: "/shop?category=shirt",
    },
    {
        id: 2,
        title: "Signed Boots & Gloves",
        description: "Game-worn boots and championship gloves signed by sporting icons across football and boxing.",
        image: "https://images.unsplash.com/photo-1549719386-74dfc441d82c?q=80&w=1887&auto=format&fit=crop",
        link: "/shop?category=boot",
    },
    {
        id: 3,
        title: "Signed Photos",
        description: "Premium framed photographs capturing iconic sporting moments, personally signed by the athletes.",
        image: "https://images.unsplash.com/photo-1533575135643-0c093122c2b3?q=80&w=1935&auto=format&fit=crop",
        link: "/shop?category=photo",
    },
    {
        id: 4,
        title: "Gift Sets",
        description: "Curated gift collections for corporate events, milestones, and unforgettable celebrations.",
        image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=2070&auto=format&fit=crop",
        link: "/shop",
    },
]

export function ProductCategories() {
    return (
        <section id="categories" className="bg-white py-16 sm:py-20 lg:py-28">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-lg text-charcoal/70">
                        From signed shirts to bespoke gift sets, discover authenticated memorabilia that tells a story.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.link}
                            className="group overflow-hidden rounded-sm border border-stone/20 bg-white hover:shadow-xl transition-all duration-300"
                        >
                            {/* Category Image */}
                            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-serif font-bold text-white mb-2">{category.title}</h3>
                                    <p className="text-white/80 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{category.description}</p>
                                    <span className="text-sm font-semibold text-gold inline-flex items-center gap-2">
                                        Shop Now
                                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>


                        </Link>
                    ))}
                </div>

                {/* Optional CTA */}
                <div className="mt-12 text-center">
                    <p className="text-charcoal/60 text-sm">
                        Want to see something specific?{" "}
                        <a
                            href="mailto:info@sportsmemorabiliastore.com"
                            className="font-semibold text-gold hover:text-gold/80 transition-colors"
                        >
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </section>
    )
}
