'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Category } from '@/lib/supabaseClient';
import { 
  FaUtensils, 
  FaLaptop, 
  FaTshirt, 
  FaHome, 
  FaBook, 
  FaFootballBall, 
  FaPalette, 
  FaGamepad,
  FaCar,
  FaHeartbeat,
  FaRing,
  FaMusic,
  FaPaw,
  FaBriefcase,
  FaPlane,
  FaCouch,
  FaTools,
  FaBaby,
  FaTree,
  FaTags,
  FaArrowRight,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';

// Icon component mapping with React Icons (same as CategoriesSection)
const categoryVisuals: { [key: string]: { icon: React.ComponentType<any>; gradient: string } } = {
  default: { icon: FaTags, gradient: "bg-secondary" },
  "Food": { icon: FaUtensils, gradient: "bg-gradient-orange-to-red" },
  "Electronics": { icon: FaLaptop, gradient: "bg-gradient-blue-to-purple" },
  "Clothing": { icon: FaTshirt, gradient: "bg-gradient-pink-to-purple" },
  "Home & Garden": { icon: FaHome, gradient: "bg-gradient-green-to-blue" },
  "Books": { icon: FaBook, gradient: "bg-warning text-dark" },
  "Sports": { icon: FaFootballBall, gradient: "bg-danger" },
  "Beauty": { icon: FaPalette, gradient: "bg-info text-dark" },
  "Toys": { icon: FaGamepad, gradient: "bg-gradient-green-to-teal" },
  "Automotive": { icon: FaCar, gradient: "bg-gradient-red-to-orange" },
  "Health": { icon: FaHeartbeat, gradient: "bg-gradient-green-to-cyan" },
  "Jewelry": { icon: FaRing, gradient: "bg-gradient-purple-to-pink" },
  "Music": { icon: FaMusic, gradient: "bg-gradient-blue-to-indigo" },
  "Pet Supplies": { icon: FaPaw, gradient: "bg-gradient-orange-to-yellow" },
  "Office": { icon: FaBriefcase, gradient: "bg-gradient-gray-to-blue" },
  "Travel": { icon: FaPlane, gradient: "bg-gradient-cyan-to-blue" },
  "Furniture": { icon: FaCouch, gradient: "bg-gradient-brown-to-orange" },
  "Tools": { icon: FaTools, gradient: "bg-gradient-gray-to-dark" },
  "Baby": { icon: FaBaby, gradient: "bg-gradient-pink-to-rose" },
  "Outdoors": { icon: FaTree, gradient: "bg-gradient-green-to-forest" },
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, markup_percentage, description, created_at, updated_at')
          .order('name');

        if (error) {
          throw error;
        }

        setCategories(data as Category[]);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <FaSpinner className="fa-spin text-primary mb-3" size={48} />
          <h4>Loading Categories...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div className="bg-gradient-primary-to-secondary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Browse All Categories</h1>
              <p className="lead mb-4">
                Discover our complete collection of product categories. From electronics to fashion, 
                find everything you need in one place.
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-circle p-4 d-inline-block">
                <FaSearch size={60} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg ps-5 rounded-pill border-0 shadow-sm"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: 'white' }}
              />
              <FaSearch 
                className="position-absolute top-50 translate-middle-y ms-3 text-muted"
                style={{ left: '1rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container pb-5">
        <div className="row">
          {filteredCategories.map((category) => {
            const visual = categoryVisuals[category.name] || categoryVisuals.default;
            const IconComponent = visual.icon;
            
            return (
              <div key={category.id} className="col-lg-4 col-md-6 mb-4">
                <Link href={`/products?category=${category.id}`} className="text-decoration-none">
                  <div 
                    className="card h-100 border-0 shadow-sm category-card-hover"
                    style={{ 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div 
                          className={`rounded-circle p-3 me-3 ${visual.gradient}`}
                          style={{ 
                            width: '60px', 
                            height: '60px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        >
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="card-title mb-1 fw-bold text-dark">{category.name}</h5>
                          <small className="text-muted">
                            {category.markup_percentage}% markup
                          </small>
                        </div>
                      </div>
                      
                      <p className="card-text text-muted mb-3">
                        {category.description || 'No description available'}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
                          Browse Products
                        </button>
                        <FaArrowRight className="text-muted" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && !loading && (
          <div className="text-center py-5">
            <div className="text-muted">
              <FaSearch size={48} className="mb-3 opacity-50" />
              <h4>No categories found</h4>
              <p>Try adjusting your search terms</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-white py-5 border-top">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-gradient-green-blue mb-2">{categories.length}+</div>
              <div className="text-muted">Categories</div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-gradient-green-blue mb-2">1000+</div>
              <div className="text-muted">Products</div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-gradient-green-blue mb-2">24/7</div>
              <div className="text-muted">Support</div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="h2 fw-bold text-gradient-green-blue mb-2">Fast</div>
              <div className="text-muted">Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;