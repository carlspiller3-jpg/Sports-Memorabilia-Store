import { Helmet } from "react-helmet-async"
import { ArrowRight } from "lucide-react"
import { PageHero } from "@/components/ui/PageHero"

const COLLECTIONS = [
    {
        id: "liverpool",
        title: "Liverpool Legends",
        description: "Authentic signed memorabilia from Anfield's greatest icons.",
        image: "https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070&auto=format&fit=crop",
        searchQuery: "liverpool"
    },
    {
        id: "premier-league",
        title: "Premier League",
        description: "Celebrate the history of the world's most exciting league.",
        image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2070&auto=format&fit=crop",
        searchQuery: "premier league"
    },
    {
        id: "framed-photos",
        title: "Framed Photos",
        description: "Premium framed photography ready for display.",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop",
        searchQuery: "photo"
    },
    {
        id: "shirts",
        title: "Signed Shirts",
        description: "Match-worn and signed shirts from football history.",
        image: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=1974&auto=format&fit=crop",
        searchQuery: "shirt"
    },
    {
        id: "boots",
        title: "Signed Boots",
        description: "Authentic signed boots from the game's biggest stars.",
        image: "https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=1964&auto=format&fit=crop",
        searchQuery: "boot"
    },
    {
        id: "legends",
        title: "All Legends",
        description: "Explore our complete collection of authenticated memorabilia.",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=2070&auto=format&fit=crop",
        searchQuery: ""
    }
]

export function CollectionsPage() {
    return (
        <div className="min-h-screen bg-ivory">
            <Helmet>
                <title>Collections | Sports Memorabilia Store</title>
                <meta name="description" content="Explore our curated collections of authentic sports memorabilia. From Liverpool Legends to Premier League icons." />
            </Helmet>

            <PageHero
                title="Collections"
                subtitle="Browse authentic memorabilia organised by team, league, and item type."
                backgroundImage="https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            {/* Collections Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {COLLECTIONS.map((collection) => (
                        <a
                            key={collection.id}
                            href={`/shop?search=${collection.searchQuery}`}
                            className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
                        >
                            <img
                                src={collection.image}
                                alt={collection.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-serif font-bold text-white mb-2 transform translate-y-0 transition-transform duration-500">
                                    {collection.title}
                                </h3>
                                <p className="text-white/80 text-sm mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                    {collection.description}
                                </p>
                                <div className="flex items-center gap-2 text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    View Collection <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
