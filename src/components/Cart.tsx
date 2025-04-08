
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, X, Minus, Plus, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import mockDatabase from "@/utils/mockDatabase";
import { Link } from "react-router-dom";

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart = ({ open, onClose }: CartProps) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState({ price: 0, ecoCredits: 0 });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      fetchCartItems();
    }
  }, [open, user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { cartItems, error } = mockDatabase.getCart(user.id);
      
      if (error) {
        throw new Error(error);
      }
      
      setCartItems(cartItems || []);
      
      // Calculate totals
      const priceTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const ecoCreditsTotal = cartItems.reduce((sum, item) => sum + (item.product.ecoCredits * item.quantity), 0);
      
      setTotal({
        price: priceTotal,
        ecoCredits: ecoCreditsTotal
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast({
        title: "Failed to load cart",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) return;
    
    try {
      const result = mockDatabase.updateCartItem(user.id, cartItemId, quantity);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Refresh cart
      fetchCartItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item quantity.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    if (!user) return;
    
    try {
      const result = mockDatabase.removeFromCart(user.id, cartItemId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      
      // Refresh cart
      fetchCartItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (!user) return;
    
    // Check if user has enough credits
    if (user.ecoCredits < total.ecoCredits) {
      toast({
        title: "Insufficient eco credits",
        description: "You don't have enough eco credits to complete this purchase.",
        variant: "destructive",
      });
      return;
    }

    onClose();
    window.location.href = "/checkout";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Review your items before checkout.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p>Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6">Looks like you haven't added any products yet.</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 border rounded-lg p-3">
                    <Link to={`/product/${item.product.id}`} className="shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-20 h-20 object-cover rounded-md" 
                      />
                    </Link>
                    <div className="flex-1">
                      <Link to={`/product/${item.product.id}`} className="font-medium hover:text-primary">
                        {item.product.name}
                      </Link>
                      <div className="text-primary font-medium">{item.product.ecoCredits} Credits</div>
                      <div className="text-sm text-gray-500">₹{item.product.price}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8" 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-2 min-w-[2rem] text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8" 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-red-500" 
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t mt-4 pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>{total.ecoCredits} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>{total.ecoCredits} Credits</span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  (Approx. ₹{total.price})
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={onClose} className="flex-1">Continue Shopping</Button>
                <Button onClick={handleCheckout} className="flex-1">Checkout</Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
