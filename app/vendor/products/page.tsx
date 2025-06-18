import { getCurrentVendor } from '@/lib/authUtils';
import { getVendorProducts, deleteProduct } from '@/lib/actions/productActions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProductListClient from './ProductListClient';

export default async function VendorProductsPage() {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession.data || !vendorSession.data.vendor) {
    redirect('/auth/login');
  }

  // Fetch all products, including inactive ones
  const products = await getVendorProducts(vendorSession.data.vendor.id);

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/vendor/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item active" aria-current="page">My Products</li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-dark fw-bold">My Products</h1>
        <Link href="/vendor/products/new" className="btn btn-gradient-green btn-lg">
          <i className="bi bi-plus-circle-fill me-2"></i>Add New Product
        </Link>
      </div>
      {products.length === 0 ? (
        <div className="alert alert-info text-center p-4">
          <i className="bi bi-info-circle-fill fs-2 text-info mb-3 d-block"></i>
          <h4 className="alert-heading">No Products Yet!</h4>
          <p>You haven't added any products. Click the button above to get started.</p>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <ProductListClient products={products} deleteProductAction={deleteProduct} />
          </div>
        </div>
      )}
    </div>
  );
}