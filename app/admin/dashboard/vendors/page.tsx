import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { format } from 'date-fns';
import DeleteButtonWithConfirmation from '@/components/admin/DeleteButtonWithConfirmation';
import { deleteVendor } from '../actions';

export default async function AdminVendorsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const itemsPerPage = 10;

  let query = supabase
    .from('vendors')
    .select(
      `
      id,
      name,
      email,
      phone_number,
      profile_picture_url,
      is_active,
      created_at
      `,
      { count: 'exact' }
    )
    // If you need to filter by role, ensure the role is stored in the vendors table or fetch users separately
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
  }

  const { data: vendors, error, count } = await query;
  if (error) {
    console.error('Error fetching vendors:', error);
    return <div className="alert alert-danger">Error fetching vendors: {error.message}</div>;
  }
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="container-fluid admin-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-dark fw-bold">Manage Vendors <span className="text-muted fs-5">({count ?? 0})</span></h1>
        {/* Add New Vendor button if applicable */}
      </div>

      <div className="card admin-card shadow-sm mb-4 filter-card">
        <div className="card-body">
          <form method="GET" className="filter-form">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="search" className="form-label">Search Vendors</label>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="form-control form-control-lg"
                  defaultValue={params.search}
                  placeholder="Name or email..."
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-gradient-primary w-100 btn-lg"><i className="bi bi-funnel-fill"></i></button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {vendors && vendors.length > 0 ? (
        <div className="card admin-card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 admin-table">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="text-center">Active</th>
                  <th>Registered</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {vendor.profile_picture_url ? (
                          <img
                            src={vendor.profile_picture_url}
                            alt={vendor.name || 'Vendor'}
                            className="rounded-circle me-2 object-fit-cover"
                            width="40"
                            height="40"
                          />
                        ) : (
                          <div className="avatar-placeholder rounded-circle me-2 bg-secondary-soft d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-person-fill text-secondary fs-5"></i>
                          </div>
                        )}
                        <span className="fw-medium">{vendor.name}</span>
                      </div>
                    </td>
                    <td>{vendor.email}</td>
                    <td>{vendor.phone_number || <span className="text-muted fst-italic">N/A</span>}</td>
                    <td className="text-center">
                      <span className={`badge rounded-pill fs-7 ${vendor.is_active ? 'bg-success-soft text-success-emphasis' : 'bg-secondary-soft text-secondary-emphasis'}`}>
                        {vendor.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{format(new Date(vendor.created_at), 'MMM dd, yyyy')}</td>
                    <td className="text-center">
                      <DeleteButtonWithConfirmation
                        itemId={vendor.id}
                        itemName={vendor.name || 'this vendor'}
                        deleteAction={deleteVendor}
                        buttonText=""
                        buttonClass="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                        modalTitle="Confirm Vendor Deletion"
                        modalBody={`Are you sure you want to delete the vendor "${vendor.name || 'N/A'}"? This will also delete their associated products. This action cannot be undone.`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="card-footer bg-light-subtle d-flex justify-content-center">
              <nav aria-label="Vendors pagination">
                <ul className="pagination admin-pagination mb-0">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <Link
                        href={`/admin/dashboard/vendors?page=${page}${params.search ? `&search=${params.search}` : ''}`}
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
          No vendors found matching your criteria.
        </div>
      )}
    </div>
  );
}