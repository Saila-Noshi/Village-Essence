// components/AddToCartButton.tsx
"use client";
import { useState } from 'react';
import { Product } from '@/lib/supabaseClient';
import { useCart } from '@/context/CartContext'; // Assuming you have this context

interface AddToCartButtonProps {
  product: Product;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart } = useCart(); // Make sure CartProvider is set up in your layout/app
  const [quantity, setQuantity] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState('');


  const handleAddToCart = () => {
    if (!product) return;

    if (product.quantity > 0 && quantity <= product.quantity) {
      addToCart(product, quantity);
      setFeedbackMessage(`${quantity} x ${product.name} added to cart!`);
      // Add class to trigger cart badge animation if any
      const cartBadge = document.querySelector('.cart-badge');
      if (cartBadge) {
          cartBadge.classList.add('animate-pop');
          setTimeout(() => cartBadge.classList.remove('animate-pop'), 500);
      }
      setTimeout(() => setFeedbackMessage(''), 3000); // Clear message after 3s
    } else if (product.quantity === 0) {
      setFeedbackMessage("This product is out of stock.");
      setTimeout(() => setFeedbackMessage(''), 3000);
    } else {
      setFeedbackMessage(`Only ${product.quantity} items in stock. Please reduce quantity.`);
      setTimeout(() => setFeedbackMessage(''), 3000);
    }
  };

  return (
    <div className="add-to-cart-controls">
      <div className="d-flex align-items-stretch mb-2">
        {product.quantity > 0 ? (
          <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.quantity)))}
              className="form-control form-control-lg me-2 text-center quantity-input-pdp"
              min="1"
              max={product.quantity}
              aria-label="Quantity"
          />
        ) : (
          <input
            type="number"
            value={0}
            disabled
            className="form-control form-control-lg me-2 text-center quantity-input-pdp"
            aria-label="Quantity"
          />
        )}
        <button
          className="btn btn-gradient-green btn-lg flex-grow-1 text-nowrap"
          onClick={handleAddToCart}
          disabled={!product || product.quantity === 0 || quantity > product.quantity}
        >
          <i className="bi bi-cart-plus-fill me-2"></i>
          {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
      {feedbackMessage && <p className="text-muted small mt-2 text-center">{feedbackMessage}</p>}
    </div>
  );
};

export default AddToCartButton;