// app/cart/page.tsx
"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container py-5">
        <div className="empty-cart-container">
            <i className="bi bi-cart-x"></i>
            <h2 className="display-5 fw-bold mb-3">Your Cart is Empty</h2>
            <p className="lead text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products" className="btn btn-gradient-green btn-lg">
                <i className="bi bi-bag-heart-fill me-2"></i>Start Shopping
            </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId: string, newQuantity: number, stock: number) => {
    if (newQuantity < 1) {
        updateQuantity(productId, 1); // Reset to 1 if user tries to go below
        return;
    }
    if (newQuantity > stock) {
        alert(`Cannot add more than ${stock} items for this product.`);
        updateQuantity(productId, stock);
        return;
    }
    updateQuantity(productId, newQuantity);
  };

  return (
    <div className="container py-5 cart-page">
      <div className="text-center">
        <h1 className="page-title">Your Shopping Cart</h1>
      </div>
      <div className="row g-4">
        <div className="col-lg-8">
          {cart.map((item) => (
            <div key={item.id} className="card cart-item-card mb-3">
              <div className="row g-0">
                <div className="col-md-3 product-image-container">
                  <Image
                    src={item.images?.find(img => img.is_primary)?.image_url || item.images?.[0]?.image_url || '/images/placeholder-image.png'}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="product-image"
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="item-name mb-0">{item.name}</h5>
                      <button
                        className="btn btn-sm btn-link text-danger btn-remove-item"
                        aria-label="Remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-trash3-fill fs-5"></i>
                      </button>
                    </div>
                    <p className="card-text mb-1">
                      <small className="text-muted">Unit Price: PKR {item.frontend_price.toFixed(2)}</small>
                    </p>
                    <div className="d-flex align-items-center flex-wrap">
                      <label htmlFor={`quantity-${item.id}`} className="form-label me-2 mb-0 visually-hidden">Quantity:</label>
                      <input
                        type="number"
                        id={`quantity-${item.id}`}
                        className="form-control form-control-sm quantity-input me-2"
                        value={item.cartQuantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value), item.quantity)}
                        min="1"
                        max={item.quantity}
                      />
                      <small className="text-muted me-3">(Max: {item.quantity})</small>
                      <p className="card-text mb-0 item-total">
                        <strong>Total: PKR {(item.frontend_price * item.cartQuantity).toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card order-summary-card sticky-top" style={{top: "100px"}}> {/* Sticky summary */}
            <div className="card-body p-4">
              <h5 className="card-title">Order Summary</h5>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  Subtotal
                  <span>PKR {getCartTotal().toFixed(2)}</span>
                </li>
                {/* Add shipping, taxes if needed later */}
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent fw-bold fs-5 mt-2">
                  Total
                  <span>PKR {getCartTotal().toFixed(2)}</span>
                </li>
              </ul>
              <div className="d-grid gap-2">
                <Link href="/checkout" className="btn btn-gradient-green btn-lg">
                  Proceed to Checkout <i className="bi bi-arrow-right-circle-fill ms-1"></i>
                </Link>
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  <i className="bi bi-x-circle me-1"></i> Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}