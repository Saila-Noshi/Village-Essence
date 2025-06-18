// vendor/dashboard/page.tsx
import { getCurrentVendor } from '@/lib/authUtils'; 
import { redirect } from 'next/navigation';
import Link from 'next/link'; 
import { createServerClient } from '@supabase/ssr'; 
import { cookies } from 'next/headers'; 

export default async function VendorDashboardPage() {
  const vendorSession = await getCurrentVendor(); 

  if (!vendorSession || !vendorSession.data || !vendorSession.data.vendor) { 
    redirect('/auth/login');
  }

  const { vendor } = vendorSession.data;

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

  const { count: productCount, error: productError } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('vendor_id', vendor.id);

  return (
    <div className="container py-5 vendor-dashboard">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">Welcome, <span className="text-gradient-green-blue">{vendor.name}!</span></h1>
        <p className="lead text-muted">Manage your store, products, and profile with ease.</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card dashboard-card h-100 category-card-hover">
            <div className="card-body text-center d-flex flex-column">
              <div className="icon-wrapper bg-gradient-green-to-blue mx-auto mb-3">
                <i className="bi bi-box-seam text-white fs-2"></i>
              </div>
              <h5 className="card-title fw-semibold">Manage Products</h5>
              <p className="card-text text-muted small flex-grow-1">
                You currently have <strong>{productError ? 'N/A' : productCount ?? 0}</strong> active products listed.
              </p>
              <Link href="/vendor/products" className="btn btn-gradient-green mt-auto w-100">
                View My Products
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card dashboard-card h-100 category-card-hover">
            <div className="card-body text-center d-flex flex-column">
              <div className="icon-wrapper bg-gradient-orange-to-red mx-auto mb-3">
                <i className="bi bi-person-circle text-white fs-2"></i>
              </div>
              <h5 className="card-title fw-semibold">My Profile</h5>
              <p className="card-text text-muted small flex-grow-1">
                Keep your contact information and profile details up to date. 
              </p>
              <Link href="/vendor/profile" className="btn btn-gradient-orange w-100 mt-auto">
                Edit My Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card dashboard-card h-100 category-card-hover">
            <div className="card-body text-center d-flex flex-column">
              <div className="icon-wrapper bg-gradient-blue-to-purple mx-auto mb-3">
                <i className="bi bi-gear-fill text-white fs-2"></i>
              </div>
              <h5 className="card-title fw-semibold">Account Settings</h5>
              <p className="card-text text-muted small flex-grow-1">
                Manage your password and other account settings. 
              </p>
              <Link href="/vendor/settings" className="btn btn-gradient-blue w-100 mt-auto">
                Go to Settings
              </Link>
            </div>
          </div>
        </div>
        {/* Add more cards/links as needed, e.g., Orders, Analytics */}
      </div>
    </div>
  );
}
