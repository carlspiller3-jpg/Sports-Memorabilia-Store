import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Save, Send, Globe, Layout, Search, Plus, Edit3, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { marked } from 'marked';

// --- Types ---
interface BlogPost {
    id: string;
    title: string;
    slug: string;
    description: string;
    content_html: string; // Markdown storage
    featured_image?: string;
    author: string;
    published: boolean;
    tags: string[];
    created_at: string;
    // SEO Fields
    seo_title: string;
    seo_description: string;
}

interface PageMeta {
    id: string;
    page_path: string; // e.g. "/" or "/shop" or "/about"
    seo_title: string;
    seo_description: string;
}

export function ContentManager() {
    const [activeTab, setActiveTab] = useState<'PAGES' | 'BLOG'>('PAGES');
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);

    // Page Meta State
    const [pages, setPages] = useState<PageMeta[]>([]);
    const [selectedPage, setSelectedPage] = useState<PageMeta | null>(null);

    // Blog State
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [isEditingPost, setIsEditingPost] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) loadContent();
        });
    }, []);

    const loadContent = async () => {
        setLoading(true);
        // Load Pages (We might need to mock this initially if table doesn't exist)
        // For now, let's just hardcode the "Known Pages" and save to a simple table if it exists,
        // or just local state for this demo to show the UI primarily.

        // Actually, let's create a Supabase table for 'page_meta' if you haven't.
        // For now, I'll simulate fetching known pages.
        const knownPages = [
            { id: '1', page_path: '/', seo_title: 'SportsSigned | Premium Authenticated Collectibles', seo_description: 'Premium authenticated sports memorabilia...' },
            { id: '2', page_path: '/shop', seo_title: 'Shop | SportsSigned', seo_description: 'Browse our collection of signed shirts, boots...' },
            { id: '3', page_path: '/about', seo_title: 'About Us | SportsSigned', seo_description: 'Our story and commitment to authenticity.' },
            { id: '4', page_path: '/verify', seo_title: 'Verify Authenticity | SportsSigned', seo_description: 'Check your NFC tag.' },
        ];
        setPages(knownPages);

        // Load Blog Posts
        // const { data: blogData } = await supabase.from('blog_posts').select('*');
        // if (blogData) setPosts(blogData);
        
        setLoading(false);
    };

    // --- Renderers ---

    if (!session) {
        return <div className="p-12 text-center text-navy">Please log in to access CMS.</div>;
    }

    return (
        <div className="min-h-screen bg-ivory text-charcoal pt-24 pb-12 px-4 md:px-12">
            <Helmet><title>Content Manager</title></Helmet>

            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8 border-b border-navy/10 pb-4">
                    <div>
                        <h1 className="font-serif text-4xl text-navy">Content Manager</h1>
                        <p className="text-charcoal/60 mt-2">Manage SEO meta tags and Blog articles.</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-lg border border-navy/10">
                        <button 
                            onClick={() => setActiveTab('PAGES')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'PAGES' ? 'bg-navy text-white shadow-sm' : 'text-charcoal/50 hover:bg-ivory'}`}
                        >
                            <Globe className="w-4 h-4 inline mr-2" />
                            Page SEO
                        </button>
                        <button 
                            onClick={() => setActiveTab('BLOG')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'BLOG' ? 'bg-navy text-white shadow-sm' : 'text-charcoal/50 hover:bg-ivory'}`}
                        >
                            <Layout className="w-4 h-4 inline mr-2" />
                            Blog Posts
                        </button>
                    </div>
                </div>

                {/* --- PAGES TAB --- */}
                {activeTab === 'PAGES' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Page List */}
                        <div className="bg-white rounded-xl shadow-sm border border-navy/5 overflow-hidden">
                            <div className="p-4 bg-navy/5 border-b border-navy/5 font-bold text-xs uppercase tracking-widest text-navy/50">
                                Site Pages
                            </div>
                            <div className="divide-y divide-navy/5">
                                {pages.map(page => (
                                    <div 
                                        key={page.id} 
                                        onClick={() => setSelectedPage(page)}
                                        className={`p-4 cursor-pointer hover:bg-ivory transition-colors group ${selectedPage?.id === page.id ? 'bg-ivory border-l-4 border-gold' : ''}`}
                                    >
                                        <div className="font-bold text-navy text-sm font-mono">{page.page_path}</div>
                                        <div className="text-xs text-charcoal/50 truncate mt-1">{page.seo_title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="md:col-span-2">
                            {selectedPage ? (
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-navy/5 animate-in fade-in slide-in-from-right-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Globe className="w-5 h-5 text-gold" />
                                        <h2 className="font-serif text-2xl text-navy">Edit Metadata</h2>
                                        <span className="ml-auto text-xs font-mono bg-navy/10 px-2 py-1 rounded text-navy">{selectedPage.page_path}</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2">Page Title (Meta Title)</label>
                                            <input 
                                                className="w-full p-3 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold font-serif text-lg"
                                                value={selectedPage.seo_title}
                                                onChange={(e) => setSelectedPage({...selectedPage, seo_title: e.target.value})}
                                            />
                                            <p className="text-[10px] text-right mt-1 text-charcoal/40">{selectedPage.seo_title.length} / 60 chars recommended</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-2">Meta Description</label>
                                            <textarea 
                                                className="w-full p-3 bg-ivory border border-navy/10 rounded-lg focus:outline-none focus:border-gold h-32 resize-none leading-relaxed"
                                                value={selectedPage.seo_description}
                                                onChange={(e) => setSelectedPage({...selectedPage, seo_description: e.target.value})}
                                            />
                                            <p className="text-[10px] text-right mt-1 text-charcoal/40">{selectedPage.seo_description.length} / 160 chars recommended</p>
                                        </div>

                                        {/* Preview Card */}
                                        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">Google Search Preview</div>
                                            <div className="font-sans">
                                                <div className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate">{selectedPage.seo_title}</div>
                                                <div className="text-[#006621] text-sm truncate">https://sportssigned.com{selectedPage.page_path}</div>
                                                <div className="text-[#545454] text-sm line-clamp-2">{selectedPage.seo_description}</div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-navy/5 flex justify-end">
                                            <button className="bg-navy text-white px-6 py-3 rounded font-bold hover:bg-navy/90 flex items-center gap-2">
                                                <Save className="w-4 h-4" />
                                                Save Page Meta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-charcoal/30 border-2 border-dashed border-navy/5 rounded-xl bg-gray-50/50 min-h-[400px]">
                                    <Globe className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Select a page to edit SEO details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- BLOG TAB --- */}
                {activeTab === 'BLOG' && (
                    <div className="text-center py-24 bg-white rounded-xl border border-dashed border-navy/10">
                        <Edit3 className="w-12 h-12 text-charcoal/20 mx-auto mb-4" />
                        <h3 className="font-serif text-xl text-navy mb-2">Blog Manager Coming Soon</h3>
                        <p className="text-charcoal/60">This module is under development.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
