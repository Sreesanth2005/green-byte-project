
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TeamSection from "@/components/TeamSection";
import EventsSection from "@/components/EventsSection";
import FeedbackSection from "@/components/FeedbackSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <TeamSection />
      <EventsSection />
      <FeedbackSection />
      <Footer />
    </div>
  );
};

export default Index;
