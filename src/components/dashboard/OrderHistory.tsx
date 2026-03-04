import { motion } from 'framer-motion';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Processing: 'bg-amber-50 text-amber-700 border-amber-200',
        Cancelled: 'bg-red-50 text-red-600 border-red-200',
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            {status}
        </span>
    );
}

export default function OrderHistory() {
    const { user } = useAuth();
    const { addToCart } = useCart();

    if (!user) return null;

    const handleBuyAgain = (item: { name: string; image?: string; price: number; quantity: number }) => {
        addToCart({
            name: item.name,
            desc: '',
            ingredients: [],
            benefits: [],
            price: item.price,
            gradient: 'from-emerald-50 to-white',
        });
    };

    if (user.orders.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-charcoal">No orders yet</h3>
                <p className="text-charcoal/50 font-medium mt-2">Start shopping to see your orders here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-charcoal">Order History</h2>
                <p className="text-charcoal/50 font-medium mt-1">{user.orders.length} order{user.orders.length !== 1 ? 's' : ''} placed</p>
            </div>

            {user.orders.map((order, oi) => (
                <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: oi * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Order Header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center gap-6 text-sm">
                            <div>
                                <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">Order ID</p>
                                <p className="font-bold text-charcoal font-mono">#{order.id.toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">Date</p>
                                <p className="font-bold text-charcoal">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">Total</p>
                                <p className="font-bold text-primary text-lg">₹{order.total}</p>
                            </div>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-gray-50">
                        {order.items.map((item, ii) => (
                            <div key={ii} className="flex items-center gap-4 px-6 py-4">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-xl bg-beige shrink-0" />
                                ) : (
                                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-gray-100 flex items-center justify-center text-primary/30 font-black text-xs shrink-0">CV</div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-charcoal">{item.name}</p>
                                    <p className="text-sm text-charcoal/50">Qty: {item.quantity} · ₹{item.price} each</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-charcoal">₹{item.price * item.quantity}</p>
                                    <motion.button
                                        whileHover={{ y: -1 }}
                                        onClick={() => handleBuyAgain(item)}
                                        className="mt-1 flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-light transition-colors"
                                    >
                                        <RefreshCw size={12} /> Buy Again
                                    </motion.button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
