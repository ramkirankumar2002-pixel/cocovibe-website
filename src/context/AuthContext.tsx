import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { DbAddress, DbOrder, DbFavorite, DbFeedback } from '../lib/supabase';

// ─────────────────────────────────────
// Public-facing Types
// ─────────────────────────────────────

export interface OrderItem {
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    date: string;
    status: 'Delivered' | 'Processing' | 'Cancelled';
}

export interface Address {
    id: string;
    fullName: string;
    phone: string;
    house: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
}

export interface FavoriteProduct {
    name: string;
    image: string;
    price: number;
    desc: string;
    gradient: string;
}

export interface Feedback {
    id: string;
    name: string;
    email: string;
    rating: number;
    message: string;
    date: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarInitial: string;
    orders: Order[];
    addresses: Address[];
    favorites: FavoriteProduct[];
    feedbacks: Feedback[];
}

type Page = 'home' | 'auth' | 'dashboard';
type AuthLoading = 'idle' | 'loading';

interface AuthContextType {
    user: UserProfile | null;
    page: Page;
    authLoading: AuthLoading;
    setPage: (p: Page) => void;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (updates: { name?: string; phone?: string }) => Promise<void>;
    addOrder: (items: OrderItem[], total: number) => Promise<void>;
    addAddress: (addr: Omit<Address, 'id' | 'isDefault'>) => Promise<void>;
    updateAddress: (id: string, addr: Omit<Address, 'id' | 'isDefault'>) => Promise<void>;
    deleteAddress: (id: string) => Promise<void>;
    setDefaultAddress: (id: string) => Promise<void>;
    addFavorite: (product: FavoriteProduct) => Promise<void>;
    removeFavorite: (name: string) => Promise<void>;
    isFavorite: (name: string) => boolean;
    addFeedback: (fb: Omit<Feedback, 'id' | 'date'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────
// Helpers: map DB rows → frontend types
// ─────────────────────────────────────

function mapAddress(a: DbAddress): Address {
    return { id: a.id, fullName: a.full_name, phone: a.phone, house: a.house, street: a.street, city: a.city, state: a.state, pincode: a.pincode, landmark: a.landmark, isDefault: a.is_default };
}

function mapOrder(o: DbOrder): Order {
    return {
        id: o.id,
        total: o.total,
        date: o.created_at,
        status: o.status as Order['status'],
        items: (o.order_items ?? []).map(i => ({ name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
    };
}

function mapFavorite(f: DbFavorite): FavoriteProduct {
    return { name: f.name, image: f.image, price: f.price, desc: f.description ?? '', gradient: f.gradient ?? 'from-emerald-50 to-white' };
}

function mapFeedback(f: DbFeedback): Feedback {
    return { id: f.id, name: f.name, email: f.email, rating: f.rating, message: f.message, date: f.created_at };
}

// ─────────────────────────────────────
// Fetch all user data from Supabase
// ─────────────────────────────────────

async function fetchUserData(supabaseUser: SupabaseUser): Promise<UserProfile> {
    const uid = supabaseUser.id;
    const email = supabaseUser.email ?? '';

    const [profileRes, addressRes, ordersRes, favRes, fbRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).single(),
        supabase.from('addresses').select('*').eq('user_id', uid).order('created_at'),
        supabase.from('orders').select('*, order_items(*)').eq('user_id', uid).order('created_at', { ascending: false }),
        supabase.from('favorites').select('*').eq('user_id', uid).order('created_at'),
        supabase.from('feedbacks').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
    ]);

    const profile = profileRes.data;
    return {
        id: uid,
        email,
        name: profile?.name ?? supabaseUser.user_metadata?.name ?? '',
        phone: profile?.phone ?? supabaseUser.user_metadata?.phone ?? '',
        avatarInitial: profile?.avatar_initial ?? (profile?.name?.charAt(0).toUpperCase() ?? '?'),
        orders: (ordersRes.data as DbOrder[] ?? []).map(mapOrder),
        addresses: (addressRes.data as DbAddress[] ?? []).map(mapAddress),
        favorites: (favRes.data as DbFavorite[] ?? []).map(mapFavorite),
        feedbacks: (fbRes.data as DbFeedback[] ?? []).map(mapFeedback),
    };
}

// ─────────────────────────────────────
// Provider
// ─────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [page, setPageState] = useState<Page>('home');
    const [authLoading, setAuthLoading] = useState<AuthLoading>('loading');
    const initDone = useRef(false);

    const setPage = useCallback((p: Page) => setPageState(p), []);

    // Bootstrap: get current session on mount
    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session: s } }) => {
            setSession(s);
            if (s?.user) {
                try {
                    const profile = await fetchUserData(s.user);
                    setUser(profile);
                } catch { /* ignore */ }
            }
            setAuthLoading('idle');
            initDone.current = true;
        });

        // Listen for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
            setSession(s);
            if (s?.user) {
                try {
                    const profile = await fetchUserData(s.user);
                    setUser(profile);
                } catch { /* ignore */ }
            } else {
                setUser(null);
                if (initDone.current && event === 'SIGNED_OUT') {
                    setPageState('home');
                }
            }
            if (!initDone.current) {
                setAuthLoading('idle');
                initDone.current = true;
            }
        });

        return () => { subscription.unsubscribe(); };
    }, []);

    // ─── Auth ───────────────────────────────────────

    const login = useCallback(async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        return { success: true };
    }, []);

    const signup = useCallback(async (name: string, email: string, phone: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, phone } },
        });
        if (error) return { success: false, error: error.message };
        return { success: true };
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    // ─── Profile ─────────────────────────────────────

    const updateProfile = useCallback(async (updates: { name?: string; phone?: string }) => {
        if (!session?.user) return;
        await supabase.from('profiles').update(updates).eq('id', session.user.id);
        setUser(prev => prev ? { ...prev, ...updates, avatarInitial: (updates.name ?? prev.name).charAt(0).toUpperCase() } : prev);
    }, [session]);

    // ─── Orders ──────────────────────────────────────

    const addOrder = useCallback(async (items: OrderItem[], total: number) => {
        if (!session?.user) return;
        const uid = session.user.id;

        const { data: order, error } = await supabase
            .from('orders')
            .insert({ user_id: uid, total, status: 'Processing' })
            .select()
            .single();
        if (error || !order) return;

        const lineItems = items.map(i => ({ order_id: order.id, user_id: uid, name: i.name, image: i.image, price: i.price, quantity: i.quantity }));
        await supabase.from('order_items').insert(lineItems);

        const newOrder: Order = { id: order.id, total, date: order.created_at, status: 'Processing', items };
        setUser(prev => prev ? { ...prev, orders: [newOrder, ...prev.orders] } : prev);
    }, [session]);

    // ─── Addresses ───────────────────────────────────

    const addAddress = useCallback(async (addr: Omit<Address, 'id' | 'isDefault'>) => {
        if (!session?.user) return;
        const uid = session.user.id;
        const isFirst = (user?.addresses.length ?? 0) === 0;

        const { data, error } = await supabase
            .from('addresses')
            .insert({ user_id: uid, full_name: addr.fullName, phone: addr.phone, house: addr.house, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, landmark: addr.landmark, is_default: isFirst })
            .select()
            .single();
        if (error || !data) return;

        setUser(prev => prev ? { ...prev, addresses: [...prev.addresses, mapAddress(data as DbAddress)] } : prev);
    }, [session, user?.addresses.length]);

    const updateAddress = useCallback(async (id: string, addr: Omit<Address, 'id' | 'isDefault'>) => {
        if (!session?.user) return;
        await supabase.from('addresses').update({ full_name: addr.fullName, phone: addr.phone, house: addr.house, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, landmark: addr.landmark }).eq('id', id);
        setUser(prev => {
            if (!prev) return prev;
            return { ...prev, addresses: prev.addresses.map(a => a.id === id ? { ...a, ...addr } : a) };
        });
    }, [session]);

    const deleteAddress = useCallback(async (id: string) => {
        if (!session?.user) return;
        await supabase.from('addresses').delete().eq('id', id);
        setUser(prev => {
            if (!prev) return prev;
            const remaining = prev.addresses.filter(a => a.id !== id);
            if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
                remaining[0] = { ...remaining[0], isDefault: true };
                supabase.from('addresses').update({ is_default: true }).eq('id', remaining[0].id);
            }
            return { ...prev, addresses: remaining };
        });
    }, [session]);

    const setDefaultAddress = useCallback(async (id: string) => {
        if (!session?.user) return;
        const uid = session.user.id;
        // Clear all defaults first, then set new one
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', uid);
        await supabase.from('addresses').update({ is_default: true }).eq('id', id);
        setUser(prev => prev ? { ...prev, addresses: prev.addresses.map(a => ({ ...a, isDefault: a.id === id })) } : prev);
    }, [session]);

    // ─── Favorites ───────────────────────────────────

    const addFavorite = useCallback(async (product: FavoriteProduct) => {
        if (!session?.user) return;
        const uid = session.user.id;
        if (user?.favorites.some(f => f.name === product.name)) return;

        const { data, error } = await supabase
            .from('favorites')
            .insert({ user_id: uid, name: product.name, image: product.image, price: product.price, description: product.desc, gradient: product.gradient })
            .select()
            .single();
        if (error || !data) return;

        setUser(prev => prev ? { ...prev, favorites: [...prev.favorites, product] } : prev);
    }, [session, user?.favorites]);

    const removeFavorite = useCallback(async (name: string) => {
        if (!session?.user) return;
        await supabase.from('favorites').delete().eq('user_id', session.user.id).eq('name', name);
        setUser(prev => prev ? { ...prev, favorites: prev.favorites.filter(f => f.name !== name) } : prev);
    }, [session]);

    const isFavorite = useCallback((name: string) => {
        return user?.favorites.some(f => f.name === name) ?? false;
    }, [user?.favorites]);

    // ─── Feedback ────────────────────────────────────

    const addFeedback = useCallback(async (fb: Omit<Feedback, 'id' | 'date'>) => {
        const uid = session?.user?.id;
        const { data, error } = await supabase
            .from('feedbacks')
            .insert({ user_id: uid ?? null, name: fb.name, email: fb.email, rating: fb.rating, message: fb.message })
            .select()
            .single();
        if (error || !data) return;

        const newFb = mapFeedback(data as DbFeedback);
        setUser(prev => prev ? { ...prev, feedbacks: [newFb, ...prev.feedbacks] } : prev);
    }, [session]);

    // ─── Render ──────────────────────────────────────

    return (
        <AuthContext.Provider value={{
            user, page, authLoading, setPage,
            login, signup, logout,
            updateProfile, addOrder,
            addAddress, updateAddress, deleteAddress, setDefaultAddress,
            addFavorite, removeFavorite, isFavorite,
            addFeedback,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
