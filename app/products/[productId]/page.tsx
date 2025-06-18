import { supabase, Product } from '@/lib/supabaseClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductImagesGallery from '@/components/ProductImagesGallery';
import AddToCartButton from '@/components/AddToCartButton';

async function getProductDetails(productId: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products_with_frontend_price')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error('Error fetching product details or product not found:', error);
    return null;
  }
  return data as Product;
}

export interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { productId } = await params;
  const product = await getProductDetails(productId);

  if (!product) notFound();

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    '/placeholder-image.png';

  return (
    <div className="container py-5 product-detail-page">
      <div className="row g-5">
        {/* Product Images */}
        <div className="col-lg-6">
          <ProductImagesGallery
            images={
              product.images?.length
                ? product.images
                : [{ id: 'default', image_url: primaryImage, alt_text: product.name, is_primary: true }]
            }
            productName={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/products">Products</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href={`/products?category=${product.category_id}`}>
                  {product.category_name || 'Category'}
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <h1 className="product-title display-5 fw-bold mb-2">{product.name}</h1>
          <p className="text-muted mb-3">
            In{' '}
            <Link
              href={`/products?category=${product.category_id}`}
              className="text-decoration-none theme-link-hover"
            >
              {product.category_name || 'N/A'}
            </Link>
          </p>

          <div className="product-price-display mb-3">
            <span className="h2 fw-bold text-gradient-green-blue me-2">
              PKR {product.frontend_price.toFixed(2)}
            </span>
          </div>

          <p
            className={`mb-3 fw-semibold product-availability ${
              product.quantity > 0 ? 'text-success' : 'text-danger'
            }`}
          >
            <i
              className={`bi me-2 ${
                product.quantity > 0 ? 'bi-check-circle-fill' : 'bi-x-circle-fill'
              }`}
            ></i>
            {product.quantity > 0
              ? `${product.quantity} available - In Stock`
              : 'Currently Out of Stock'}
          </p>

          <p className="product-description lead fs-6 mb-4">
            {product.description || 'No description available.'}
          </p>

          <div className="mt-4">
            <AddToCartButton product={product} />
          </div>

          <hr className="my-4" />

          {/* Vendor Info */}
          <div className="vendor-info-card p-3 rounded">
            <h5 className="mb-3">Sold by:</h5>
            <div className="d-flex align-items-center mb-2">
              {product.vendor_profile_picture ? (
                <img
                  src={product.vendor_profile_picture}
                  alt={product.vendor_name || 'Vendor'}
                  className="rounded-circle me-3 vendor-avatar-detail"
                />
              ) : (
                <div className="vendor-avatar-placeholder rounded-circle me-3 d-flex align-items-center justify-content-center bg-gradient-green-to-blue text-white">
                  <i className="bi bi-shop fs-4"></i>
                </div>
              )}
              <div>
                <h6 className="mb-0">
                  <Link
                    href={`/all-vendors/${product.vendor_id}`}
                    className="text-decoration-none fw-bold theme-link-hover"
                  >
                    {product.vendor_name || 'Anonymous Vendor'}
                  </Link>
                </h6>
              </div>
            </div>
            <Link
              href={`/all-vendors/${product.vendor_id}?show=products`}
              className="btn btn-outline-success btn-sm mt-2 w-100"
            >
              <i className="bi bi-box-seam me-2"></i>View all products from this vendor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 600;