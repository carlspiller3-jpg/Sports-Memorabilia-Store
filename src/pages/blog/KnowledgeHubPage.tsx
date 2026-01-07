import { useNavigate, useSearchParams } from "react-router-dom";
import { articles } from "@/data/articles";
import { ArrowRight, BookOpen, TrendingUp, History, ShieldCheck } from "lucide-react";

export function KnowledgeHubPage() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const isPreview = searchParams.get("preview") === "true";

    // Filter articles (Show all if preview mode, otherwise only published)
    const displayArticles = isPreview
        ? articles
        : articles.filter(article => new Date(article.date) <= new Date());

    // Use displayArticles for display
    const featuredArticle = displayArticles[0];
    const gridArticles = displayArticles.slice(1);

    const getIcon = (category: string) => {
        switch (category) {
            case "Analysis": return <TrendingUp className="w-4 h-4" />;
            case "History": return <History className="w-4 h-4" />;
            case "Education": return <ShieldCheck className="w-4 h-4" />;
            default: return <BookOpen className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-ivory min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="font-serif text-4xl md:text-5xl text-navy mb-4">The Knowledge Hub</h1>
                        <p className="text-navy/60 text-lg max-w-2xl mx-auto">
                            Expert analysis, authenticity guides, and collecting history from the team at SportsSigned.
                        </p>
                    </div>

                    {/* Featured / Hero Article (First one) */}
                    {featuredArticle && (
                        <div
                            className="group cursor-pointer bg-white rounded-xl shadow-sm border border-navy/5 overflow-hidden mb-12 hover:shadow-md transition-all"
                            onClick={() => navigate(`/hub/${featuredArticle.slug}`)}
                        >
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={featuredArticle.imageUrl}
                                        alt={featuredArticle.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 text-gold font-bold text-sm uppercase tracking-wider mb-4">
                                        {getIcon(featuredArticle.category)}
                                        {featuredArticle.category}
                                        {isPreview && new Date(featuredArticle.date) > new Date() && (
                                            <span className="bg-red-500 text-white px-2 py-0.5 rounded textxs ml-2">SCHEDULED</span>
                                        )}
                                    </div>
                                    <h2 className="font-serif text-2xl md:text-3xl text-navy mb-4 group-hover:text-gold transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-navy/70 mb-6 line-clamp-3">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <span className="text-navy font-bold flex items-center gap-2 text-sm">
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid for the rest */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {gridArticles.map((article) => (
                            <div
                                key={article.id}
                                className="group cursor-pointer bg-white rounded-xl shadow-sm border border-navy/5 overflow-hidden hover:shadow-md transition-all flex flex-col"
                                onClick={() => navigate(`/hub/${article.slug}`)}
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider mb-3">
                                        {getIcon(article.category)}
                                        {article.category}
                                        {isPreview && new Date(article.date) > new Date() && (
                                            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[10px] ml-2">SCHEDULED</span>
                                        )}
                                    </div>
                                    <h3 className="font-serif text-xl text-navy mb-3 group-hover:text-gold transition-colors">
                                        {article.title}
                                    </h3>
                                    <p className="text-navy/60 text-sm mb-6 flex-1">
                                        {article.excerpt}
                                    </p>
                                    <span className="text-navy/40 text-xs font-mono">
                                        {article.date} • By {article.author}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
