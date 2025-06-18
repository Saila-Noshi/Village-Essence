import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { format } from 'date-fns';
import DeleteButtonWithConfirmation from '@/components/admin/DeleteButtonWithConfirmation';
import { deleteProduct } from '../actions';

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  is_primary?: boolean;
  image_url: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number | null;
  frontend_price: number | null;
  quantity: number;
  category_id: string;
  category_name: string;
  vendor_name: string;
  vendor_id: string;
  images: ProductImage[] | null;
  is_active: boolean;
  created_at: string;
}

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string; vendor?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const itemsPerPage = 10;

  const { data: categoriesData } = await supabase.from('categories').select('id, name').order('name');
  const categories: Category[] = categoriesData || [];

  let query = supabase
    .from('products_with_frontend_price')
    .select(
      `
      id,
      name,
      description,
      base_price,
      frontend_price,
      quantity,
      category_id,
      category_name,
      vendor_name,
      vendor_id,
      images,
      is_active,
      created_at
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }
  if (params.category) {
    query = query.eq('category_id', params.category);
  }
  if (params.vendor) {
    query = query.eq('vendor_id', params.vendor);
  }

  const { data: products, error, count } = await query as { data: Product[] | null; error: any; count: number | null };

  if (error) {
    console.error('Error fetching products:', error);
    return <div className="alert alert-danger">Error fetching products: {error.message}</div>;
  }
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="container-fluid admin-page py-4">
      <style>{`
        :root {
          --primary-color: #2563eb;
          --primary-hover: #1d4ed8;
          --success-soft: #d1fae5;
          --secondary-soft: #e5e7eb;
          --border-radius: 0.5rem;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .admin-page {
          max-width: 100%;
          margin: 0 auto;
        }
        .page-header h1 {
          font-size: clamp(1.5rem, 4vw, 1.875rem);
        }
        .filter-card {
          border: none;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          background: #fff;
        }
        .filter-form .form-control,
        .filter-form .form-select {
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
        }
        .btn-gradient-primary {
          background: linear-gradient(90deg, var(--primary-color), #60a5fa);
          border: none;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-gradient-primary:hover {
          background: linear-gradient(90deg, var(--primary-hover), #3b82f6);
        }
        .admin-table {
          border-collapse: separate;
          border-spacing: 0;
        }
        .admin-table th,
        .admin-table td {
          padding: 0.75rem;
          vertical-align: middle;
          font-size: 0.875rem;
        }
        .admin-table th {
          background: #f8fafc;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4b5563;
        }
        .admin-table tr {
          transition: background 0.2s ease;
        }
        .admin-table tr:hover {
          background: #f9fafb;
        }
        .product-list-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.25rem;
          border: 1px solid #e5e7eb;
        }
        .theme-link-hover {
          color: var(--primary-color);
          transition: color 0.2s ease;
        }
        .theme-link-hover:hover {
          color: var(--primary-hover);
        }
        .badge {
          padding: 0.35em 0.65em;
          font-weight: 500;
        }
        .admin-pagination .page-link {
          border: none;
          color: var(--primary-color);
          padding: 0.5rem 0.75rem;
          margin: 0 0.25rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
        }
        .admin-pagination .page-item.active .page-link {
          background: var(--primary-color);
          color: white;
        }
        .admin-pagination .page-link:hover {
          background: #f1f5f9;
        }
        .alert-info-soft {
          background: #e0f2fe;
          color: #0ea5e9;
          border: none;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }
        @media (max-width: 768px) {
          .filter-form .row {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-form .col-md-4,
          .filter-form .col-md-3,
          .filter-form .col-md-2 {
            width: 100%;
          }
          .admin-table {
            display: block;
            overflow-x: auto;
            white-space: nowrap;
          }
          .admin-table thead {
            display: none;
          }
          .admin-table tbody,
          .admin-table tr {
            display: block;
          }
          .admin-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
          }
          .admin-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #4b5563;
            width: 40%;
            min-width: 100px;
          }
          .admin-table td.text-center,
          .admin-table td.text-end {
            justify-content: space-between;
          }
          .product-list-thumbnail {
            width: 50px;
            height: 50px;
          }
          .page-header h1 {
            font-size: 1.25rem;
          }
          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-dark fw-bold">Manage All Products <span className="text-muted fs-5">({count ?? 0})</span></h1>
      </div>

      <div className="card admin-card shadow-sm mb-4 filter-card">
        <div className="card-body">
          <form method="GET" className="filter-form">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="search" className="form-label">Search Products</label>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="form-control form-control-lg"
                  defaultValue={params.search}
                  placeholder="Product name or description..."
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select name="category" id="category" className="form-select form-select-lg" defaultValue={params.category}>
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-gradient-primary w-100 btn-lg">
                  <i className="bi bi-funnel-fill"></i> Filter
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="card admin-card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 admin-table">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Image</th>
                  <th>Name</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th className="text-end">Base Price</th>
                  <th className="text-end">Sell Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const primaryImage = Array.isArray(product.images)
                    ? product.images.find((img: ProductImage) => img.is_primary)?.image_url || product.images[0]?.image_url
                    : null;
                  return (
                    <tr key={product.id}>
                      <td className="text-center" data-label="Image">
                        {primaryImage ? (
                          <img src={primaryImage} alt={product.name} className="product-list-thumbnail" />
                        ) : (
                          <div className="product-list-thumbnail placeholder d-flex align-items-center justify-content-center bg-light-subtle border">
                            <i className="bi bi-card-image text-muted fs-4"></i>
                          </div>
                        )}
                      </td>
                      <td data-label="Name">
                        <Link href={`/product/${product.id}`} target="_blank" className="fw-medium text-decoration-none theme-link-hover">
                          {product.name}
                        </Link>
                        <small className="d-block text-muted">ID: {product.id.substring(0, 8)}...</small>
                      </td>
                      <td data-label="Vendor">
                        <Link href={`/admin/dashboard/vendors?search=${encodeURIComponent(product.vendor_name || '')}`} className="text-decoration-none theme-link-hover">
                          {product.vendor_name}
                        </Link>
                      </td>
                      <td data-label="Category">{product.category_name}</td>
                      <td className="text-end" data-label="Base Price">{formatCurrency(product.base_price)}</td>
                      <td className="text-end fw-bold" data-label="Sell Price">{formatCurrency(product.frontend_price)}</td>
                      <td className="text-center" data-label="Qty">{product.quantity}</td>
                      <td className="text-center" data-label="Status">
                        <span className={`badge rounded-pill fs-7 ${product.is_active ? 'bg-success-soft text-success-emphasis' : 'bg-secondary-soft text-secondary-emphasis'}`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-center" data-label="Actions">
                        <DeleteButtonWithConfirmation
                          itemId={product.id}
                          itemName={product.name}
                          deleteAction={deleteProduct}
                          buttonText=""
                          buttonClass="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          modalTitle="Confirm Product Deletion"
                          modalBody={`Are you sure you want to delete the product "${product.name}"? This will also remove its images. This action cannot be undone.`}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="card-footer bg-light-subtle d-flex justify-content-center">
              <nav aria-label="Products pagination">
                <ul className="pagination admin-pagination mb-0">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <Link
                        href={`/admin/dashboard/products?page=${page}${params.search ? `&search=${params.search}` : ''}${params.category ? `&category=${params.category}` : ''}`}
                        className="page-link"
                      >
                        {page}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="alert alert-info-soft text-center p-4">
          <i className="bi bi-info-circle fs-1 d-block mb-2"></i>
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
}