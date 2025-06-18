import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5">
      <div className="container">
        <div className="row gy-4">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 col-12">
            <div className="d-flex align-items-center mb-3">
              <div className="footer-logo-icon-wrapper bg-gradient-green-to-blue me-2 p-2 rounded">
                <i className="bi bi-leaf-fill text-white"></i>
              </div>
              <div>
                <h3 className="footer-brand-text text-gradient-green-blue mb-0">Village Essence</h3>
                <p className="footer-brand-tagline mb-0 text-light opacity-75">Authentic Local Products</p>
              </div>
            </div>
            <p className="mb-3 text-light opacity-75">
              Connecting you with authentic local vendors and their premium products across Pakistan.
              Experience the essence of village life delivered to your doorstep.
            </p>
            <div className="social-icons-footer d-flex gap-3">
              <a href="/villageessence" className="text-light fs-5 opacity-75 hover-opacity-100"><i className="bi bi-facebook"></i></a>
              <a href="/villageessence" className="text-light fs-5 opacity-75 hover-opacity-100"><i className="bi bi-twitter-x"></i></a>
              <a href="/villageessence" className="text-light fs-5 opacity-75 hover-opacity-100"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6 col-12 offset-lg-1">
            <h5 className="mb-3 fw-bold text-light">Quick Links</h5>
            <div className="row">
              <div className="col-6">
                <ul className="list-unstyled">
                  <li className="mb-2"><Link href="/" className="text-light opacity-75 text-decoration-none hover-opacity-100">Home</Link></li>
                  <li className="mb-2"><Link href="/products" className="text-light opacity-75 text-decoration-none hover-opacity-100">Products</Link></li>
                  <li className="mb-2"><Link href="/categories" className="text-light opacity-75 text-decoration-none hover-opacity-100">Categories</Link></li>
                </ul>
              </div>
              <div className="col-6">
                <ul className="list-unstyled">
                  <li className="mb-2"><Link href="/all-vendors" className="text-light opacity-75 text-decoration-none hover-opacity-100">Vendors</Link></li>
                  <li className="mb-2"><Link href="/about" className="text-light opacity-75 text-decoration-none hover-opacity-100">About Us</Link></li>
                  <li className="mb-2"><Link href="/contact" className="text-light opacity-75 text-decoration-none hover-opacity-100">Contact</Link></li>
                  <li className="mb-2"><Link href="/return-policy" className="text-light opacity-75 text-decoration-none hover-opacity-100">Return Policy</Link></li>
                  <li className="mb-2"><Link href="/privacy-policy" className="text-light opacity-75 text-decoration-none hover-opacity-100">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Get in Touch */}
          <div className="col-lg-3 col-md-12 col-12">
            <h5 className="mb-3 fw-bold text-light">Get in Touch</h5>
            <ul className="list-unstyled contact-info">
              <li className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone-fill me-2 text-primary"></i>
                <span className="text-light opacity-75">+92 300 1234567</span>
              </li>
              <li className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                <span className="text-light opacity-75">info@villageessence.com</span>
              </li>
              <li className="d-flex align-items-center">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                <span className="text-light opacity-75">Swat, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom text-center mt-4">
          <p className="mb-0 text-light opacity-75">
            © {new Date().getFullYear()} Village Essence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;