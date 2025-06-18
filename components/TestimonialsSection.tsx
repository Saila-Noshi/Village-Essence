// components/TestimonialsSection.tsx

const testimonialsData = [
    {
      name: "Ayesha Khan",
      location: "Karachi",
      rating: 5,
      comment: "Amazing quality products! I love the authentic taste of village-made foods. The delivery was super fast too.",
      avatarEmoji: "👩", // Using emoji as in original
      avatarBg: "bg-success"
    },
    {
      name: "Ahmad Ali",
      location: "Lahore",
      rating: 5,
      comment: "As a vendor, Village Essence has helped me reach customers across Pakistan. Great platform for local businesses!",
      avatarEmoji: "👨",
      avatarBg: "bg-primary"
    },
    {
      name: "Fatima Sheikh",
      location: "Islamabad",
      rating: 5,
      comment: "The handcrafted items are beautiful and authentic. Supporting local vendors has never been easier!",
      avatarEmoji: "👩‍🦳",
      avatarBg: "bg-info"
    }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section bg-white">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">What Our Community Says</h2>
          <p className="lead text-muted col-lg-8 mx-auto">
            Hear from our satisfied customers and successful vendors.
          </p>
        </div>

        <div className="row g-4">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="testimonial-card h-100">
                <div className="d-flex align-items-center mb-3">
                  <div className={`testimonial-avatar ${testimonial.avatarBg} me-3`}>
                    {testimonial.avatarEmoji}
                  </div>
                  <div>
                    <h5 className="fw-semibold text-dark mb-0">{testimonial.name}</h5>
                    <small className="text-muted">{testimonial.location}</small>
                  </div>
                </div>
                <div className="stars mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="bi bi-star-fill me-1"></i>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                     <i key={i + testimonial.rating} className="bi bi-star me-1 text-muted"></i>
                  ))}
                </div>
                <p className="comment">"{testimonial.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;