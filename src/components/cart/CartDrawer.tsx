import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, setIsCheckoutOpen } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-beige z-[101] shadow-2xl flex flex-col border-l border-white overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 bg-white flex justify-between items-center border-b border-gray-100 shadow-sm z-10">
                            <h2 className="text-2xl font-black text-charcoal flex items-center gap-3">
                                <ShoppingBag className="text-primary" size={28} />
                                Your Cart
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-charcoal" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-charcoal/50 space-y-4">
                                    <ShoppingBag size={64} className="opacity-20" />
                                    <p className="text-xl font-medium">Your cart is empty.</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="mt-4 text-primary font-bold hover:underline"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.name}
                                        className="bg-white p-4 rounded-2xl shadow-md border border-gray-50 flex gap-4 relative group"
                                    >
                                        {/* Product Image Placeholder */}
                                        <div className={`w-20 h-24 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient} shrink-0`}>
                                            <span className="text-primary/40 font-black rotate-[-90deg] tracking-widest text-xs mix-blend-multiply">VIBE</span>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-charcoal text-lg">{item.name}</h3>
                                                <p className="text-primary font-black">₹{item.price}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-beige rounded-full border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                                                        className="p-1 px-3 hover:text-primary transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                                                        className="p-1 px-3 hover:text-primary transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                {/* Remove btn */}
                                                <button
                                                    onClick={() => removeFromCart(item.name)}
                                                    className="text-xs text-red-400 font-bold hover:text-red-600 uppercase tracking-wider"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-charcoal/70 font-medium text-lg">Subtotal</span>
                                    <span className="text-3xl font-black text-charcoal">₹{cartTotal}</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        setIsCheckoutOpen(true);
                                    }}
                                    className="w-full py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-light transition-all shadow-[0_5px_20px_rgba(46,125,50,0.4)] hover:shadow-[0_10px_30px_rgba(46,125,50,0.6)] hover:-translate-y-1 active:translate-y-0"
                                >
                                    Proceed to Checkout
                                </button>
                                <p className="text-center text-xs text-charcoal/40 mt-4 flex items-center justify-center gap-1 font-medium">
                                    <Info size={14} /> Shipping calculated at checkout
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
