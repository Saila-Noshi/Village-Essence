// vendor/products/new/page.tsx
import { getCurrentVendor } from '@/lib/authUtils';
import { addProduct, getCategoriesList, ProductFormState } from '@/lib/actions/productActions';
import ProductForm from '@/components/vendor/ProductForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const initialState: ProductFormState = { message: '', type: null };

export default async function AddProductPage() {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession.data || !vendorSession.data.vendor) {
    redirect('/auth/login');
  }
  
  const categories = await getCategoriesList();

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/vendor/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link href="/vendor/products">My Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Add New Product</li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-dark fw-bold">Add New Product</h1>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-lg-4">
          <ProductForm
            formAction={addProduct}
            initialState={initialState}
            categories={categories}
            vendorId={vendorSession.data.vendor.id}
            submitButtonText="Add Product"
          />
        </div>
      </div>
    </div>
  );
}
