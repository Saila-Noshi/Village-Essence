
import { getCurrentVendor } from '@/lib/authUtils';
import { updateProduct, getProductForEdit, getCategoriesList, ProductFormState } from '@/lib/actions/productActions';
import ProductForm from '@/components/vendor/ProductForm';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

const initialState: ProductFormState = { message: '', type: null };

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const vendorSession = await getCurrentVendor();

  if (!vendorSession.data || !vendorSession.data.vendor) {
    redirect('/auth/login');
  }

  const { productId } = await params; // Await params to access productId

  const product = await getProductForEdit(productId, vendorSession.data.vendor.id);

  if (!product) {
    notFound();
  }

  const categories = await getCategoriesList();
  const updateProductWithId = updateProduct.bind(null, productId);

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/vendor/dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item"><Link href="/vendor/products">My Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Edit Product</li>
        </ol>
      </nav>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-dark fw-bold">Edit Product: <span className="text-gradient-green-blue">{product.name}</span></h1>
      </div>
      <div className="card shadow-sm">
        <div className="card-body p-lg-4">
          <ProductForm
            formAction={updateProductWithId}
            initialState={initialState}
            categories={categories}
            vendorId={vendorSession.data.vendor.id}
            product={product}
            submitButtonText="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
