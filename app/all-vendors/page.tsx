import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Vendor {
  id: string;
  name: string;
  profile_picture_url: string | null;
}

const VendorCard: React.FC<{ vendor: Vendor }> = ({ vendor }) => {
  const placeholderImage = '/images/vendor-placeholder.png';

  return (
    <div className="col">
      <div className="card h-100 text-center category-card-hover">
        <Link href={`/all-vendors/${vendor.id}`} className="text-decoration-none text-dark stretched-link">
          <div className="card-body p-4">
            <img
              src={vendor.profile_picture_url || placeholderImage}
              alt={`${vendor.name} logo`}
              className="rounded-circle mb-3"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                border: '3px solid #f0fdf4'
              }}
            />
            <h5 className="card-title fw-semibold">{vendor.name}</h5>
            <p className="btn btn-sm btn-outline-green mt-2">
              View Products
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default async function AllVendorsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '0');
  const limit = 10;

  const { data: vendors, error } = await supabase
    .from('vendors')
    .select('id, name, profile_picture_url')
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.error('Error fetching vendors:', error);
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center p-5">
          <h4 className="alert-heading">Error</h4>
          <p>Error fetching vendors: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">All Vendors</li>
        </ol>
      </nav>

      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-dark">Our Vendors</h1>
        <p className="lead text-muted">Discover products from our trusted partners.</p>
      </div>

      {vendors && vendors.length > 0 ? (
        <div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-4">
              <li className="page-item">
                <Link href={`/all-vendors?page=${Math.max(0, page - 1)}`} className="page-link" aria-label="Previous">
                  <span aria-hidden="true">«</span>
                </Link>
              </li>
              <li className="page-item">
                <span className="page-link">{page + 1}</span>
              </li>
              <li className="page-item">
                <Link href={`/all-vendors?page=${page + 1}`} className="page-link" aria-label="Next">
                  <span aria-hidden="true">»</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <div className="alert alert-info text-center p-5">
          <i className="bi bi-shop-window fs-1 text-info mb-3 d-block"></i>
          <h4 className="alert-heading">No Vendors Found</h4>
          <p>We are currently setting up our vendor partnerships. Please check back soon!</p>
        </div>
      )}
    </div>
  );
}