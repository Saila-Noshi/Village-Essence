"use client";
import React from 'react';

export default function AboutUsPage() {
  const founderData = [
    {
      id: 1,
      name: "Misbah Bibi",
      role: "Co-Founder & Creative Director",
      message: "Passionate about bringing creativity to life through handmade crafts. I believe every creation tells a story and connects hearts across communities.",
      image: "https://img.freepik.com/premium-vector/muslim-woman-hijab-face-portrait-avatar-beauty_1322553-56785.jpg?w=360"
    },
    {
      id: 2,
      name: "Saila Noshi",
      role: "Co-Founder & Operations Manager",
      message: "Dedicated to building bridges between traditional craftsmanship and modern innovation. Together, we're creating a platform where passion meets purpose.",
      image: "https://pics.craiyon.com/2023-07-09/e0d6c3b2d54c4e93821391f901255a29.webp"
    }
  ];

  const values = [
    {
      icon: "fa-heart",
      title: "Passion-Driven",
      description: "Every product we create comes from genuine love for handmade craftsmanship and quality.",
      gradient: "bg-gradient-pink-to-purple"
    },
    {
      icon: "fa-users",
      title: "Community Focused",
      description: "Building meaningful connections and relationships through shared creativity and collaboration.",
      gradient: "bg-gradient-blue-to-purple"
    },
    {
      icon: "fa-leaf",
      title: "Sustainable Approach",
      description: "Committed to eco-friendly practices and supporting local artisans and communities.",
      gradient: "bg-gradient-green-to-teal"
    },
    {
      icon: "fa-lightbulb",
      title: "Innovation & Tradition",
      description: "Blending time-honored techniques with modern innovation to create unique experiences.",
      gradient: "bg-gradient-orange-to-red"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Customers" },
    { number: "50+", label: "Unique Products" },
    { number: "2", label: "Years Experience" },
    { number: "100%", label: "Handmade Quality" }
  ];

  return (
    <div className="about-us-page">
      <style jsx>{`
        /* Custom CSS based on your theme */
        .bg-gradient-primary-to-secondary {
          background: linear-gradient(to right, #10b981, #3b82f6) !important;
        }
        .bg-gradient-green-to-blue {
          background: linear-gradient(to right, #10b981, #3b82f6) !important;
        }
        .bg-gradient-orange-to-red {
          background: linear-gradient(to right, #f97316, #ef4444) !important;
        }
        .bg-gradient-blue-to-purple {
          background: linear-gradient(to right, #3b82f6, #8b5cf6) !important;
        }
        .bg-gradient-pink-to-purple {
          background: linear-gradient(to right, #ec4899, #a855f7) !important;
        }
        .bg-gradient-green-to-teal {
          background: linear-gradient(to right, #22c55e, #14b8a6) !important;
        }
        .text-gradient-green-blue {
          background: linear-gradient(to right, #10b981, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-gradient-green {
          background: linear-gradient(to right, #10b981, #16a34a);
          color: white;
          border: none;
          transition: all 0.3s ease;
          border-radius: 50px;
          padding: 12px 30px;
        }
        .btn-gradient-green:hover {
          background: linear-gradient(to right, #059669, #15803d);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }
        .hero-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f5f3ff 100%);
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
          opacity: 0.8;
        }
        .hero-content {
          position: relative;
          z-index: 2;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          animation: fadeInUp 1s ease-out;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: #6b7280;
          margin-bottom: 2rem;
          animation: fadeInUp 1s ease-out 0.2s both;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .mission-section {
          padding: 80px 0;
          background: white;
        }
        .mission-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .mission-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #10b981, #3b82f6);
        }
        .mission-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
        }
        .founder-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .founder-card {
          background: white;
          border-radius: 25px;
          padding: 40px 30px;
          text-align: center;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          position: relative;
          overflow: hidden;
          height: 100%;
        }
        .founder-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(16, 185, 129, 0.05), transparent);
          transform: rotate(45deg);
          transition: all 0.6s ease;
          opacity: 0;
        }
        .founder-card:hover::before {
          opacity: 1;
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% { transform: rotate(45deg) translateX(-100%); }
          100% { transform: rotate(45deg) translateX(100%); }
        }
        .founder-card:hover {
          transform: translateY(-15px) scale(1.02);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
        }
        .founder-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin: 0 auto 25px;
          border: 4px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          object-fit: cover;
        }
        .founder-card:hover .founder-image {
          border-color: #10b981;
          transform: scale(1.1);
        }
        .founder-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 2;
        }
        .founder-role {
          color: #10b981;
          font-weight: 500;
          font-size: 1rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
        }
        .founder-message {
          color: #6b7280;
          font-style: italic;
          line-height: 1.6;
          position: relative;
          z-index: 2;
        }
        .values-section {
          padding: 80px 0;
          background: white;
        }
        .value-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
          height: 100%;
        }
        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
        }
        .value-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: white;
          font-size: 24px;
        }
        .stats-section {
          padding: 60px 0;
          background: linear-gradient(to right, #10b981, #3b82f6);
          color: white;
        }
        .stat-item {
          text-align: center;
          padding: 20px;
        }
        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          display: block;
          margin-bottom: 0.5rem;
        }
        .stat-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        .project-badge {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <div className="project-badge">
              🎓 College Final Year Project
            </div>
            <h1 className="hero-title text-gradient-green-blue">About HomeCraft</h1>
            <p className="hero-subtitle">
              Passionate creators dedicated to sharing the art of homemade craftsmanship with the world
            </p>
            <div className="row justify-content-center mt-4">
              <div className="col-lg-8">
                <p className="lead text-muted">
                  We are a team of passionate individuals who love making homemade things. Our mission is to share our knowledge and skills with others and help them create their own unique homemade products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-6">
                <div className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="mission-card">
                <div className="text-center mb-4">
                  <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Our Mission</h2>
                  <div className="d-flex justify-content-center mb-4">
                    <div className="bg-gradient-green-to-blue rounded-circle p-3">
                      <i className="fas fa-bullseye text-white fa-2x"></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <p className="lead">
                      We believe that homemade things are not just about the end product, but about the process and the journey. We want to inspire and empower others to take control of their own creativity and make something truly special.
                    </p>
                  </div>
                  <div className="col-lg-6">
                    <p className="lead">
                      Our mission is to inspire and empower others to create their own homemade things, whether it's a delicious meal, a handmade craft, or a beautiful piece of art. We believe that making things from scratch is not only fun and rewarding, but also a great way to connect with others and build meaningful relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founder-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Meet Our Co-Founders</h2>
            <p className="lead text-muted">The passionate minds behind HomeCraft</p>
          </div>
          <div className="row justify-content-center">
            {founderData.map((founder) => (
              <div key={founder.id} className="col-lg-5 col-md-6 mb-4">
                <div className="founder-card">
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    className="founder-image"
                  />
                  <h3 className="founder-name">{founder.name}</h3>
                  <p className="founder-role">{founder.role}</p>
                  <p className="founder-message">"{founder.message}"</p>
                  <div className="mt-3">
                    <div className="d-flex justify-content-center gap-3">
                      <a href="#" className="text-muted">
                        <i className="fab fa-linkedin fa-lg"></i>
                      </a>
                      <a href="#" className="text-muted">
                        <i className="fab fa-twitter fa-lg"></i>
                      </a>
                      <a href="#" className="text-muted">
                        <i className="fab fa-instagram fa-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Our Values</h2>
            <p className="lead text-muted">The principles that guide everything we do</p>
          </div>
          <div className="row">
            {values.map((value, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="value-card">
                  <div className={`value-icon ${value.gradient}`}>
                    <i className={`fas ${value.icon}`}></i>
                  </div>
                  <h4 className="fw-bold mb-3">{value.title}</h4>
                  <p className="text-muted">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)'}}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Ready to Start Your Journey?</h2>
              <p className="lead text-muted mb-4">
                Join our community of creators and discover the joy of making something beautiful with your own hands.
              </p>
             <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
  <a href="/products" className="btn btn-gradient-green btn-lg">
    <i className="fas fa-shopping-cart me-2"></i>
    Explore Products
  </a>
  <a href="/contact" className="btn btn-outline-success btn-lg">
    <i className="fas fa-envelope-cart me-2"></i>
    Contact Us
  </a>
</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};