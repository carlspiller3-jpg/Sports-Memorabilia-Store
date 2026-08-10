import { useState } from 'react'
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { AddressModal } from './AddressModal'

interface AddressBookProps {
    defaultAddress: any
    addresses: any[]
}

export function AddressBook({ defaultAddress, addresses }: AddressBookProps) {
    const { addAddress, deleteAddress, updateAddress } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const allAddresses = [defaultAddress, ...addresses.filter((a: any) => a.id !== defaultAddress?.id)].filter(Boolean)

    const handleAdd = async (addressData: any) => {
        const success = await addAddress(addressData)
        if (success) setIsModalOpen(false)
    }
    
    const handleEdit = async (addressData: any) => {
        if (!editingAddress) return
        // Shopify update mutation requires just the fields to change.
        // We'll pass the whole form data.
        const success = await updateAddress(editingAddress.id, addressData)
        if (success) {
            setIsModalOpen(false)
            setEditingAddress(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this address?')) {
            setIsDeleting(id)
            await deleteAddress(id)
            setIsDeleting(null)
        }
    }

    const openForEdit = (addr: any) => {
        setEditingAddress(addr)
        setIsModalOpen(true)
    }

    const openForAdd = () => {
        setEditingAddress(null)
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-charcoal">Saved Addresses</h3>
                <Button variant="outline" className="gap-2" onClick={openForAdd}>
                    <Plus className="w-4 h-4" />
                    Add New Address
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allAddresses.map((addr, idx) => {
                    const isDefault = addr.id === defaultAddress?.id
                    return (
                        <div key={addr.id || idx} className={`p-6 bg-white border rounded-sm relative group ${
                            isDefault ? 'border-gold shadow-md shadow-gold/5' : 'border-stone/10'
                        }`}>
                            {isDefault && (
                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-gold/10 text-gold px-2 py-1 rounded-sm">
                                    Default
                                </span>
                            )}

                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className={`w-5 h-5 ${isDefault ? 'text-gold' : 'text-stone/40'}`} />
                                <div>
                                    <p className="font-bold text-charcoal">{addr.firstName} {addr.lastName}</p>
                                    <div className="text-navy/70 text-sm mt-1 space-y-0.5">
                                        <p>{addr.address1}</p>
                                        {addr.address2 && <p>{addr.address2}</p>}
                                        <p>{addr.city}, {addr.province} {addr.zip}</p>
                                        <p>{addr.country}</p>
                                    </div>
                                    {addr.phone && (
                                        <p className="text-xs text-navy/40 mt-3">{addr.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-navy/60 hover:text-charcoal h-8 px-2"
                                    onClick={() => openForEdit(addr)}
                                >
                                    <Edit2 className="w-3 h-3 mr-1.5" />
                                    Edit
                                </Button>
                                {!isDefault && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-400 hover:text-red-600 h-8 px-2"
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={isDeleting === addr.id}
                                    >
                                        <Trash2 className="w-3 h-3 mr-1.5" />
                                        {isDeleting === addr.id ? 'Removing...' : 'Remove'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {allAddresses.length === 0 && (
                 <div className="text-center py-12 bg-white border border-stone/10 rounded-sm">
                    <MapPin className="w-12 h-12 text-stone/20 mx-auto mb-4" />
                    <h3 className="font-serif text-lg text-charcoal">No Addresses</h3>
                    <p className="text-navy/60 max-w-sm mx-auto mt-2 mb-4">
                        Add a shipping address for faster checkout.
                    </p>
                    <Button variant="secondary" onClick={openForAdd}>Add Address</Button>
                </div>
            )}

            <AddressModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={editingAddress ? handleEdit : handleAdd}
                initialData={editingAddress}
                title={editingAddress ? 'Edit Address' : 'Add New Address'}
            />
        </div>
    )
}
