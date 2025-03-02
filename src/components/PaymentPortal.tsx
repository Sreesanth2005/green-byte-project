
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Building, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface PaymentPortalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentPortal = ({ open, onClose }: PaymentPortalProps) => {
  const [activeTab, setActiveTab] = useState("card");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      if (!otpSent) {
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "A one-time password has been sent to your registered mobile number.",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Your transaction has been processed successfully.",
        });
        onClose();
      }
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Processing</DialogTitle>
          <DialogDescription>
            Complete your payment to continue with the conversion.
          </DialogDescription>
        </DialogHeader>
        
        {!otpSent ? (
          <Tabs defaultValue="card" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
              <TabsTrigger value="upi">UPI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="card">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <div className="relative">
                    <Input placeholder="1234 5678 9012 3456" required />
                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <Input placeholder="MM/YY" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <Input placeholder="123" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <Input placeholder="John Smith" required />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="bank">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bank Name</label>
                  <div className="relative">
                    <Input placeholder="HDFC Bank" required />
                    <Building className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Account Number</label>
                  <Input placeholder="123456789012" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">IFSC Code</label>
                  <Input placeholder="HDFC0001234" required />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                  <Input placeholder="John Smith" required />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="upi">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">UPI ID</label>
                  <div className="relative">
                    <Input placeholder="username@upi" required />
                    <QrCode className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <p className="text-sm text-gray-600 mb-2">Alternatively, scan the QR code below:</p>
                  <div className="bg-white p-4 rounded border flex items-center justify-center">
                    <svg className="h-48 w-48" viewBox="0 0 100 100">
                      <path d="M30,30 L30,40 L40,40 L40,30 Z M50,30 L50,40 L60,40 L60,30 Z M70,30 L70,40 L80,40 L80,30 Z M20,40 L20,50 L30,50 L30,40 Z M40,40 L40,50 L50,50 L50,40 Z M60,40 L60,50 L70,50 L70,40 Z M80,40 L80,50 L90,50 L90,40 Z M10,50 L10,60 L20,60 L20,50 Z M30,50 L30,60 L40,60 L40,50 Z M50,50 L50,60 L60,60 L60,50 Z M70,50 L70,60 L80,60 L80,50 Z M20,60 L20,70 L30,70 L30,60 Z M40,60 L40,70 L50,70 L50,60 Z M60,60 L60,70 L70,70 L70,60 Z M80,60 L80,70 L90,70 L90,60 Z M30,70 L30,80 L40,80 L40,70 Z M50,70 L50,80 L60,80 L60,70 Z M70,70 L70,80 L80,80 L80,70 Z" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Verify Payment"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <Input 
                placeholder="Enter the OTP sent to your mobile" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                required 
              />
              <p className="text-xs text-gray-500 mt-2">
                A one-time password has been sent to your registered mobile number ending with ****1234
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <Button type="button" variant="link" className="px-0">
                Resend OTP
              </Button>
              <span className="text-sm text-gray-500">Valid for 05:00</span>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPortal;
