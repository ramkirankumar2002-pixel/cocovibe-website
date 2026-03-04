import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, CheckCircle2, ShoppingCart, Heart } from 'lucide-react';

import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../Toast';

type Nutrition = {
    calories: string;
    potassium: string;
    carbs: string;
    sugars: string;
    fat: string;
    protein: string;
}

type Flavour = {
    name: string;
    desc: string;
    image: string;
    gradient: string;
    price: number;
    ingredients: string[];
    benefits: string[];
    nutrition: Nutrition;
};

const baseNutrition: Nutrition = {
    calories: "60 kcal",
    potassium: "250 mg",
    carbs: "14 g",
    sugars: "12 g",
    fat: "0 g",
    protein: "0 g"
};

const flavours: Flavour[] = [
    {
        name: 'Original Pure',
        desc: 'The classic, untouched coconut water. Naturally hydrating with a pure, refreshing taste.',
        image: '/products/original-coconut.jpeg',
        gradient: 'from-emerald-50 to-white',
        price: 90,
        ingredients: ['Fresh tender coconut water', 'Natural fruit extracts'],
        benefits: ['Natural Electrolytes', 'Instant Hydration', 'No Added Sugar'],
        nutrition: baseNutrition
    },
    {
        name: 'Mango Tango',
        desc: 'A tropical fusion of fresh coconut water blended with real Alphonso mango puree.',
        image: '/products/mango-tango.jpeg',
        gradient: 'from-orange-50 to-white',
        price: 120,
        ingredients: ['Fresh tender coconut water', 'Alphonso mango puree', 'Natural fruit extracts'],
        benefits: ['Rich in Vitamins', 'Instant Hydration', 'No Added Sugar'],
        nutrition: { ...baseNutrition, calories: "85 kcal", sugars: "18 g" }
    },
    {
        name: 'Pineapple Splash',
        desc: 'A tropical blend with fresh pineapple. Tangy, sweet, and incredibly refreshing.',
        image: '/products/pineapple-splash.jpeg',
        gradient: 'from-yellow-50 to-white',
        price: 110,
        ingredients: ['Fresh tender coconut water', 'Fresh pineapple juice', 'Natural fruit extracts'],
        benefits: ['Natural Electrolytes', 'Digestive Support', 'No Added Sugar'],
        nutrition: { ...baseNutrition, calories: "75 kcal", sugars: "15 g" }
    },
    {
        name: 'Watermelon Breeze',
        desc: 'Light, refreshing watermelon notes blended with pure coconut water.',
        image: '/products/watermelon-breeze.jpeg',
        gradient: 'from-red-50 to-white',
        price: 105,
        ingredients: ['Fresh tender coconut water', 'Cold-pressed watermelon juice'],
        benefits: ['Ultra Hydrating', 'Cooling Refreshment', 'No Added Sugar'],
        nutrition: { ...baseNutrition, calories: "65 kcal", sugars: "13 g" }
    },
    {
        name: 'Lime Coconut Zest',
        desc: 'Cooling cucumber with a hint of mint and zesty lime. The ultimate refresher.',
        image: '/products/lemon-coconut.jpeg',
        gradient: 'from-green-50 to-white',
        price: 95,
        ingredients: ['Fresh tender coconut water', 'Cucumber extract', 'Mint leaves', 'Lime zest'],
        benefits: ['Detoxifying Blend', 'Instant Hydration', 'Low Calorie'],
        nutrition: { ...baseNutrition, calories: "55 kcal", sugars: "10 g" }
    },
    {
        name: 'Tropical Energy Boost',
        desc: 'Carbonated with zesty lemon and infused with tropical energy extracts.',
        image: '/products/tropical-energy.jpeg',
        gradient: 'from-lime-50 to-white',
        price: 130,
        ingredients: ['Carbonated tender coconut water', 'Lemon juice', 'Guarana extract', 'Natural caffeine'],
        benefits: ['Natural Energy Boost', 'Focus Enhancing', 'Sparkling Finish'],
        nutrition: { ...baseNutrition, calories: "70 kcal", sugars: "12 g" }
    }
];

export default function Flavours() {
    const [selectedFlavour, setSelectedFlavour] = useState<Flavour | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { user, addFavorite, removeFavorite, isFavorite, setPage } = useAuth();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleAddToCart = () => {
        if (!selectedFlavour) return;
        addToCart(selectedFlavour, quantity);
        setToastMessage(`Added to Cart 🥥`);
        setSelectedFlavour(null);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleFavoriteToggle = (e: React.MouseEvent, flavour: Flavour) => {
        e.stopPropagation();
        if (!user) { setPage('auth'); return; }
        if (isFavorite(flavour.name)) {
            removeFavorite(flavour.name);
            setToastMessage(`💔 Removed from Favorites`);
        } else {
            addFavorite({ name: flavour.name, image: flavour.image, price: flavour.price, desc: flavour.desc, gradient: flavour.gradient });
            setToastMessage(`❤️ Added to Favorites!`);
        }
        setTimeout(() => setToastMessage(null), 2500);
    };

    useEffect(() => {
        if (selectedFlavour) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedFlavour]);

    return (
        <section id="flavours" className="py-32 bg-beige relative overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-charcoal tracking-tight mb-6">
                        Find Your <span className="text-primary">Flavor</span>
                    </h2>
                    <p className="text-xl text-charcoal/70 max-w-2xl mx-auto font-light leading-relaxed">
                        Six distinct variations, each crafted to perfection. Discover the one that speaks to your vibe.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {flavours.map((flavour, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`group relative p-10 rounded-[2.5rem] bg-gradient-to-br ${flavour.gradient} border border-white shadow-xl transition-all cursor-pointer overflow-hidden`}
                            onClick={() => setSelectedFlavour(flavour)}
                        >
                            {/* Heart / Favorite Button */}
                            <motion.button
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => handleFavoriteToggle(e, flavour)}
                                className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${isFavorite(flavour.name)
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-white/80 text-charcoal/30 hover:text-red-400'
                                    }`}
                                title={isFavorite(flavour.name) ? 'Remove from Favorites' : user ? 'Add to Favorites' : 'Login to save favorites'}
                            >
                                <Heart size={17} fill={isFavorite(flavour.name) ? 'currentColor' : 'none'} />
                            </motion.button>

                            <div className="relative z-10 pointer-events-none">
                                {/* Real Product Image with Glow + Float */}
                                <div className="h-64 flex items-center justify-center mb-8 relative">
                                    {/* Soft ambient glow behind image */}
                                    <div className="absolute inset-0 rounded-full bg-white/70 blur-2xl scale-75 opacity-80" />
                                    <motion.img
                                        src={flavour.image}
                                        alt={flavour.name}
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: idx * 0.4 }}
                                        whileHover={{ scale: 1.08, y: -14 }}
                                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.18)] pointer-events-auto"
                                    />
                                </div>

                                <h3 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">{flavour.name}</h3>
                                <p className="text-charcoal/60 mb-8 font-light text-lg">{flavour.desc}</p>

                                <div className="flex items-center gap-3 text-primary font-bold text-lg group-hover:gap-5 transition-all">
                                    View Details <ArrowRight size={20} className="text-accent group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedFlavour && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSelectedFlavour(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden max-w-5xl w-full relative flex flex-col md:flex-row max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedFlavour(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full text-charcoal shadow-sm hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Left Column: Image Area */}
                            <div className={`w-full md:w-5/12 bg-gradient-to-br ${selectedFlavour.gradient} p-8 flex items-center justify-center relative overflow-hidden shrink-0`}>
                                {/* Soft ambient background glow */}
                                <div className="absolute inset-0 bg-white/30 blur-[100px] rounded-full scale-150" />

                                <motion.div
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                    className="relative z-10"
                                >
                                    <img
                                        src={selectedFlavour.image}
                                        alt={selectedFlavour.name}
                                        className="w-56 h-72 md:w-64 md:h-80 object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]"
                                    />
                                </motion.div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col bg-white overflow-y-auto">

                                <div className="flex-1">
                                    <h3 className="text-3xl md:text-4xl font-black text-charcoal tracking-tight mb-3">
                                        {selectedFlavour.name}
                                    </h3>
                                    <p className="text-charcoal/70 text-lg font-medium leading-relaxed mb-8">
                                        {selectedFlavour.desc}
                                    </p>

                                    {/* Benefits */}
                                    <div className="mb-8 p-5 bg-beige/50 rounded-2xl border border-gray-100">
                                        <div className="flex flex-col gap-3">
                                            {selectedFlavour.benefits.slice(0, 3).map((benefit, i) => (
                                                <div key={i} className="flex items-center gap-3 text-charcoal/80 font-medium">
                                                    <div className="p-1 bg-primary/10 rounded-full">
                                                        <CheckCircle2 size={16} className="text-primary" />
                                                    </div>
                                                    <span>{benefit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nutrition Facts */}
                                    <div className="mb-8">
                                        <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">Nutrition (per 250ml)</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                                <span className="text-gray-400 text-xs mb-1">Calories</span>
                                                <span className="font-bold text-charcoal">{selectedFlavour.nutrition.calories}</span>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                                <span className="text-gray-400 text-xs mb-1">Potassium</span>
                                                <span className="font-bold text-charcoal">{selectedFlavour.nutrition.potassium}</span>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                                <span className="text-gray-400 text-xs mb-1">Carbs</span>
                                                <span className="font-bold text-charcoal">{selectedFlavour.nutrition.carbs}</span>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                                <span className="text-gray-400 text-xs mb-1">Sugars</span>
                                                <span className="font-bold text-charcoal">{selectedFlavour.nutrition.sugars}</span>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                                <span className="text-gray-400 text-xs mb-1">Fat</span>
                                                <span className="font-bold text-charcoal">{selectedFlavour.nutrition.fat}</span>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 flex flex-col justify-center items-center text-center">
                                                <span className="text-gray-400 text-xs mb-1">Protein</span>
                                                <span className="font-bold text-charcoal">{selectedFlavour.nutrition.protein}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Premium Bottom Action Bar */}
                                <div className="mt-4 pt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full">
                                    <div className="text-3xl font-black text-charcoal shrink-0">
                                        ₹{selectedFlavour.price}
                                    </div>

                                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 shadow-inner px-2 py-1 shrink-0">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-colors font-bold text-xl text-charcoal/60 hover:text-charcoal hover:shadow-sm"
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-bold text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full transition-colors font-bold text-xl text-charcoal/60 hover:text-charcoal hover:shadow-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddToCart}
                                        className="relative group w-full sm:w-auto flex-1 outline-none"
                                    >
                                        {/* Outer Glow */}
                                        <div className="absolute inset-0 bg-primary/40 rounded-full blur-lg group-hover:bg-primary/60 group-hover:blur-xl transition-all duration-300" />

                                        <div className="relative w-full py-4 px-6 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-full font-bold text-lg shadow-[0_4px_10px_rgba(46,125,50,0.3)] border border-primary-light/50 flex items-center justify-center gap-3 overflow-hidden">
                                            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform duration-300" />
                                            <span>Add to Cart</span>
                                            {/* Shine effect */}
                                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Toast message={toastMessage} />
        </section>
    );
}
