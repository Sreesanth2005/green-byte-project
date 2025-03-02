
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate("/about-us");
  };

  const handleSchedulePickup = () => {
    navigate("/schedule-pickup");
  };

  return (
    <section className="pt-32 pb-24 bg-[url('/lovable-uploads/4d738902-b757-49a8-9fe8-1354783f4812.png')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Recycle Electronics, <span className="text-primary">Earn Rewards</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-200">
          Join Green Byte in building a sustainable future by recycling your e-waste and earning EcoCredits.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="text-lg px-8" onClick={handleSchedulePickup}>
            Schedule Pickup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg border-white text-white hover:bg-white/10" onClick={handleLearnMore}>
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
