// components/CategoriesSection.tsx
import Link from 'next/link';
import { Category } from '@/lib/supabaseClient'; // Assuming this type exists
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
  FaTags
} from 'react-icons/fa';

interface CategoriesSectionProps {
  categories: Category[]; // Categories fetched from Supabase
}

// Icon component mapping with React Icons
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

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="categories-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">Shop by Category</h2>
          <p className="lead text-muted col-lg-8 mx-auto">
            Explore our wide range of authentic products across various categories.
          </p>
        </div>

        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-4">
          {categories.map((category) => {
            const visual = categoryVisuals[category.name] || categoryVisuals.default;
            const IconComponent = visual.icon;
            
            return (
              <div key={category.id} className="col">
                <Link href={`/products?category=${category.id}`} className="text-decoration-none">
                  <div className="category-card text-center h-100">
                    <div className={`icon-wrapper mx-auto ${visual.gradient}`}>
                      <IconComponent className="fs-1" size={48} />
                    </div>
                    <h5 className="card-title">{category.name}</h5>
                    {/* If you have product counts per category, you can add them here */}
                    {/* <p className="product-count text-muted">{category.products_count || '0'} products</p> */}
                    <span className="shop-now-link">
                      Shop Now <i className="bi bi-arrow-right-short"></i>
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        {categories.length > 5 && ( // Show "View All" if more than a few categories are displayed
            <div className="text-center mt-5">
                <Link href="/categories" className="btn btn-outline-secondary btn-lg">
                View All Categories
                </Link>
            </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;