// components/HeroSection.tsx
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Column: Text Content & CTAs */}
          <div className="col-lg-6">
            <h1 className="display-4 mb-3">
              <span className="text-gradient-green-blue">Village Essence</span>
              <br />
              <span className="text-dark">Where Tradition Meets Quality</span>
            </h1>
            <p className="lead mb-4">
              Discover authentic local products from trusted vendors across Pakistan.
              From fresh foods to handcrafted goods, experience the essence of village life delivered to your doorstep.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
              <Link href="/products" className="btn btn-gradient-green btn-lg px-4 py-3">
                Shop Now
              </Link>
              <Link href="/auth/signup" className="btn btn-outline-green btn-lg px-4 py-3">
                Become a Vendor
              </Link>
            </div>
            <div className="hero-stats row g-3 text-center text-sm-start">
              <div className="col-sm-4 stat-item">
                <div className="stat-number text-success">500+</div>
                <div className="stat-label">Local Vendors</div>
              </div>
              <div className="col-sm-4 stat-item">
                <div className="stat-number text-primary">10K+</div>
                <div className="stat-label">Products</div>
              </div>
              <div className="col-sm-4 stat-item">
                <div className="stat-number" style={{color: '#8b5cf6'}}>50K+</div> {/* custom purple */}
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Column: Image/Visual Element */}
          <div className="col-lg-6">
            <div className="hero-features-card bg-gradient-green-to-blue p-4">
              <div className="hero-features-card-inner p-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="hero-feature-item bg-light"> {/* Example: Orange-100 like */}
                      <div className="icon-wrapper" style={{backgroundColor: '#fb923c'}}> {/* orange-500 */}
                        <i className="bi bi-box-seam fs-4"></i>
                      </div>
                      <h5>Fresh Foods</h5>
                      <p>Farm to table</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="hero-feature-item bg-light"> {/* Example: Green-100 like */}
                      <div className="icon-wrapper" style={{backgroundColor: '#22c55e'}}> {/* green-500 */}
                        <i className="bi bi-heart-fill fs-4"></i>
                      </div>
                      <h5>Handcrafted</h5>
                      <p>Made with love</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="hero-feature-item bg-light"> {/* Example: Blue-100 like */}
                      <div className="icon-wrapper" style={{backgroundColor: '#3b82f6'}}> {/* blue-500 */}
                        <i className="bi bi-shield-check fs-4"></i>
                      </div>
                      <h5>Authentic</h5>
                      <p>100% genuine</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="hero-feature-item bg-light"> {/* Example: Purple-100 like */}
                      <div className="icon-wrapper" style={{backgroundColor: '#a855f7'}}> {/* purple-500 */}
                        <i className="bi bi-truck fs-4"></i>
                      </div>
                      <h5>Fast Delivery</h5>
                      <p>Quick & safe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;