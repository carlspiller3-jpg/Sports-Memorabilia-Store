import { useParams, useNavigate } from "react-router-dom";
import { articles } from "@/data/articles";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { NotFoundPage } from "../NotFoundPage";

export function ArticlePage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
        return <NotFoundPage />; // Or generic 404
    }

    return (
        <div className="bg-ivory min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4">
                <article className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-navy/5 overflow-hidden">

                    {/* Header Image Area */}
                    <div className="h-64 md:h-80 bg-navy/10 flex items-center justify-center">
                        {/* Would be <img src={article.imageUrl} ... /> */}
                        <div className="text-navy/20 font-serif text-6xl">SportsSigned News</div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Back Link */}
                        <button
                            onClick={() => navigate("/hub")}
                            className="flex items-center gap-2 text-navy/50 hover:text-gold transition-colors mb-8 text-sm font-bold"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Hub
                        </button>

                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 text-xs font-mono text-navy/50 mb-6 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-navy/5 rounded-full">
                                <Tag className="w-3 h-3" /> {article.category}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> {article.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <User className="w-3 h-3" /> {article.author}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-serif text-3xl md:text-5xl text-navy mb-8 leading-tight">
                            {article.title}
                        </h1>

                        {/* Content Injection */}
                        <div
                            className="prose prose-navy prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy prose-a:text-gold"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Contextual CTA for SEO */}
                        <div className="mt-12 p-8 bg-navy text-white rounded-lg text-center">
                            <h3 className="font-serif text-2xl mb-4">Looking for Authentic Memorabilia?</h3>
                            <p className="mb-6 opacity-80">Don't risk buying a fake. Every item at SportsSigned comes with our lifetime authenticity guarantee and immutable digital COA.</p>
                            <button
                                onClick={() => navigate("/shop")}
                                className="bg-gold text-navy px-8 py-3 rounded font-bold hover:bg-white transition-colors"
                            >
                                Browse the Shop
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
