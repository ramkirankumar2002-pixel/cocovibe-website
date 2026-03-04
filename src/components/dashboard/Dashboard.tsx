import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Sidebar, { type Tab } from './Sidebar';
import ProfileSection from './ProfileSection';
import OrderHistory from './OrderHistory';
import RecentPurchases from './RecentPurchases';
import SavedAddress from './SavedAddress';
import Favorites from './Favorites';
import FeedbackPage from './FeedbackPage';
import { useAuth } from '../../context/AuthContext';




export default function Dashboard() {
    const { user, logout, setPage } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) { setPage('home'); return null; }

    const handleLogout = () => { logout(); };

    const contentMap: Record<Tab, React.ReactNode> = {
        profile: <ProfileSection />,
        orders: <RecentPurchases />,
        history: <OrderHistory />,
        address: <SavedAddress />,
        favorites: <Favorites />,
        feedback: <FeedbackPage />,
    };

    return (
        <div className="min-h-screen bg-beige flex">
            {/* --- Sidebar (desktop) --- */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-100 shadow-sm fixed left-0 top-0 h-full z-30">
                <Sidebar activeTab={activeTab} onChange={setActiveTab} onLogout={handleLogout} />
            </aside>

            {/* --- Mobile sidebar overlay --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 28 }}
                            className="w-72 bg-white h-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="relative h-full">
                                <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 z-50 p-2 text-charcoal/40 hover:text-charcoal">
                                    <X size={20} />
                                </button>
                                <Sidebar activeTab={activeTab} onChange={t => { setActiveTab(t); setSidebarOpen(false); }} onLogout={handleLogout} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Main Content --- */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-charcoal/60 hover:text-charcoal">
                            <Menu size={22} />
                        </button>
                        <div>
                            <h1 className="font-black text-charcoal text-lg leading-tight">
                                {activeTab === 'profile' ? 'My Profile' :
                                    activeTab === 'orders' ? 'Recent Orders' :
                                        activeTab === 'history' ? 'Order History' :
                                            activeTab === 'address' ? 'Saved Address' :
                                                activeTab === 'favorites' ? 'My Favorites' : 'Feedback'}
                            </h1>
                            <p className="text-xs text-charcoal/40 font-medium">CocoVibe Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPage('home')}
                            className="text-sm font-bold text-charcoal/60 hover:text-primary transition-colors"
                        >
                            ← Back to Store
                        </button>
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center text-white font-black text-sm shadow">
                            {user.avatarInitial ?? user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 md:p-10 max-w-5xl w-full mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {contentMap[activeTab]}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
