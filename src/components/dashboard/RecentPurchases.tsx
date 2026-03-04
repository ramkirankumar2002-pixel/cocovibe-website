import { motion } from 'framer-motion';
import { ShoppingCart, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function RecentPurchases() {
    const { user } = useAuth();
    const { addToCart } = useCart();

    if (!user) return null;

    // Flatten items from most recent 3 orders, deduplicate by name
    const recentItems = Array.from(
        user.orders
            .slice(0, 3)
            .flatMap(o => o.items)
            .reduce((map, item) => {
                if (!map.has(item.name)) map.set(item.name, item);
                return map;
            }, new Map<string, typeof user.orders[0]['items'][0]>())
            .values()
    ).slice(0, 6);

    const handleBuyAgain = (item: typeof recentItems[0]) => {
        addToCart({
            name: item.name,
            desc: '',
            ingredients: [],
            benefits: [],
            price: item.price,
            gradient: 'from-emerald-50 to-white',
        });
    };

    if (recentItems.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-charcoal">Recent Orders</h2>
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <Clock size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-charcoal/50 font-medium">No recent purchases yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-charcoal">Recent Orders</h2>
                    <p className="text-charcoal/50 font-medium mt-1">Your last purchased products</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {recentItems.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
                    >
                        <div className="h-32 flex items-center justify-center bg-beige rounded-xl overflow-hidden">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                            ) : (
                                <div className="flex items-center justify-center text-primary/20 font-black text-xl">CV</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-black text-charcoal">{item.name}</h4>
                            <p className="text-2xl font-black text-primary mt-1">₹{item.price}</p>
                        </div>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleBuyAgain(item)}
                            className="w-full py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.4)] transition-all"
                        >
                            <ShoppingCart size={16} /> Buy Again
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
