import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Favorites() {
    const { user, removeFavorite } = useAuth();
    const { addToCart } = useCart();

    if (!user) return null;
    const favs = user.favorites;

    const handleAddToCart = (fav: typeof favs[0]) => {
        addToCart({ name: fav.name, desc: fav.desc, price: fav.price, ingredients: [], benefits: [], gradient: fav.gradient });
    };

    if (favs.length === 0) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-black text-charcoal">My Favorites</h2>
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-charcoal">No favorites yet</h3>
                    <p className="text-charcoal/50 font-medium mt-1">Tap the ♡ icon on any product card to save it here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-charcoal">My Favorites</h2>
                <p className="text-charcoal/50 font-medium mt-1">{favs.length} saved product{favs.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {favs.map((fav, i) => (
                    <motion.div
                        key={fav.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`bg-gradient-to-br ${fav.gradient} rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all`}
                    >
                        <div className="relative">
                            <div className="h-40 flex items-center justify-center bg-white/60 rounded-xl overflow-hidden">
                                <img src={fav.image} alt={fav.name} className="h-full w-full object-contain" />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFavorite(fav.name)}
                                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500"
                                title="Remove from favorites"
                            >
                                <Heart size={15} fill="currentColor" />
                            </motion.button>
                        </div>

                        <div>
                            <h4 className="font-black text-charcoal text-base">{fav.name}</h4>
                            <p className="text-charcoal/50 text-sm mt-0.5 line-clamp-2">{fav.desc}</p>
                            <p className="text-2xl font-black text-primary mt-2">₹{fav.price}</p>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAddToCart(fav)}
                                className="flex-1 py-2.5 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(46,125,50,0.2)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.35)] transition-all"
                            >
                                <ShoppingCart size={14} /> Add to Cart
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -2 }}
                                onClick={() => removeFavorite(fav.name)}
                                className="px-3 py-2.5 bg-red-50 text-red-400 rounded-xl font-bold text-xs hover:bg-red-100 transition-all"
                            >
                                <Heart size={14} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
