import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVendorById } from '@/lib/actions/vendorActions';
import { getVendorProducts } from '@/lib/actions/productActions';
import ProductCard from '@/components/ProductCard';

interface VendorPageProps {
  params: Promise<{
    vendorId: string;
  }>;
}

export default async function VendorProductsPage({ params }: VendorPageProps) {
  const { vendorId } = await params;

  if (!vendorId) {
    notFound();
  }

  const [vendor, products] = await Promise.all([
    getVendorById(vendorId),
    getVendorProducts(vendorId)
  ]);

  if (!vendor) {
    notFound();
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Home</Link></li>
          <li className="breadcrumb-item"><Link href="/all-vendors">All Vendors</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{vendor.name}</li>
        </ol>
      </nav>

      <div className="vendor-header d-flex flex-column align-items-center text-center mb-5 p-4 rounded-3" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #d9f9e6 100%)' }}>
        <div className="vendor-avatar-container mb-3">
          <img
            src={vendor.profile_picture_url || '/images/vendor-placeholder.png'}
            alt={`${vendor.name} profile`}
            className="rounded-circle"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              border: '5px solid #ffffff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>
        <div className="vendor-info">
          <h1 className="display-5 fw-bold text-dark mb-2">{vendor.name}</h1>
          <p className="lead text-muted mb-0">
            Explore the finest products curated by {vendor.name}.
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-5 bg-light rounded-3">
          <i className="bi bi-box-seam fs-1 text-secondary mb-3 d-block"></i>
          <h4 className="text-dark">No Products Available</h4>
          <p className="text-muted">This vendor has not listed any products yet. Please check back later.</p>
        </div>
      )}
    </div>
  );
}