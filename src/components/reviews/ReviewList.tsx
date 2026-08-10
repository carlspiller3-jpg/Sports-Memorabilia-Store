import { useEffect, useState } from "react"
import { Star, CheckCircle, User } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { ReviewForm } from "./ReviewForm"
import { Button } from "@/components/ui/Button"

interface Review {
    id: string
    product_handle: string
    rating: number
    author_name: string
    title: string
    body: string
    created_at: string
    verified: boolean
}

interface ReviewListProps {
    productHandle: string
}

export function ReviewList({ productHandle }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_handle', productHandle)
                .order('created_at', { ascending: false })

            if (error) {
                // If table doesn't exist yet (migration pending), just ignore
                console.warn('Could not fetch reviews:', error.message)
                return
            }

            if (data) {
                setReviews(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [productHandle])

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
        : null

    if (loading) return <div className="py-12 text-center text-stone/50">Loading reviews...</div>

    return (
        <section className="py-12 border-t border-stone/10" id="reviews">
            <div className="flex flex-col md:flex-row gap-12 md:gap-20">
                {/* Summary Column */}
                <div className="md:w-1/3 space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-charcoal">Customer Reviews</h2>
                    
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-bold text-charcoal">{averageRating}</span>
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={`w-5 h-5 ${star <= Math.round(Number(averageRating)) ? "fill-gold text-gold" : "fill-stone/10 text-stone/30"}`} 
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-navy/60">{reviews.length} Verified Reviews</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-navy/60">
                            No reviews yet. Be the first to review this item!
                        </div>
                    )}
                    
                    {!showForm ? (
                        <Button 
                            variant="outline" 
                            onClick={() => setShowForm(true)}
                            className="w-full md:w-auto"
                        >
                            Write a Review
                        </Button>
                    ) : (
                         <Button 
                            variant="ghost" 
                            onClick={() => setShowForm(false)}
                            className="w-full md:w-auto text-stone/50 hover:text-navy"
                        >
                            Cancel
                        </Button>
                    )}
                </div>

                {/* Reviews Column */}
                <div className="md:w-2/3 space-y-8">
                    {showForm && (
                        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                           <ReviewForm 
                                productHandle={productHandle} 
                                onSuccess={() => {
                                    setShowForm(false)
                                    fetchReviews()
                                }} 
                            /> 
                        </div>
                    )}

                    <div className="space-y-8">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-b border-stone/10 last:border-0 pb-8 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={`w-4 h-4 ${star <= review.rating ? "fill-gold text-gold" : "fill-stone/10 text-stone/30"}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-stone/40">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-charcoal mb-2">{review.title}</h3>
                                <p className="text-navy/80 leading-relaxed mb-4">{review.body}</p>
                                
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-stone/10 flex items-center justify-center text-navy/40">
                                        <User className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm font-medium text-navy/70">{review.author_name}</span>
                                    {review.verified && (
                                        <div className="flex items-center gap-1 text-xs text-gold font-medium ml-2">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified Buyer
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
