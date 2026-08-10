import { Message } from "@/lib/chatbot/memory"
import { cn } from "@/lib/utils"
import { Bot, User, ShoppingBag, Check } from "lucide-react"
import type { Product } from "@/types/schema"
import { useCart } from "@/context/CartContext"
import { useState } from "react"

interface ChatMessageProps {
    message: Message
    products?: Product[]
}

export function ChatMessage({ message, products }: ChatMessageProps) {
    const isBot = message.role === 'bot'

    return (
        <div className="mb-4 flex flex-col gap-3">
            <div className={cn(
                "flex gap-3 max-w-[85%]",
                isBot ? "self-start" : "self-end flex-row-reverse"
            )}>
                {/* Avatar */}
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    isBot ? "bg-navy text-gold" : "bg-stone/10 text-charcoal"
                )}>
                    {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                    isBot 
                        ? "bg-stone/5 text-charcoal rounded-tl-none border border-stone/10" 
                        : "bg-navy text-white rounded-tr-none"
                )}>
                    {message.content}
                </div>
            </div>

            {/* Product Cards */}
            {products && products.length > 0 && isBot && (
                <div className="flex flex-col gap-2 ml-11 max-w-[75%]">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}

function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart()
    const [isAdded, setIsAdded] = useState(false)
    const price = product.variants?.[0]?.price || 0
    const imageUrl = product.images?.[0] || '/placeholder-product.jpg'

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (product.variants?.[0]) {
            addToCart(product, product.variants[0])
            setIsAdded(true)
            setTimeout(() => setIsAdded(false), 2000)
        }
    }

    return (
        <a
            href={`/products/${product.id}`}
            className="group bg-white border border-stone/20 rounded-xl p-3 hover:border-gold/50 hover:shadow-md transition-all flex gap-3 relative overflow-hidden"
        >
            {/* Product Image */}
            <div className="w-20 h-20 bg-stone/5 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                    src={imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <h4 className="font-semibold text-charcoal text-sm line-clamp-2 group-hover:text-navy transition-colors">
                        {product.title}
                    </h4>
                    <p className="text-xs text-stone mt-1 line-clamp-1">
                        {product.product_type || 'Memorabilia'}
                    </p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gold">
                        £{price.toFixed(0)}
                    </span>
                    
                    <button 
                        onClick={handleAddToCart}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            isAdded 
                                ? "bg-green-500 text-white" 
                                : "bg-navy text-white hover:bg-gold hover:text-navy"
                        )}
                    >
                        {isAdded ? (
                            <>
                                <Check className="w-3 h-3" />
                                <span>Added</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-3 h-3" />
                                <span>Add</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </a>
    )
}

