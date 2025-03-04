
import FeedbackForm from "./FeedbackForm";

const FeedbackSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Share Your Feedback</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We'd love to hear about your experience with Green Byte. Your feedback helps us improve our services.
          </p>
        </div>
        
        <FeedbackForm />
      </div>
    </section>
  );
};

export default FeedbackSection;
