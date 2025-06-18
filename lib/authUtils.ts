import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User } from '@supabase/supabase-js';

export interface VendorProfile {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  age: number | null;
  gender: string | null;
  profile_picture_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getCurrentVendor(): Promise<{ data: { user: User; vendor: VendorProfile } | null; error: string | null }> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
          },
          async set(name: string, value: string, options: any) {
            try {
              const cookieStore = await cookies();
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // Ignore errors in Server Components
            }
          },
          async remove(name: string, options: any) {
            try {
              const cookieStore = await cookies();
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // Ignore errors in Server Components
            }
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { data: null, error: userError?.message || 'No user authenticated.' };
    }

    const userRole = user.app_metadata?.role;
    if (userRole !== 'vendor') {
      return { data: null, error: `User ${user.email} is not a vendor (role: ${userRole}).` };
    }

    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', user.id)
      .single();

    if (vendorError || !vendorData) {
      return { data: null, error: vendorError?.message || 'Vendor profile not found.' };
    }

    // Log profile picture URL for debugging (already public, no need to convert)
    if (vendorData.profile_picture_url) {
      console.log('Profile Picture URL:', vendorData.profile_picture_url);
    } else {
      console.log('No Profile Picture Found for Vendor ID:', vendorData.id);
    }

    return { data: { user, vendor: vendorData as VendorProfile }, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Unexpected error in getCurrentVendor.' };
  }
}