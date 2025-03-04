
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Trash2, X, Plus, Minus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    eco_credits: number;
    price: number;
    image_url: string;
  };
}

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart = ({ open, onClose }: CartProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const [userCredits, setUserCredits] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchCartItems();
      fetchUserCredits();
    }
  }, [open, user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          product:marketplace_items (
            id,
            name,
            eco_credits,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Transform the data to match the CartItem interface
      const transformedData = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: {
          id: item.product?.id || "",
          name: item.product?.name || "",
          eco_credits: item.product?.eco_credits || 0,
          price: item.product?.price || 0,
          image_url: item.product?.image_url || ""
        }
      })) || [];
      
      setCartItems(transformedData);
      
      // Calculate total credits
      const total = transformedData.reduce((sum, item) => {
        return sum + item.product.eco_credits * item.quantity;
      }, 0);
      
      setTotalCredits(total);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('eco_credits')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      setUserCredits(data?.eco_credits || 0);
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!user || newQuantity < 1) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Recalculate total
      const newTotal = cartItems
        .map(item => item.id === itemId ? 
          { ...item, quantity: newQuantity } : item
        )
        .reduce((sum, item) => sum + (item.product?.eco_credits || 0) * item.quantity, 0);
      
      setTotalCredits(newTotal);
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      const itemToRemove = cartItems.find(item => item.id === itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Recalculate total
      if (itemToRemove) {
        setTotalCredits(prev => prev - (itemToRemove.product?.eco_credits || 0) * itemToRemove.quantity);
      }
      
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    if (totalCredits > userCredits) {
      toast({
        title: "Insufficient EcoCredits",
        description: "You don't have enough EcoCredits for this purchase. Please add more EcoCredits to proceed.",
        variant: "destructive",
      });
      
      // Close cart and redirect to EcoCredits page
      onClose();
      window.location.href = "/my-ecocredits";
      return;
    }
    
    // Proceed to checkout
    onClose();
    window.location.href = "/checkout";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
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
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Button onClick={onClose} variant="outline">Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center border rounded-lg p-3">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-grow">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-sm text-primary">{item.product.eco_credits} Credits</p>
                    <div className="flex items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg text-primary">{totalCredits} Credits</span>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Your balance: {userCredits} EcoCredits
                {totalCredits > userCredits && (
                  <div className="text-red-500 mt-1">
                    You need {totalCredits - userCredits} more credits to complete this purchase.
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {totalCredits > userCredits ? (
                  <Button className="flex-1" asChild>
                    <Link to="/my-ecocredits" onClick={onClose}>
                      Add EcoCredits
                    </Link>
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={handleCheckout}>
                    Checkout
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
