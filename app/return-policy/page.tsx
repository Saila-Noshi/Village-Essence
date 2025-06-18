"use client";
import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <div className="return-policy-page">
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
            <h1 className="hero-title text-gradient-green-blue">Return Policy</h1>
            <p className="hero-subtitle">
              Our commitment to your satisfaction with every purchase
            </p>
            <div className="row justify-content-center mt-4">
              <div className="col-lg-8">
                <p className="lead text-muted">
                  At Village Essence, we strive to ensure you are completely satisfied with your purchase. Our return policy is designed to be fair, transparent, and customer-friendly.
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
                  <h3>30-Day Return Window</h3>
                  <p>
                    We offer a 30-day return period from the date of delivery. If you are not satisfied with your purchase, you may return it within this timeframe for a refund or exchange, subject to the conditions below.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Eligibility for Returns</h3>
                  <p>
                    To be eligible for a return, the item must be unused, in its original packaging, and in the same condition as received. Items that are damaged, used, or missing parts may not qualify for a full refund. Certain products, such as perishable goods or personalized items, are non-returnable unless defective.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Return Process</h3>
                  <p>
                    To initiate a return, please contact our customer support team at <a href="mailto:info@villageessence.com">info@villageessence.com</a> or call +92 300 1234567. Provide your order number and a brief explanation of the reason for the return. We will provide you with a Return Merchandise Authorization (RMA) number and instructions for shipping the item back to us.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Return Shipping</h3>
                  <p>
                    Customers are responsible for return shipping costs unless the item is defective or was sent in error. We recommend using a trackable shipping service to ensure the safe return of your package. Village Essence is not liable for items lost or damaged during return shipping.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Refunds</h3>
                  <p>
                    Once we receive and inspect the returned item, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 7-10 business days and credited to your original payment method. Please note that shipping fees are non-refundable.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Exchanges</h3>
                  <p>
                    If you wish to exchange an item for a different size, color, or product, please contact us to confirm availability. Exchanges are subject to the same eligibility criteria as returns. We will provide instructions for returning the original item and shipping the replacement.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Defective or Damaged Items</h3>
                  <p>
                    If you receive a defective or damaged item, please contact us within 7 days of delivery. We will arrange for a replacement or refund at no additional cost, including return shipping fees. Please provide photos of the issue to expedite the process.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Non-Returnable Items</h3>
                  <p>
                    The following items are non-returnable unless defective: perishable goods, custom-made or personalized products, and items marked as final sale. Please review product descriptions carefully before purchasing.
                  </p>
                </div>
                <div className="policy-item">
                  <h3>Contact Us</h3>
                  <p>
                    For any questions or concerns about our return policy, please reach out to our team at <a href="mailto:info@villageessence.com">info@villageessence.com</a> or +92 300 1234567. We’re here to assist you!
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
              <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Shop with Confidence</h2>
              <p className="lead text-muted mb-4">
                We’re committed to making your shopping experience seamless and worry-free. Explore our products today!
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