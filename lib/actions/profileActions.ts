"use server";
import { supabase } from '@/lib/supabaseClient';
import { getCurrentVendor } from '@/lib/authUtils';
import { revalidatePath } from 'next/cache';

export interface ProfileFormState {
  message: string;
  type: 'success' | 'error' | null;
}

export async function updateVendorProfile(
  prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const vendorSession = await getCurrentVendor();
  if (!vendorSession || !vendorSession.data || !vendorSession.data.vendor) {
    return { message: 'Authentication required.', type: 'error' };
  }

  const phone_number = formData.get('phone_number') as string;
  const name = formData.get('name') as string; // Allow name update too
  const ageStr = formData.get('age') as string;
  const gender = formData.get('gender') as string;
  const profile_picture_url = formData.get('profile_picture_url') as string | null; // This comes from ImageUploader's hidden input


  const age = ageStr ? parseInt(ageStr) : vendorSession.data.vendor.age;
  if (age !== null && (age < 18 || age > 120)) {
     return { message: 'Age must be between 18 and 120.', type: 'error' };
  }

  const updateData: {
    phone_number?: string;
    name?: string;
    age?: number | null;
    gender?: string | null;
    profile_picture_url?: string | null;
    updated_at: string;
  } = { updated_at: new Date().toISOString() };

  if (phone_number && phone_number !== vendorSession.data.vendor.phone_number) {
    updateData.phone_number = phone_number;
  }
  if (name && name !== vendorSession.data.vendor.name) {
    updateData.name = name;
  }
   if (age !== vendorSession.data.vendor.age) {
    updateData.age = age;
  }
  if (gender && gender !== vendorSession.data.vendor.gender) {
    updateData.gender = gender;
  }
  // Only update profile picture if a new URL is provided (meaning a new image was uploaded)
  if (profile_picture_url && profile_picture_url !== vendorSession.data.vendor.profile_picture_url) {
    updateData.profile_picture_url = profile_picture_url;
  }


  if (Object.keys(updateData).length === 1 && updateData.updated_at) { // Only updated_at is present
      return { message: "No changes detected.", type: 'error' };
  }


  const { error } = await supabase
    .from('vendors')
    .update(updateData)
    .eq('id', vendorSession.data.vendor.id);

  if (error) {
    console.error("Profile update error:", error);
    return { message: error.message, type: 'error' };
  }

  revalidatePath('/vendor/profile');
  revalidatePath('/vendor/layout'); // To update navbar if pic changed
  return { message: 'Profile updated successfully!', type: 'success' };
}