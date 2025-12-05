
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { Helmet } from 'react-helmet-async'
import { Package, User as UserIcon, LogOut } from 'lucide-react'

export function AccountPage() {
    const { user, logout, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login')
        }
    }, [user, isLoading, navigate])

    if (isLoading || !user) {
        return <div className="min-h-screen bg-ivory flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-ivory pb-20">
             <Helmet>
                <title>My Account | Sports Memorabilia Store</title>
            </Helmet>
            <PageHero 
                title="My Account" 
                subtitle="Manage your orders and account details."
                backgroundImage="https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-stone/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal">Welcome Back</h3>
                                    <p className="text-sm text-navy/60 truncate max-w-[150px]">{user.email}</p>
                                </div>
                            </div>
                            
                            <Button variant="outline" className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => { logout(); navigate('/'); }}>
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </Button>
                        </div>
                    </div>

                    {/* Main Content (Orders) */}
                    <div className="lg:col-span-2 space-y-6">
                         <div className="bg-white p-6 rounded-sm shadow-sm border border-stone/10">
                            <h2 className="text-xl font-serif font-bold text-charcoal mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-gold" />
                                Recent Orders
                            </h2>
                            
                            {/* Placeholder for orders */}
                            <div className="text-center py-12 border-2 border-dashed border-stone/10 rounded-sm">
                                <p className="text-navy/60">No orders found yet.</p>
                                <Button variant="link" className="text-gold mt-2" onClick={() => navigate('/shop')}>Start Shopping</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
