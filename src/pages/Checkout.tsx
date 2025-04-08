
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import mockDatabase from "@/utils/mockDatabase";

const Checkout = () => {
  const [address, setAddress] = useState({
    fullName: "",
    streetAddress: "",
    apartmentNumber: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("eco-credits");
  const [processing, setProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0
  });
  
  const { user, refreshUser } = useAuth();
  const { cartItems, loading, userCredits, fetchCartItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    fetchCartItems();
    
    // Pre-fill address if user has one
    if (user) {
      const userData = mockDatabase.getUserById(user.id).user;
      if (userData) {
        setAddress({
          fullName: `${userData.firstName} ${userData.lastName}`,
          streetAddress: userData.streetAddress || "",
          apartmentNumber: userData.apartmentNumber || "",
          city: userData.city || "",
          state: userData.state || "",
          pinCode: userData.pinCode || "",
          phone: userData.phone || ""
        });
      }
    }
  }, [user]);
  
  // Calculate order summary when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.ecoCredits * item.quantity), 0);
      
      setOrderSummary({
        subtotal,
        shipping: 0, // Free shipping
        total: subtotal
      });
    }
  }, [cartItems]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to complete your order.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    // Validate form
    const requiredFields = ["fullName", "streetAddress", "city", "state", "pinCode", "phone"];
    const missingFields = requiredFields.filter(field => !address[field as keyof typeof address]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has enough credits
    if (userCredits < orderSummary.total) {
      toast({
        title: "Insufficient eco credits",
        description: "You don't have enough eco credits to complete this purchase.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setProcessing(true);
      
      const result = mockDatabase.createOrder(user.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      
      // Refresh user data to update eco credits balance
      await refreshUser();
      
      // Navigate to order confirmation page
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
      
    } catch (error: any) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: error.message || "An error occurred while placing your order.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="mb-8">Add some products to your cart before proceeding to checkout.</p>
          <Button asChild>
            <a href="/marketplace">Continue Shopping</a>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <Input
                    name="streetAddress"
                    value={address.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Apartment, suite, etc. (optional)</label>
                  <Input
                    name="apartmentNumber"
                    value={address.apartmentNumber}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">PIN Code</label>
                    <Input
                      name="pinCode"
                      value={address.pinCode}
                      onChange={handleInputChange}
                      placeholder="PIN Code"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="Phone number for delivery updates"
                    required
                  />
                </div>
                
                <div className="pt-6 border-t mt-6">
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="eco-credits"
                        name="paymentMethod"
                        value="eco-credits"
                        checked={paymentMethod === "eco-credits"}
                        onChange={() => setPaymentMethod("eco-credits")}
                        className="h-4 w-4 text-primary"
                      />
                      <label htmlFor="eco-credits" className="text-sm font-medium">
                        Pay with Eco Credits ({userCredits} credits available)
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-3 opacity-50">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        disabled
                        className="h-4 w-4"
                      />
                      <label htmlFor="card" className="text-sm font-medium">
                        Credit/Debit Card (Coming Soon)
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                      <div className="text-primary font-medium">
                        {item.product.ecoCredits * item.quantity} Credits
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{orderSummary.subtotal} Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{orderSummary.total} Credits</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit} 
                  className="w-full" 
                  disabled={processing || orderSummary.total > userCredits}
                >
                  {processing ? "Processing..." : "Place Order"}
                </Button>
                
                {orderSummary.total > userCredits && (
                  <div className="mt-2 text-red-500 text-sm">
                    Insufficient eco credits. You need {orderSummary.total - userCredits} more credits to complete this purchase.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
