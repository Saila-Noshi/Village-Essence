export type Category = {
  id: string;
  name: string;
  markup_percentage: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProductImage = {
  id: string;
  image_url: string;
  alt_text?: string;
  display_order?: number;
  is_primary?: boolean;
};

export type Product = {
  id: string;
  vendor_id: string;
  category_id: string;
  name: string;
  description?: string;
  base_price: number;
  quantity: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // Fields from products_with_frontend_price view
  category_name?: string;
  markup_percentage?: number;
  frontend_price?: number;
  vendor_name?: string;
  vendor_profile_picture?: string;
  images?: ProductImage[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Customer = {
  id?: string;
  name: string;
  email?: string; // Optional
  phone_number: string;
  address: string;
  created_at?: string;
};

export type Vendor = {
  id: string; // References auth.users(id)
  name: string;
  email: string; // Should be unique
  phone_number: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profile_picture_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type OrderItem = {
  id?: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  quantity: number;
  unit_price: number; // Frontend price (with markup)
  base_unit_price: number; // Vendor's original price
  total_price: number;
  // Optional: for display purposes in admin
  product_name?: string;
  vendor_name?: string;
  category_name?: string;
};

export type Order = {
  id?: string;
  customer_id: string;
  order_number?: string;
  total_amount: number;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // For order_details view
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  items?: OrderItem[];
};

// types.ts or lib/types.ts
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
// Add other shared types if needed