import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();
    const { user, logout, setPage } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const links = [
        { name: 'Our Story', id: 'about' },
        { name: 'Flavours', id: 'flavours' },
        { name: 'Experience', id: 'experience' },
        { name: 'Testimonials', id: 'testimonials' },
        { name: 'Contact', id: 'contact' }
    ];

    const scrollToFlavours = () => {
        document.getElementById('flavours')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    const textColor = isScrolled ? 'text-charcoal' : 'text-white';

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}
        >
            <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                <a href="#" onClick={() => setPage('home')} className="flex items-center gap-2">
                    <span className={`text-3xl font-bold tracking-tighter ${isScrolled ? 'text-primary' : 'text-white'}`}>
                        Coco<span className="text-accent">Vibe</span>
                    </span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center space-x-8">
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className={`text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors ${textColor}`}
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="flex items-center gap-4 border-l border-white/20 pl-8">
                        {/* Cart Button */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className={`relative p-2 hover:scale-110 transition-transform ${textColor}`}
                        >
                            <ShoppingBag size={24} />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-accent text-charcoal text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </button>

                        {/* User Area */}
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setDropdownOpen(p => !p)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all"
                                >
                                    <div className="w-7 h-7 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center text-white font-black text-xs shadow">
                                        {user.avatarInitial ?? user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className={`text-sm font-bold max-w-[100px] truncate ${textColor}`}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <p className="font-black text-charcoal text-sm">{user.name}</p>
                                                <p className="text-xs text-charcoal/50 truncate">{user.email}</p>
                                            </div>
                                            {[
                                                { label: 'My Account', icon: <User size={15} />, action: () => { setPage('dashboard'); setDropdownOpen(false); } },
                                                { label: 'My Orders', icon: <LayoutDashboard size={15} />, action: () => { setPage('dashboard'); setDropdownOpen(false); } },
                                                { label: 'Cart', icon: <ShoppingCart size={15} />, action: () => { setIsCartOpen(true); setDropdownOpen(false); } },
                                            ].map(item => (
                                                <button
                                                    key={item.label}
                                                    onClick={item.action}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors text-left"
                                                >
                                                    <span className="text-primary">{item.icon}</span>
                                                    {item.label}
                                                </button>
                                            ))}
                                            <div className="border-t border-gray-50">
                                                <button
                                                    onClick={() => { logout(); setDropdownOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                                                >
                                                    <LogOut size={15} /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage('auth')}
                                    className={`text-sm font-bold ${textColor} hover:text-accent transition-colors`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={scrollToFlavours}
                                    className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-primary-light transition-all shadow-[0_0_15px_rgba(46,125,50,0.5)] hover:shadow-[0_0_25px_rgba(46,125,50,0.8)] hover:-translate-y-1"
                                >
                                    Shop Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle & Cart */}
                <div className="md:hidden flex items-center gap-3">
                    <button onClick={() => setIsCartOpen(true)} className={`relative p-2 ${textColor}`}>
                        <ShoppingBag size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-charcoal text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {user && (
                        <button onClick={() => setPage('dashboard')} className={`p-1 ${textColor}`}>
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center text-white font-black text-xs">
                                {user.avatarInitial ?? user.name.charAt(0).toUpperCase()}
                            </div>
                        </button>
                    )}

                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className={isScrolled ? 'text-primary' : 'text-white'} /> : <Menu className={isScrolled ? 'text-primary' : 'text-white'} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass absolute top-full w-full left-0 flex flex-col items-center py-6 space-y-4 shadow-xl"
                    >
                        {links.map((link) => (
                            <a key={link.id} href={`#${link.id}`} onClick={() => setIsOpen(false)} className="text-primary text-xl font-bold uppercase tracking-widest">
                                {link.name}
                            </a>
                        ))}
                        {user ? (
                            <div className="flex flex-col items-center gap-3 pt-4 w-3/4">
                                <button onClick={() => { setPage('dashboard'); setIsOpen(false); }} className="w-full px-8 py-3 bg-primary text-white rounded-full font-bold flex justify-center shadow-lg hover:bg-primary-light transition-colors">
                                    My Dashboard
                                </button>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 font-bold text-sm">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 pt-4 w-3/4">
                                <button onClick={() => { setPage('auth'); setIsOpen(false); }} className="w-full px-8 py-3 border-2 border-primary text-primary rounded-full font-bold flex justify-center hover:bg-primary/5 transition-colors">
                                    Login / Sign Up
                                </button>
                                <button onClick={scrollToFlavours} className="w-full px-8 py-3 bg-primary text-white rounded-full font-bold flex justify-center shadow-lg hover:bg-primary-light transition-colors">
                                    Shop Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
