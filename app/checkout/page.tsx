// app/checkout/page.tsx
"use client";
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface CustomerInfo {
  name: string;
  email?: string;
  phone_number: string;
  address: string;
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone_number: '',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Basic client-side validation (add more as needed)
      if (!customerInfo.name || !customerInfo.phone_number || !customerInfo.address) {
        throw new Error("Please fill in all required shipping details.");
      }

      // Server-side validation (product quantities) and order creation via API route
      const response = await fetch('/api/create-order', { // Ensure this API route exists and works
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerInfo, cartItems: cart, totalAmount: getCartTotal() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order.');
      }

      setOrderNumber(result.orderNumber);
      setOrderSuccess(true);
      clearCart();

    } catch (err: any) {
      console.error("Order submission error:", err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container py-5">
        <div className="order-success-container">
            <i className="bi bi-check-circle-fill text-success mb-3"></i>
            <h2 className="display-5 fw-bold mb-3">Order Placed Successfully!</h2>
            <p className="lead text-muted">Thank you for your purchase, {customerInfo.name}.</p>
            {orderNumber && <p className="lead">Your Order Number is: <strong className="text-dark">{orderNumber}</strong></p>}
            <p className="text-muted mb-4">We will contact you shortly regarding your order delivery and confirmation.</p>
            <Link href="/products" className="btn btn-gradient-green btn-lg">
                <i className="bi bi-arrow-left-circle-fill me-2"></i>Continue Shopping
            </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderSuccess) {
     router.push('/cart');
     return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Your cart is empty. Redirecting...</p>
        </div>
     );
  }

  return (
    <div className="container py-5 checkout-page">
      <h1 className="page-title text-center">Checkout</h1>
      <div className="row g-5">
        <div className="col-lg-7">
          <div className="checkout-form-section">
            <h4 className="mb-4 border-bottom pb-2">Shipping Information</h4>
            <form onSubmit={handleSubmitOrder}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-lg" id="name" name="name" value={customerInfo.name} onChange={handleInputChange} required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email (Optional)</label>
                    <input type="email" className="form-control form-control-lg" id="email" name="email" value={customerInfo.email || ''} onChange={handleInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="phone_number" className="form-label">Phone Number <span className="text-danger">*</span></label>
                    <input type="tel" className="form-control form-control-lg" id="phone_number" name="phone_number" value={customerInfo.phone_number} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Full Address (Street, City, etc.) <span className="text-danger">*</span></label>
                <textarea className="form-control form-control-lg" id="address" name="address" rows={3} value={customerInfo.address} onChange={handleInputChange} required></textarea>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <button type="submit" className="btn btn-gradient-green btn-lg w-100 mt-3" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Placing Order...
                  </>
                ) : (
                  <>Place Order <i className="bi bi-shield-check-fill ms-1"></i></>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="checkout-summary-section sticky-top" style={{top: "20px"}}>
            <h4 className="mb-4 border-bottom pb-2">Your Order</h4>
            {cart.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <div>
                  <p className="mb-0 fw-medium">{item.name}</p>
                  <small className="text-muted">{item.cartQuantity} x PKR {item.frontend_price.toFixed(2)}</small>
                </div>
                <p className="mb-0 fw-medium">PKR {(item.frontend_price * item.cartQuantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="checkout-summary-total d-flex justify-content-between align-items-center">
              <p className="mb-0">Total:</p>
              <p className="mb-0">PKR {getCartTotal().toFixed(2)}</p>
            </div>
            <div className="mt-4">
              <Link href="/cart" className="text-decoration-none text-primary">
                <i className="bi bi-arrow-left-short"></i> Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}