// components/ProductCard.tsx
"use client";

import Link from 'next/link';
import { Product } from '@/lib/supabaseClient';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const primaryImage =
    product.images?.find(img => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    '/images/placeholder-image.png';

  const handleAddToCart = () => {
    if (product.quantity > 0) {
      // addToCart(product, 1);
      toast(`${product.name} added to cart!`);
    } else {
      toast("This product is out of stock.");
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4 product-card-hover">
      <Link href={`/products/${product.id}`} className="text-decoration-none">
        <div className="ratio ratio-4x3 overflow-hidden rounded-top-4">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-100 h-100 object-fit-cover"
          />
        </div>
      </Link>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title fs-6 fw-semibold mb-1 text-dark text-truncate">
          <Link href={`/products/${product.id}`} className="text-decoration-none text-dark stretched-link">
            {product.name}
          </Link>
        </h5>

        {product.category_name && (
          <p className="text-muted small mb-2">{product.category_name}</p>
        )}

        <div className="mt-auto">
          <p className="fw-bold text-success fs-5 mb-1">
            PKR {product.frontend_price.toFixed(2)}
          </p>

          <p className={`small mb-2 ${product.quantity > 0 ? 'text-success' : 'text-danger'}`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </p>

          {product.vendor_name && (
            <Link href={`/all-vendors/${product.vendor_id}`} className="d-flex align-items-center text-decoration-none text-muted small vendor-link mb-2">
              {product.vendor_profile_picture && (
                <img
                  src={product.vendor_profile_picture}
                  alt={product.vendor_name}
                  className="me-2 rounded-circle"
                  style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                />
              )}
              <span>{product.vendor_name}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="card-footer bg-transparent border-0 pt-0">
        <button
          className={`btn w-100 btn-sm fw-semibold ${product.quantity > 0 ? 'btn-gradient-green' : 'btn-secondary'}`}
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          <i className="bi bi-cart-plus me-1"></i>
          {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
