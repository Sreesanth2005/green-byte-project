
import { useState } from "react";
import { X, CreditCard, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentModalProps {
  type: "toCredits" | "toRupees";
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal = ({ type, amount, onClose, onSuccess }: PaymentModalProps) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStepOne = () => {
    if (type === "toCredits") {
      // Validate credit card details
      if (paymentMethod === "credit-card") {
        if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
          toast({
            title: "Missing payment details",
            description: "Please fill in all the card details.",
            variant: "destructive",
          });
          return;
        }
      } else if (paymentMethod === "upi") {
        if (!upiId) {
          toast({
            title: "Missing UPI ID",
            description: "Please enter your UPI ID.",
            variant: "destructive",
          });
          return;
        }
      }
    } else {
      // Validate bank account details
      if (paymentMethod === "upi") {
        if (!upiId) {
          toast({
            title: "Missing UPI ID",
            description: "Please enter your UPI ID.",
            variant: "destructive",
          });
          return;
        }
      } else if (paymentMethod === "bank-transfer") {
        if (!accountNumber || !ifscCode) {
          toast({
            title: "Missing bank details",
            description: "Please fill in all the bank account details.",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    // Proceed to OTP step
    sendOtp();
  };

  const sendOtp = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Get user phone from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (!profile || !profile.phone) {
        toast({
          title: "Phone number required",
          description: "Please update your profile with a valid phone number.",
          variant: "destructive",
        });
        return;
      }
      
      // Generate OTP using the verify-otp function
      const response = await supabase.functions.invoke('verify-otp', {
        body: { 
          action: 'generate',
          userId: user.id,
          phone: profile.phone
        }
      });
      
      if (response.error) throw response.error;
      
      setOtpSent(true);
      setStep(2);
      
      toast({
        title: "OTP sent",
        description: `An OTP has been sent to your registered phone number. For demo purposes, your OTP is: ${response.data.demo_otp}`,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Failed to send OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!otp) {
      toast({
        title: "OTP required",
        description: "Please enter the OTP sent to your phone.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Verify OTP
      const otpResponse = await supabase.functions.invoke('verify-otp', {
        body: { 
          action: 'verify',
          userId: user.id,
          otp
        }
      });
      
      if (otpResponse.error) throw otpResponse.error;
      
      // Process payment
      const paymentDetails = type === "toCredits" 
        ? paymentMethod === "credit-card" 
          ? { cardNumber, cardName, cardExpiry } 
          : { upiId }
        : paymentMethod === "upi"
          ? { upiId }
          : { accountNumber, ifscCode };
      
      const response = await supabase.functions.invoke('process-payment', {
        body: {
          userId: user.id,
          amount: type === "toCredits" ? Number(amount) : Number(amount) * 10,
          direction: type,
          paymentDetails
        }
      });
      
      if (response.error) throw response.error;
      
      toast({
        title: "Transaction successful",
        description: type === "toCredits" 
          ? `Successfully added ${amount * 10} eco-credits to your account.`
          : `Successfully converted ${amount * 10} eco-credits to ₹${amount}.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Transaction failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length <= 2) {
      return v;
    }
    
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value);
    setCardExpiry(formattedValue);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {type === "toCredits" ? "Add Eco-Credits" : "Withdraw Eco-Credits"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {step === 1 ? (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Amount:</p>
                <p className="font-semibold">
                  {type === "toCredits" 
                    ? `₹${amount} = ${amount * 10} Eco-Credits` 
                    : `${amount * 10} Eco-Credits = ₹${amount}`}
                </p>
              </div>
            </div>
            
            {type === "toCredits" ? (
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Payment Method</Label>
                  <RadioGroup 
                    defaultValue="credit-card" 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="cursor-pointer flex-grow">Credit/Debit Card</Label>
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 mt-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="cursor-pointer flex-grow">UPI</Label>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-6" alt="UPI" />
                    </div>
                  </RadioGroup>
                </div>
                
                {paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry Date</Label>
                        <Input
                          id="cardExpiry"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="name@upi"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Withdrawal Method</Label>
                  <RadioGroup 
                    defaultValue="upi" 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mt-3"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="cursor-pointer flex-grow">UPI</Label>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-6" alt="UPI" />
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 mt-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer" className="cursor-pointer flex-grow">Bank Transfer</Label>
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                  </RadioGroup>
                </div>
                
                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="name@upi"
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === "bank-transfer" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Account Number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        placeholder="IFSC Code"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 flex flex-col gap-4">
              <Button onClick={handleStepOne} disabled={loading}>
                {loading ? "Processing..." : "Continue"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <p className="text-center text-gray-600 mb-4">
                Enter the 6-digit OTP sent to your registered mobile number for verification.
              </p>
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="text-center text-xl letter-spacing-wide"
                />
              </div>
              <div className="mt-2 text-center">
                <button 
                  type="button" 
                  onClick={sendOtp}
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Verifying..." : "Verify & Complete"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
