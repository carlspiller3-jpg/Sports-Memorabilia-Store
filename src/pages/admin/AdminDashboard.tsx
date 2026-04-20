import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, Search, ShieldCheck, FileText, Zap, Bug, LogOut, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function AdminDashboard() {
    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    const adminLinks = [
        { title: 'CRM (Leads & Contacts)', path: '/admin/crm', icon: Users, description: 'Manage your B2B and high-value leads.' },
        { title: 'SEO Manager', path: '/admin/seo', icon: Search, description: 'Update metadata for Supabase stored products/pages.' },
        { title: 'NFC Tag Manager', path: '/admin/nfc', icon: ShieldCheck, description: 'Map physical NFC tags to digital certificates.' },
        { title: 'Invoice Generator', path: '/admin/invoice-generator', icon: FileText, description: 'Quickly generate branded PDFs for manual B2B orders.' },
        { title: 'Shopify Asset Generator', path: '/admin/asset-generator', icon: Package, description: 'Auto-frame and scale assets natively in browser to maintain Shopify standards.' },
        { title: 'SEO AI Generator', path: '/admin/seo-generator', icon: Zap, description: 'Generate titles and descriptions for Google, eBay, Etsy, and Amazon.' },
        { title: 'AI Chatbot Debug', path: '/admin/ai-debug', icon: Bug, description: 'Test and debug the AI assistant prompts.' },
    ]

    return (
        <div className="min-h-screen bg-ivory pt-36 pb-12 px-4">
            <Helmet><title>Admin Dashboard | Sports Memorabilia Store</title></Helmet>
            <div className="container mx-auto max-w-5xl">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-navy/10 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-navy">Admin Hub</h1>
                            <p className="text-navy/60 font-medium">Internal tools and operations.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="bg-white border border-stone/20 text-charcoal/70 px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors shadow-sm"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminLinks.map((link) => {
                        const Icon = link.icon
                        return (
                            <Link 
                                key={link.path} 
                                to={link.path}
                                className="bg-white p-6 rounded-xl shadow-sm border border-stone/20 hover:border-gold hover:shadow-md transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="w-12 h-12 bg-stone/5 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                                    <Icon className="w-6 h-6 text-navy" />
                                </div>
                                
                                <h3 className="font-serif text-xl font-bold text-navy mb-2">{link.title}</h3>
                                <p className="text-sm text-navy/60 leading-relaxed">
                                    {link.description}
                                </p>
                            </Link>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
