"use server";

import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

// Interface for Vendor
export interface Vendor {
  id: string;
  name: string;
  profile_picture_url: string | null;
}

/**
 * Fetches vendors from the database with pagination and role filter.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<Vendor[]>} A promise that resolves to an array of vendors.
 */
export const getAllVendors = async (page: number = 0, limit: number = 10): Promise<Vendor[]> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('id, name, profile_picture_url')
    .eq('role', 'vendor') // Filter by role
    .range(page * limit, (page + 1) * limit - 1); // Pagination

  if (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }

  return data || [];
};

/**
 * Fetches a single vendor by their ID.
 * @param {string} id - The UUID of the vendor to fetch.
 * @returns {Promise<Vendor>} A promise that resolves to the vendor object.
 */
export const getVendorById = async (id: string): Promise<Vendor> => {
  const { data, error } = await supabase
    .from('vendors')
    .select('id, name, profile_picture_url')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error fetching vendor with ID ${id}:`, error);
    notFound();
  }

  return data;
};
