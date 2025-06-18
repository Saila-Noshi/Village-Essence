import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { type OrderStatus } from '@/lib/types';
import { format } from 'date-fns';

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount);
};

function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'pending': return 'bg-warning-soft text-warning-emphasis';
    case 'confirmed': return 'bg-info-soft text-info-emphasis';
    case 'processing': return 'bg-primary-soft text-primary-emphasis';
    case 'shipped': return 'bg-secondary-soft text-secondary-emphasis';
    case 'delivered': return 'bg-success-soft text-success-emphasis';
    case 'cancelled': return 'bg-danger-soft text-danger-emphasis';
    default: return 'bg-light text-dark';
  }
}

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ status?: OrderStatus; page?: string; search?: string; date_from?: string; date_to?: string; }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const itemsPerPage = 15;

  let query = supabase
    .from('order_details')
    .select(`
      id,
      order_number,
      customer_name,
      customer_email,
      total_amount,
      status,
      order_date,
      items
    `, { count: 'exact' })
    .order('order_date', { ascending: false })
    .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

  if (params.status) {
    query = query.eq('status', params.status);
  }
  if (params.search) {
    query = query.or(`order_number.ilike.%${params.search}%,customer_name.ilike.%${params.search}%,customer_email.ilike.%${params.search}%`);
  }
  if (params.date_from) {
    query = query.gte('order_date', params.date_from);
  }
  if (params.date_to) {
    const toDate = new Date(params.date_to);
    toDate.setDate(toDate.getDate() + 1);
    query = query.lt('order_date', toDate.toISOString().split('T')[0]);
  }

  const { data: orders, error, count } = await query;
  if (error) {
    console.error("Error fetching orders:", error);
    return <div className="alert alert-danger">Error fetching orders: {error.message}</div>;
  }

  const totalPages = Math.ceil((count || 0) / itemsPerPage);
  const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="container-fluid admin-page p-3 p-md-4">
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1 className="h2 text-dark fw-bold mb-3 mb-md-0">
          Manage Orders <span className="text-muted fs-5">({count ?? 0})</span>
        </h1>
      </div>

      <div className="card admin-card shadow-sm mb-4 filter-card">
        <div className="card-body">
          <form method="GET" className="filter-form">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="search" className="form-label">Search</label>
                <input type="text" name="search" id="search" className="form-control form-control-lg" defaultValue={params.search} placeholder="Order #, Name, Email"/>
              </div>
              <div className="col-12 col-md-6 col-lg-2">
                <label htmlFor="status" className="form-label">Status</label>
                <select name="status" id="status" className="form-select form-select-lg" defaultValue={params.status}>
                  <option value="">All Statuses</option>
                  {orderStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="date_from" className="form-label">Date From</label>
                <input type="date" name="date_from" id="date_from" className="form-control form-control-lg" defaultValue={params.date_from} />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <label htmlFor="date_to" className="form-label">Date To</label>
                <input type="date" name="date_to" id="date_to" className="form-control form-control-lg" defaultValue={params.date_to} />
              </div>
              <div className="col-12 col-lg-1">
                <button type="submit" className="btn btn-gradient-primary w-100 btn-lg">
                  <i className="bi bi-funnel-fill"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="card admin-card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 admin-table w-100">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th className="d-none d-md-table-cell">Date</th>
                  <th>Customer</th>
                  <th className="text-end d-none d-lg-table-cell">Total</th>
                  <th className="text-center">Status</th>
                  <th className="text-center d-none d-md-table-cell">Items</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-truncate" style={{ maxWidth: '150px' }}>
                      <Link href={`/admin/dashboard/orders/${order.id}`} className="fw-bold text-decoration-none theme-link-hover">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="d-none d-md-table-cell text-nowrap">{format(new Date(order.order_date), 'MMM dd, yyyy')}</td>
                    <td className="text-truncate" style={{ maxWidth: '200px' }}>
                      <div>{order.customer_name}</div>
                      <small className="text-muted">{order.customer_email}</small>
                    </td>
                    <td className="text-end d-none d-lg-table-cell">{formatCurrency(order.total_amount)}</td>
                    <td className="text-center">
                      <span className={`badge rounded-pill fs-7 ${getStatusBadgeClass(order.status as OrderStatus)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-center d-none d-md-table-cell">{order.items && Array.isArray(order.items) ? order.items.length : 0}</td>
                    <td className="text-center">
                      <Link href={`/admin/dashboard/orders/${order.id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        <i className="bi bi-eye-fill me-1"></i>View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="card-footer bg-light-subtle d-flex justify-content-center">
              <nav aria-label="Orders pagination">
                <ul className="pagination admin-pagination mb-0 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                      <Link
                        href={`/admin/dashboard/orders?page=${page}${params.status ? `&status=${params.status}` : ''}${params.search ? `&search=${params.search}` : ''}${params.date_from ? `&date_from=${params.date_from}` : ''}${params.date_to ? `&date_to=${params.date_to}` : ''}`}
                        className="page-link">
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
          No orders found matching your criteria.
        </div>
      )}
    </div>
  );
}
