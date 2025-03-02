
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, CreditCard, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentPortalProps {
  isOpen: boolean;
  onClose: () => void;
  conversionType: "toCredits" | "toRupees";
  amount: string;
  creditAmount: string;
  onSuccess: () => void;
}

const PaymentPortal = ({ 
  isOpen, 
  onClose, 
  conversionType, 
  amount, 
  creditAmount,
  onSuccess 
}: PaymentPortalProps) => {
  const [step, setStep] = useState<"details" | "otp" | "processing" | "success" | "error">("details");
  const [accountDetails, setAccountDetails] = useState("");
  const [otp, setOtp] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleDetailsSubmit = async () => {
    if (!accountDetails) {
      setError("Please enter your account details");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Request OTP
      const response = await supabase.functions.invoke('payment-processing', {
        body: {
          action: 'send-otp',
          userId: user?.id
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send OTP");
      }
      
      // For demo purposes only - in real app, OTP would be sent to user's phone
      setDemoOtp(response.data.demoOtp);
      
      setStep("otp");
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP sent to your phone");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Verify OTP
      const verifyResponse = await supabase.functions.invoke('payment-processing', {
        body: {
          action: 'verify-otp',
          userId: user?.id,
          otp: otp
        }
      });
      
      if (!verifyResponse.data.success) {
        throw new Error(verifyResponse.data.message || "Failed to verify OTP");
      }
      
      setStep("processing");
      
      // Process the payment
      const processResponse = await supabase.functions.invoke('payment-processing', {
        body: {
          action: 'process-payment',
          userId: user?.id,
          transactionType: conversionType === "toCredits" ? "money-to-credits" : "credits-to-money",
          accountInfo: accountDetails,
          convertAmount: conversionType === "toCredits" ? parseInt(amount) : parseInt(creditAmount)
        }
      });
      
      if (!processResponse.data.success) {
        throw new Error(processResponse.data.message || "Transaction failed");
      }
      
      // Success
      setStep("success");
      
      // Call onSuccess to refresh parent component
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (err: any) {
      console.error("Error processing payment:", err);
      setError(err.message || "Transaction failed. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setStep("details");
    setAccountDetails("");
    setOtp("");
    setDemoOtp("");
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {conversionType === "toCredits" 
              ? "Add EcoCredits" 
              : "Convert EcoCredits to Money"}
          </DialogTitle>
          <DialogDescription>
            {conversionType === "toCredits"
              ? `You're adding ${creditAmount} EcoCredits for ₹${amount}`
              : `You're converting ${creditAmount} EcoCredits to ₹${amount}`}
          </DialogDescription>
        </DialogHeader>
        
        {step === "details" && (
          <>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">
                  {conversionType === "toCredits" 
                    ? "Payment Method" 
                    : "Money Transfer Details"}
                </label>
                <Input
                  placeholder={conversionType === "toCredits" 
                    ? "Enter card number or UPI ID" 
                    : "Enter UPI ID or bank account details"
                  }
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleDetailsSubmit} disabled={loading}>
                {loading ? "Processing..." : "Continue"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "otp" && (
          <>
            <div className="space-y-4 py-4">
              <div className="text-center p-2 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  For demo purposes, your OTP is: <span className="font-bold">{demoOtp}</span>
                </p>
                <p className="text-xs mt-1">
                  (In a real app, this would be sent to your phone)
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">
                  Enter OTP
                </label>
                <Input
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                  className="mt-1"
                  maxLength={6}
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("details")}>Back</Button>
              <Button onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </DialogFooter>
          </>
        )}
        
        {step === "processing" && (
          <div className="py-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4">Processing your transaction...</p>
          </div>
        )}
        
        {step === "success" && (
          <div className="py-8 flex flex-col items-center">
            <div className="rounded-full h-12 w-12 bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="mt-4 font-medium">Transaction Successful!</p>
            <p className="text-sm text-center mt-2">
              {conversionType === "toCredits"
                ? `You've added ${creditAmount} EcoCredits to your account`
                : `Your money transfer of ₹${amount} is being processed`}
            </p>
          </div>
        )}
        
        {step === "error" && (
          <div className="py-8 flex flex-col items-center">
            <div className="rounded-full h-12 w-12 bg-red-100 flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <p className="mt-4 font-medium">Transaction Failed</p>
            <p className="text-sm text-center mt-2 text-red-500">{error}</p>
            
            <Button onClick={handleReset} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPortal;
