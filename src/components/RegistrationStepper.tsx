
import { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

interface RegistrationStepperProps {
  onComplete: () => void;
}

const RegistrationStepper = ({ onComplete }: RegistrationStepperProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords don't match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        return;
      }
      
      if (formData.password.length < 6) {
        toast({
          title: "Password too short",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the Terms of Service to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        { 
          firstName: formData.firstName, 
          lastName: formData.lastName 
        }
      );
      
      if (error) throw error;
      
      setStep(3); // Move to success step
      setTimeout(() => {
        navigate("/login");
        onComplete();
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`text-sm ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>Account</div>
          <div className={`text-sm ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>Personal Info</div>
          <div className={`text-sm ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>Complete</div>
        </div>
        <div className="relative mt-2">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-2 bg-primary rounded-full transition-all"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
          <div className="flex justify-between absolute top-0 -mt-2 w-full">
            <div className={`h-6 w-6 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-200'} flex items-center justify-center`}>
              {step > 1 ? (
                <CheckCircle2 className="h-4 w-4 text-white" />
              ) : (
                <span className="text-xs text-white">1</span>
              )}
            </div>
            <div className={`h-6 w-6 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-200'} flex items-center justify-center`}>
              {step > 2 ? (
                <CheckCircle2 className="h-4 w-4 text-white" />
              ) : (
                <span className="text-xs text-white">2</span>
              )}
            </div>
            <div className={`h-6 w-6 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-200'} flex items-center justify-center`}>
              <span className="text-xs text-white">3</span>
            </div>
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Create your account</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
          <div className="pt-4">
            <Button type="button" onClick={handleNextStep} className="w-full">Continue</Button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
          </div>
          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pinCode">PIN Code</Label>
            <Input
              id="pinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="PIN code"
            />
          </div>
          <div className="pt-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2" 
                required
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <span className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>
              </span>
            </label>
          </div>
          <div className="pt-2 flex space-x-3">
            <Button type="button" variant="outline" onClick={handlePrevStep}>Back</Button>
            <Button 
              type="button" 
              className="flex-1"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been created successfully. As a welcome bonus, 5000 EcoCredits have been added to your account!
          </p>
          <p className="text-gray-600">
            Redirecting to login page...
          </p>
        </div>
      )}
    </div>
  );
};

export default RegistrationStepper;
