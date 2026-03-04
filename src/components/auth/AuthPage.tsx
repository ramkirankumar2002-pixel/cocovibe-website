import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type Tab = 'login' | 'signup';

function InputField({
    label, type = 'text', value, onChange, placeholder, error
}: {
    label: string; type?: string; value: string;
    onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
    const [showPwd, setShowPwd] = useState(false);
    const isPwd = type === 'password';
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">{label}</label>
            <div className="relative">
                <input
                    type={isPwd && showPwd ? 'text' : type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 rounded-xl border text-charcoal bg-white/80 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition-all text-base ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                        }`}
                />
                {isPwd && (
                    <button
                        type="button"
                        onClick={() => setShowPwd(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                    >
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
        </div>
    );
}

export default function AuthPage() {
    const { login, signup, setPage } = useAuth();
    const [tab, setTab] = useState<Tab>('login');
    const [isLoading, setIsLoading] = useState(false);

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPwd, setLoginPwd] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Signup state
    const [signName, setSignName] = useState('');
    const [signEmail, setSignEmail] = useState('');
    const [signPhone, setSignPhone] = useState('');
    const [signPwd, setSignPwd] = useState('');
    const [signConfirmPwd, setSignConfirmPwd] = useState('');
    const [signErrors, setSignErrors] = useState<Record<string, string>>({});
    const [signSuccess, setSignSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (!loginEmail.trim()) { setLoginError('Please enter your email.'); return; }
        if (!loginPwd) { setLoginError('Please enter your password.'); return; }
        setIsLoading(true);
        const result = await login(loginEmail.trim(), loginPwd);
        setIsLoading(false);
        if (result.success) {
            setPage('home');
        } else {
            setLoginError(result.error ?? 'Login failed. Please check your credentials.');
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs: Record<string, string> = {};
        if (!signName.trim()) errs.name = 'Full name is required.';
        if (!signEmail.trim() || !/\S+@\S+\.\S+/.test(signEmail)) errs.email = 'Valid email is required.';
        if (!signPhone.trim()) errs.phone = 'Phone number is required.';
        if (signPwd.length < 6) errs.pwd = 'Password must be at least 6 characters.';
        if (signPwd !== signConfirmPwd) errs.confirm = 'Passwords do not match.';
        setSignErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        const result = await signup(signName.trim(), signEmail.trim(), signPhone.trim(), signPwd);
        setIsLoading(false);
        if (result.success) {
            setSignSuccess(true);
            // After Supabase signup, user may need to confirm email OR
            // if email confirmation is disabled, they're auto-logged-in.
            // Either way, show success then redirect home.
            setTimeout(() => { setPage('home'); }, 2500);
        } else {
            setSignErrors({ email: result.error ?? 'Signup failed.' });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-beige to-white flex items-center justify-center p-4 relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <button onClick={() => setPage('home')} className="text-4xl font-black tracking-tighter text-charcoal hover:text-primary transition-colors">
                        Coco<span className="text-primary">Vibe</span>
                    </button>
                    <p className="text-charcoal/60 mt-1 font-medium">Your tropical hydration journey</p>
                </div>

                {/* Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-white overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {(['login', 'signup'] as Tab[]).map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setLoginError(''); setSignErrors({}); }}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${tab === t ? 'text-primary' : 'text-charcoal/40 hover:text-charcoal/70'
                                    }`}
                            >
                                {t === 'login' ? 'Login' : 'Sign Up'}
                                {tab === t && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {tab === 'login' ? (
                                <motion.form
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleLogin}
                                    className="space-y-5"
                                >
                                    <InputField label="Email" type="email" value={loginEmail} onChange={setLoginEmail} placeholder="you@example.com" />
                                    <InputField label="Password" type="password" value={loginPwd} onChange={setLoginPwd} placeholder="••••••••" />

                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2 cursor-pointer select-none text-charcoal/60 hover:text-charcoal transition-colors">
                                            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="accent-primary w-4 h-4 rounded" />
                                            Remember me
                                        </label>
                                        <button type="button" className="text-primary hover:underline font-medium">
                                            Forgot password?
                                        </button>
                                    </div>

                                    {loginError && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl flex items-center gap-2">
                                            <span>⚠️</span> {loginError}
                                        </motion.p>
                                    )}

                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold text-lg shadow-[0_4px_15px_rgba(46,125,50,0.3)] hover:shadow-[0_8px_25px_rgba(46,125,50,0.4)] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</> : 'Login to CocoVibe'}
                                    </motion.button>

                                    <p className="text-center text-sm text-charcoal/50">
                                        Don't have an account?{' '}
                                        <button type="button" onClick={() => setTab('signup')} className="text-primary font-bold hover:underline">
                                            Sign up
                                        </button>
                                    </p>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    onSubmit={handleSignup}
                                    className="space-y-4"
                                >
                                    {signSuccess ? (
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-center py-6 flex flex-col items-center gap-3"
                                        >
                                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                                <CheckCircle2 size={36} className="text-primary" />
                                            </div>
                                            <h3 className="text-xl font-black text-charcoal">Welcome to CocoVibe! 🥥</h3>
                                            <p className="text-charcoal/60 text-sm max-w-xs">Account created! Check your email to confirm, then log in.</p>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <InputField label="Full Name" value={signName} onChange={setSignName} placeholder="John Doe" error={signErrors.name} />
                                            <InputField label="Email" type="email" value={signEmail} onChange={setSignEmail} placeholder="you@example.com" error={signErrors.email} />
                                            <InputField label="Phone Number" type="tel" value={signPhone} onChange={setSignPhone} placeholder="+91 98765 43210" error={signErrors.phone} />
                                            <InputField label="Password" type="password" value={signPwd} onChange={setSignPwd} placeholder="Min. 6 characters" error={signErrors.pwd} />
                                            <InputField label="Confirm Password" type="password" value={signConfirmPwd} onChange={setSignConfirmPwd} placeholder="Re-enter password" error={signErrors.confirm} />

                                            <motion.button
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-4 bg-gradient-to-r from-primary to-emerald-500 text-white rounded-xl font-bold text-lg shadow-[0_4px_15px_rgba(46,125,50,0.3)] hover:shadow-[0_8px_25px_rgba(46,125,50,0.4)] transition-all mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
                                            >
                                                {isLoading ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</> : 'Create Account'}
                                            </motion.button>

                                            <p className="text-center text-sm text-charcoal/50">
                                                Already have an account?{' '}
                                                <button type="button" onClick={() => setTab('login')} className="text-primary font-bold hover:underline">
                                                    Login
                                                </button>
                                            </p>
                                        </>
                                    )}
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
