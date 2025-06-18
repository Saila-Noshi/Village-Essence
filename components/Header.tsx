// components/Header.tsx
"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const [animateCart, setAnimateCart] = useState(false);
  const prevItemCountRef = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevItemCountRef.current) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 500);
      return () => clearTimeout(timer);
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount]);

  return (
    <header className="shadow-sm bg-white sticky-top">
      {/* Top Bar */}
      <div className="header-top-bar d-none d-md-block">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="contact-info">
            <a href="tel:+923001234567" className="text-decoration-none text-muted me-3">
              <i className="bi bi-telephone-fill me-1"></i> +92 300 1234567
            </a>
            <a href="mailto:info@villageessence.com" className="text-decoration-none text-muted">
              <i className="bi bi-envelope-fill me-1"></i> info@villageessence.com
            </a>
          </div>
          <div className="social-icons d-flex align-items-center">
            <span className="me-2 text-muted">Follow us:</span>
            <a href="#" className="me-2"><i className="bi bi-facebook"></i></a>
            <a href="#" className="me-2"><i className="bi bi-twitter-x"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <div className="logo-icon-wrapper bg-gradient-green-to-blue me-2">
              <i className="bi bi-leaf-fill text-white"></i>
            </div>
            <div>
              <span className="brand-text text-gradient-green-blue">Village Essence</span>
              <span className="brand-tagline">Authentic Local Products</span>
            </div>
          </Link>

          <div className="d-flex align-items-center d-lg-none">
            <Link href="/cart" className="nav-link me-2 position-relative">
              <i className="bi bi-cart3 fs-4"></i>
              {itemCount > 0 && (
                <span className={`cart-badge ${animateCart ? 'animate-pop' : ''}`}>
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/products" className="nav-link">Products</Link>
              </li>
              <li className="nav-item">
                <Link href="/categories" className="nav-link">Categories</Link>
              </li>
              <li className="nav-item">
                <Link href="/all-vendors" className="nav-link">Vendors</Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">Contact</Link>
              </li>
              <li className="nav-item d-lg-none">
                <Link href="/auth/login" className="nav-link">Login</Link>
              </li>
            </ul>

            <div className="d-flex align-items-center d-none d-lg-flex">
              <Link href="/cart" className="nav-link me-2 position-relative">
                <i className="bi bi-cart3 fs-4"></i>
                {itemCount > 0 && (
                  <span className={`cart-badge ${animateCart ? 'animate-pop' : ''}`}>
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link href="/auth/login" className="btn btn-gradient-green ms-4">Login</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
