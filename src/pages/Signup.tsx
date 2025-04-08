
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RegistrationStepper from "@/components/RegistrationStepper";

const Signup = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleRegistrationComplete = () => {
    setRegistrationComplete(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-xl mx-auto px-6 pt-24 pb-16">
        <div className="text-center mb-8">
          <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-gray-600">Join Green Byte and start recycling</p>
        </div>

        <RegistrationStepper onComplete={handleRegistrationComplete} />

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
