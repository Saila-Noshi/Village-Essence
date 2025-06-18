
"use server";
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { type SignUpWithPasswordCredentials, type SignInWithPasswordCredentials } from '@supabase/supabase-js';

export interface AuthFormState {
  message: string;
  type: 'success' | 'error' | null;
  fields?: Record<string, string>;
  issues?: string[];
}

function createSupabaseServerClient() {
  return createServerClient(
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
}

export async function signUpVendor(
  prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const phone_number = formData.get('phone_number') as string;
  const ageStr = formData.get('age') as string;
  const gender = formData.get('gender') as string;

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.', type: 'error' };
  }

  const age = ageStr ? parseInt(ageStr) : null;
  if (age !== null && (age < 18 || age > 120)) {
    return { message: 'Age must be between 18 and 120.', type: 'error' };
  }

  const supabase = createSupabaseServerClient();
  const credentials: SignUpWithPasswordCredentials = { email, password };

  const { data: authData, error: authError } = await supabase.auth.signUp(credentials);

  if (authError || !authData.user) {
    console.error("Auth signup error:", authError);
    return { message: authError?.message || 'Signup failed. Please try again.', type: 'error' };
  }

  const { error: vendorError } = await supabase
    .from('vendors')
    .insert({
      id: authData.user.id,
      name,
      email,
      phone_number,
      age,
      gender,
    });

  if (vendorError) {
    console.error("Vendor profile creation error:", vendorError);
    return { message: `Signup was successful but profile creation failed: ${vendorError.message}. Please contact support.`, type: 'error' };
  }

  revalidatePath('/');
  return { message: 'Signup successful! Please check your email to confirm your account.', type: 'success' };
}

export async function signInVendor(
  prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = createSupabaseServerClient();
  const credentials: SignInWithPasswordCredentials = { email, password };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.error("signInVendor Action Error:", error.message);
    return { message: error.message, type: 'error' };
  }

  if (!data.session || !data.user) {
    console.error("signInVendor Action: No session or user data returned.");
    return { message: "Login seemed to succeed but no session data was returned. Please try again.", type: 'error' };
  }

  const userRole = data.user.app_metadata?.role;
  console.log("signInVendor Action: User signed in. Role:", userRole);

  // Handle different roles
  if (userRole === 'admin') {
    revalidatePath('/admin/dashboard', 'layout');
    revalidatePath('/admin', 'layout');
    redirect('/admin/dashboard');
  }

  if (userRole === 'vendor') {
    // Check if vendor profile exists
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (vendorError || !vendorData) {
      console.error("signInVendor Action: Vendor profile not found:", vendorError?.message);
      await supabase.auth.signOut(); // Sign out the user to prevent access
      return { message: 'Your account does not exist or has been deleted. Please contact support.', type: 'error' };
    }

    revalidatePath('/vendor/dashboard', 'layout');
    revalidatePath('/vendor', 'layout');
    redirect('/vendor/dashboard');
  }

  // If role is neither admin nor vendor
  await supabase.auth.signOut();
  console.warn(`signInVendor Action: User ${email} signed in but has invalid role: ${userRole}.`);
  return { message: 'Login successful, but you do not have access to this area. Please contact support.', type: 'error' };
}

export async function signOutVendor() {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Signout error:", error);
    return { message: error.message, type: 'error' };
  }
  redirect('/auth/login');
}

export async function updateVendorPassword(
  prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmNewPassword = formData.get('confirmNewPassword') as string;

  if (newPassword !== confirmNewPassword) {
    return { message: 'New passwords do not match.', type: 'error' };
  }
  if (newPassword.length < 6) {
    return { message: 'New password must be at least 6 characters long.', type: 'error' };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    console.error("Password update error:", error);
    return { message: error.message, type: 'error' };
  }

  return { message: 'Password updated successfully.', type: 'success' };
}

export async function deleteVendorAccount(
  prevState: AuthFormState | undefined,
  formData: FormData
): Promise<AuthFormState> {
  const password = formData.get('password') as string;

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { message: 'User not authenticated.', type: 'error' };
  }

  // Re-authenticate the user
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: password,
  });

  if (reauthError) {
    return { message: 'Incorrect password. Account deletion failed.', type: 'error' };
  }

  // Delete vendor profile from vendors table
  const { error: deleteVendorError } = await supabase
    .from('vendors')
    .delete()
    .eq('id', user.id);

  if (deleteVendorError) {
    return { message: `Failed to delete vendor profile: ${deleteVendorError.message}`, type: 'error' };
  }

  // Delete user from Supabase auth using admin API
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
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

  const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (deleteUserError) {
    return { message: `Failed to delete user account: ${deleteUserError.message}`, type: 'error' };
  }

  // Sign out the user
  await supabase.auth.signOut();

  return { message: 'Account deleted successfully.', type: 'success' };
}
