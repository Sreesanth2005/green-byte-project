
import { Button } from "@/components/ui/button";
import { Recycle, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 py-3 px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/4d738902-b757-49a8-9fe8-1354783f4812.png" alt="Green Byte Logo" className="w-8 h-8" />
          <span className="font-semibold text-lg text-primary">Green Byte</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/schedule-pickup" className="text-sm font-medium hover:text-primary transition-colors">
            Schedule Pickup
          </Link>
          <Link to="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link to="/my-ecocredits" className="text-sm font-medium hover:text-primary transition-colors">
            My EcoCredits
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
