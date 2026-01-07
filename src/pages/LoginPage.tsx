
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { Helmet } from 'react-helmet-async'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await login(email, password)
            if (result.success) {
                navigate('/account')
            } else {
                setError(result.error || 'Invalid email or password.')
            }
        } catch {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ivory pt-20 pb-20">
            <Helmet>
                <title>Login | Sports Memorabilia Store</title>
            </Helmet>
            <PageHero
                title="Welcome Back"
                subtitle="Sign in to your account to view orders and manage authentications."
                backgroundImage="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?q=80&w=2070&auto=format&fit=crop"
                compact
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-white p-8 rounded-sm shadow-sm border border-stone/10">
                    <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">Sign In</h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-navy uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            className="w-full h-12 text-lg mt-6"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-navy/60">
                        Don't have an account? <a href="/register" className="text-gold font-bold hover:underline">Create one</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
