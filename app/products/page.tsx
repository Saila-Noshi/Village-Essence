// app/products/page.tsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, Product, Category } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

async function fetchInitialProducts(page = 1, limit = 12, categoryId?: string, searchTerm?: string): Promise<{ products: Product[], count: number | null }> {
  let query = supabase
    .from('products_with_frontend_price')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .range((page - 1) * limit, page * limit - 1);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category_name.ilike.%${searchTerm}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], count: 0 };
  }
  return { products: data as Product[], count };
}

async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 12;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        fetchCategories(),
        fetchInitialProducts(currentPage, productsPerPage, selectedCategory || undefined, searchTerm || undefined),
      ]);
      setCategories(categoriesData);
      setProducts(productsData.products);
      setTotalProducts(productsData.count || 0);
      setIsLoading(false);
    };
    loadData();
  }, [selectedCategory, searchTerm, currentPage]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark">Our Products</h1>
        <p className="lead text-muted">Explore our wide range of authentic local goods.</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center mb-4 bg-light rounded shadow-sm py-3 px-4">
        <div className="col-md-4">
          <select
            className="form-select form-select-lg"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search products, categories..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-gradient-green btn-lg w-100">Search</button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map((product) => (
              <div key={product.id} className="col">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Page navigation" className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>Next</button>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown fs-1 text-gradient-green-blue mb-3"></i>
          <h4 className="mb-3">No Products Found</h4>
          <p className="text-muted">Try adjusting your filters or search term, or explore other categories.</p>
          <Link href="/products" className="btn btn-gradient-green mt-3">
            Clear Filters & View All
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-5"><div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}