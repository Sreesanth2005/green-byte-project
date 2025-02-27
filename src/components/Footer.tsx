
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/4d738902-b757-49a8-9fe8-1354783f4812.png" alt="Green Byte Logo" className="w-8 h-8" />
              <span className="font-semibold text-lg text-primary">Green Byte</span>
            </Link>
            <p className="text-sm text-gray-600">
              Making e-waste recycling accessible and rewarding for everyone.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/schedule-pickup" className="text-gray-600 hover:text-primary">Schedule Pickup</Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-600 hover:text-primary">Marketplace</Link>
              </li>
              <li>
                <Link to="/my-ecocredits" className="text-gray-600 hover:text-primary">My EcoCredits</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Subscribe to our newsletter for updates and eco tips.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Green Byte. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
