
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import TeamSection from "@/components/TeamSection";
import FeedbackSection from "@/components/FeedbackSection";
import EventsSection from "@/components/EventsSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      
      <main className="flex-grow">
        <EventsSection />
        <TeamSection />
        <FeedbackSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
