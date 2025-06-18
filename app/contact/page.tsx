"use client";
import React from 'react';
import { FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaShoppingCart, FaClock } from 'react-icons/fa';

export default function ContactUsPage() {
  return (
    <div className="contact-us-page">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      />
      <style jsx>{`
        /* Custom CSS to match About Us page styling */
        .bg-gradient-primary-to-secondary {
          background: linear-gradient(to right, #10b981, #3b82f6) !important;
        }
        .bg-gradient-green-to-blue {
          background: linear-gradient(to right, #10b981, #3b82f6) !important;
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
        .contact-section {
          padding: 80px 0;
          background: white;
        }
        .contact-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .contact-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(to right, #10b981, #3b82f6);
        }
        .contact-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.15);
        }
        .contact-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          color: white;
          font-size: 24px;
          background: linear-gradient(to right, #10b981, #3b82f6);
        }
        .social-section {
          padding: 60px 0;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .social-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 1px solid #f1f5f9;
          text-align: center;
        }
        .social-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
        }
        .social-icon {
          font-size: 2rem;
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }
        .social-card:hover .social-icon {
          transform: scale(1.2);
        }
        .map-section {
          padding: 60px 0;
          background: white;
        }
        .map-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          height: 400px;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1rem;
          }
          .contact-card {
            padding: 20px;
          }
          .map-container {
            height: 300px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content text-center">
            <h1 className="hero-title text-gradient-green-blue">Contact Village Essence</h1>
            <p className="hero-subtitle">
              We're here to help you bring your creative ideas to life. Reach out to us!
            </p>
            <div className="row justify-content-center mt-4">
              <div className="col-lg-8">
                <p className="lead text-muted">
                  Whether you have questions about our handmade products, need assistance, or want to collaborate, feel free to get in touch with us through any of the channels below.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="contact-card">
                <div className="text-center mb-5">
                  <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Get in Touch</h2>
                  <p className="lead text-muted">We'd love to hear from you!</p>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-4">
                    <div className="contact-icon">
                      <FaEnvelope />
                    </div>
                    <h4 className="fw-bold mb-2">Email Us</h4>
                    <p className="text-muted mb-2">For inquiries, support, or collaborations:</p>
                    <a href="mailto:info@villageessence.com" className="text-gradient-green-blue">
                      info@villageessence.com
                     </a>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="contact-icon">
                      <FaPhone />
                    </div>
                    <h4 className="fw-bold mb-2">Call Us</h4>
                    <p className="text-muted mb-2">Available during business hours:</p>
                    <a href="tel:+923001234567" className="text-gradient-green-blue">
                      +92 300 1234567
                    </a>
                  </div>
                  <div className="col-md-4 mb-4">
                    <div className="contact-icon">
                      <FaClock />
                    </div>
                    <h4 className="fw-bold mb-2">Business Hours</h4>
                    <p className="text-muted mb-2">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-muted">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-muted">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Follow Us</h2>
            <p className="lead text-muted">Connect with us on social media for updates and inspiration</p>
          </div>
          <div className="row justify-content-center">
            {[
              { platform: 'LinkedIn', icon: <FaLinkedin className="social-icon text-gradient-green-blue" />, url: 'https://www.linkedin.com/company/villageessence' },
              { platform: 'Twitter', icon: <FaTwitter className="social-icon text-gradient-green-blue" />, url: 'https://www.twitter.com/villageessence' },
              { platform: 'Instagram', icon: <FaInstagram className="social-icon text-gradient-green-blue" />, url: 'https://www.instagram.com/villageessence' },
              { platform: 'Facebook', icon: <FaFacebook className="social-icon text-gradient-green-blue" />, url: 'https://www.facebook.com/villageessence' },
            ].map((social, index) => (
              <div key={index} className="col-lg-3 col-md-6 mb-4">
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                  <div className="social-card">
                    {social.icon}
                    <h4 className="fw-bold mb-2">{social.platform}</h4>
                    <p className="text-muted">/{social.platform.toLowerCase()}/villageessence</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Find Us</h2>
            <p className="lead text-muted">Located in the heart of Swat, KPK, Pakistan</p>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d135154.14876856047!2d72.24749604999999!3d35.22279965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e8b8f36d6975c5%3A0x95d4337db2607b7!2sSwat%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1697051234567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="h1 fw-bold text-gradient-green-blue mb-3">Ready to Connect?</h2>
              <p className="lead text-muted mb-4">
                Join our community of creators and start your journey with Village Essence today.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a href="mailto:info@villageessence.com" className="btn btn-gradient-green btn-lg d-flex align-items-center">
                  <FaEnvelope className="me-2" />
                  Email Us
                </a>
                <a href="/products" className="btn btn-outline-success btn-lg d-flex align-items-center">
                  <FaShoppingCart className="me-2" />
                  Explore Products
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}