import { Package, CheckCircle, Clock } from 'lucide-react'

interface OrderHistoryProps {
    orders: any[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-stone/10 rounded-sm">
                <Package className="w-12 h-12 text-stone/20 mx-auto mb-4" />
                <h3 className="font-serif text-lg text-charcoal">No Orders Yet</h3>
                <p className="text-navy/60 max-w-sm mx-auto mt-2">
                    Start your collection today. Once you make a purchase, it will appear here.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => {
                const date = new Date(order.processedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                })
                
                const isDelivered = order.fulfillmentStatus === 'FULFILLED'


                return (
                    <div key={order.id} className="bg-white border border-stone/10 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="bg-stone/5 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-stone/10">
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <p className="text-navy/40 uppercase text-xs font-bold tracking-wider">Order Placed</p>
                                    <p className="font-medium text-charcoal">{date}</p>
                                </div>
                                <div>
                                    <p className="text-navy/40 uppercase text-xs font-bold tracking-wider">Total</p>
                                    <p className="font-medium text-charcoal">
                                        {order.totalPrice.amount} {order.totalPrice.currencyCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-navy/40 uppercase text-xs font-bold tracking-wider">Order #</p>
                                    <p className="font-medium text-charcoal">#{order.orderNumber}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                    isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {isDelivered ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                    {isDelivered ? 'Delivered' : 'Processing'}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="p-6">
                            <div className="space-y-6">
                                {order.lineItems.edges.map((edge: any) => {
                                    const item = edge.node
                                    return (
                                        <div key={item.title} className="flex gap-6">
                                            <div className="w-20 h-20 bg-stone/5 rounded-md overflow-hidden flex-shrink-0 border border-stone/10">
                                                {item.variant?.image ? (
                                                    <img 
                                                        src={item.variant.image.url} 
                                                        alt={item.variant.image.altText || item.title} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone/20">
                                                        <Package className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-charcoal font-serif">{item.title}</h4>
                                                <p className="text-sm text-gold mt-1">
                                                    {item.variant?.price?.amount} {item.variant?.price?.currencyCode}
                                                </p>
                                                <div className="mt-4 flex gap-3">
                                                    <button className="text-xs font-medium text-navy/60 hover:text-gold transition-colors">
                                                        View Product
                                                    </button>
                                                    <span className="text-stone/20">|</span>
                                                    <button className="text-xs font-medium text-navy/60 hover:text-gold transition-colors">
                                                        Buy Again
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
