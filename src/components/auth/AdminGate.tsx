import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Lock, Loader2, X } from 'lucide-react'
import { Helmet } from 'react-helmet-async'

interface AdminGateProps {
    children: React.ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
    const [session, setSession] = useState<any>(null)
    const [authLoading, setAuthLoading] = useState(true)

    // Login Form State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const [loggingIn, setLoggingIn] = useState(false)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setAuthLoading(false)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setAuthLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoggingIn(true)
        setLoginError('')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setLoginError(error.message)
        setLoggingIn(false)
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center pt-24 pb-12">
                <Loader2 className="w-8 h-8 animate-spin text-navy" />
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-4 pt-24 pb-12">
                <Helmet><title>Admin Login | Sports Memorabilia Store</title></Helmet>
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-md w-full border border-navy/10 text-center">
                    <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-navy/20">
                        <Lock className="w-7 h-7 text-gold" />
                    </div>
                    <h1 className="font-serif text-3xl text-navy mb-2">Team Access</h1>
                    <p className="text-charcoal/60 mb-8 text-sm leading-relaxed">Secure Admin Login.</p>

                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-1">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-navy uppercase tracking-widest mb-1">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-ivory border border-navy/10 rounded focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        {loginError && <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-center gap-2"><X className="w-3 h-3" />{loginError}</div>}
                        <button type="submit" disabled={loggingIn} className="w-full bg-navy text-white font-bold py-4 rounded hover:bg-navy/90 transition-all flex justify-center items-center gap-2 mt-4">{loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}</button>
                    </form>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
