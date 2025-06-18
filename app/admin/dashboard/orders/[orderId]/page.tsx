import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateOrderStatus } from '../../actions';
import { type OrderStatus } from '@/lib/types';
import { format } from 'date-fns';
import OrderStatusUpdater from './OrderStatusUpdater';

const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'PKR' }).format(amount);
};

interface OrderItemDetail {
  item_id: string;
  product_id: string | null;
  product_name: string;
  vendor_id: string | null;
  vendor_name: string;
  vendor_email: string | null;
  vendor_phone: string | null;
  quantity: number;
  unit_price: number;
  base_unit_price: number;
  total_price: number;
  category_name: string | null;
}

function getStatusBadgeClass(status: OrderStatus | null): string {
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

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const { data: order, error } = await supabase
    .from('order_details')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) {
    console.error("Error fetching order details:", error?.message || 'Order not found');
    notFound();
  }

  const items: OrderItemDetail[] = Array.isArray(order.items) ? order.items : [];
  let calculatedTotalMargin = 0;
  items.forEach(item => {
    calculatedTotalMargin += (item.unit_price - item.base_unit_price) * item.quantity;
  });
  const orderStatuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  const vendors = Array.from(
    new Map(
      items
        .filter(item => item.vendor_id) // Filter out null vendor_id
        .map(item => [
          item.vendor_id,
          {
            vendor_id: item.vendor_id,
            vendor_name: item.vendor_name,
            vendor_email: item.vendor_email,
            vendor_phone: item.vendor_phone
          }
        ])
    ).values()
  );

  return (
    <div className="container-fluid admin-order-detail-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-dark fw-bold">Order Details: <span className="text-gradient-primary-to-secondary">#{order.order_number}</span></h1>
        <Link href="/admin/dashboard/orders" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Back to Orders
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-xl-4 col-lg-5">
          <div className="card admin-card shadow-sm mb-4">
            <div className="card-header bg-light border-bottom">
              <h5 className="mb-0 card-title-custom">Order Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li className="mb-2"><strong>Order ID:</strong> <span className="text-muted">{order.id}</span></li>
                <li className="mb-2"><strong>Order Date:</strong> <span className="text-muted">{format(new Date(order.order_date), 'MMM dd, yyyy, HH:mm a')}</span></li>
                <li className="mb-2"><strong>Status:</strong> <span className={`badge rounded-pill fs-6 ${getStatusBadgeClass(order.status as OrderStatus)}`}>{(order.status ?? 'pending').charAt(0).toUpperCase() + (order.status ?? 'pending').slice(1)}</span></li>
                <li className="mb-2"><strong>Total Amount:</strong> <span className="fw-bold text-primary">{formatCurrency(order.total_amount)}</span></li>
                <li className="mb-2"><strong>Calculated Margin:</strong> <span className="text-success fw-bold">{formatCurrency(calculatedTotalMargin)}</span></li>
                {order.notes && <li className="mt-2"><strong>Notes:</strong> <em className="text-muted d-block">{order.notes}</em></li>}
              </ul>
            </div>
          </div>
          <div className="card admin-card shadow-sm">
            <div className="card-header bg-light border-bottom"><h5 className="mb-0 card-title-custom">Update Status</h5></div>
            <div className="card-body">
              <OrderStatusUpdater
                orderId={order.id}
                currentStatus={order.status as OrderStatus}
                availableStatuses={orderStatuses}
                updateAction={updateOrderStatus}
              />
            </div>
          </div>
        </div>

        <div className="col-xl-8 col-lg-7">
          <div className="card admin-card shadow-sm mb-4">
            <div className="card-header bg-light border-bottom"><h5 className="mb-0 card-title-custom">Customer Details</h5></div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-2"><strong>Name:</strong> <span className="text-muted">{order.customer_name}</span></div>
                <div className="col-md-6 mb-2"><strong>Email:</strong> <span className="text-muted">{order.customer_email || 'N/A'}</span></div>
                <div className="col-md-6 mb-2"><strong>Phone:</strong> <span className="text-muted">{order.customer_phone}</span></div>
                <div className="col-md-12"><strong>Shipping Address:</strong> <span className="text-muted d-block">{order.customer_address}</span></div>
              </div>
            </div>
          </div>
          
          {vendors.length > 0 && (
            <div className="card admin-card shadow-sm mb-4">
              <div className="card-header bg-light border-bottom"><h5 className="mb-0 card-title-custom">Vendor Details ({vendors.length})</h5></div>
              <div className="card-body">
                {vendors.map((vendor) => (
                  <div key={vendor.vendor_id} className="mb-3 pb-2 border-bottom-dashed">
                     <div className="row">
                        <div className="col-md-6"><strong>Name:</strong> <Link href={`/admin/dashboard/vendors?search=${encodeURIComponent(vendor.vendor_name)}`} className="text-decoration-none theme-link-hover">{vendor.vendor_name}</Link></div>
                        <div className="col-md-6"><strong>Email:</strong> <span className="text-muted">{vendor.vendor_email || 'N/A'}</span></div>
                        <div className="col-md-6"><strong>Phone:</strong> <span className="text-muted">{vendor.vendor_phone || 'N/A'}</span></div>
                        <div className="col-md-6"><strong>Vendor ID:</strong> <span className="text-muted small">{vendor.vendor_id ? vendor.vendor_id.substring(0, 8) : 'N/A'}...</span></div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card admin-card shadow-sm">
            <div className="card-header bg-light border-bottom"><h5 className="mb-0 card-title-custom">Items Ordered ({items.length})</h5></div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 admin-table">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Vendor</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Base Price</th>
                      <th className="text-end">Unit Price (Sold)</th>
                      <th className="text-end">Total</th>
                      <th className="text-end">Item Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const itemMargin = (item.unit_price - item.base_unit_price) * item.quantity;
                      return (
                        <tr key={item.item_id}>
                          <td>
                            {item.product_id ? (
                              <Link href={`/products/${item.product_id}`} target="_blank" className="text-decoration-none theme-link-hover fw-medium">{item.product_name}</Link>
                            ) : (
                              <span className="text-muted">{item.product_name} (Deleted)</span>
                            )}
                            <small className="d-block text-muted">ID: {item.product_id ? item.product_id.substring(0, 8) : 'N/A'}...</small>
                          </td>
                          <td>{item.category_name || 'N/A'}</td>
                          <td>
                            <Link href={`/admin/dashboard/vendors?search=${encodeURIComponent(item.vendor_name)}`} className="text-decoration-none theme-link-hover">{item.vendor_name}</Link>
                            <small className="d-block text-muted">ID: {item.vendor_id ? item.vendor_id.substring(0, 8) : 'N/A'}...</small>
                          </td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.base_unit_price)}</td>
                          <td className="text-end">{formatCurrency(item.unit_price)}</td>
                          <td className="text-end fw-bold">{formatCurrency(item.total_price)}</td>
                          <td className="text-end text-success fw-medium">{formatCurrency(itemMargin)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-light-subtle">
              <p className="text-end mb-1"><strong>Subtotal (Items):</strong> {formatCurrency(items.reduce((sum, item) => sum + item.total_price, 0))}</p>
              <p className="text-end mb-0 fs-5 fw-bold text-gradient-primary-to-secondary">Order Grand Total: {formatCurrency(order.total_amount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}