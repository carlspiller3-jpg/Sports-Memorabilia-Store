import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/context/AuthContext"

interface ReviewFormProps {
    productHandle: string
    onSuccess: () => void
}

export function ReviewForm({ productHandle, onSuccess }: ReviewFormProps) {
    const { user } = useAuth()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [authorName, setAuthorName] = useState(user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            setError("Please select a rating")
            return
        }
        if (!authorName) {
           setError("Please enter your name")
           return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const { error: submitError } = await supabase
                .from('reviews')
                .insert({
                    product_handle: productHandle,
                    rating,
                    title,
                    body,
                    author_name: authorName,
                    verified: !!user // Simple check for now
                })

            if (submitError) throw submitError

            onSuccess()
            // Reset form
            setRating(0)
            setTitle("")
            setBody("")
            if (!user) setAuthorName("") 

        } catch (err: any) {
            console.error('Error submitting review:', err)
            setError(err.message || 'Failed to submit review')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-sm border border-stone/10 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-charcoal">Write a Review</h3>
            
            {/* Rating */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-navy">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="p-1 focus:outline-none focus:ring-2 focus:ring-gold/50 rounded-full"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star 
                                className={`w-6 h-6 transition-colors ${
                                    star <= (hoverRating || rating) 
                                        ? "fill-gold text-gold" 
                                        : "fill-stone/10 text-stone/30"
                                }`} 
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <label htmlFor="authorName" className="text-sm font-medium text-navy">Name</label>
                <input
                    id="authorName"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full h-11 px-4 rounded-sm border border-stone/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-ivory/30"
                    placeholder="Your Name"
                    required
                />
            </div>

            {/* Title */}
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-navy">Review Title</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-sm border border-stone/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-ivory/30"
                    placeholder="Summarize your experience"
                    required
                />
            </div>

            {/* Body */}
            <div className="space-y-2">
                <label htmlFor="body" className="text-sm font-medium text-navy">Review</label>
                <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    className="w-full p-4 rounded-sm border border-stone/20 focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-ivory/30 resize-none"
                    placeholder="How was the quality? Delivery? Unboxing?"
                    required
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-sm">
                    {error}
                </div>
            )}

            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-navy text-white hover:bg-navy/90 h-12 font-bold"
            >
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
        </form>
    )
}
