import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ------------------------------------
// Database types (mirroring our tables)
// ------------------------------------
export interface DbProfile {
    id: string;
    name: string;
    phone: string;
    avatar_initial: string;
    updated_at: string;
}

export interface DbAddress {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    house: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    is_default: boolean;
    created_at: string;
}

export interface DbOrder {
    id: string;
    user_id: string;
    total: number;
    status: 'Processing' | 'Delivered' | 'Cancelled';
    created_at: string;
    order_items?: DbOrderItem[];
}

export interface DbOrderItem {
    id: string;
    order_id: string;
    user_id: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
}

export interface DbFavorite {
    id: string;
    user_id: string;
    name: string;
    image: string;
    price: number;
    description?: string;
    gradient?: string;
    created_at: string;
}

export interface DbFeedback {
    id: string;
    user_id?: string;
    name: string;
    email: string;
    rating: number;
    message: string;
    created_at: string;
}
