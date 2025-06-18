// app/page.tsx (or your equivalent main page file like index.tsx)
import { supabase, Product, Category } from '@/lib/supabaseClient'; // Your existing Supabase client and types
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CategoriesSection from '@/components/CategoriesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';


// Your existing data fetching functions
async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products_with_frontend_price') // Ensure this view/table exists
    .select('*')
    .eq('is_active', true)
    // .order('created_at', { ascending: false }) // Example: newest products
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
  return data as Product[];
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, description') // Add any other fields needed for display like image_url or icon_name
    .order('name')
    .limit(6); // Show a few categories on homepage

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}

export const revalidate = 3600; // Revalidate data every hour

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  return (
    <>
      <HeroSection />
      <FeaturesSection />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h2 className="display-5 fw-bold text-dark text-center mb-5">Featured Products</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="col">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
                <Link href="/products" className="btn btn-outline-primary btn-lg">
                    View All Products
                </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category Section - uses CategoriesSection component */}
      {categories.length > 0 && (
        <CategoriesSection categories={categories} />
      )}

      <TestimonialsSection />
      <CTASection />
    </>
  );
}