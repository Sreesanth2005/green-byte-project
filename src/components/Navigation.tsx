
import { Button } from "@/components/ui/button";
import { Recycle, User, Menu, X, BarChart2, Info, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 py-3 px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/24b8d545-2e4e-42c1-9d48-3e0dd4888244.png" alt="Green Byte Logo" className="w-8 h-8" />
          <span className="font-semibold text-lg text-primary">Green Byte</span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center justify-center text-gray-700"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/schedule-pickup" className="text-sm font-medium hover:text-primary transition-colors">
            Schedule Pickup
          </Link>
          <Link to="/marketplace" className="text-sm font-medium hover:text-primary transition-colors">
            Marketplace
          </Link>
          <Link to="/events" className="text-sm font-medium hover:text-primary transition-colors">
            Events
          </Link>
          <Link to="/my-ecocredits" className="text-sm font-medium hover:text-primary transition-colors">
            My EcoCredits
          </Link>
          <Link to="/analysis" className="text-sm font-medium hover:text-primary transition-colors">
            Analysis
          </Link>
          <Link to="/about-us" className="text-sm font-medium hover:text-primary transition-colors">
            About Us
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link to="/profile">
              <User className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-md animate-fadeIn">
          <div className="flex flex-col p-4 space-y-3">
            <Link 
              to="/" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/schedule-pickup" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Schedule Pickup
            </Link>
            <Link 
              to="/marketplace" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link 
              to="/events" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              to="/my-ecocredits" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              My EcoCredits
            </Link>
            <Link 
              to="/analysis" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Analysis
            </Link>
            <Link 
              to="/about-us" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/profile" 
              className="text-sm font-medium hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
            <div className="pt-2">
              <Button className="w-full" asChild>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
