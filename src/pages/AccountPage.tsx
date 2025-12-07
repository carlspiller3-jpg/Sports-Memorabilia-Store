import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { Helmet } from 'react-helmet-async'
import { Package, User as UserIcon, LogOut, LayoutDashboard, Gem, MapPin } from 'lucide-react'
import { OrderHistory } from '@/components/account/OrderHistory'
import { AddressBook } from '@/components/account/AddressBook'
import { CollectionGallery } from '@/components/account/CollectionGallery'
import { TradeInModal } from '@/components/account/TradeInModal'

type Tab = 'overview' | 'orders' | 'vault' | 'addresses'

export function AccountPage() {
    const { user, logout, isLoading, refreshProfile } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [showTradeIn, setShowTradeIn] = useState(false)

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login')
        }
    }, [user, isLoading, navigate])

    // Auto-refresh profile on mount to ensure fresh data
    useEffect(() => {
        if (user && !user.profile) {
            refreshProfile()
        }
    }, [user, refreshProfile])

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-ivory flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-navy/60 font-medium">Loading your profile...</p>
            </div>
        )
    }

    const { profile } = user
    const firstName = profile?.firstName || user.firstName || 'Collector'
    const email = profile?.email || user.email

    return (
        <div className="min-h-screen bg-ivory pb-20">
             <Helmet>
                <title>My Dashboard | Sports Memorabilia Store</title>
            </Helmet>
            <PageHero 
                title={`Welcome, ${firstName}`}
                subtitle="Manage your collection and account details."
                backgroundImage="https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            <div className="container mx-auto px-4 py-8">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-stone/10 pb-1">
                    <TabButton 
                        active={activeTab === 'overview'} 
                        icon={LayoutDashboard} 
                        label="Overview" 
                        onClick={() => setActiveTab('overview')} 
                    />
                    <TabButton 
                        active={activeTab === 'orders'} 
                        icon={Package} 
                        label="Orders" 
                        onClick={() => setActiveTab('orders')} 
                    />
                     <TabButton 
                        active={activeTab === 'vault'} 
                        icon={Gem} 
                        label="The Vault" 
                        onClick={() => setActiveTab('vault')} 
                    />
                    <TabButton 
                        active={activeTab === 'addresses'} 
                        icon={MapPin} 
                        label="Addresses" 
                        onClick={() => setActiveTab('addresses')} 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 min-h-[500px]">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="bg-white p-8 rounded-sm shadow-sm border border-stone/10 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <UserIcon className="w-32 h-32 text-gold" />
                                    </div>
                                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">Account Overview</h2>
                                    <p className="text-navy/60 max-w-lg mb-6">
                                        You are currently logged in as <span className="text-charcoal font-bold">{email}</span>.
                                    </p>
                                    <div className="flex gap-4">
                                        <Button onClick={() => setActiveTab('orders')}>Track Recent Order</Button>
                                        <Button variant="outline" onClick={() => logout()}>Sign Out</Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-charcoal text-white p-6 rounded-sm">
                                        <h3 className="font-serif text-lg text-gold mb-4 flex items-center gap-2">
                                            <Gem className="w-4 h-4" /> Collection Value
                                        </h3>
                                        <p className="text-3xl font-bold">
                                            £{profile?.orders?.reduce((acc: number, o: any) => acc + parseFloat(o.totalPrice?.amount || '0'), 0).toFixed(2) || '0.00'}
                                        </p>
                                        <p className="text-white/40 text-sm mt-1">Based on purchase history</p>
                                    </div>
                                    <div className="bg-white border border-stone/10 p-6 rounded-sm">
                                         <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-gold" /> Recent Activity
                                        </h3>
                                        {profile?.orders && profile.orders.length > 0 ? (
                                            <div className="space-y-3">
                                                 <p className="text-sm text-navy/70">
                                                    Last order <span className="font-bold">#{profile.orders[0].orderNumber}</span>
                                                 </p>
                                                 <p className="text-xs text-navy/40">
                                                    {new Date(profile.orders[0].processedAt).toLocaleDateString()}
                                                 </p>
                                                 <Button variant="link" className="h-auto p-0 text-gold" onClick={() => setActiveTab('orders')}>View Details</Button>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-navy/40">No recent activity.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && <OrderHistory orders={profile?.orders || []} />}
                        
                        {activeTab === 'vault' && (
                            <CollectionGallery 
                                orders={profile?.orders || []} 
                                onTradeInClick={() => setShowTradeIn(true)}
                            />
                        )}

                        {activeTab === 'addresses' && (
                            <AddressBook 
                                defaultAddress={profile?.defaultAddress} 
                                addresses={profile?.addresses || []} 
                            />
                        )}
                        
                        <TradeInModal 
                            isOpen={showTradeIn} 
                            onClose={() => setShowTradeIn(false)} 
                        />
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-6">
                         <div className="bg-white p-6 rounded-sm shadow-sm border border-stone/10">
                            <h3 className="font-bold text-charcoal mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
                            <div className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start text-navy/70 hover:text-charcoal hover:bg-stone/5" onClick={() => setActiveTab('orders')}>
                                    <Package className="w-4 h-4 mr-2" />
                                    Track My Order
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-navy/70 hover:text-charcoal hover:bg-stone/5" onClick={() => setActiveTab('addresses')}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Manage Addresses
                                </Button>
                                 <div className="h-px bg-stone/10 my-2" />
                                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => { logout(); navigate('/'); }}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                         </div>

                        <div className="bg-stone/5 p-6 rounded-sm border border-stone/10 text-center">
                            <h4 className="font-serif font-bold text-charcoal mb-2">Need Help?</h4>
                            <p className="text-sm text-navy/70 mb-4">Have questions about your order or collection?</p>
                            <Button variant="outline" className="w-full">Contact Support</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TabButton({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative ${
                active 
                ? 'text-gold' 
                : 'text-navy/60 hover:text-charcoal hover:bg-stone/5'
            }`}
        >
            <Icon className={`w-4 h-4 ${active ? 'text-gold' : 'text-stone/40'}`} />
            {label}
            {active && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />
            )}
        </button>
    )
}
