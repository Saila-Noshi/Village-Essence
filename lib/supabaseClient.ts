// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Supabase Anon Key is missing from .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // autoRefreshToken: true, // Default true
    // persistSession: true, // Default true, uses localStorage
    // detectSessionInUrl: true // Default true, for OAuth redirects
  }
});

// Interface for Product from the view 'products_with_frontend_price'
export interface Product {
  id: string;
  vendor_id: string;
  category_id: string;
  name: string;
  description: string;
  base_price: number;
  quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
  markup_percentage: number;
  frontend_price: number;
  vendor_name: string;
  vendor_profile_picture: string | null;
  images: ProductImage[] | null;
}

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order?: number;
  is_primary?: boolean;
}

export interface Category {
  id: string;
  name: string;
  markup_percentage: number;
  description?: string;
}

// Interface for Cart Item
export interface CartItem extends Product {
  cartQuantity: number;
}