"use server";

import { revalidatePath } from "next/cache";
import { type OrderStatus } from "@/lib/types";
import { cookies } from "next/headers";
import { createServerClient as createSupabaseServerClientOriginal } from "@supabase/ssr";

export interface AdminActionFormState {
  message: string;
  type: "success" | "error" | null;
  errors?: Record<string, string>;
}

function createSupabaseAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase URL and Service Role Key are required. Check your Supabase project's API settings at https://supabase.com/dashboard/project/_/settings/api");
  }

  return createSupabaseServerClientOriginal(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get: async (name: string) => {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        set: async (name: string, value: string, options: any) => {
          try {
            const cookieStore = await cookies();
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignore errors in Server Components
          }
        },
        remove: async (name: string, options: any) => {
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

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<AdminActionFormState> {
  try {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return { message: `Failed to update order status: ${error.message}`, type: "error" };
    }

    revalidatePath(`/admin/dashboard/orders`);
    revalidatePath(`/admin/dashboard/orders/${orderId}`);
    return { message: "Order status updated successfully.", type: "success" };
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return { message: "Failed to initialize Supabase client. Please check your configuration.", type: "error" };
  }
}

export async function deleteVendor(vendorId: string): Promise<AdminActionFormState> {
  try {
    const supabase = createSupabaseAdminClient();

    const { error: deleteAuthUserError } = await supabase.auth.admin.deleteUser(vendorId);

    if (deleteAuthUserError) {
      console.error("Error deleting vendor auth user:", deleteAuthUserError);
      return { message: `Failed to delete vendor: ${deleteAuthUserError.message}`, type: "error" };
    }

    revalidatePath(`/admin/dashboard/vendors`);
    revalidatePath(`/admin/dashboard/products`);
    return { message: "Vendor deleted successfully. Associated products may also be removed.", type: "success" };
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return { message: "Failed to initialize Supabase client. Please check your configuration.", type: "error" };
  }
}

export async function deleteProduct(productId: string): Promise<AdminActionFormState> {
  try {
    const supabase = createSupabaseAdminClient();

    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId);

    if (imagesError) {
      console.warn("Could not fetch product images for deletion from DB:", imagesError.message);
    }

    const { error: deleteProductError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteProductError) {
      console.error("Error deleting product from DB:", deleteProductError);
      return { message: `Failed to delete product: ${deleteProductError.message}`, type: "error" };
    }

    if (images && images.length > 0) {
      const imagePaths = images
        .map((img) => {
          try {
            const url = new URL(img.image_url);
            const pathSegments = url.pathname.split('/');
            const bucketName = 'product-images';
            const bucketIndex = pathSegments.findIndex((segment) => segment === bucketName);
            if (bucketIndex !== -1 && bucketIndex + 1 < pathSegments.length) {
              return pathSegments.slice(bucketIndex + 1).join('/');
            }
            return null;
          } catch (e) {
            console.error("Error parsing image URL for storage deletion:", img.image_url, e);
            return null;
          }
        })
        .filter((path) => path !== null) as string[];

      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove(imagePaths);

        if (storageError) {
          console.warn("Error deleting product images from storage:", storageError.message);
          revalidatePath(`/admin/dashboard/products`);
          return { message: "Product deleted from database, but failed to remove some images from storage.", type: "error" };
        }
      }
    }

    revalidatePath(`/admin/dashboard/products`);
    revalidatePath(`/admin/dashboard/orders`);
    return { message: "Product and associated images deleted successfully.", type: "success" };
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    return { message: "Failed to initialize Supabase client. Please check your configuration.", type: "error" };
  }
}