import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Edit3, Trash2, Star, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Address } from '../../context/AuthContext';

type AddrForm = Omit<Address, 'id' | 'isDefault'>;
const emptyForm: AddrForm = { fullName: '', phone: '', house: '', street: '', city: '', state: '', pincode: '', landmark: '' };

function AddressModal({ initial, onSave, onClose }: {
    initial?: AddrForm;
    onSave: (f: AddrForm) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState<AddrForm>(initial ?? emptyForm);
    const [errors, setErrors] = useState<Partial<AddrForm>>({});

    const set = (k: keyof AddrForm, v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Partial<AddrForm> = {};
        if (!form.fullName.trim()) errs.fullName = 'Required';
        if (!form.phone.trim()) errs.phone = 'Required';
        if (!form.house.trim()) errs.house = 'Required';
        if (!form.street.trim()) errs.street = 'Required';
        if (!form.city.trim()) errs.city = 'Required';
        if (!form.state.trim()) errs.state = 'Required';
        if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        onSave(form);
    };

    const Field = ({ label, k, placeholder, half }: { label: string; k: keyof AddrForm; placeholder?: string; half?: boolean }) => (
        <div className={half ? '' : 'col-span-2'}>
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1 block">{label}</label>
            <input
                value={form[k] ?? ''}
                onChange={e => set(k, e.target.value)}
                placeholder={placeholder}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors[k] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
            />
            {errors[k] && <p className="text-red-500 text-xs mt-0.5">{errors[k]}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-black text-charcoal mb-6">{initial ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Full Name" k="fullName" placeholder="John Doe" />
                        <Field label="Phone Number" k="phone" placeholder="+91 98765 43210" />
                        <Field label="House / Flat / Building" k="house" placeholder="Flat 4B, Green Tower" />
                        <Field label="Street / Area" k="street" placeholder="MG Road, Koramangala" />
                        <Field label="City" k="city" placeholder="Bengaluru" half />
                        <Field label="State" k="state" placeholder="Karnataka" half />
                        <Field label="Pincode" k="pincode" placeholder="560001" half />
                        <Field label="Landmark (optional)" k="landmark" placeholder="Near City Mall" half />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <motion.button whileHover={{ y: -1 }} type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.4)] transition-all">
                            Save Address
                        </motion.button>
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 text-charcoal rounded-xl font-bold hover:bg-gray-200 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default function SavedAddress() {
    const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editAddr, setEditAddr] = useState<Address | null>(null);

    if (!user) return null;

    const handleSave = (form: AddrForm) => {
        if (editAddr) {
            updateAddress(editAddr.id, form);
        } else {
            addAddress(form);
        }
        setShowModal(false);
        setEditAddr(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-black text-charcoal">Saved Addresses</h2>
                    <p className="text-charcoal/50 font-medium mt-1">{user.addresses.length} address{user.addresses.length !== 1 ? 'es' : ''} saved</p>
                </div>
                <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => { setEditAddr(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-[0_4px_15px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.35)] transition-all"
                >
                    <Plus size={16} /> Add New Address
                </motion.button>
            </div>

            {user.addresses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-charcoal">No addresses saved yet</h3>
                    <p className="text-charcoal/50 font-medium mt-1">Add a delivery address to get started.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {user.addresses.map((addr, i) => (
                        <motion.div
                            key={addr.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`relative p-5 bg-white rounded-2xl border-2 transition-all shadow-sm ${addr.isDefault ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            {addr.isDefault && (
                                <span className="absolute top-4 right-4 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Star size={10} fill="currentColor" /> Default
                                </span>
                            )}
                            <p className="font-black text-charcoal text-base">{addr.fullName}</p>
                            <p className="text-sm text-charcoal/60 font-medium mt-0.5">{addr.phone}</p>
                            <p className="text-sm text-charcoal/70 mt-2 leading-relaxed">
                                {addr.house}, {addr.street},<br />{addr.city}, {addr.state} – {addr.pincode}
                                {addr.landmark && <><br /><span className="text-charcoal/40">Near: {addr.landmark}</span></>}
                            </p>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <motion.button whileHover={{ y: -1 }} onClick={() => { setEditAddr(addr); setShowModal(true); }}
                                    className="flex items-center gap-1 text-xs font-bold text-charcoal/60 hover:text-primary transition-colors px-3 py-1.5 bg-gray-50 hover:bg-primary/10 rounded-lg">
                                    <Edit3 size={13} /> Edit
                                </motion.button>
                                <motion.button whileHover={{ y: -1 }} onClick={() => deleteAddress(addr.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition-colors px-3 py-1.5 bg-gray-50 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={13} /> Delete
                                </motion.button>
                                {!addr.isDefault && (
                                    <motion.button whileHover={{ y: -1 }} onClick={() => setDefaultAddress(addr.id)}
                                        className="ml-auto flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-light transition-colors px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg">
                                        <Check size={13} /> Set Default
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {showModal && (
                    <AddressModal
                        initial={editAddr ? { fullName: editAddr.fullName, phone: editAddr.phone, house: editAddr.house, street: editAddr.street, city: editAddr.city, state: editAddr.state, pincode: editAddr.pincode, landmark: editAddr.landmark } : undefined}
                        onSave={handleSave}
                        onClose={() => { setShowModal(false); setEditAddr(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
