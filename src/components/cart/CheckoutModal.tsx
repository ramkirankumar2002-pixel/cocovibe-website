import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CheckoutModal() {
    const { isCheckoutOpen, setIsCheckoutOpen, cartItems, cartTotal, clearCart, setIsCartOpen } = useCart();
    const { addOrder, user } = useAuth();
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleConfirmOrder = () => {
        // Save order to user profile if logged in
        if (user) {
            addOrder(
                cartItems.map(item => ({
                    name: item.name,
                    image: (item as typeof item & { image?: string }).image,
                    price: item.price,
                    quantity: item.quantity,
                })),
                cartTotal
            );
        }
        // Show success state
        setOrderPlaced(true);
        setTimeout(() => {
            clearCart();
        }, 500); // clear cart after animation starts
    };

    const handleClose = () => {
        setIsCheckoutOpen(false);
        setOrderPlaced(false);
        setIsCartOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!orderPlaced ? () => setIsCheckoutOpen(false) : undefined}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden max-w-lg w-full relative border border-white/20 z-10"
                    >
                        {!orderPlaced ? (
                            <>
                                <div className="p-8 bg-gradient-to-br from-beige to-white flex justify-between items-center border-b border-gray-100">
                                    <h2 className="text-3xl font-black text-charcoal tracking-tight">Checkout</h2>
                                    <button
                                        onClick={() => setIsCheckoutOpen(false)}
                                        className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                                    >
                                        <X size={24} className="text-charcoal" />
                                    </button>
                                </div>

                                <div className="p-8">
                                    <h3 className="text-sm uppercase tracking-widest font-bold text-primary mb-6">Order Summary</h3>

                                    <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                                        {cartItems.map((item) => (
                                            <div key={item.name} className="flex justify-between items-center text-charcoal/80">
                                                <div className="flex-1">
                                                    <span className="font-bold text-charcoal">{item.name}</span>
                                                    <span className="mx-2 text-charcoal/40">×</span>
                                                    <span>{item.quantity}</span>
                                                </div>
                                                <div className="font-bold">₹{item.price * item.quantity}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 pt-6 space-y-3">
                                        <div className="flex justify-between items-center text-charcoal/70">
                                            <span>Subtotal:</span>
                                            <span className="font-bold text-charcoal">₹{cartTotal}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl">
                                            <span className="font-bold text-charcoal">Total:</span>
                                            <span className="font-black text-primary">₹{cartTotal}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirmOrder}
                                        className="w-full mt-10 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary-light transition-all shadow-[0_5px_20px_rgba(46,125,50,0.4)] hover:shadow-[0_10px_30px_rgba(46,125,50,0.6)] hover:-translate-y-1"
                                    >
                                        Confirm Order
                                    </button>
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 15, delay: 0.2 }}
                                    className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
                                >
                                    <CheckCircle size={48} className="text-primary" />
                                </motion.div>

                                <h2 className="text-3xl font-black text-charcoal tracking-tight mb-4">Order Successful</h2>
                                <p className="text-charcoal/70 text-lg mb-10 max-w-sm mx-auto">
                                    Thank you for choosing CocoVibe. Your refreshing coconut drink is on the way!
                                </p>

                                <button
                                    onClick={handleClose}
                                    className="px-8 py-4 bg-charcoal text-white text-lg font-bold rounded-full hover:bg-charcoal/90 transition-all shadow-xl hover:-translate-y-1"
                                >
                                    Continue Shopping
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
