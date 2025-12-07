import { useState } from "react"
import { X, Upload, Camera } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

interface TradeInModalProps {
    isOpen: boolean
    onClose: () => void
}

export function TradeInModal({ isOpen, onClose }: TradeInModalProps) {
    const { user } = useAuth()
    const [description, setDescription] = useState("")
    const [condition, setCondition] = useState("excellent")
    const [email, setEmail] = useState(user?.email || "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const { error: submitError } = await supabase
                .from('trade_ins')
                .insert({
                    customer_email: email,
                    item_description: description,
                    condition,
                    // images: [] // TODO: Implement image upload
                })

            if (submitError) throw submitError

            setSuccess(true)
        } catch (err: any) {
            console.error('Error submitting trade-in:', err)
            setError(err.message || 'Failed to submit request')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-white rounded-sm shadow-2xl max-w-md w-full p-8 text-center animate-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Request Received</h3>
                    <p className="text-navy/60 mb-8">
                        Our valuation experts will review your submission and contact you via email ({email}) within 48 hours.
                    </p>
                    <Button onClick={onClose} className="w-full bg-navy text-white">Return to Dashboard</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-stone/10">
                    <h3 className="text-xl font-serif font-bold text-charcoal">Trade-in Request</h3>
                    <button onClick={onClose} className="text-stone/40 hover:text-charcoal transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-ivory p-4 rounded-sm border border-gold/20 text-sm text-navy/80">
                        <p className="font-bold text-gold mb-1">Get an Estimate</p>
                        We accept authentic signed memorabilia. Provide details below for a preliminary valuation.
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-navy">Item Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 rounded-sm border border-stone/20 outline-none focus:border-gold focus:ring-1 focus:ring-gold h-32 resize-none"
                            placeholder="e.g. 2022 Signed Messi Argentina Shirt, COA included..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-navy">Condition</label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-full h-11 px-3 rounded-sm border border-stone/20 outline-none focus:border-gold focus:ring-1 focus:ring-gold bg-white"
                        >
                            <option value="mint">Mint (Like New)</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-navy">Photos</label>
                        <div className="border-2 border-dashed border-stone/20 rounded-sm p-8 text-center hover:bg-stone/5 transition-colors cursor-pointer group">
                            <Camera className="w-8 h-8 mx-auto text-stone/30 group-hover:text-gold mb-2 transition-colors" />
                            <p className="text-sm text-navy/50 group-hover:text-navy">Click to upload photos</p>
                            <p className="text-xs text-navy/30 mt-1">(Not implemented in demo)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-navy">Contact Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-11 px-4 rounded-sm border border-stone/20 outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-xs bg-red-50 p-2 rounded-sm">{error}</div>
                    )}

                    <div className="pt-4 flex gap-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-navy text-white hover:bg-navy/90">
                            {isSubmitting ? "Submitting..." : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
