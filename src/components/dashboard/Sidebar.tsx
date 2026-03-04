import { motion } from 'framer-motion';
import { User, Heart, Clock, MapPin, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';

type Tab = 'profile' | 'orders' | 'history' | 'address' | 'favorites' | 'feedback';

interface SidebarProps {
    activeTab: Tab;
    onChange: (t: Tab) => void;
    onLogout: () => void;
    onClose?: () => void;
}

const links: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'profile', icon: <User size={18} />, label: 'My Profile' },
    { id: 'orders', icon: <LayoutDashboard size={18} />, label: 'Recent Orders' },
    { id: 'history', icon: <Clock size={18} />, label: 'Order History' },
    { id: 'address', icon: <MapPin size={18} />, label: 'Saved Address' },
    { id: 'favorites', icon: <Heart size={18} />, label: 'Favorites' },
    { id: 'feedback', icon: <MessageSquare size={18} />, label: 'Feedback' },
];

export default function Sidebar({ activeTab, onChange, onLogout, onClose }: SidebarProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 relative">
                <span className="text-2xl font-black text-charcoal tracking-tight">
                    Coco<span className="text-primary">Vibe</span>
                </span>
                <p className="text-xs text-charcoal/40 font-medium mt-0.5 uppercase tracking-widest">My Account</p>
                {onClose && (
                    <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/40 hover:text-charcoal md:hidden">✕</button>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map(link => (
                    <motion.button
                        key={link.id}
                        whileHover={{ x: 4 }}
                        onClick={() => { onChange(link.id); onClose?.(); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-sm transition-all ${activeTab === link.id
                                ? 'bg-primary text-white shadow-[0_4px_15px_rgba(46,125,50,0.3)]'
                                : 'text-charcoal/60 hover:bg-gray-50 hover:text-charcoal'
                            }`}
                    >
                        <span className={activeTab === link.id ? 'text-white' : 'text-charcoal/40'}>{link.icon}</span>
                        {link.label}
                        {activeTab === link.id && (
                            <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-4 bg-white/60 rounded-full" />
                        )}
                    </motion.button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <motion.button
                    whileHover={{ x: 4 }}
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </motion.button>
            </div>
        </div>
    );
}

export type { Tab };
