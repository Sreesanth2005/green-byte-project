
import { Button } from "@/components/ui/button";
import { RecycleBin, Award, User } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 py-4 px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <RecycleBin className="w-6 h-6 text-primary" />
          <span className="font-semibold text-lg">EcoReward</span>
        </div>
        <div className="flex items-center space-x-8">
          <Button variant="ghost" className="text-sm font-medium">
            Schedule Pickup
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            About
          </Button>
          <Button variant="ghost" className="text-sm font-medium">
            Impact
          </Button>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Award className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
