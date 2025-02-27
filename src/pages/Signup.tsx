
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Signup = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-md mx-auto px-6 pt-24 pb-16">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-600">Join Green Byte and start recycling</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                required
              />
              <Input
                placeholder="Last name"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm password"
                required
              />
            </div>
            <div className="text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline ml-1">
                  Terms of Service
                </a>
              </label>
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
