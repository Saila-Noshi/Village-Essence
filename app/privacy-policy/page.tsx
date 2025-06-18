"use client";
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-policy-page">
      <style jsx>{`
        .bg-gradient-green-to-blue {
          background: linear-gradient(to right, #10b981, #3b82f6) !important;
        }
        .text-gradient-green-blue {
          background: linear-gradient(to right, #10b981, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 50%, #f5f3ff 100%);
          padding: 80px 0;
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
          font-size: 3rem;
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
        .policy-section {
          padding: 60px 0;
          background: white;
        }
        .policy-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .policy-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #10b981, #3b82f6);
        }
        .policy-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
        }
        .policy-item {
          margin-bottom: 2rem;
        }
        .policy-item h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }
        .policy-item p {
          color: #6b7280;
          line-height: 1.6;
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
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title text-gradient-green-blue">Privacy Policy</h1>
            <p className="hero-subtitle">
              Your trust is our priority
            </p>
            <div className="row justify-content-center mt-4">
              <div className="col-lg-8">
                <p className="lead text-muted">
                  At Village Essence, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section className="policy-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="policy-card">
                <div className="policy-item">
                  <h3>Information We Collect</h3>
                  <p>
                    We collect information you provide directly, such as your name, email address, phone number, shipping address, and payment details when you create an account, place an order, or contact us. We also collect data automatically, including your IP address, browser type, device information, and browsing behavior on our website through cookies and similar technologies.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>How We Use Your Information</h3>
                  <p>
                    Your information is used to process orders, provide customer support, improve our services, and send you promotional offers (if you opt in). We may also use your data to analyze website usage, enhance user experience, and comply with legal obligations.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Sharing Your Information</h3>
                  <p>
                    We do not sell or rent your personal information to third parties. We may share your data with trusted service providers (e.g., payment processors, shipping companies) to fulfill orders and provide services. These partners are bound by confidentiality agreements and are only permitted to use your data for the specified purpose.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Cookies and Tracking</h3>
                  <p>
                    We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings. Some cookies are essential for website functionality, while others are optional and require your consent.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Data Security</h3>
                  <p>
                    We implement industry-standard security measures, including encryption and secure servers, to protect your personal information. However, no online platform can guarantee complete security, and you share information at your own risk.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Your Rights</h3>
                  <p>
                    You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, contact us at <a href="mailto:info@villageessence.com">info@villageessence.com</a>. We will respond to your request within a reasonable timeframe, in accordance with applicable laws.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Third-Party Links</h3>
                  <p>
                    Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these sites. We encourage you to review their privacy policies before providing any personal information.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Children's Privacy</h3>
                  <p>
                    Our services are not intended for individuals under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately, and we will take steps to remove it.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Changes to This Policy</h3>
                  <p>
                    We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or a notice on our website. The updated policy will be effective upon posting.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Contact Us</h3>
                  <p>
                    For questions or concerns about our Privacy Policy, please reach out to us at <a href="mailto:info@villageessence.com">info@villageessence.com</a> or +92 300 1234567. We’re here to assist you!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)'}}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Shop Securely with Us</h2>
              <p className="lead text-muted mb-4">
                Your privacy matters to us. Explore our authentic local products with confidence!
              </p>
              <a href="/products" className="btn btn-gradient-green btn-lg">
                <i className="fas fa-shopping-cart me-2"></i>
                Explore Products
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};