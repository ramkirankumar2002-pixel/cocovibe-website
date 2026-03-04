import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSection() {
    const { user, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        address: user?.address ?? '',
    });

    if (!user) return null;

    const handleSave = () => {
        updateProfile(form);
        setEditing(false);
    };

    const handleCancel = () => {
        setForm({ name: user.name, email: user.email, phone: user.phone, address: user.address ?? '' });
        setEditing(false);
    };

    const fields = [
        { key: 'name' as const, label: 'Full Name', icon: <User size={16} />, type: 'text' },
        { key: 'email' as const, label: 'Email Address', icon: <Mail size={16} />, type: 'email' },
        { key: 'phone' as const, label: 'Phone Number', icon: <Phone size={16} />, type: 'tel' },
        { key: 'address' as const, label: 'Saved Address', icon: <MapPin size={16} />, type: 'text' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-black text-charcoal">My Profile</h2>
                    <p className="text-charcoal/50 font-medium mt-1">Manage your personal information</p>
                </div>
                {!editing ? (
                    <motion.button
                        whileHover={{ y: -2 }}
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.35)] transition-all"
                    >
                        <Edit3 size={16} /> Edit Profile
                    </motion.button>
                ) : (
                    <div className="flex gap-2">
                        <motion.button whileHover={{ y: -2 }} onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm">
                            <Save size={16} /> Save
                        </motion.button>
                        <motion.button whileHover={{ y: -2 }} onClick={handleCancel} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-charcoal rounded-xl font-bold text-sm">
                            <X size={16} /> Cancel
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
                    {user.avatarInitial ?? user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="text-xl font-black text-charcoal">{user.name}</h3>
                    <p className="text-charcoal/50 font-medium">{user.email}</p>
                    <p className="text-xs text-primary font-bold mt-1 bg-primary/10 px-2 py-0.5 rounded-full inline-block">CocoVibe Member</p>
                </div>
            </div>

            {/* Fields */}
            <div className="grid md:grid-cols-2 gap-4">
                {fields.map(field => (
                    <motion.div
                        key={field.key}
                        layout
                        className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary">{field.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">{field.label}</span>
                        </div>
                        {editing ? (
                            <input
                                type={field.type}
                                value={form[field.key]}
                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                className="w-full text-charcoal font-semibold bg-beige rounded-xl px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        ) : (
                            <p className="text-charcoal font-semibold">{user[field.key] || <span className="text-charcoal/30 italic">Not set</span>}</p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Orders', value: user.orders.length },
                    { label: 'Total Spent', value: `₹${user.orders.reduce((s, o) => s + o.total, 0)}` },
                    { label: 'Member Since', value: 'March 2026' },
                ].map(stat => (
                    <div key={stat.label} className="p-4 bg-gradient-to-br from-primary/5 to-white rounded-2xl border border-gray-100 text-center">
                        <p className="text-2xl font-black text-primary">{stat.value}</p>
                        <p className="text-xs text-charcoal/50 font-medium mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
