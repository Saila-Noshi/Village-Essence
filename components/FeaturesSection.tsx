// components/FeaturesSection.tsx

const featuresData = [
  {
    icon: "bi-shield-lock-fill",
    color: "text-success",
    title: "Trusted Vendors",
    description: "All our vendors are verified and trusted by our community."
  },
  {
    icon: "bi-gem",
    color: "text-danger", // Original was red for Heart
    title: "Quality Products",
    description: "Hand-picked products ensuring the highest quality standards."
  },
  {
    icon: "bi-truck",
    color: "text-primary",
    title: "Fast Delivery",
    description: "Quick and reliable delivery across Pakistan."
  },
  {
    icon: "bi-headphones",
    color: "text-info", // Original was purple
    title: "24/7 Support",
    description: "Round-the-clock customer support for all your needs."
  }
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">Why Choose Village Essence?</h2>
          <p className="lead text-muted col-lg-8 mx-auto">
            We connect you with authentic local vendors and their premium products,
            ensuring quality, authenticity, and fair prices.
          </p>
        </div>

        <div className="row g-4">
          {featuresData.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3 feature-item text-center">
              <div className="feature-icon-wrapper">
                <i className={`${feature.icon} ${feature.color} display-4`}></i>
              </div>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;