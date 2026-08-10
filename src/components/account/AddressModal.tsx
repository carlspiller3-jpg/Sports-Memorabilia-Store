import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AddressModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (address: any) => Promise<void>
    initialData?: any
    title: string
}

export function AddressModal({ isOpen, onClose, onSubmit, initialData, title }: AddressModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        address1: initialData?.address1 || '',
        address2: initialData?.address2 || '',
        city: initialData?.city || '',
        province: initialData?.province || '',
        zip: initialData?.zip || '',
        country: initialData?.country || '',
        phone: initialData?.phone || ''
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        await onSubmit(formData)
        setIsLoading(false)
        onClose()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-sm w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-stone/10">
                    <h2 className="text-xl font-serif font-bold text-charcoal">{title}</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-charcoal transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-navy/60">First Name</label>
                            <input
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-navy/60">Last Name</label>
                            <input
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-navy/60">Address 1</label>
                        <input
                            required
                            name="address1"
                            value={formData.address1}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-navy/60">Address 2 (Optional)</label>
                        <input
                            name="address2"
                            value={formData.address2}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-navy/60">City</label>
                            <input
                                required
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-navy/60">Postal / Zip Code</label>
                            <input
                                required
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-navy/60">Country</label>
                            <input
                                required
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs uppercase font-bold text-navy/60">Province / State</label>
                            <input
                                required
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-navy/60">Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-stone/20 rounded-sm focus:outline-none focus:border-gold"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 bg-gold hover:bg-gold/90 text-charcoal">
                            {isLoading ? 'Saving...' : 'Save Address'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
