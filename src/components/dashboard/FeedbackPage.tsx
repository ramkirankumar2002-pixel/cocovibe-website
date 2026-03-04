import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function FeedbackPage() {
    const { user, addFeedback } = useAuth();

    const [form, setForm] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        rating: 0,
        message: '',
    });
    const [hoverRating, setHoverRating] = useState(0);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const set = (k: string, v: string | number) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
        if (form.rating === 0) errs.rating = 'Please select a rating';
        if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Please write at least 10 characters';
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        addFeedback({ name: form.name.trim(), email: form.email.trim(), rating: form.rating, message: form.message.trim() });
        setSubmitted(true);
    };

    const handleClear = () => {
        setForm({ name: user?.name ?? '', email: user?.email ?? '', rating: 0, message: '' });
        setErrors({});
        setSubmitted(false);
    };

    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h2 className="text-2xl font-black text-charcoal">Share Feedback</h2>
                <p className="text-charcoal/50 font-medium mt-1">We'd love to hear about your CocoVibe experience!</p>
            </div>

            <AnimatePresence mode="wait">
                {submitted ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-10 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15, delay: 0.1 }}
                            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <CheckCircle2 size={36} className="text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-black text-charcoal mb-2">Thank you for your feedback!</h3>
                        <p className="text-charcoal/60 font-medium mb-6">Your thoughts help us improve CocoVibe for everyone. 🥥</p>
                        <motion.button
                            whileHover={{ y: -2 }}
                            onClick={handleClear}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-[0_4px_15px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.35)] transition-all"
                        >
                            <RotateCcw size={15} /> Submit Another
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
                    >
                        {/* Name & Email */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1 block">Name</label>
                                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name"
                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`} />
                                {errors.name && <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1 block">Email</label>
                                <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="you@example.com"
                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`} />
                                {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Star Rating */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-3 block">Rating</label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <motion.button
                                        key={star}
                                        type="button"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => set('rating', star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-colors"
                                    >
                                        <Star
                                            size={32}
                                            className={`transition-colors ${star <= (hoverRating || form.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                                                }`}
                                            fill={star <= (hoverRating || form.rating) ? 'currentColor' : 'none'}
                                        />
                                    </motion.button>
                                ))}
                                {(hoverRating || form.rating) > 0 && (
                                    <span className="ml-2 text-sm font-bold text-charcoal/60">
                                        {ratingLabels[hoverRating || form.rating]}
                                    </span>
                                )}
                            </div>
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 mb-1 block">Message / Feedback</label>
                            <textarea
                                value={form.message}
                                onChange={e => set('message', e.target.value)}
                                rows={5}
                                placeholder="Share your experience with CocoVibe..."
                                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none ${errors.message ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'}`}
                            />
                            <div className="flex justify-between items-center mt-0.5">
                                {errors.message ? <p className="text-red-500 text-xs">{errors.message}</p> : <span />}
                                <span className="text-xs text-charcoal/30">{form.message.length} chars</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                className="flex-1 py-3 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(46,125,50,0.25)] hover:shadow-[0_8px_20px_rgba(46,125,50,0.4)] transition-all"
                            >
                                <Send size={16} /> Submit Feedback
                            </motion.button>
                            <button type="button" onClick={handleClear}
                                className="px-5 py-3 bg-gray-100 text-charcoal/60 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm flex items-center gap-2">
                                <RotateCcw size={14} /> Clear
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Past feedbacks */}
            {user && user.feedbacks.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/40">Your Previous Feedback</h3>
                    {user.feedbacks.slice(0, 3).map(fb => (
                        <div key={fb.id} className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                            <div className="flex gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={12} className={s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} fill={s <= fb.rating ? 'currentColor' : 'none'} />
                                ))}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-charcoal/70 line-clamp-2">{fb.message}</p>
                                <p className="text-xs text-charcoal/30 mt-1">{new Date(fb.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
