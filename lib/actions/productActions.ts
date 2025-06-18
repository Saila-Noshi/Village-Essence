"use server";
import { supabase } from '@/lib/supabaseClient';
import { getCurrentVendor } from '@/lib/authUtils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Product } from '@/lib/supabaseClient';

export interface ProductFormState {
  message: string;
  type: 'success' | 'error' | null;
  productId?: string;
  errors?: { [key: string]: string };
}

function parseProductFormData(formData: FormData) {
  return {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    base_price: parseFloat(formData.get('base_price') as string),
    quantity: parseInt(formData.get('quantity') as string, 10),
    category_id: formData.get('category_id') as string,
    is_active: formData.get('is_active') === 'on' || formData.get('is_active') === 'true',
    image_uploads: JSON.parse(formData.get('image_uploads') as string || '[]') as { publicUrl: string, filePath: string, isPrimary: boolean, altText?: string }[],
  };
}

export async function addProduct(
  prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const vendorSession = await getCurrentVendor();
  if (!vendorSession || !vendorSession.data?.vendor) {
    return { message: 'Authentication required.', type: 'error' };
  }

  const data = parseProductFormData(formData);

  if (!data.name || !data.category_id || isNaN(data.base_price) || isNaN(data.quantity)) {
    return { message: 'Missing required fields or invalid data.', type: 'error' };
  }
  if (data.base_price <= 0 || data.quantity < 0) {
    return { message: 'Price must be positive and quantity non-negative.', type: 'error' };
  }

  const { data: productData, error: productError } = await supabase
    .from('products')
    .insert({
      vendor_id: vendorSession.data.vendor.id,
      name: data.name,
      description: data.description,
      base_price: data.base_price,
      quantity: data.quantity,
      category_id: data.category_id,
      is_active: data.is_active,
    })
    .select()
    .single();

  if (productError || !productData) {
    console.error("Add product error:", productError);
    return { message: productError?.message || 'Failed to add product.', type: 'error' };
  }

  if (data.image_uploads && data.image_uploads.length > 0) {
    const imageRecords = data.image_uploads.map((img, index) => ({
      product_id: productData.id,
      image_url: img.publicUrl,
      is_primary: img.isPrimary || (index === 0 && !data.image_uploads.some(i => i.isPrimary)),
      display_order: index,
    }));
    const { error: imageError } = await supabase.from('product_images').insert(imageRecords);
    if (imageError) {
      console.error("Product image insert error:", imageError);
      return { message: `Product added, but failed to save images: ${imageError.message}`, type: 'error', productId: productData.id };
    }
  }

  revalidatePath('/vendor/products');
  return { message: 'Product added successfully!', type: 'success', productId: productData.id };
}

export async function updateProduct(
  productId: string,
  prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const vendorSession = await getCurrentVendor();
  if (!vendorSession || !vendorSession.data?.vendor) {
    return { message: 'Authentication required.', type: 'error' };
  }

  const data = parseProductFormData(formData);

  const { data: existingProduct, error: fetchError } = await supabase
    .from('products')
    .select('id, vendor_id')
    .eq('id', productId)
    .eq('vendor_id', vendorSession.data.vendor.id)
    .single();

  if (fetchError || !existingProduct) {
    return { message: 'Product not found or you do not have permission to edit it.', type: 'error' };
  }

  const { error: productError } = await supabase
    .from('products')
    .update({
      name: data.name,
      description: data.description,
      base_price: data.base_price,
      quantity: data.quantity,
      category_id: data.category_id,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (productError) {
    console.error("Update product error:", productError);
    return { message: productError.message, type: 'error' };
  }

  const { error: deleteImagesError } = await supabase
    .from('product_images')
    .delete()
    .eq('product_id', productId);

  if (deleteImagesError) {
    console.warn("Could not delete old product images:", deleteImagesError.message);
  }

  if (data.image_uploads && data.image_uploads.length > 0) {
    const imageRecords = data.image_uploads.map((img, index) => ({
      product_id: productId,
      image_url: img.publicUrl,
      is_primary: img.isPrimary || (index === 0 && !data.image_uploads.some(i => i.isPrimary)),
      display_order: index,
    }));
    const { error: imageError } = await supabase.from('product_images').insert(imageRecords);
    if (imageError) {
      console.error("Product image update error:", imageError);
      return { message: `Product updated, but failed to save new images: ${imageError.message}`, type: 'error', productId };
    }
  }

  revalidatePath('/vendor/products');
  revalidatePath(`/vendor/products/edit/${productId}`);
  return { message: 'Product updated successfully!', type: 'success', productId };
}

export async function deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
  const vendorSession = await getCurrentVendor();
  if (!vendorSession || !vendorSession.data?.vendor) {
    return { success: false, message: 'Authentication required.' };
  }

  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('id, vendor_id, product_images(image_url)')
    .eq('id', productId)
    .eq('vendor_id', vendorSession.data.vendor.id)
    .single();

  if (fetchError || !product) {
    return { success: false, message: 'Product not found or you do not have permission.' };
  }

  const imageUrls = product.product_images?.map((img: { image_url: string }) => img.image_url) || [];
  if (imageUrls.length > 0) {
    const filePaths = imageUrls.map(url => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname.split(`/product-images/`)[1];
      } catch (e) {
        console.error("Error parsing image URL for deletion:", url, e);
        return null;
      }
    }).filter(path => path !== null) as string[];

    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove(filePaths);
      if (storageError) {
        console.warn("Failed to delete some product images from storage:", storageError.message);
      }
    }
  }

  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (deleteError) {
    console.error("Delete product error:", deleteError);
    return { success: false, message: deleteError.message };
  }

  revalidatePath('/vendor/products');
  return { success: true, message: 'Product deleted successfully.' };
}

export async function getVendorProducts(vendorId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (name),
      product_images (image_url, is_primary, display_order)
    `)
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching vendor products:", error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    base_price: item.base_price,
    frontend_price: item.base_price, // Adjust if you have a separate frontend_price logic
    quantity: item.quantity,
    category_id: item.category_id,
    category_name: item.categories?.name || 'N/A',
    is_active: item.is_active,
    images: item.product_images || [],
  })) as Product[];
}

export async function getProductForEdit(productId: string, vendorId: string): Promise<Product & { images_data: any[] } | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name),
      images_data:product_images (id, image_url, alt_text, is_primary, display_order)
    `)
    .eq('id', productId)
    .eq('vendor_id', vendorId)
    .single();

  if (error) {
    console.error("Error fetching product for edit:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    base_price: data.base_price,
    frontend_price: data.base_price, // Adjust if needed
    quantity: data.quantity,
    category_id: data.category_id,
    category_name: data.categories?.name || 'N/A',
    is_active: data.is_active,
    images: data.images_data || [],
    images_data: data.images_data || [],
  } as Product & { images_data: any[] };
}

export async function getCategoriesList(): Promise<{id: string, name: string}[]> {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}