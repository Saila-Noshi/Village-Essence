'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createSupabaseServerClient() {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        const cookieStore = await cookies();
        return cookieStore.get(name)?.value;
      },
      async set(name: string, value: string, options: any) {
        const cookieStore = await cookies();
        cookieStore.set({ name, value, ...options });
      },
      async remove(name: string, options: any) {
        const cookieStore = await cookies();
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}
