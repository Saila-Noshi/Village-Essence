// components/CTASection.tsx
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="cta-section bg-gradient-green-to-blue">
      <div className="container text-center">
        <div className="col-lg-8 mx-auto">
          <h2 className="text-white">
            Ready to Experience Village Essence?
          </h2>
          <p className="text-white-75"> {/* Bootstrap class for lighter white */}
            Join thousands of customers discovering authentic local products or become a vendor
            and showcase your products to customers across Pakistan.
          </p>
          <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
            <Link href="/products" className="btn btn-cta-primary btn-lg">
              Start Shopping
            </Link>
            <Link href="/auth/signup" className="btn btn-cta-secondary btn-lg">
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;