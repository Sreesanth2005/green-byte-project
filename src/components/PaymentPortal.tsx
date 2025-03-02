
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const conversionRate = 100; // 1 USD = 100 eco credits

interface PaymentPortalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentPortal = ({ open, onClose }: PaymentPortalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('add');

  // Calculate eco credits based on amount
  const ecoCreditsToAdd = parseInt(amount) * conversionRate || 0;
  const moneyToReceive = parseInt(amount) / conversionRate || 0;

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // Call the Edge Function to send OTP
      const { data, error } = await supabase.functions.invoke('payment-processing', {
        body: { action: 'send-otp', userId: user?.id },
      });
      
      if (error) throw error;
      
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: 'A verification code has been sent to your registered mobile number.',
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: 'Failed to send OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifying(true);
    try {
      // Call the Edge Function to verify OTP
      const { data, error } = await supabase.functions.invoke('payment-processing', {
        body: { 
          action: 'verify-otp', 
          userId: user?.id, 
          otp,
          amount: parseInt(amount),
          direction: activeTab === 'add' ? 'add' : 'withdraw',
          accountNumber: activeTab === 'withdraw' ? accountNumber : undefined,
          upiId: activeTab === 'withdraw' ? upiId : undefined,
          paymentMethod: activeTab === 'add' ? paymentMethod : undefined
        },
      });
      
      if (error) throw error;
      
      // Update success message based on direction
      const successMessage = activeTab === 'add' 
        ? `Successfully added ${ecoCreditsToAdd} eco credits to your account.`
        : `Withdrawal initiated for $${moneyToReceive}. It will be processed within 24 hours.`;
      
      toast({
        title: 'Transaction Successful',
        description: successMessage,
      });
      
      onClose();
      
      // Reset form
      setAmount('');
      setAccountNumber('');
      setUpiId('');
      setOtp('');
      setOtpSent(false);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Verification Failed',
        description: 'Invalid OTP or the transaction could not be processed.',
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eco Credits Payment Portal</DialogTitle>
          <DialogDescription>
            Convert between money and eco credits safely and securely.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Add Credits</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {amount && (
                <p className="text-sm text-green-600">
                  You will receive {ecoCreditsToAdd} eco credits
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
              </RadioGroup>
            </div>
            
            {otpSent ? (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button 
                  onClick={handleVerifyOtp} 
                  className="w-full" 
                  disabled={!otp || verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : "Verify & Pay"}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleSendOtp} 
                className="w-full" 
                disabled={!amount || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : "Continue to Payment"}
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Eco Credits to Withdraw</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Enter eco credits amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {amount && (
                <p className="text-sm text-green-600">
                  You will receive ${moneyToReceive}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number (Optional)</Label>
              <Input
                id="account-number"
                type="text"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upi-id">UPI ID (Optional)</Label>
              <Input
                id="upi-id"
                type="text"
                placeholder="Enter UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
            
            {otpSent ? (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button 
                  onClick={handleVerifyOtp} 
                  className="w-full" 
                  disabled={!otp || verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : "Verify & Withdraw"}
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleSendOtp} 
                className="w-full" 
                disabled={!amount || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : "Request Withdrawal"}
              </Button>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPortal;
