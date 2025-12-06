import { Download, TrendingUp, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'

interface CollectionGalleryProps {
    orders: any[]
}

export function CollectionGallery({ orders }: CollectionGalleryProps) {
    // Extract unique items from all orders
    const collectionItems = orders.flatMap(order => 
        order.lineItems.edges.map((edge: any) => ({
            ...edge.node,
            purchaseDate: order.processedAt,
            orderId: order.orderNumber
        }))
    )

    if (collectionItems.length === 0) {
         return (
            <div className="text-center py-20 bg-ivory/50 rounded-sm border border-gold/20">
                <ShieldCheck className="w-16 h-16 text-gold/30 mx-auto mb-6" />
                <h3 className="font-serif text-2xl font-bold text-charcoal">The Vault is Empty</h3>
                <p className="text-navy/60 max-w-md mx-auto mt-3 mb-8">
                    Your authenticated collection will appear here. Each item is permanently recorded in your secure ledger.
                </p>
                <Button className="bg-charcoal text-white hover:bg-black">Start Collecting</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
             <div className="bg-charcoal text-ivory p-8 rounded-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <h3 className="font-serif text-2xl text-gold mb-2">My Vault</h3>
                    <p className="text-white/60 max-w-xl">
                        Your secured assets. Access digital Certificates of Authenticity (COA) and track estimated portfolio value.
                    </p>
                    <div className="flex gap-8 mt-6">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gold/60">Total Items</p>
                            <p className="text-3xl font-serif">{collectionItems.length}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gold/60">Est. Value</p>
                            <p className="text-3xl font-serif">£{collectionItems.reduce((acc, item) => acc + parseFloat(item.variant?.price?.amount || '0'), 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collectionItems.map((item, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="group bg-white border border-stone/10 rounded-sm overflow-hidden hover:shadow-xl hover:shadow-gold/5 transition-all duration-300"
                    >
                        <div className="aspect-[4/5] relative overflow-hidden bg-stone/5">
                            {item.variant?.image ? (
                                <img 
                                    src={item.variant.image.url} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone/20 font-serif text-4xl">?</div>
                            )}
                            
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary" className="w-full text-xs h-8 bg-white/10 text-white border-white/20 hover:bg-white hover:text-charcoal backdrop-blur-sm">
                                        <Download className="w-3 h-3 mr-2" />
                                        COA
                                    </Button>
                                    <Button size="sm" variant="secondary" className="w-full text-xs h-8 bg-gold text-charcoal border-gold hover:bg-white">
                                        <TrendingUp className="w-3 h-3 mr-2" />
                                        Value
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-stone/10 bg-ivory/20">
                            <h4 className="font-serif font-bold text-charcoal line-clamp-1">{item.title}</h4>
                            <p className="text-xs text-navy/40 mt-1 uppercase tracking-wide">
                                Auth. ID: {item.variant?.sku || 'PENDING'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
