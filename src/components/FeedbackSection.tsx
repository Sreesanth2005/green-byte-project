
import { Star } from "lucide-react";

const FeedbackSection = () => {
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Regular User",
      content: "Green Byte made recycling my old electronics so easy! The pickup service was prompt and professional.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    },
    {
      name: "Maria Garcia",
      role: "Business Owner",
      content: "Their marketplace for refurbished electronics is amazing. Great prices and everything works perfectly!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    },
    {
      name: "James Wilson",
      role: "Tech Enthusiast",
      content: "I love how I can earn EcoCredits for recycling. It's a win-win for both me and the environment.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community has to say about Green Byte.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-secondary rounded-2xl p-6">
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
