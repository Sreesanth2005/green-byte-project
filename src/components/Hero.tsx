
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary to-white pt-16">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border mb-8 animate-fadeIn">
          <span className="text-sm font-medium text-primary">Join the E-Waste Revolution</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-fadeIn [animation-delay:200ms]">
          Turn Your E-Waste into
          <span className="text-primary block mt-2">Eco Rewards</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 animate-fadeIn [animation-delay:400ms]">
          Schedule a pickup, responsibly dispose of your electronic waste, and earn rewards while helping the environment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn [animation-delay:600ms]">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Schedule Pickup
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
